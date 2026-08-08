# ETCD Backup and Restore - Complete Guide

## Table of Contents
- [What is ETCD?](#what-is-etcd)
- [Why ETCD Backup is Critical](#why-etcd-backup-is-critical)
- [ETCD Architecture](#etcd-architecture)
- [Prerequisites](#prerequisites)
- [Backup Methods](#backup-methods)
- [Restore Process](#restore-process)
- [Automated Backup Solutions](#automated-backup-solutions)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## What is ETCD?

ETCD is a distributed, reliable key-value store that Kubernetes uses to store all cluster data. It serves as the **single source of truth** for:

| Data Type | Description |
|-----------|-------------|
| Cluster State | Node information, cluster membership |
| Configuration | ConfigMaps, Secrets |
| Workloads | Deployments, Pods, Services, ReplicaSets |
| RBAC | Roles, RoleBindings, ServiceAccounts |
| Namespaces | All namespace configurations |
| Custom Resources | CRDs and their instances |

> **Important:** If ETCD data is lost and no backup exists, the entire cluster state is lost!

---

## Why ETCD Backup is Critical

### Disaster Recovery Scenarios

```
┌─────────────────────────────────────────────────────────────┐
│                    ETCD Failure Scenarios                    │
├─────────────────────────────────────────────────────────────┤
│  • Hardware failure on control plane nodes                   │
│  • Accidental deletion of critical resources                 │
│  • Corrupted ETCD data due to disk issues                   │
│  • Failed cluster upgrades                                   │
│  • Ransomware or security incidents                         │
│  • Human error (wrong kubectl delete)                        │
└─────────────────────────────────────────────────────────────┘
```

### Recovery Time Objectives

| Scenario | Without Backup | With Backup |
|----------|---------------|-------------|
| Complete cluster rebuild | Hours to Days | 15-30 minutes |
| Accidental resource deletion | Manual recreation | Minutes |
| Cluster upgrade failure | Rollback complexity | Simple restore |

---

## ETCD Architecture

![ETCD Architecture](../../assets/images/diagrams/etcd-architecture.svg)

### Key Components

```yaml
ETCD Cluster Components:
  Leader:
    - Handles all write operations
    - Replicates to followers
    - Elected via Raft consensus

  Followers:
    - Receive replicated data
    - Handle read operations
    - Participate in leader election

  Data Storage:
    - Default path: /var/lib/etcd
    - WAL (Write-Ahead Log)
    - Snapshot files
```

---

## Prerequisites

### 1. Install etcdctl

```bash
# Check if etcdctl is installed
etcdctl version

# If not installed, download from GitHub releases
ETCD_VERSION="v3.5.9"
wget https://github.com/etcd-io/etcd/releases/download/${ETCD_VERSION}/etcd-${ETCD_VERSION}-linux-amd64.tar.gz
tar -xvf etcd-${ETCD_VERSION}-linux-amd64.tar.gz
sudo mv etcd-${ETCD_VERSION}-linux-amd64/etcdctl /usr/local/bin/
```

### 2. Set API Version

```bash
# Always use API version 3
export ETCDCTL_API=3

# Add to .bashrc for persistence
echo 'export ETCDCTL_API=3' >> ~/.bashrc
source ~/.bashrc
```

### 3. Locate Certificate Files

```bash
# Default certificate locations (kubeadm clusters)
ETCD_CACERT=/etc/kubernetes/pki/etcd/ca.crt
ETCD_CERT=/etc/kubernetes/pki/etcd/server.crt
ETCD_KEY=/etc/kubernetes/pki/etcd/server.key

# Verify certificates exist
ls -la /etc/kubernetes/pki/etcd/
```

### 4. Find ETCD Endpoint

```bash
# Get ETCD endpoint from static pod manifest
cat /etc/kubernetes/manifests/etcd.yaml | grep listen-client-urls

# Common endpoints
# - https://127.0.0.1:2379 (local)
# - https://<control-plane-ip>:2379
```

---

## Backup Methods

### Method 1: Snapshot Backup (Recommended)

This is the most common and reliable backup method.

```bash
# Set environment variables
export ETCDCTL_API=3
export ETCD_ENDPOINTS="https://127.0.0.1:2379"
export ETCD_CACERT="/etc/kubernetes/pki/etcd/ca.crt"
export ETCD_CERT="/etc/kubernetes/pki/etcd/server.crt"
export ETCD_KEY="/etc/kubernetes/pki/etcd/server.key"

# Create snapshot backup
etcdctl snapshot save /backup/etcd-snapshot-$(date +%Y%m%d-%H%M%S).db \
  --endpoints=$ETCD_ENDPOINTS \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY

# Verify the snapshot
etcdctl snapshot status /backup/etcd-snapshot-*.db --write-out=table \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY
```

**Expected Output:**
```
+----------+----------+------------+------------+
|   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
+----------+----------+------------+------------+
| 3e5c4a2b |   145678 |       1250 |     5.2 MB |
+----------+----------+------------+------------+
```

### Method 2: Backup via kubectl exec

If you don't have direct access to control plane:

```bash
# Execute backup command inside etcd pod
kubectl exec -n kube-system etcd-<control-plane-node> -- sh -c \
  "ETCDCTL_API=3 etcdctl snapshot save /var/lib/etcd/snapshot.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key"

# Copy snapshot from pod to local machine
kubectl cp kube-system/etcd-<control-plane-node>:/var/lib/etcd/snapshot.db ./etcd-backup.db
```

### Method 3: Volume Snapshot (Cloud Providers)

For managed Kubernetes or cloud-based storage:

```yaml
# AWS EBS Snapshot Example
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: etcd-volume-snapshot
  namespace: kube-system
spec:
  volumeSnapshotClassName: csi-aws-vsc
  source:
    persistentVolumeClaimName: etcd-data-pvc
```

---

## Restore Process

### Step 1: Stop kube-apiserver

```bash
# Move the static pod manifest to stop API server
sudo mv /etc/kubernetes/manifests/kube-apiserver.yaml /tmp/

# Verify API server is stopped
crictl ps | grep kube-apiserver
```

### Step 2: Restore ETCD Snapshot

```bash
# Set environment variables
export ETCDCTL_API=3

# Restore to a new data directory
etcdctl snapshot restore /backup/etcd-snapshot.db \
  --data-dir=/var/lib/etcd-restored \
  --initial-cluster=master=https://127.0.0.1:2380 \
  --initial-cluster-token=etcd-cluster-1 \
  --initial-advertise-peer-urls=https://127.0.0.1:2380 \
  --name=master
```

### Step 3: Update ETCD Configuration

```bash
# Backup current etcd data
sudo mv /var/lib/etcd /var/lib/etcd-old

# Move restored data to correct location
sudo mv /var/lib/etcd-restored /var/lib/etcd

# Set correct ownership
sudo chown -R etcd:etcd /var/lib/etcd
```

### Step 4: Update ETCD Static Pod (if needed)

```yaml
# Edit /etc/kubernetes/manifests/etcd.yaml
# Update the data-dir if changed
spec:
  containers:
  - command:
    - etcd
    - --data-dir=/var/lib/etcd  # Ensure this matches restored path
    volumeMounts:
    - mountPath: /var/lib/etcd
      name: etcd-data
  volumes:
  - hostPath:
      path: /var/lib/etcd
      type: DirectoryOrCreate
    name: etcd-data
```

### Step 5: Restart Services

```bash
# Restore API server manifest
sudo mv /tmp/kube-apiserver.yaml /etc/kubernetes/manifests/

# Restart kubelet to pick up changes
sudo systemctl restart kubelet

# Verify cluster is healthy
kubectl get nodes
kubectl get pods -A
```

### Step 6: Verify Restoration

```bash
# Check ETCD cluster health
etcdctl endpoint health \
  --endpoints=$ETCD_ENDPOINTS \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY

# Verify member list
etcdctl member list \
  --endpoints=$ETCD_ENDPOINTS \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY
```

---

## Automated Backup Solutions

### Option 1: CronJob for Regular Backups

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: etcd-backup
  namespace: kube-system
spec:
  schedule: "0 */6 * * *"  # Every 6 hours
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          hostNetwork: true
          containers:
          - name: etcd-backup
            image: bitnami/etcd:3.5
            command:
            - /bin/sh
            - -c
            - |
              etcdctl snapshot save /backup/etcd-$(date +%Y%m%d-%H%M%S).db \
                --endpoints=https://127.0.0.1:2379 \
                --cacert=/etc/kubernetes/pki/etcd/ca.crt \
                --cert=/etc/kubernetes/pki/etcd/server.crt \
                --key=/etc/kubernetes/pki/etcd/server.key
              # Cleanup old backups (keep last 7)
              ls -t /backup/etcd-*.db | tail -n +8 | xargs -r rm
            env:
            - name: ETCDCTL_API
              value: "3"
            volumeMounts:
            - name: etcd-certs
              mountPath: /etc/kubernetes/pki/etcd
              readOnly: true
            - name: backup-volume
              mountPath: /backup
          restartPolicy: OnFailure
          nodeSelector:
            node-role.kubernetes.io/control-plane: ""
          tolerations:
          - key: node-role.kubernetes.io/control-plane
            effect: NoSchedule
          volumes:
          - name: etcd-certs
            hostPath:
              path: /etc/kubernetes/pki/etcd
          - name: backup-volume
            persistentVolumeClaim:
              claimName: etcd-backup-pvc
```

### Option 2: Shell Script for Manual/Scheduled Backups

```bash
#!/bin/bash
# etcd-backup.sh

set -e

# Configuration
BACKUP_DIR="/backup/etcd"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d-%H%M%S)
SNAPSHOT_NAME="etcd-snapshot-${DATE}.db"

# ETCD Configuration
export ETCDCTL_API=3
ENDPOINTS="https://127.0.0.1:2379"
CACERT="/etc/kubernetes/pki/etcd/ca.crt"
CERT="/etc/kubernetes/pki/etcd/server.crt"
KEY="/etc/kubernetes/pki/etcd/server.key"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Create snapshot
echo "Creating ETCD snapshot..."
etcdctl snapshot save ${BACKUP_DIR}/${SNAPSHOT_NAME} \
  --endpoints=${ENDPOINTS} \
  --cacert=${CACERT} \
  --cert=${CERT} \
  --key=${KEY}

# Verify snapshot
echo "Verifying snapshot..."
etcdctl snapshot status ${BACKUP_DIR}/${SNAPSHOT_NAME} \
  --write-out=table

# Compress backup
echo "Compressing backup..."
gzip ${BACKUP_DIR}/${SNAPSHOT_NAME}

# Clean old backups
echo "Cleaning backups older than ${RETENTION_DAYS} days..."
find ${BACKUP_DIR} -name "etcd-snapshot-*.db.gz" -mtime +${RETENTION_DAYS} -delete

# Upload to remote storage (optional)
# aws s3 cp ${BACKUP_DIR}/${SNAPSHOT_NAME}.gz s3://my-backup-bucket/etcd/

echo "Backup completed: ${BACKUP_DIR}/${SNAPSHOT_NAME}.gz"
```

### Option 3: Velero Integration

```bash
# Install Velero with restic for ETCD backup
velero install \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.5.0 \
  --bucket my-backup-bucket \
  --backup-location-config region=us-east-1 \
  --snapshot-location-config region=us-east-1 \
  --use-restic

# Create backup schedule
velero schedule create daily-backup \
  --schedule="0 2 * * *" \
  --include-namespaces "*" \
  --ttl 168h
```

---

## Best Practices

### 1. Backup Frequency

| Environment | Recommended Frequency | Retention |
|-------------|----------------------|-----------|
| Production | Every 1-2 hours | 30 days |
| Staging | Every 6 hours | 14 days |
| Development | Daily | 7 days |

### 2. Storage Recommendations

```
✅ DO:
  • Store backups in multiple locations (3-2-1 rule)
  • Use encrypted storage for backups
  • Test restore process regularly
  • Monitor backup job success/failure
  • Document restore procedures

❌ DON'T:
  • Store backups only on the same server
  • Skip backup verification
  • Keep backups indefinitely without rotation
  • Ignore backup failures
```

### 3. Security Considerations

```bash
# Encrypt backup files
gpg --symmetric --cipher-algo AES256 etcd-snapshot.db

# Secure certificate files
chmod 600 /etc/kubernetes/pki/etcd/*.key
chmod 644 /etc/kubernetes/pki/etcd/*.crt

# Use secrets for backup credentials
kubectl create secret generic backup-credentials \
  --from-file=aws-credentials=~/.aws/credentials \
  -n kube-system
```

### 4. Monitoring & Alerting

```yaml
# Prometheus Alert Rule for Backup Failures
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: etcd-backup-alerts
  namespace: monitoring
spec:
  groups:
  - name: etcd-backup
    rules:
    - alert: ETCDBackupFailed
      expr: kube_job_status_failed{job_name=~"etcd-backup.*"} > 0
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "ETCD backup job failed"
        description: "ETCD backup job {{ $labels.job_name }} has failed"
    
    - alert: ETCDBackupMissing
      expr: time() - etcd_backup_last_success_timestamp > 86400
      for: 1h
      labels:
        severity: warning
      annotations:
        summary: "ETCD backup is overdue"
        description: "No successful ETCD backup in the last 24 hours"
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Connection Refused

```bash
# Error: context deadline exceeded / connection refused

# Solution: Check ETCD endpoint and certificates
etcdctl endpoint status \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify ETCD is running
crictl ps | grep etcd
systemctl status etcd  # for external etcd
```

#### Issue 2: Certificate Errors

```bash
# Error: certificate signed by unknown authority

# Solution: Verify certificate paths
ls -la /etc/kubernetes/pki/etcd/

# Check certificate validity
openssl x509 -in /etc/kubernetes/pki/etcd/server.crt -text -noout | grep -A2 "Validity"
```

#### Issue 3: Snapshot Restore Fails

```bash
# Error: member already bootstrapped

# Solution: Clear existing data directory
sudo rm -rf /var/lib/etcd/*

# Then restore
etcdctl snapshot restore snapshot.db --data-dir=/var/lib/etcd
```

#### Issue 4: Cluster Not Healthy After Restore

```bash
# Check ETCD logs
kubectl logs -n kube-system etcd-<node-name>

# Or for static pods
crictl logs $(crictl ps -q --name etcd)

# Verify cluster membership
etcdctl member list \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key
```

---

## Quick Reference Commands

```bash
# ═══════════════════════════════════════════════════════════════
#                    ETCD Quick Reference
# ═══════════════════════════════════════════════════════════════

# Set API version (always use v3)
export ETCDCTL_API=3

# Common variables
ENDPOINTS="https://127.0.0.1:2379"
CERTS="--cacert=/etc/kubernetes/pki/etcd/ca.crt \
       --cert=/etc/kubernetes/pki/etcd/server.crt \
       --key=/etc/kubernetes/pki/etcd/server.key"

# Health check
etcdctl endpoint health --endpoints=$ENDPOINTS $CERTS

# Member list
etcdctl member list --endpoints=$ENDPOINTS $CERTS -w table

# Create backup
etcdctl snapshot save backup.db --endpoints=$ENDPOINTS $CERTS

# Verify backup
etcdctl snapshot status backup.db -w table

# Restore backup
etcdctl snapshot restore backup.db --data-dir=/var/lib/etcd-new

# Get all keys
etcdctl get / --prefix --keys-only --endpoints=$ENDPOINTS $CERTS

# Defragment (maintenance)
etcdctl defrag --endpoints=$ENDPOINTS $CERTS

# Compact revision (maintenance)
etcdctl compact $(etcdctl endpoint status -w json | jq -r '.[].Status.header.revision')
```

---

## Related Topics

- [ETCD Commands Reference](./Etcd%20commands.md)
- [Kubernetes Cluster Setup](../Kubernetes%20Cluster%20setups/)
- [Kubernetes Troubleshooting](../Kubernetes-troubleshooting/)

---

> **Pro Tip:** Always test your backup restoration process in a non-production environment before relying on it for disaster recovery!

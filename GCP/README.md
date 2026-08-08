# Google Cloud

Notes and command references for Google Cloud Platform.

> Sections below match the sidebar. Content is being filled in incrementally.

## Compute

### Compute Engine

Machine types, images, instance templates, metadata, startup scripts.

### Cloud Run

Services, revisions, traffic splitting, concurrency, cold starts.

## Containers

### GKE

Standard vs Autopilot, node pools, workload identity, upgrades.

### Artifact Registry

Repository formats, authentication, cleanup policies, vulnerability scanning.

## Storage

### Cloud Storage

Buckets, storage classes, signed URLs, lifecycle rules.

### Filestore

Tiers, capacity, NFS mounts, backups.

## Security & Access

### Identity-Aware Proxy (IAP)

IAP provides secure access to VMs without exposing them to the public internet.

- [IAP SSH Setup Guide](/GCP/GCP%20IAP%20→%20Windows%20VM%20→%20SSH.md) - Complete guide for setting up IAP SSH to Windows VMs
- [IAP SSH Quick Reference](/GCP/gcp-iap-windows-ssh1.md) - Quick reference with validation checklist
- [Windows OpenSSH Setup](/GCP/gcp-iap-windows-ssh.md) - Detailed Windows OpenSSH configuration and troubleshooting

**Key Concepts:**

| Component | Purpose |
|-----------|---------|
| IAP | Secure network connectivity without public IP |
| IAM | Controls who can use IAP tunnels |
| VPC Firewall | Allows IAP traffic (35.235.240.0/20) |
| Cloud NAT | Provides outbound internet access |
| OpenSSH | SSH service on Windows |
| authorized_keys | Public SSH key storage |

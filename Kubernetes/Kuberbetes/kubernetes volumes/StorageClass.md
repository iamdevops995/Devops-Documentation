## Introduction

Storage is a central component in Kubernetes, enabling workloads to persist data beyond the lifetime of pods. Kubernetes supports multiple storage backends through **Persistent Volumes (PV)**, **Persistent Volume Claims (PVC)**, and **Storage Classes (SC)**.

This guide explains:
- How storage is provisioned
- The difference between static and dynamic provisioning
- How Storage Classes automate provisioning
- When and why to use each approach
#### **Key Concepts**


Persistent Volume (PV)
A cluster-wide storage resource representing actual physical storage (disk, NFS, cloud disk, etc.).

Persistent Volume Claim (PVC)
A request for storage by a user/workload, similar to requesting CPU/Memory.

Storage Class (SC)
A template that defines how Kubernetes should create volumes, including:

Provisioner (e.g. AWS EBS, GCP PD, Azure Disk, NFS)
Storage type (SSD/HDD)
Parameters (performance, replication, filesystem)
Reclaim policy
Binding mode
StorageClass enables Dynamic Provisioning.


### Static Provisioning
Static provisioning requires manual setup of Persistent Volumes. Typically performed by a storage administrator or DevOps engineer.

**How It Works**
- Admin creates a PV with a fixed size, access mode, and backend.
- Developer creates a PVC requesting capacity.
- Kubernetes tries to match the PVC to an existing PV.
- If parameters match (size, access mode, storage class), they are bound.
**Example Flow**
Admin creates PV → 80Gi, ReadWriteOnce (RWO)
Developer requests PVC → 10Gi, RWO
Kubernetes binds PVC → PV (if requirements match)
**Pros**
- Predictable
- Full control over volumes
- Good for pre-allocated enterprise storage
**Cons**
- Manual
- Risk of unused PVs (wasted cost)
- Not scalable for cloud-native environments
 ### Dynamic Provisioning
Dynamic provisioning allows Kubernetes to automatically create persistent volumes when a PVC is submitted.

**How It Works**
- Developer creates a PVC referencing a StorageClass
- K8s uses the StorageClass provisioner
- A new PV is automatically created and bound
- Storage is created on demand and deleted when no longer needed
**Pros**
- Automatic & scalable
- Cost-efficient
- Different StorageClasses for different workloads (SSD/HDD/Network Storage)
- No manual PV creation required
**Cons**
- Requires a cloud provider or storage plugin that supports provisioning
- Not all on-prem storage supports dynamic provisioning without CSI drivers

#### How Storage Classes Work
A StorageClass links Kubernetes to a storage backend using:

**Provisioner**
Defines “how to create the disk”. Examples:

```
kubernetes.io/gce-pd (GCP Persistent Disk)
kubernetes.io/aws-ebs (AWS EBS)
disk.csi.azure.com (Azure Disk CSI)
nfs.csi.k8s.io (NFS CSI)
```

**Parameters**

Backend-specific options, such as:

- Disk type (SSD/HDD)
- Replication level
- Filesystem type
- Zones/regions
- Performance profile

**Reclaim Policy**
What happens when the PVC is deleted:

- Retain → keep data
- Delete → delete underlying storage
- Recycle (deprecated)

**VolumeBindingMode**

- Immediate: PV is created instantly
- WaitForFirstConsumer: PV created only when a Pod using PVC is scheduled
	- Prevents creating PV in the wrong zone

##  Supported Storage Backends

Examples of storage options commonly used:

|Storage Type|Examples|
|---|---|
|**Cloud disks**|GCP Persistent Disk, AWS EBS, Azure Disk|
|**Network file systems**|NFS, Azure Files, Filestore|
|**Local storage**|local-path provisioner|
|**Enterprise storage**|NetApp, Ceph, Portworx, Dell EMC|
|**SSD / HDD**|Based on cloud provider or hardware|

1. StorageClass (SSD — High Performance)

```YML
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: high-performance
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
  fsType: ext4
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

2. StorageClass (Standard HDD — Cost Efficient)
```YML
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: cost-effective
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
  fsType: ext4
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: Immediate
```

3. PVC using a StorageClass (Dynamic Provisioning)
```YML
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-storage
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: high-performance
  resources:
    requests:
      storage: 20Gi
```

 How Dynamic Provisioning Behaves
Scenario: Developer creates PVC → 70Gi, AccessMode: RWX.

If:
- No matching PV exists
- StorageClass is available
Then:

- Kubernetes creates a new PV with matching requirements
- PVC is immediately bound
- Volume is created on-demand

Useful Commands

```
List all Storage Classes
kubectl get storageclass

View default StorageClass
kubectl get sc | grep "(default)"

 Describe a StorageClass
kubectl describe sc <name>

# Patch default StorageClass
kubectl patch storageclass <name> \
  -p '{"metadata":{"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

# Remove default annotation
kubectl patch storageclass <name> \
  -p '{"metadata":{"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'

# Check PVCs
kubectl get pvc

# Troubleshoot PVC
kubectl describe pvc <pvc-name>

# Inspect auto-created PVs
kubectl get pv
```
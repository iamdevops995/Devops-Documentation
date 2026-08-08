#### Critical Security Context

1. runAsUser
	**Purpose:** Specifies the user ID to run container processes
	**Default:** Usually root (UID 0)
	**Security:** Running as non-root reduces attack surface
```
securityContext:
  runAsUser: 1000  # Run as user ID 1000 (non-root)
```

2. runAsNonRoot
	**Purpose:** Ensures container cannot run as root user
	**Behavior:** Kubernetes blocks pod if image tries to run as root
	**Security:** Prevents root-level access entirely
```
securityContext:
  runAsNonRoot: true  # Block any attempt to run as root
```

3. fsGroup
	**Purpose:** Sets group ID for volume ownership
	**Behavior:** All volumes owned by this group
	**Use Case:** Shared storage between containers
```
securityContext:
  fsGroup: 2000  # Volumes owned by group 2000
```

4. allowPrivilegeEscalation
	**Purpose:** Controls if process can gain more privileges
	**Default:** true (allows escalation)
	**Security:** Set to false to prevent privilege escalation
```
securityContext:
  allowPrivilegeEscalation: false  # Prevent privilege escalation
```

#### Complete Security Context Example

```yaml
# Secure container configuration
apiVersion: v1
kind: Pod
metadata:
  name: secure-demo
spec:
  securityContext:          # Pod-level security context
    runAsUser: 1000  # process id
    runAsGroup: 3000  # group id of process
    runAsNonRoot: true
    fsGroup: 2000  # file ownership group
  volumes:
  - name: sec-ctx-vol
    emptyDir: {}
  containers:
  - name: sec-ctx-demo
    image: busybox:1.28
    command: [ "sh", "-c", "sleep 1h" ]
    volumeMounts:
    - name: sec-ctx-vol
      mountPath: /data/demo
    securityContext:
      runAsUser: 1000
      runAsNonRoot: true
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
```

Run below commands:
```
 ps
 cd /data; ls -l
 touch test;  ls -l
 id
su -
```

#### Hands-on Capability and Security Context Testing:

###### Task 1: Test Different Capability Configurations

 *1.1 Container with NET_ADMIN Capability*
 ```
 # net-admin-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: net-admin-test
spec:
  containers:
  - name: network-tool
    image: busybox
    command: ["sleep", "3600"]
    securityContext:
      capabilities:
        add: ["NET_ADMIN"]
```

**Test Commands:**
```
kubectl apply -f net-admin-pod.yaml
kubectl exec -it net-admin-test -- ip link add dummy0 type dummy
# This should work - NET_ADMIN allows network interface creation
ip link show
# Now add the drop and test again
drop: ["NET_ADMIN"]
```

##### Task 2: Test Security Context Configurations

*2.1 Root User Test*

```
# root-user-test.yaml
apiVersion: v1
kind: Pod
metadata:
  name: root-user-test
spec:
  containers:
  - name: root-container
    image: busybox
    command: ["sleep", "3600"]
    securityContext:
      runAsUser: 0  # Root user
```

**Verification:**

```
kubectl exec -it root-user-test -- id
# Should show uid=0(root)
```
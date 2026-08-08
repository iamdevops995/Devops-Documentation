##### The Three Standards
1. Privileged
	**Security Level:** Lowest
	**Capabilities:** All allowed
	**Security Context:** No restrictions
2. Baseline
	**Security Level:** Medium
	**Capabilities:** Some restrictions
	**Security Context:** Basic protections
3. Restricted
	**Security Level:** Highest
	**Capabilities:** Only safe ones allowed
	**Security Context:** Strict requirements
### Restricted Standard Requirements

The restricted standard requires:

- `runAsNonRoot: true`
- `allowPrivilegeEscalation: false`
- `capabilities.drop: ["ALL"]`
- No privileged containers
- No host networking
- Seccomp profile must be set
####  Implement Restricted Namespace

 *Task: Create and Configure restricted-ns*
 ```
 # Create namespace with restricted pod security standard
kubectl create namespace restricted-ns

# Apply pod security standard labels
kubectl label namespace restricted-ns \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/audit=restricted \
  pod-security.kubernetes.io/warn=restricted
```

**Compliant Pod for Restricted Namespace**

```
# restricted-compliant-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: compliant-pod
  namespace: restricted-ns
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: nginx:alpine
    securityContext:
      allowPrivilegeEscalation: false
      runAsNonRoot: true
      runAsUser: 1000
      capabilities:
        drop: ["ALL"]
```
##### Test All Violations in One Pod

*Combined Violation Test (Should Fail)*
This single pod violates multiple restricted policy requirements:
```
# all-violations-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: security-violations
  namespace: restricted-ns
spec:
  containers:
  - name: insecure-app
    image: nginx
    securityContext:
      privileged: true                 # Violation 1: Privileged container
      runAsUser: 0                     # Violation 2: Running as root
      allowPrivilegeEscalation: true   # Violation 3: Privilege escalation allowed
      capabilities:
        add: ["SYS_ADMIN", "NET_ADMIN"] # Violation 4: Adding dangerous capabilities
    volumeMounts:
    - name: host-root
      mountPath: /host
  volumes:
  - name: host-root
    hostPath:
      path: /                          # Violation 5: Host path volume
      type: Directory
```

**What this pod violates:**
1. **Host Networking** (`hostNetwork: true`) - Direct access to host network
2. **Host PID** (`hostPID: true`) - Can see host processes
3. **Privileged Container** (`privileged: true`) - Full host access
4. **Root User** (`runAsUser: 0`) - Running as root
5. **Privilege Escalation** (`allowPrivilegeEscalation: true`) - Can gain more privileges
6. **Dangerous Capabilities** - SYS_ADMIN and NET_ADMIN capabilities
7. **Host Path Volume** - Direct access to host filesystem
##### Verification and Testing

```
# Apply compliant pod
kubectl apply -f restricted-compliant-pod.yaml

# Try to apply violation pods (should fail)
kubectl apply -f violation-privileged.yaml
kubectl apply -f violation-root.yaml
kubectl apply -f violation-hostnetwork.yaml

# Check events for violation messages
kubectl get events -n restricted-ns

# Verify compliant pod is running
kubectl get pods -n restricted-ns
```
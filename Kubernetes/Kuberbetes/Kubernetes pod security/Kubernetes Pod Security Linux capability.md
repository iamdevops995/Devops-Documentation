#Linux-Capabilities
1. CAP_NET_ADMIN
	**Purpose:** Network administration tasks
	**Allows:** Configure network interfaces, routing tables, firewall rules
	**Risk:** Can intercept or modify network traffic
	**Example Use:** Network monitoring tools, VPN software
2. CAP_SYS_ADMIN
	**Purpose:** System administration operations
	**Allows:** Mount filesystems, system configuration changes
	**Risk:** Nearly equivalent to root access
	**Example Use:** System management tools, backup software
3. CAP_SYS_TIME
	**Purpose:** Set system clock
	**Allows:** Modify system time and hardware clock
	**Risk:** Can disrupt time-sensitive operations
	**Example Use:** NTP clients, time synchronization services
4. CAP_CHOWN
	**Purpose:** Change file ownership
	**Allows:** Change owner and group of files
	**Risk:** Can gain access to other users' files
	**Example Use:** File management utilities
 #### Capability Management in Kubernetes
 ```yaml
 apiVersion: v1
kind: Pod
metadata:
  name: secure-demo
spec:
  containers:
  - name: app
    image: nginx:alpine
    securityContext:
      capabilities:
        add: ["NET_ADMIN", "SYS_TIME"]    # Add specific capabilities
        drop: ["ALL"]                                         # Drop all capabilities first 
```

```
# Test NET_ADMIN capability (should work)
kubectl exec secure-demo -- ip link add dummy0 type dummy

# Test SYS_TIME capability (should work)
kubectl exec secure-demo -- date -s "$(date)"

# Test restricted capability - CAP_SYS_ADMIN (should fail)
kubectl exec secure-demo -- mount -t tmpfs tmpfs /tmp/test
```

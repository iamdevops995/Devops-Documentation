#### Security Violation Scenario: Running Containers as Root

Filename: pod-config.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: root-pod
spec:
  containers:
  - name: root-container
    image: nginx
    securityContext:
      runAsUser: 0
```





#### Resource Management Scenario: Exceeding Resource Limits

Filename: pod-resource-limit.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: unlimited-pod
spec:
  containers:
  - name: busybox
    image: busybox
    command: ["sh", "-c", "yes"]
```



#### Compliance Scenario: Lack of Labeling Standards

Filename: label-standard.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: unlabeled-pod
spec:
  containers:
  - name: nginx
    image: nginx
```

#### Operational Efficiency Scenario: Unauthorized Config Changes

Filename: configmap.yaml

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-configmap
data:
  config.json: |
    {"debug":true}
```


#### Availability Scenario: Excessive Resource Creation

Filename: script-pod.yaml

```sh
for i in {1..100}; do
  kubectl run overload-pod-$i --image=busybox --restart=Never -- sleep 3600
done
```



Arch:

![[Pasted image 20251120130953.png]]
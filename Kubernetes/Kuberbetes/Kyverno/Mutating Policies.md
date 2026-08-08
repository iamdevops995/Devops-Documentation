#### Introduction to Mutating Policies

Mutating policies in Kubernetes are rules that automatically modify resource definitions before they are stored in the cluster's database. These modifications can include adding, changing, or removing configurations to ensure resources comply with organizational standards or enhance their functionality.

#### Why Mutating Policies?

1. **Consistency:** They ensure resources are created with consistent configurations, reducing manual errors and deviations.
2. **Automation:** By automatically applying necessary changes, they speed up deployment processes and reduce the need for manual intervention.
3. **Security and Compliance:** Mutating policies can enforce security settings or compliance requirements automatically.


To add default CPU and memory limits to all new Pods.

Filename: add-default-resources.yaml

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-default-resources
spec:
  rules:
  - name: set-default-resources
    match:
      resources:
        kinds:
        - Pod
    mutate:
      patchStrategicMerge:
        spec:
          containers:
          - (name): "*"
            resources:
              limits:
                +(memory): "128Mi"
                +(cpu): "200m"
              requests:
                +(memory): "64Mi"
                +(cpu): "100m"
```

To add label to newly creating pods.

filename: add-label-pod.yaml

```yaml
---
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-environment-label
spec:
  validationFailureAction: Enforce
  rules:
    - name: add-environment-label
      match:
        resources:
          kinds:
            - Pod
      mutate:
        patchStrategicMerge:
          metadata:
            labels:
              environment: "dev"

```

To add namespace labels:


```yaml
---
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-namespace-label
spec:
  validationFailureAction: Enforce
  rules:
    - name: add-namespace-label
      match:
        resources:
          kinds:
            - Namespace
      mutate:
        patchStrategicMerge:
          metadata:
            labels:
              owner: "devops"
```
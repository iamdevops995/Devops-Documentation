### Role-Based Multiple Namespace Setup

**Step 1: Create Namespaces**

```
apiVersion: v1
kind: Namespace
metadata:
  name: dev
---
apiVersion: v1
kind: Namespace
metadata:
  name: prod
```

**Step 2: Create Roles**
```
#Read-only Role for dev:
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: read-only-role
  namespace: dev
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps"]
  verbs: ["get", "list", "watch"]

```

```
# Write Role for prod:
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: write-role
  namespace: prod
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps"]
  verbs: ["get", "list", "create", "update", "delete"]
```
**Step 3: Create ServiceAccounts**
```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: viewer-sa
  namespace: dev
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: deployer-sa
  namespace: prod
```
**Step 4: Bind Roles to ServiceAccounts**
```
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: bind-viewer
  namespace: dev
subjects:
- kind: ServiceAccount
  name: viewer-sa
  namespace: dev
roleRef:
  kind: Role
  name: read-only-role
  apiGroup: rbac.authorization.k8s.io
```

```
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: bind-deployer
  namespace: prod
subjects:
- kind: ServiceAccount
  name: deployer-sa
  namespace: prod
roleRef:
  kind: Role
  name: write-role
  apiGroup: rbac.authorization.k8s.io
```

**Step 5: Test Access with kubectl auth can-i**
```
# Viewer
kubectl auth can-i get pods --as=system:serviceaccount:dev:viewer-sa -n dev
kubectl auth can-i create pods --as=system:serviceaccount:dev:viewer-sa -n dev

# Deployer
kubectl auth can-i get pods --as=system:serviceaccount:prod:deployer-sa -n prod
kubectl auth can-i delete pods --as=system:serviceaccount:prod:deployer-sa -n prod
```

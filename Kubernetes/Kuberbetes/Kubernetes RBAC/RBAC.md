**What is RBAC and How It Works in Kubernetes.**
RBAC (Role-Based Access Control) is a security mechanism in Kubernetes that restricts access to resources based on the roles of individual users or service accounts. It controls who can access, modify, or delete Kubernetes resources and how.

*RBAC policies are enforced by the Kubernetes API server using the following core components.*
Subjects (Users, Groups, ServiceAccounts)
Roles / ClusterRoles (Define permissions)
RoleBindings / ClusterRoleBindings (Attach roles to subjects)
## Key RBAC Resources

##### Role (Namespaced)
**Defines permissions within a specific namespace**
```
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: dev
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

##### ClusterRole (Cluster-wide)
**Grants permissions across the entire cluster.**
```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: pod-reader-cluster
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```
### RoleBinding
Binds a **Role** to a **Subject** within a namespace.
```
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: dev
subjects:
- kind: ServiceAccount
  name: dev-sa
  namespace: dev
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```
### ClusterRoleBinding
Binds a **ClusterRole** to a **Subject** across all namespaces.
```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-read-pods
subjects:
- kind: User
  name: sandip
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: pod-reader-cluster
  apiGroup: rbac.authorization.k8s.io
```
#### Difference Between Role & ClusterRole
| **Feature**      | **Role**                 | **ClusterRole**                       |
| ---------------- | ------------------------ | ------------------------------------- |
| Scope            | Single namespace         | All namespaces / cluster-wide         |
| Use in Binding   | RoleBinding              | ClusterRoleBinding or RoleBinding     |
| Common Use Cases | Namespace-specific tasks | Node access, persistent volumes, etc. |
##### How Permissions Are Defined
Permissions are defined in rules using:
**verbs:** actions like get, list, create, delete
**resources:** such as pods, deployments, services
**apiGroups**: group resources belong to ("" for core APIs)
*Example:*
```
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["create", "delete", "update"]
```
##### Creating Service Accounts and Binding Them
Create Service Account
```
kubectl create serviceaccount dev-sa -n dev
```
Apply Role and Binding
```
kubectl apply -f role.yaml
kubectl apply -f rolebinding.yaml
```
Verify Access
```
kubectl auth can-i get pods --as=system:serviceaccount:dev:dev-sa -n dev
```

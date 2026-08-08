- ClusterIP(For Internal access)
### ClusterIP: 
![[Pasted image 20250215095107.png]]

sample yaml file for cluster IP:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: cluster-svc
  labels:
    env: demo
spec:
  ports:
  - port: 80
  selector:
    env: demo
```

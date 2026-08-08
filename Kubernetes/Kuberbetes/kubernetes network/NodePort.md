- NodePort(To access the application on a particular port)

### NodePort:
![[Pasted image 20250215095202.png]]

Sample yaml file for NodePort:
apiVersion: v1
kind: Service
metadata:
  name: nodeport-svc
  labels:
    env: demo
spec:
  type: NodePort
  ports:
  - nodePort: 30001
    port: 80
    targetPort: 80
  selector:
    env: demo
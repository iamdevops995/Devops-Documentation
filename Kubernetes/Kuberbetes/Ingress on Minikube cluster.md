To list the minikube profiles:
![[Pasted image 20251008123458.png]]

To check cluster status:
![[Pasted image 20251008123529.png]]
Enable ingress on the minikube cluster:
![[Pasted image 20251008124139.png]]

![[Pasted image 20251008124236.png]]

![[Pasted image 20251008124403.png]]


```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: appingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  rules:
    - host: webapp.com
      http:
        paths:
          - path: /blue
            pathType: Prefix
            backend:
              service:
                name: bluesvc
                port:
                  number: 80
          - path: /green
            pathType: Prefix
            backend:
              service:
                name: greensvc
                port:
                  number: 80
```

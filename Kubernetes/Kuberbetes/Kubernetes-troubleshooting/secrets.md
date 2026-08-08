vim secret.yaml with base encode format

```sh
echo -n admin | base64
# YWRtaW4=

echo -n password123 | base64
# cGFzc3dvcmQxMjM=

```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  DB_USER: YWRtaW4=
  DB_PASSWORD: cGFzc3dvcmQxMjM=
```

vim  secret.yaml with stringData format

```
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  DB_USER: admin
  DB_PASSWORD: password123

```

vim deployment.yaml
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: db-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: db-app
  template:
    metadata:
      labels:
        app: db-app
    spec:
      containers:
      - name: app
        image: busybox
        command:
          - sh
          - -c
          - |
            echo "DB_USER=$DB_USER"
            echo "DB_PASSWORD=$DB_PASSWORD"
            sleep 3600
        env:
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: DB_USER
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: DB_PASSWORD

```

![[Pasted image 20260201124314.png]]

After chnaged secret as string Data.

![[Pasted image 20260201124634.png]]

![[Pasted image 20260201124701.png]]
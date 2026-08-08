
vim configmap.yaml
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: feature-config
data:
  FEATURE_X_ENABLED: "false"

```

vim deployment.yaml
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: feature-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: feature-app
  template:
    metadata:
      labels:
        app: feature-app
    spec:
      containers:
      - name: app
        image: busybox
        command:
          - sh
          - -c
          - |
            echo "Feature flag is: $FEATURE_X_ENABLED"
            sleep 3600
        env:
        - name: FEATURE_X_ENABLED
          valueFrom:
            configMapKeyRef:
              name: feature-config
              key: FEATURE_X_ENABLED

```

Update ConfigMap (feature enabled)

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: feature-config
data:
  FEATURE_X_ENABLED: "true"

```


![[Pasted image 20260201122640.png]]

-----------------
configmap-tr-sc2

vim configmap.yaml
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.yaml: |
    server:
      port: 8080
```

vim deployment.yaml

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: config-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: config-app
  template:
    metadata:
      labels:
        app: config-app
    spec:
      containers:
      - name: app
        image: busybox
        command:
          - sh
          - -c
          - |
            ls /app/config/app.yaml || echo "Config file not found"
            sleep 3600
        volumeMounts:
        - name: config-vol
          mountPath: /config 
      volumes:
      - name: config-vol
        configMap:
          name: app-config
```

![[Pasted image 20260201130450.png]]

![[Pasted image 20260201131411.png]]

--------------




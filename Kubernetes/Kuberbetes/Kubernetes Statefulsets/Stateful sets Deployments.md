**Step 1: Create Headless Service**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: webapp
spec:
  clusterIP: None
  selector:
    app: webapp
  ports:
  - port: 80
    targetPort: 80
```


![[Pasted image 20250722102753.png]]

**Step 2: Create StatefulSet with 3 Replicas, Hostnames, and PVCs**

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: webapp
spec:
  serviceName: "webapp"
  replicas: 3
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
        volumeMounts:
        - name: content
          mountPath: /usr/share/nginx/html
        command: ["/bin/sh"]
        args:
          - -c
          - |
            echo "Hello from $(hostname)" > /usr/share/nginx/html/index.html; 
            while true; do sleep 3600; done
  volumeClaimTemplates:
  - metadata:
      name: content
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
```

**Step 3: Validate Persistent Identity and Data**

```
# Access each Pod and confirm hostname and stored data
kubectl exec webapp-0 -- cat /usr/share/nginx/html/index.html
kubectl exec webapp-1 -- cat /usr/share/nginx/html/index.html

# Delete a Pod
kubectl delete pod webapp-1

# After it restarts, check again
kubectl exec webapp-1 -- cat /usr/share/nginx/html/index.html
# Output should still include original hostname and data
```
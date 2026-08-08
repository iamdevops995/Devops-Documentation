Create Namespace:

![[Pasted image 20251008225651.png]]

```sh
# Backend CA (used to sign backend cert)
openssl req -x509 -newkey rsa:2048 -days 365 -nodes \
  -keyout backend-ca.key -out backend-ca.crt \
  -subj "/CN=BackendCA"

# Backend server cert (signed by backend CA)
openssl req -newkey rsa:2048 -nodes \
  -keyout backend.key -out backend.csr \
  -subj "/CN=backend.myapp.svc.cluster.local"

openssl x509 -req -in backend.csr -CA backend-ca.crt -CAkey backend-ca.key \
  -CAcreateserial -out backend.crt -days 365 \
  -extfile <(printf "subjectAltName=DNS:backend.myapp.svc.cluster.local")

# Frontend (Ingress) public cert
openssl req -x509 -newkey rsa:2048 -days 365 -nodes \
  -keyout frontend.key -out frontend.crt \
  -subj "/CN=myapp.example.com"
```

List the certs and keys:

![[Pasted image 20251008225832.png]]

Create secrets:

![[Pasted image 20251008225722.png]]

Create config map:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: backend-nginx-conf
  namespace: myapp
data:
  default.conf: |
    server {
      listen 8443 ssl;
      ssl_certificate /etc/nginx/tls/tls.crt;
      ssl_certificate_key /etc/nginx/tls/tls.key;

      location / {
        return 200 'Hello from backend over HTTPS!\n';
      }
    }
```

![[Pasted image 20251008225955.png]]

![[Pasted image 20251008230007.png]]

Create deployment:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: myapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: nginx:alpine
        ports:
        - containerPort: 8443
        volumeMounts:
        - name: tls
          mountPath: /etc/nginx/tls
          readOnly: true
        - name: nginx-conf
          mountPath: /etc/nginx/conf.d
      volumes:
      - name: tls
        secret:
          secretName: backend-cert
      - name: nginx-conf
        configMap:
          name: backend-nginx-conf
```

![[Pasted image 20251008230110.png]]

![[Pasted image 20251008230125.png]]

Create service for backend deployement:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: myapp
spec:
  ports:
  - port: 8443
    targetPort: 8443
  selector:
    app: backend
```

![[Pasted image 20251008230226.png]]

Nginx Ingress Deployment url:
```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.0/deploy/static/provider/cloud/deploy.yaml

```

**Check the nginx ingress controller:**

![[Pasted image 20251008230626.png]]


**Deploy nginx resource:**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp
  namespace: myapp
  annotations:
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
    nginx.ingress.kubernetes.io/proxy-ssl-secret: "myapp/backend-ca"
    nginx.ingress.kubernetes.io/proxy-ssl-verify: "on"
    nginx.ingress.kubernetes.io/proxy-ssl-verify-depth: "2"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
      - myapp.example.com
    secretName: frontend-cert
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 8443
```

**Test connect over https:**

![[Pasted image 20251008230322.png]]

![[Pasted image 20251008230422.png]]


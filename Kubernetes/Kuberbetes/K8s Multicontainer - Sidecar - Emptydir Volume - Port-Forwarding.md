```yaml
apiVersion: v1
kind: Pod
metadata:
  name: multicontainer
spec:
  containers:
  - name: webcontainer                           # container name: webcontainer
    image: nginx                                 # image from nginx
    ports:                                       # opening-port: 80
      - containerPort: 80
    volumeMounts:
    - name: sharedvolume                          
      mountPath: /usr/share/nginx/html          # path in the container
  - name: sidecarcontainer
    image: busybox                              # sidecar, second container image is busybox
    command: ["/bin/sh"]                        # it pulls index.html file from github every 15 seconds
    args: ["-c", "while true; do wget -O /var/log/index.html https://raw.githubusercontent.com/omerbsezer/Fast-Kubernetes/main/index.html; sleep 15; done"]
    volumeMounts:
    - name: sharedvolume
      mountPath: /var/log
  volumes:                                      # define emptydir temporary volume, when the pod is deleted, volume also deleted
  - name: sharedvolume                          # name of volume 
    emptyDir: {}                                # volume type emtpydir: creates empty directory where the pod is runnning
```

- Create multicontainer on the pod (webcontainer and sidecarcontainer):
```sh
kubectl apply -f  multicontainer-sidecar.yaml
```

![[Pasted image 20251008115716.png]]
```sh
kubectl get pods
```

![[Pasted image 20251008121038.png]]

```sh
 kubectl  exec -it -n default multicontainer -c webcontainer -- /bin/sh
```

![[Pasted image 20251008121017.png]]

![[Pasted image 20251008121146.png]]

![[Pasted image 20251008121241.png]]

![[Pasted image 20251008121533.png]]

![[Pasted image 20251008121312.png]]

![[Pasted image 20251008121353.png]]

Log validation

![[Pasted image 20251008121626.png]]

![[Pasted image 20251008121758.png]]

![[Pasted image 20251008121719.png]]



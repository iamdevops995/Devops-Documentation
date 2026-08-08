#### Cluster creation

**Installing minikube binaries for Linux systems**
*Note:* For latest version download from the minikube official site.
Logeshkumar@0987
```
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```

**To setup cluster using minikube.** 

```
minikube start --nodes 2 -p local-cluster --driver=docker
```

![[Pasted image 20250712110145.png]]

**To check the cluster status:**
```
minikube status -p cluster_name
ex: minikube status -p local-cluster
```

![[Pasted image 20250712110701.png]]
**To add node to minikube cluster**.
```
minikube node add --worker -p local-cluster
minikube node add --master -p local-cluster
```
**To delete node in cluster.**
```
minikube delete node node_name
ex:
minikube delete node local-cluster-m02 -p local-cluster
```

**To enable minikube cluster  dashboard**

```
minikube dashboard --url -p cluster_name
```

![[Pasted image 20250712111139.png]]

**To stop the minikube cluster**
```
minikube stop -p cluster_name
```

![[Pasted image 20250712120157.png]]

Minikube ingress confif:



---------------------------------------------
#KubernetesManagementOverview:

- Kubernetes High Availability
- K8s Management Tools
- SetUp K8s HA cluster
- K8s Maintenance window management
- Upgrading kubernetes cluster
**Kubernetes High Availability in K8s:**
- K8s facilitate HA Applications
- Infra HA is necessary
- Cluster also needs to be highly available to support Applications HA
- To facilitate cluster HA we need multiple control Planes.
- User needs Load balancer to communicate with multiple control planes.

**K8s Management Tools:**
1. kubectl
2. kubeadm
3. minikube
4. Helm
5. Kompose
6. Kustomize
#### **SetUp K8s HA Cluster:**
### Install kubernetes on Master node:

1 upgrade the apt package
`sudo apt update`
2 Install docker engine
`sudo apt install docker.io`
3 Install the Support packages 
`sudo apt-get install -y apt-transport-https ca-certificates curl gpg`
4  Download the public signing key for the Kubernetes package repositories.

`curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg`
5 Add the kubernetes repo to the system
`echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list`
6 Update the `apt` package index, install kubelet, kubeadm and kubectl
`sudo apt-get update`
`sudo apt-get install -y kubelet kubeadm kubectl`
`sudo apt-mark hold kubelet kubeadm kubectl`
7  Enable the kubelet service before running kubeadm:
`sudo systemctl enable --now kubelet`
8 Create the actual cluster
Configure Cgroups for containerd runtime.
`mkdir -p /etc/containerd/`
containerd config default | sed 's/SystemdCgroup = false/SystemdCgroup = true/' | tee /etc/containerd/config.toml
`kubeadm init --pod-network-cidr=192.168.0.0/16`

```
`**Sample Output of kubeadm init:**`
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

Note: Note down the command to join worker nodes
9 Install the Network addon's
`kubectl apply -f <add-on.yaml>`
10 Untaint the master so that it will available for scheduling workloads
`kubectl taint nodes --all node-role.kubernetes.io/master-`

### Install kubernetes on Worker nodes:
1.upgrade the apt package
`sudo apt update`
2 Install docker engine
`sudo apt install docker.io`
3 Install the Support packages 
`sudo apt-get install -y apt-transport-https ca-certificates curl gpg`
4  Download the public signing key for the Kubernetes package repositories.

`curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg`
5 Add the kubernetes repo to the system
`echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list`
6 Update the `apt` package index, install kubelet, kubeadm and kubectl
`sudo apt-get update`
`sudo apt-get install -y kubelet kubeadm kubectl`
`sudo apt-mark hold kubelet kubeadm kubectl`
7  Enable the kubelet service before running kubeadm:
`sudo systemctl enable --now kubelet`
8 Execute the kubeadm join command
  `kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>`
9 Verify the nodes are join to cluster
`kubectl get nodes` 
To generate the join command again for feature.
`kudeadm token create  --print-join-command`
To view token list
`kubeadm token list`

------------------------------------------------------------------

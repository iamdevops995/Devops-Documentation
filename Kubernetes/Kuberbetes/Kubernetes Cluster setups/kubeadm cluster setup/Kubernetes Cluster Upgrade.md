#Kubernetes #Cluster #upgrade:


To seamlessly transition from Kubernetes v1.30 to v1.31 and gain access to the packages specific to the desired Kubernetes minor version, follow these essential steps during the upgrade process. This ensures that your environment is appropriately configured and aligned with the features and improvements introduced in Kubernetes v1.31.

On the controlplane node:

Use any text editor you prefer to open the file that defines the Kubernetes apt repository.

`vim /etc/apt/sources.list.d/kubernetes.list`

Update the version in the URL to the next available minor release, i.e v1.31.

`deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /` 

After making changes, save the file and exit from your text editor. Proceed with the next instruction.

`kubectl drain controlplane --ignore-daemonsets`
`apt update`
`apt-cache madison kubeadm`

Based on the version information displayed by apt-cache madison, it indicates that for Kubernetes version 1.31.0, the available package version is 1.31.0-1.1. Therefore, to install kubeadm for Kubernetes v1.31.0, use the following command:

`apt-get install kubeadm=1.31.0-1.1`

Run the following command to upgrade the Kubernetes cluster.

`kubeadm upgrade plan v1.31.0`
`kubeadm upgrade apply v1.31.0`

Now, upgrade the version and restart Kubelet. Also, mark the node (in this case, the "controlplane" node) as schedulable.

`apt-get install kubelet=1.31.0-1.1`
`systemctl daemon-reload`
`systemctl restart kubelet`
`kubectl uncordon controlplane`

Before draining node01, if the controlplane gets taint during an upgrade, we have to remove it.

#Identify the taint first. 
`kubectl describe node controlplane | grep -i taint`

#Remove the taint with help of "kubectl taint" command.
`kubectl taint node controlplane node-role.kubernetes.io/control-plane:NoSchedule-`

#Verify it, the taint has been removed successfully.  
`kubectl describe node controlplane | grep -i taint`

Now, drain the node01 as follows: -

`kubectl drain node01 --ignore-daemonsets`

SSH to the node01 and perform the below steps as follows: -
`ssh node_name`

Use any text editor you prefer to open the file that defines the Kubernetes apt repository.

`vim /etc/apt/sources.list.d/kubernetes.list`

Update the version in the URL to the next available minor release, i.e v1.31.

`deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /`

After making changes, save the file and exit from your text editor. Proceed with the next instruction.

`apt update`
`apt-cache madison kubeadm`

Based on the version information displayed by apt-cache madison, it indicates that for Kubernetes version 1.31.0, the available package version is 1.31.0-1.1. Therefore, to install kubeadm for Kubernetes v1.31.0, use the following **command**:

`apt-get install kubeadm=1.31.0-1.1`
#Upgrade the node 
`kubeadm upgrade node`

Now, upgrade the version and restart Kubelet.

`apt-get install kubelet=1.31.0-1.1`
`systemctl daemon-reload`
`systemctl restart kubelet`

To exit from the specific node, type exit or logout on the terminal.

Back on the controlplane node: -

`kubectl uncordon node_name`
`kubectl get pods -o wide | grep gold` # make sure this is scheduled on a node
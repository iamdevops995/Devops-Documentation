What?
Different applications communicate with each other within Kubernetes using a service; it is also used to access applications outside the cluster.
Expose an application running in your cluster behind a single outward-facing endpoint, even when the workload is split across multiple backends.
Each Pod gets its own IP address (Kubernetes expects network plugins to ensure this).
There are 4 types of Services:
- ClusterIP(For Internal access)
	- NodePort(To access the application on a particular port)
	- LoadBalancer(To access the application on a domain name or IP address without using the port number)
	- External (To use an external DNS for routing)

We can specify the pods IP range in the kube-api server
	-cat /etc/kubernetes/manifests/kube-apiserver.yaml | grep ip
	-sample: - --service-cluster-ip-range=10.96.0.0/12


To view the which proxier kube-proxy server/pod using
kubectl logs -n <namespace> <proxy-pod-name>
sample: **I0215 02:44:57.735539       1 server_linux.go:169] "Using iptables Proxier"**



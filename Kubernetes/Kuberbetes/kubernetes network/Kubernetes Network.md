Container Network interface
1.Container Runtime must create network namespace
2.Identify network the container must attach to
3.Container runtime to invoke network plugin bridge when container is Added
4.Container runtime to invoke network plugin bridge when container is Deleted
Standard's:
1.Must support command line argument ADD/DEL/CHECK
2.Must support parameters container id, network ns etc.
3.Must manage IP address assignment  to POD's
4.Must return in a specific format
Plugins:
Bridge, VLAN,IPVLAN, MACVLAN ,WINDOWS DHCP host-local
All plugins will located in /opt/cni/bin
To configure the we need to specify the plugin name in /etc/cni/net.d
Kubernetes will create the container with none network. once container created it will add required plugin's
Cluster Network configuration:
![[Pasted image 20250214112958.png]]Required ports for cluster configuration:
![[Pasted image 20250214113258.png]]
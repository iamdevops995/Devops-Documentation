- Remove Node from cluster
- Node Draining
- How to drain a node
- Ignore daemonSets
- Uncordoning a node
**Node Draining**
- Sometimes, we need to remove a node from cluster in service
- Application shouldn't be impacted by the process.
- Draining Node: Containers Runnings on that node will be gracefully terminated and re-schedule to another available node
**Use kubectl to drain node:**
`kubectl drain <node_name>`
**Ignore DaemonSets:** DaemonSets means pods that are tied coupled to each node in the cluster. If any daemonsets is running in our K8's cluster use command
`kubectl drain <node_name>  --ignore-daemonsets`
**Uncordoning K8s Node:**
If node remain part of container. User can allow pods to run on that node
`kubectl uncordon <node_name>`
 ### ***Encrypting Confidential Data at Rest***
 
  - All of the APIs in Kubernetes that let you write persistent API resource data support at-rest encryption. For example, you can enable at-rest encryption for Secrets. This at-rest encryption is additional to any system-level encryption for the etcd cluster or for the filesystem(s) on hosts where you are running the kube-apiserver.
  - To encrypt a custom resource, your cluster must be running Kubernetes v1.26 or newer
 
 The way Kubernetes handles secrets. Such as:
- A secret is only sent to a node if a pod on that node requires it.
- Kubelet stores the secret into a tmpfs so that the secret is not written to disk storage.
- Once the Pod that depends on the secret is deleted, kubelet will delete its local copy of the secret data as well.
##### ***Determine whether encryption at rest is already enabled***

1. By default, the API server stores plain-text representations of resources into etcd, with no at-rest encryption.
2. The default identity provider does not provide any confidentiality protection.
3. The `kube-apiserver` process accepts an argument `--encryption-provider-config` that specifies a path to a configuration file.
**Create a new encryption configuration file.**


```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      - configmaps
    providers:
      - aescbc:
          keys:
            - name: key1
              # See the following text for more details about the secret value
              secret: <BASE 64 ENCODED SECRET>
      - identity: {} # this fallback allows reading unencrypted secrets;
                     # for example, during initial migration
```
For Base64 Encoded secret.
`head -c 32 /dev/urandom | base64`
##### *Use the new encryption configuration file*
- You will need to mount the new encryption config file to the kube-apiserver static pod. Here is an example on how to do that.
- Save the new encryption config file to /etc/kubernetes/enc/enc.yaml on the control-plane node.
- Edit the manifest for the kube-apiserver static pod: /etc/kubernetes/manifests/kube-apiserver.yaml so that it is similar to.
**Add below line in Kube-apiserver.yaml file:**
-  --encryption-provider-config=/etc/kubernetes/enc/enc.yaml
-  Mount the file into the Pod.
To verify the secret data.
```shell
ETCDCTL_API=3 etcdctl \
   --cacert=/etc/kubernetes/pki/etcd/ca.crt   \
   --cert=/etc/kubernetes/pki/etcd/server.crt \
   --key=/etc/kubernetes/pki/etcd/server.key  \
   get /registry/secrets/default/secret_name | hexdump -C
```
```shell
# Run this as an administrator that can read and write all Secrets
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```
```yaml
---
#!/usr/local/bin/ansible-playbook
- name: Deploying application on kubernetes cluster
  hosts: localhost
  become: false
  gather_facts: no
  vars:
    ansible_python_interpreter: /mnt/d/Projects/ansible_kube/ansible/myansible/bin/python
  tasks:
    - name: Set kubeconfig path
      set_fact:
        kubeconfig: "/home/logesh/.kube/config"
    - name: Create namespace on the cluster
      k8s:
        name: python-hello
        api_version: v1
        kind: namespace
        state: present
    - name: Deploy the python application
      k8s:
        state: present
        definition: "{{ lookup('file', '/mnt/d/Projects/ansible_kube/ansible/python.yaml') | from_yaml }}"
```

```yaml
apiversion: apps/v1
kind: Deployment
metadata:
  name: python-hello
  namespace: python-hello
  labels:
    app: python-hello
spec:
  replicas: 1
  selector:
    matchLabels:
      app: python-hello
  template:
    metadata:
      labels:
        app: python-hello
    spec:
      containers:
        - name: python-hello
          image: iamdevops995/paypal3x-restui-outbound:latest
          ports:
            - containerPort: 5000
```

![[Pasted image 20250903162538.png]]

![[Pasted image 20250903162614.png]]
**Create a service for the application using ansible:**

```yaml
- name: Creating service for the python application
  hosts: localhost
  gather_facts: no
  become: false
  tasks:
    - name: Create a Service object from an inline definition
      k8s:
        state: present
        definition:
          apiVersion: v1
          kind: Service
          metadata:
            name: py-service
            namespace: python-hello
          spec:
            selector:
              app: python-hello
            ports:
            - protocol: TCP
              targetPort: 5000
              port: 500
```


![[Pasted image 20250903163448.png]]

![[Pasted image 20250903163738.png]]


------------------------------------------------
*Create config using ansible*

```yaml
- name: Creating service for the python application
  hosts: localhost
  gather_facts: no
  become: false
  tasks:
    - name: Create configmap using server side apply
      kubernetes.core.k8s:
        namespace: python-hello
        definition:
          apiVersion: v1
          kind: ConfigMap
          metadata:
            name: dbconfig
          data:
            db_username: "admin"
            db_password: "Passw0rd"
        apply: yes
        server_side_apply:
          field_manager: ansible
```

![[Pasted image 20250903171415.png]]![[Pasted image 20250903171508.png]]
![[Pasted image 20250903171554.png | 600]]
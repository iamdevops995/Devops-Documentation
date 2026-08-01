#### ROLES:

Used to divide the playbook into directory structure.
We can organize the playbook
We can encapsulate the data
We can reduce the playbook length

```shell
yum install tree -y
mkdir playbooks
cd playbooks
mkdir -p /roles/one/tasks
```

***vim roles/one/tasks/main.yaml

```yaml
- name: installing maven
  yum:
    name: maven
    state: present
```

***vim master.yaml

```yaml
- hosts: all
  roles:
    - one
```

```shell
ansible-playbook master.yaml
mkdir -p /roles/two/tasks
```

***vim main.yaml

```yaml
- name: create user
  user:
    name: logeshkumar
    state: present
```

***vim master.yaml

```yaml
- hosts: all
  roles:
    - one
    - two
```

***ansible-playbook master.yaml

```shell
mkdir -p /roles/three/tasks
```

***vim mail.yaml

```shell
- name: create a file
  shell: touch file1
```

***vim master.yaml

```yaml
- hosts: all
  roles:
    - one
    - two
    - three
```

***ansible-playbook master.yaml
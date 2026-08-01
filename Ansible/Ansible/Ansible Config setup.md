### Path Preferences

| Priority | Location |
|----------|----------|
| **ANSIBLE_CONFIG** | Environment Variable |
| **Current Dir** | ./ansible.cfg |
| **Hidden file in Home Dir** | ~/.ansible.cfg |
| **Ansible config at etc** | /etc/ansible/ansible.cfg |

---

**Create ansible config as env:**

![Ansible Config as Environment Variable](/Ansible/Ansible/images/Pasted%20image%2020250820094321.png)

**Create ansible on current directory:**

![Ansible Config in Current Directory](/Ansible/Ansible/images/Pasted%20image%2020250820094547.png)

**Create ansible config file on user home directory:**

![Ansible Config in Home Directory](/Ansible/Ansible/images/Pasted%20image%2020250820094836.png)

```bash
ANSIBLE_KEEP_REMOTE_FILE=1 ansible-playbook lineinfile.yaml
```
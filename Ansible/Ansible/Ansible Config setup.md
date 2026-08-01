### Path Preferences

| Priority | Location |
|----------|----------|
| **ANSIBLE_CONFIG** | Environment Variable |
| **Current Dir** | ./ansible.cfg |
| **Hidden file in Home Dir** | ~/.ansible.cfg |
| **Ansible config at etc** | /etc/ansible/ansible.cfg |

---

**Create ansible config as env:**

![Ansible Config as Environment Variable](images/ansible-config-env.png)

**Create ansible on current directory:**

![Ansible Config in Current Directory](images/ansible-config-current-dir.png)

**Create ansible config file on user home directory:**

![Ansible Config in Home Directory](images/ansible-config-home-dir.png)

```bash
ANSIBLE_KEEP_REMOTE_FILE=1 ansible-playbook lineinfile.yaml
```
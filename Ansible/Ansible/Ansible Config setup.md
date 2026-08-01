### Path Preferences

| Priority | Location |
|----------|----------|
| **ANSIBLE_CONFIG** | Environment Variable |
| **Current Dir** | ./ansible.cfg |
| **Hidden file in Home Dir** | ~/.ansible.cfg |
| **Ansible config at etc** | /etc/ansible/ansible.cfg |

---

**Create ansible config as env:**

<img src="/Ansible/Ansible/images/ansible-config-env.png" alt="Ansible Config as Environment Variable" />

**Create ansible on current directory:**

<img src="/Ansible/Ansible/images/ansible-config-current-dir.png" alt="Ansible Config in Current Directory" />

**Create ansible config file on user home directory:**

<img src="/Ansible/Ansible/images/ansible-config-home-dir.png" alt="Ansible Config in Home Directory" />

```bash
ANSIBLE_KEEP_REMOTE_FILE=1 ansible-playbook lineinfile.yaml
```
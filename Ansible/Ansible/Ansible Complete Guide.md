# Ansible Complete Guide

<div class="page-header">
  <span class="difficulty-badge beginner">Beginner Friendly</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 45 min read</span>
</div>

## 📚 What You'll Learn

<div class="learning-objectives">

| Objective | Description |
|-----------|-------------|
| 🎯 **Understand** | What Ansible is and why it's essential for DevOps |
| 🔧 **Configure** | Set up Ansible control node and managed nodes |
| 📝 **Write** | Create inventory files, playbooks, and roles |
| 🚀 **Deploy** | Automate real-world infrastructure tasks |
| 🔒 **Secure** | Implement Ansible Vault for secrets management |

</div>

---

## 🎓 Theory: Understanding Ansible

### What is Ansible?

> **Ansible** is an open-source IT automation engine that automates provisioning, configuration management, application deployment, orchestration, and many other IT processes.

<div class="concept-box">

**Key Characteristics:**

- **Agentless**: No software needs to be installed on managed nodes
- **Idempotent**: Running the same task multiple times yields the same result
- **Push-based**: Configurations are pushed from control node to managed nodes
- **YAML-based**: Human-readable configuration language
- **Modular**: Extensive library of built-in modules

</div>

### Why Use Ansible?

| Challenge | Without Ansible | With Ansible |
|-----------|-----------------|--------------|
| Server configuration | Manual SSH to each server | Single playbook for all servers |
| Software installation | Run commands individually | Automated, consistent installs |
| Configuration drift | Servers become inconsistent | Enforce desired state |
| Documentation | Outdated wikis | Playbooks ARE documentation |
| Disaster recovery | Hours of manual work | Re-run playbooks in minutes |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONTROL NODE                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Playbooks  │  │  Inventory  │  │   Modules   │              │
│  │   (.yml)    │  │   (hosts)   │  │  (built-in) │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                           │                                     │
│                       SSH / WinRM                               │
└───────────────────────────┼─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  MANAGED NODE │   │  MANAGED NODE │   │  MANAGED NODE │
│   (Server 1)  │   │   (Server 2)  │   │   (Server 3)  │
│    Linux/Win  │   │    Linux/Win  │   │    Linux/Win  │
└───────────────┘   └───────────────┘   └───────────────┘
```

---

## 🔧 Practical: Installation & Setup

### Lab 1: Install Ansible Control Node

<div class="lab-box">

**Objective:** Set up Ansible on Ubuntu/Amazon Linux

**Prerequisites:**
- Linux server (Ubuntu 20.04+ or Amazon Linux 2)
- sudo/root access
- Python 3.8+

</div>

<!-- tabs:start -->

#### **Ubuntu/Debian**

```bash
# Update package index
sudo apt update

# Install dependencies
sudo apt install -y software-properties-common

# Add Ansible PPA
sudo add-apt-repository --yes --update ppa:ansible/ansible

# Install Ansible
sudo apt install -y ansible

# Verify installation
ansible --version
```

#### **Amazon Linux / RHEL**

```bash
# Install EPEL repository (if needed)
sudo amazon-linux-extras install epel -y

# Install Ansible
sudo yum install -y ansible

# OR using pip (recommended for latest version)
sudo pip3 install ansible

# Verify installation
ansible --version
```

#### **Using pip (Any Linux)**

```bash
# Install pip if not present
sudo apt install -y python3-pip  # Ubuntu
sudo yum install -y python3-pip  # RHEL

# Install Ansible via pip
pip3 install ansible

# Add to PATH (if needed)
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

# Verify
ansible --version
```

<!-- tabs:end -->

**Expected Output:**
```
ansible [core 2.15.0]
  config file = /etc/ansible/ansible.cfg
  configured module search path = ['/home/user/.ansible/plugins/modules']
  ansible python module location = /usr/lib/python3/dist-packages/ansible
  ansible collection location = /home/user/.ansible/collections
  executable location = /usr/bin/ansible
  python version = 3.10.12
```

---

### Lab 2: Configure SSH Key Authentication

<div class="lab-box">

**Objective:** Set up passwordless SSH between control and managed nodes

</div>

```bash
# Generate SSH key pair (on control node)
ssh-keygen -t ed25519 -C "ansible-control" -f ~/.ssh/ansible_key

# Copy public key to managed nodes
ssh-copy-id -i ~/.ssh/ansible_key.pub user@managed-node-ip

# Test connection
ssh -i ~/.ssh/ansible_key user@managed-node-ip "hostname"
```

**For AWS EC2 instances:**
```bash
# If you have a .pem file
chmod 400 ~/mykey.pem

# Test connection
ssh -i ~/mykey.pem ec2-user@<EC2-IP> "hostname"
```

---

### Lab 3: Create Your First Inventory

<div class="lab-box">

**Objective:** Define managed hosts in an inventory file

</div>

**File: `inventory.ini`**
```ini
# Simple inventory file
[webservers]
web1 ansible_host=192.168.1.10 ansible_user=ubuntu
web2 ansible_host=192.168.1.11 ansible_user=ubuntu

[dbservers]
db1 ansible_host=192.168.1.20 ansible_user=ubuntu

[loadbalancers]
lb1 ansible_host=192.168.1.5 ansible_user=ubuntu

# Group of groups
[production:children]
webservers
dbservers
loadbalancers

# Variables for all hosts
[all:vars]
ansible_ssh_private_key_file=~/.ssh/ansible_key
ansible_python_interpreter=/usr/bin/python3
```

**Verify inventory:**
```bash
# List all hosts
ansible-inventory -i inventory.ini --list

# Ping all hosts
ansible all -i inventory.ini -m ping

# Ping specific group
ansible webservers -i inventory.ini -m ping
```

---

## 📝 Playbooks: Deep Dive

### Playbook Structure

```yaml
---
# Playbook header
- name: Descriptive name for this play    # Play name
  hosts: webservers                        # Target hosts/groups
  become: yes                              # Run as sudo
  vars:                                    # Variables
    http_port: 80
    
  tasks:                                   # List of tasks
    - name: Task description               # Task name
      module_name:                         # Module to use
        param1: value1                     # Module parameters
        param2: value2
      register: result                     # Save output
      when: condition                      # Conditional
      notify: handler_name                 # Trigger handler
      
  handlers:                                # Handlers section
    - name: handler_name
      module_name:
        param: value
```

### Lab 4: Write Your First Playbook

<div class="lab-box">

**Objective:** Create a playbook to install and configure Apache web server

</div>

**File: `install-apache.yml`**
```yaml
---
- name: Install and Configure Apache Web Server
  hosts: webservers
  become: yes
  
  vars:
    http_port: 80
    document_root: /var/www/html
    server_admin: admin@example.com
    
  tasks:
    # Task 1: Install Apache
    - name: Install Apache HTTP Server
      apt:
        name: apache2
        state: present
        update_cache: yes
      when: ansible_os_family == "Debian"
      
    - name: Install Apache HTTP Server (RHEL)
      yum:
        name: httpd
        state: present
      when: ansible_os_family == "RedHat"

    # Task 2: Create custom index page
    - name: Create index.html
      copy:
        dest: "{{ document_root }}/index.html"
        content: |
          <!DOCTYPE html>
          <html>
          <head><title>Welcome</title></head>
          <body>
            <h1>Server: {{ ansible_hostname }}</h1>
            <p>Deployed by Ansible on {{ ansible_date_time.date }}</p>
          </body>
          </html>
        mode: '0644'
      notify: Restart Apache

    # Task 3: Ensure Apache is running
    - name: Start and enable Apache
      service:
        name: "{{ 'apache2' if ansible_os_family == 'Debian' else 'httpd' }}"
        state: started
        enabled: yes

    # Task 4: Open firewall port
    - name: Allow HTTP through firewall (UFW)
      ufw:
        rule: allow
        port: "{{ http_port }}"
        proto: tcp
      when: ansible_os_family == "Debian"

  handlers:
    - name: Restart Apache
      service:
        name: "{{ 'apache2' if ansible_os_family == 'Debian' else 'httpd' }}"
        state: restarted
```

**Execute the playbook:**
```bash
# Syntax check
ansible-playbook install-apache.yml --syntax-check

# Dry run (check mode)
ansible-playbook install-apache.yml -i inventory.ini --check

# Execute
ansible-playbook install-apache.yml -i inventory.ini

# Execute with verbose output
ansible-playbook install-apache.yml -i inventory.ini -v
```

---

## 🔄 Variables & Facts

### Types of Variables

| Type | Scope | Example Location |
|------|-------|------------------|
| **Inventory vars** | Host/Group | `inventory.ini` or `group_vars/` |
| **Playbook vars** | Play | `vars:` section in playbook |
| **Role vars** | Role | `roles/myrole/vars/main.yml` |
| **Extra vars** | Highest precedence | `-e "var=value"` |
| **Facts** | Auto-collected | `ansible_hostname`, `ansible_os_family` |

### Lab 5: Working with Variables

**File: `group_vars/webservers.yml`**
```yaml
---
# Variables for webservers group
http_port: 80
https_port: 443
document_root: /var/www/html
max_clients: 200

packages:
  - apache2
  - php
  - php-mysql
  - libapache2-mod-php

firewall_rules:
  - port: 80
    proto: tcp
  - port: 443
    proto: tcp
```

**Using variables in playbook:**
```yaml
---
- name: Configure Web Servers with Variables
  hosts: webservers
  become: yes
  
  tasks:
    - name: Install required packages
      apt:
        name: "{{ packages }}"
        state: present
        update_cache: yes
        
    - name: Configure firewall rules
      ufw:
        rule: allow
        port: "{{ item.port }}"
        proto: "{{ item.proto }}"
      loop: "{{ firewall_rules }}"
      
    - name: Display server info
      debug:
        msg: |
          Hostname: {{ ansible_hostname }}
          OS: {{ ansible_distribution }} {{ ansible_distribution_version }}
          IP: {{ ansible_default_ipv4.address }}
          Memory: {{ ansible_memtotal_mb }} MB
```

---

## 🔐 Ansible Vault: Secrets Management

### Why Vault?

<div class="warning-box">

⚠️ **Never store passwords, API keys, or certificates in plain text!**

Ansible Vault encrypts sensitive data using AES256 encryption.

</div>


### Lab 6: Using Ansible Vault

```bash
# Create encrypted file
ansible-vault create secrets.yml

# Edit encrypted file
ansible-vault edit secrets.yml

# Encrypt existing file
ansible-vault encrypt vars.yml

# Decrypt file
ansible-vault decrypt vars.yml

# View encrypted file
ansible-vault view secrets.yml

# Change password
ansible-vault rekey secrets.yml
```

**File: `secrets.yml` (encrypted)**
```yaml
---
db_password: "SuperSecretPassword123!"
api_key: "sk-1234567890abcdef"
ssl_certificate: |
  -----BEGIN CERTIFICATE-----
  MIIDXTCCAkWgAwIBAgIJAJC1...
  -----END CERTIFICATE-----
```

**Using vault in playbook:**
```yaml
---
- name: Deploy Application with Secrets
  hosts: appservers
  become: yes
  vars_files:
    - secrets.yml
    
  tasks:
    - name: Configure database connection
      template:
        src: db-config.j2
        dest: /etc/myapp/database.conf
        mode: '0600'
      vars:
        db_host: localhost
        db_name: production
        db_user: appuser
        db_pass: "{{ db_password }}"  # From vault
```

**Execute with vault password:**
```bash
# Prompt for password
ansible-playbook deploy.yml --ask-vault-pass

# Use password file
ansible-playbook deploy.yml --vault-password-file ~/.vault_pass

# Use environment variable
export ANSIBLE_VAULT_PASSWORD_FILE=~/.vault_pass
ansible-playbook deploy.yml
```

---

## 📦 Roles: Reusable Automation

### Role Directory Structure

```
roles/
└── webserver/
    ├── defaults/          # Default variables (lowest precedence)
    │   └── main.yml
    ├── vars/              # Role variables (higher precedence)
    │   └── main.yml
    ├── tasks/             # Task definitions
    │   └── main.yml
    ├── handlers/          # Handlers
    │   └── main.yml
    ├── templates/         # Jinja2 templates
    │   └── vhost.conf.j2
    ├── files/             # Static files
    │   └── index.html
    ├── meta/              # Role metadata & dependencies
    │   └── main.yml
    └── README.md          # Documentation
```

### Lab 7: Create a Reusable Role

**Create role structure:**
```bash
# Using ansible-galaxy
ansible-galaxy init roles/webserver

# Manual creation
mkdir -p roles/webserver/{tasks,handlers,templates,files,vars,defaults,meta}
```

**File: `roles/webserver/tasks/main.yml`**
```yaml
---
- name: Include OS-specific variables
  include_vars: "{{ ansible_os_family }}.yml"

- name: Install web server packages
  package:
    name: "{{ webserver_packages }}"
    state: present

- name: Deploy virtual host configuration
  template:
    src: vhost.conf.j2
    dest: "{{ vhost_config_path }}"
    mode: '0644'
  notify: Reload web server

- name: Deploy website content
  copy:
    src: "{{ item }}"
    dest: "{{ document_root }}/"
    mode: '0644'
  loop:
    - index.html
    - style.css

- name: Ensure web server is running
  service:
    name: "{{ webserver_service }}"
    state: started
    enabled: yes
```

**File: `roles/webserver/handlers/main.yml`**
```yaml
---
- name: Reload web server
  service:
    name: "{{ webserver_service }}"
    state: reloaded

- name: Restart web server
  service:
    name: "{{ webserver_service }}"
    state: restarted
```

**File: `roles/webserver/templates/vhost.conf.j2`**
```apache
<VirtualHost *:{{ http_port }}>
    ServerName {{ server_name }}
    ServerAdmin {{ server_admin | default('webmaster@localhost') }}
    DocumentRoot {{ document_root }}

    <Directory {{ document_root }}>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/{{ server_name }}-error.log
    CustomLog ${APACHE_LOG_DIR}/{{ server_name }}-access.log combined
</VirtualHost>
```

**Using the role:**
```yaml
---
- name: Deploy Web Servers
  hosts: webservers
  become: yes
  
  roles:
    - role: webserver
      vars:
        server_name: example.com
        http_port: 80
        document_root: /var/www/example.com
```

---

## 🎯 Real-World Scenarios

### Scenario 1: Multi-Tier Application Deployment

```yaml
---
# Site-wide playbook: site.yml
- name: Configure Load Balancers
  hosts: loadbalancers
  roles:
    - role: haproxy
      vars:
        backend_servers: "{{ groups['webservers'] }}"

- name: Configure Web Servers
  hosts: webservers
  roles:
    - role: nginx
    - role: php-fpm
    - role: app-deploy
      vars:
        app_version: "{{ lookup('env', 'APP_VERSION') | default('latest') }}"

- name: Configure Database Servers
  hosts: dbservers
  roles:
    - role: mysql
      vars:
        mysql_root_password: "{{ vault_mysql_root_password }}"
    - role: mysql-backup
```

### Scenario 2: Rolling Update with Zero Downtime

```yaml
---
- name: Rolling Update - Web Servers
  hosts: webservers
  serial: 1                    # Update one server at a time
  max_fail_percentage: 0       # Stop if any server fails
  become: yes
  
  pre_tasks:
    - name: Disable server in load balancer
      uri:
        url: "http://{{ lb_api }}/disable/{{ inventory_hostname }}"
        method: POST
      delegate_to: localhost
      
    - name: Wait for connections to drain
      wait_for:
        timeout: 30

  roles:
    - role: app-deploy
      vars:
        app_version: "{{ new_version }}"

  post_tasks:
    - name: Health check
      uri:
        url: "http://{{ ansible_host }}:{{ http_port }}/health"
        status_code: 200
      retries: 5
      delay: 10
      
    - name: Enable server in load balancer
      uri:
        url: "http://{{ lb_api }}/enable/{{ inventory_hostname }}"
        method: POST
      delegate_to: localhost
```

---

## 🧪 Troubleshooting Guide

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| `Permission denied` | SSH key not authorized | `ssh-copy-id` or check `.ssh/authorized_keys` |
| `Host unreachable` | Network/firewall issue | Check security groups, ping host |
| `Python not found` | Missing Python on managed node | Install Python or set `ansible_python_interpreter` |
| `Become password required` | Missing sudo password | Use `--ask-become-pass` or configure NOPASSWD |
| `Module not found` | Missing collection/module | `ansible-galaxy collection install ...` |


### Debug Commands

```bash
# Verbose output levels
ansible-playbook playbook.yml -v      # Basic
ansible-playbook playbook.yml -vv     # More detail
ansible-playbook playbook.yml -vvv    # Connection debug
ansible-playbook playbook.yml -vvvv   # Full debug

# Check connectivity
ansible all -m ping -i inventory.ini

# Gather facts about a host
ansible hostname -m setup -i inventory.ini

# Run ad-hoc command
ansible all -a "df -h" -i inventory.ini

# Check playbook syntax
ansible-playbook playbook.yml --syntax-check

# Dry run (check mode)
ansible-playbook playbook.yml --check --diff

# List tasks that would run
ansible-playbook playbook.yml --list-tasks

# Start at specific task
ansible-playbook playbook.yml --start-at-task="Task name"

# Step through tasks
ansible-playbook playbook.yml --step
```

---

## 💼 Interview Questions

### Beginner Level

<details>
<summary><strong>Q: What is Ansible and why is it used?</strong></summary>

**A:** Ansible is an open-source IT automation tool that automates:
- **Configuration Management**: Maintain consistent server configurations
- **Application Deployment**: Deploy applications across multiple servers
- **Orchestration**: Coordinate complex multi-tier deployments
- **Provisioning**: Set up infrastructure on cloud/on-premises

**Key benefits:**
- Agentless (uses SSH)
- Simple YAML syntax
- Idempotent operations
- Large module library
</details>

<details>
<summary><strong>Q: What is the difference between Ansible and Terraform?</strong></summary>

**A:**

| Aspect | Ansible | Terraform |
|--------|---------|-----------|
| **Primary Use** | Configuration Management | Infrastructure Provisioning |
| **Approach** | Mutable (modifies existing) | Immutable (replace resources) |
| **State** | No state file | Maintains state file |
| **Language** | YAML | HCL |
| **Best For** | App deployment, config | Cloud infrastructure |

**In practice:** Use Terraform to create infrastructure, Ansible to configure it.
</details>

<details>
<summary><strong>Q: Explain idempotency in Ansible.</strong></summary>

**A:** Idempotency means running a playbook multiple times produces the same result. If the desired state is already achieved, Ansible makes no changes.

**Example:**
```yaml
- name: Ensure Apache is installed
  apt:
    name: apache2
    state: present
```
- First run: Installs Apache → **Changed**
- Second run: Apache exists → **OK** (no change)
- Third run: Apache exists → **OK** (no change)
</details>

### Intermediate Level

<details>
<summary><strong>Q: What are handlers and when would you use them?</strong></summary>

**A:** Handlers are special tasks that only run when notified by another task. They're typically used for actions that should only happen when a change occurs.

**Use cases:**
- Restart service after config change
- Reload firewall after rule update
- Clear cache after deployment

```yaml
tasks:
  - name: Update Apache config
    template:
      src: httpd.conf.j2
      dest: /etc/httpd/conf/httpd.conf
    notify: Restart Apache    # Only notifies if changed

handlers:
  - name: Restart Apache
    service:
      name: httpd
      state: restarted
```

**Key points:**
- Handlers run at the END of the play
- Each handler runs only ONCE even if notified multiple times
- Use `meta: flush_handlers` to run immediately
</details>

<details>
<summary><strong>Q: Explain Ansible variable precedence.</strong></summary>

**A:** Ansible has 22 levels of variable precedence (lowest to highest):

1. Role defaults (`roles/x/defaults/main.yml`)
2. Inventory file variables
3. Inventory `group_vars`
4. Inventory `host_vars`
5. Playbook `group_vars`
6. Playbook `host_vars`
7. Host facts
8. Play vars
9. Play `vars_prompt`
10. Play `vars_files`
11. Role vars (`roles/x/vars/main.yml`)
12. Block vars
13. Task vars
14. Include vars
15. Set_facts / registered vars
16. Role params
17. Include params
18. **Extra vars (`-e`)** ← Highest precedence

**Rule of thumb:** Extra vars (`-e`) always win!
</details>

### Advanced Level

<details>
<summary><strong>Q: How would you implement a rolling update with zero downtime?</strong></summary>

**A:** Key strategies:

```yaml
- hosts: webservers
  serial: "25%"              # Update 25% at a time
  max_fail_percentage: 10    # Stop if >10% fail
  
  pre_tasks:
    - name: Remove from load balancer
      # ...
    - name: Wait for connections to drain
      wait_for:
        timeout: 30
        
  roles:
    - deploy_app
    
  post_tasks:
    - name: Health check
      uri:
        url: http://localhost/health
        status_code: 200
      retries: 5
      delay: 10
    - name: Add back to load balancer
      # ...
```

**Options for `serial`:**
- `1` - One host at a time
- `"25%"` - 25% of hosts
- `[1, 5, 10]` - Start with 1, then 5, then 10
</details>

---

## 📋 Quick Reference

### Essential Commands

```bash
# Inventory
ansible-inventory --list -i inventory.ini
ansible-inventory --graph

# Ad-hoc Commands
ansible all -m ping
ansible webservers -m shell -a "uptime"
ansible all -m copy -a "src=file.txt dest=/tmp/"
ansible all -m yum -a "name=httpd state=present" -b

# Playbook Execution
ansible-playbook site.yml
ansible-playbook site.yml --check --diff
ansible-playbook site.yml --limit webservers
ansible-playbook site.yml --tags "deploy,config"
ansible-playbook site.yml --skip-tags "test"
ansible-playbook site.yml -e "version=2.0"

# Vault
ansible-vault create secrets.yml
ansible-vault edit secrets.yml
ansible-vault encrypt vars.yml
ansible-vault decrypt vars.yml

# Galaxy (Roles/Collections)
ansible-galaxy init myrole
ansible-galaxy install geerlingguy.docker
ansible-galaxy collection install community.general
```

### Commonly Used Modules

| Module | Purpose | Example |
|--------|---------|---------|
| `apt`/`yum`/`dnf` | Package management | Install software |
| `service`/`systemd` | Service management | Start/stop services |
| `copy` | Copy files | Deploy static files |
| `template` | Jinja2 templates | Deploy config files |
| `file` | File operations | Create dirs, set permissions |
| `user`/`group` | User management | Create users |
| `git` | Git operations | Clone repositories |
| `command`/`shell` | Run commands | Execute scripts |
| `uri` | HTTP requests | API calls, health checks |
| `debug` | Debugging | Print variables |

---

## 🔗 Additional Resources

- [Official Ansible Documentation](https://docs.ansible.com/)
- [Ansible Galaxy](https://galaxy.ansible.com/) - Community roles and collections
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)
- [Jinja2 Template Designer](https://jinja.palletsprojects.com/en/3.0.x/templates/)

---

<div class="next-steps">

## 🚀 Next Steps

1. **Practice Labs**: Complete the hands-on exercises above
2. **Build a Project**: Automate your own server setup
3. **Learn Roles**: Create reusable automation
4. **Explore AWX/Tower**: Enterprise Ansible with UI

</div>

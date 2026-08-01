# Ansible Roles

<div class="page-header">
  <span class="difficulty-badge advanced">Advanced</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 30 min</span>
</div>

> Roles are the standard way to organize and reuse Ansible automation. They provide a structured way to break up complex playbooks into reusable components.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 📁 **Role Structure** | Understand the directory layout |
| 🔧 **Create Roles** | Build roles from scratch |
| 📦 **Use Roles** | Include roles in playbooks |
| 🌐 **Ansible Galaxy** | Download community roles |

---

## 🎓 Theory: Why Use Roles?

<div class="concept-box">

**Benefits of Roles:**

| Benefit | Description |
|---------|-------------|
| 🔄 **Reusability** | Use the same role across multiple projects |
| 📦 **Organization** | Clean separation of concerns |
| 🤝 **Sharing** | Publish to Ansible Galaxy for community |
| 📏 **Standardization** | Consistent structure across teams |
| 🧪 **Testability** | Easier to test individual components |

</div>

---

## 📁 Role Directory Structure

![Ansible Role Structure](../../assets/images/diagrams/ansible-role-structure.svg ':size=100%')

### Directory Breakdown

```
roles/
└── webserver/                 # Role name
    ├── defaults/              # Default variables (lowest precedence)
    │   └── main.yml
    ├── vars/                  # Role variables (higher precedence)
    │   └── main.yml
    ├── tasks/                 # Main task list
    │   └── main.yml
    ├── handlers/              # Handler definitions
    │   └── main.yml
    ├── templates/             # Jinja2 template files
    │   └── nginx.conf.j2
    ├── files/                 # Static files to copy
    │   └── index.html
    ├── meta/                  # Role dependencies
    │   └── main.yml
    └── README.md              # Documentation
```

| Directory | Purpose | Loaded |
|-----------|---------|--------|
| `defaults/` | Default variables, easily overridden | Auto |
| `vars/` | Role variables, higher precedence | Auto |
| `tasks/` | Main task execution | Auto |
| `handlers/` | Handler definitions | Auto |
| `templates/` | Jinja2 templates | Manual |
| `files/` | Static files | Manual |
| `meta/` | Role metadata & dependencies | Auto |

---

## 🔧 Practical: Create a Role

### Method 1: Using ansible-galaxy (Recommended)

```bash
# Create role skeleton
ansible-galaxy init roles/webserver

# This creates the complete directory structure
tree roles/webserver
```

### Method 2: Manual Creation

```bash
# Create directory structure
mkdir -p roles/webserver/{tasks,handlers,templates,files,vars,defaults,meta}

# Create main.yml files
touch roles/webserver/{tasks,handlers,vars,defaults,meta}/main.yml
```

---

## 📝 Example: Complete Webserver Role

### Step 1: Define Defaults

**`roles/webserver/defaults/main.yml`**
```yaml
---
# Default variables (can be overridden)
http_port: 80
server_name: localhost
document_root: /var/www/html
max_clients: 256

# Package names (varies by OS)
webserver_package: httpd
webserver_service: httpd
```

### Step 2: Create Tasks

**`roles/webserver/tasks/main.yml`**
```yaml
---
- name: Install web server package
  yum:
    name: "{{ webserver_package }}"
    state: present
  notify: Restart webserver

- name: Deploy configuration file
  template:
    src: httpd.conf.j2
    dest: /etc/httpd/conf/httpd.conf
    mode: '0644'
  notify: Restart webserver

- name: Deploy website content
  copy:
    src: index.html
    dest: "{{ document_root }}/index.html"
    mode: '0644'

- name: Ensure webserver is running
  service:
    name: "{{ webserver_service }}"
    state: started
    enabled: yes
```

### Step 3: Create Handlers

**`roles/webserver/handlers/main.yml`**
```yaml
---
- name: Restart webserver
  service:
    name: "{{ webserver_service }}"
    state: restarted

- name: Reload webserver
  service:
    name: "{{ webserver_service }}"
    state: reloaded
```

### Step 4: Create Template

**`roles/webserver/templates/httpd.conf.j2`**
```apache
# Apache Configuration - Managed by Ansible
ServerName {{ server_name }}
Listen {{ http_port }}

DocumentRoot "{{ document_root }}"

<Directory "{{ document_root }}">
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>

MaxClients {{ max_clients }}
```

### Step 5: Add Static File

**`roles/webserver/files/index.html`**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome</title>
</head>
<body>
    <h1>Server deployed by Ansible!</h1>
</body>
</html>
```

### Step 6: Define Metadata

**`roles/webserver/meta/main.yml`**
```yaml
---
galaxy_info:
  author: Your Name
  description: Installs and configures Apache web server
  license: MIT
  min_ansible_version: "2.9"
  platforms:
    - name: EL
      versions:
        - "7"
        - "8"

dependencies: []
```

---

## 🚀 Using Roles in Playbooks

### Basic Usage

**`site.yml`**
```yaml
---
- name: Configure Web Servers
  hosts: webservers
  become: yes
  
  roles:
    - webserver
```

### With Variables

```yaml
---
- name: Configure Web Servers
  hosts: webservers
  become: yes
  
  roles:
    - role: webserver
      vars:
        http_port: 8080
        server_name: myapp.example.com
        max_clients: 512
```

### Multiple Roles

**`master.yml`**
```yaml
---
- name: Full Stack Deployment
  hosts: all
  become: yes
  
  roles:
    - common        # Base configuration
    - security      # Security hardening
    - webserver     # Apache installation
    - app_deploy    # Application deployment
```

### Conditional Roles

```yaml
---
- name: Conditional Role Application
  hosts: all
  become: yes
  
  roles:
    - role: webserver
      when: "'webservers' in group_names"
    
    - role: database
      when: "'dbservers' in group_names"
```

---

## 🌐 Ansible Galaxy

### Install Community Roles

```bash
# Install a role from Galaxy
ansible-galaxy install geerlingguy.docker

# Install to custom path
ansible-galaxy install geerlingguy.nginx -p ./roles/

# Install from requirements file
ansible-galaxy install -r requirements.yml
```

### Requirements File

**`requirements.yml`**
```yaml
---
roles:
  - name: geerlingguy.docker
    version: "6.0.0"
  - name: geerlingguy.nginx
  - src: https://github.com/user/custom-role.git
    name: custom-role
    version: main
```

---

## 📋 Role Best Practices

### 1. Use Sensible Defaults

```yaml
# defaults/main.yml
---
app_port: 8080
app_user: appuser
app_install_dir: /opt/myapp
```

### 2. Document Your Role

Create a comprehensive `README.md`:

```markdown
# Role: webserver

Installs and configures Apache web server.

## Requirements
- RHEL/CentOS 7 or 8
- Ansible 2.9+

## Role Variables
| Variable | Default | Description |
|----------|---------|-------------|
| http_port | 80 | HTTP listen port |
| server_name | localhost | Server hostname |

## Example Playbook
```yaml
- hosts: webservers
  roles:
    - webserver
```
```

### 3. Use Tags

```yaml
# tasks/main.yml
- name: Install packages
  yum:
    name: "{{ webserver_package }}"
    state: present
  tags: [install, packages]

- name: Configure service
  template:
    src: httpd.conf.j2
    dest: /etc/httpd/conf/httpd.conf
  tags: [configure]
```

Run specific tags:
```bash
ansible-playbook site.yml --tags "configure"
```

---

## 🔗 Next Steps

- [Ansible Vault](Ansible%20Vault.md) - Encrypt sensitive data in roles
- [Practical Playbooks](Practical%20ansible%20playbook.md) - Real-world examples

# Include & Import in Ansible

<div class="page-header">
  <span class="difficulty-badge intermediate">Intermediate</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 15 min</span>
</div>

> Learn how to modularize your playbooks by including and importing tasks, handlers, and entire playbooks.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 📥 **include_tasks** | Dynamically include tasks at runtime |
| 📦 **import_tasks** | Statically include tasks at parse time |
| 📚 **import_playbook** | Include entire playbooks |
| 🔄 **Key Differences** | When to use each approach |

---

## 🎓 Theory: Include vs Import

> **Key Difference:**

| Aspect | `import_*` (Static) | `include_*` (Dynamic) |
|--------|---------------------|----------------------|
| **When processed** | At playbook parse time | At runtime |
| **Conditional support** | Limited | Full support |
| **Loop support** | No | Yes |
| **Tags** | Applied to all imported tasks | Can be selective |
| **Use case** | Fixed structure | Dynamic, conditional |

### When to Use Each

| Use Case | Recommendation |
|----------|----------------|
| Fixed task structure | `import_tasks` |
| Conditional inclusion | `include_tasks` |
| Loop through task files | `include_tasks` |
| Main playbook organization | `import_playbook` |
| Dynamic file selection | `include_tasks` |

---

## 📥 include_tasks

Dynamically includes tasks at runtime.

### Basic Usage

**`tasks/install_packages.yml`**
```yaml
---
- name: Update package cache
  apt:
    update_cache: yes
  when: ansible_os_family == "Debian"

- name: Install required packages
  package:
    name: "{{ item }}"
    state: present
  loop: "{{ packages }}"
```

**`main.yml`**
```yaml
---
- name: Server Setup
  hosts: all
  become: yes
  
  vars:
    packages:
      - vim
      - git
      - curl
  
  tasks:
    - name: Include package installation
      include_tasks: tasks/install_packages.yml
```

### Conditional Include

```yaml
---
- name: OS-Specific Setup
  hosts: all
  become: yes
  
  tasks:
    - name: Include RedHat tasks
      include_tasks: tasks/redhat.yml
      when: ansible_os_family == "RedHat"
    
    - name: Include Debian tasks
      include_tasks: tasks/debian.yml
      when: ansible_os_family == "Debian"
```

### Include with Loop

```yaml
---
- name: Setup Multiple Services
  hosts: all
  become: yes
  
  tasks:
    - name: Configure each service
      include_tasks: tasks/configure_service.yml
      loop:
        - nginx
        - mysql
        - redis
      loop_control:
        loop_var: service_name
```

**`tasks/configure_service.yml`**
```yaml
---
- name: Install {{ service_name }}
  package:
    name: "{{ service_name }}"
    state: present

- name: Start {{ service_name }}
  service:
    name: "{{ service_name }}"
    state: started
    enabled: yes
```

### Pass Variables to Included Tasks

```yaml
---
- name: Include with variables
  include_tasks: tasks/create_user.yml
  vars:
    username: alice
    user_group: developers
    user_shell: /bin/zsh
```

---

## 📦 import_tasks

Statically imports tasks at parse time.

### Basic Usage

```yaml
---
- name: Server Setup
  hosts: all
  become: yes
  
  tasks:
    - import_tasks: tasks/common.yml
    - import_tasks: tasks/security.yml
    - import_tasks: tasks/application.yml
```

### With Tags

```yaml
---
- name: Full Deployment
  hosts: all
  become: yes
  
  tasks:
    - import_tasks: tasks/install.yml
      tags: [install, setup]
    
    - import_tasks: tasks/configure.yml
      tags: [configure]
    
    - import_tasks: tasks/deploy.yml
      tags: [deploy]
```

Run specific tags:
```bash
ansible-playbook site.yml --tags "configure"
```

!> ⚠️ **Limitation:** `import_tasks` cannot be used with loops or most conditionals (conditional is applied to each task inside, not the import itself).

---

## 📚 import_playbook

Include entire playbooks.

### Master Playbook

**`site.yml`**
```yaml
---
# Master playbook - orchestrates all plays
- import_playbook: playbooks/common.yml
- import_playbook: playbooks/webservers.yml
- import_playbook: playbooks/databases.yml
- import_playbook: playbooks/monitoring.yml
```

### Environment-Specific Playbooks

**`deploy.yml`**
```yaml
---
# Common tasks for all environments
- import_playbook: playbooks/base.yml

# Environment-specific playbook
- import_playbook: "playbooks/{{ env }}.yml"
```

```bash
ansible-playbook deploy.yml -e "env=production"
```

---

## 🔄 Practical Examples

### Example 1: Modular Role Alternative

Instead of a full role, use organized task files:

```
project/
├── site.yml
└── tasks/
    ├── common/
    │   ├── packages.yml
    │   ├── users.yml
    │   └── security.yml
    ├── webserver/
    │   ├── install.yml
    │   ├── configure.yml
    │   └── deploy.yml
    └── database/
        ├── install.yml
        └── configure.yml
```

**`site.yml`**
```yaml
---
- name: Full Server Setup
  hosts: all
  become: yes
  
  tasks:
    # Common setup
    - import_tasks: tasks/common/packages.yml
    - import_tasks: tasks/common/users.yml
    - import_tasks: tasks/common/security.yml

- name: Web Server Setup
  hosts: webservers
  become: yes
  
  tasks:
    - import_tasks: tasks/webserver/install.yml
    - import_tasks: tasks/webserver/configure.yml
    - import_tasks: tasks/webserver/deploy.yml

- name: Database Setup
  hosts: databases
  become: yes
  
  tasks:
    - import_tasks: tasks/database/install.yml
    - import_tasks: tasks/database/configure.yml
```

### Example 2: OS-Specific Task Selection

```yaml
---
- name: Cross-Platform Setup
  hosts: all
  become: yes
  
  tasks:
    - name: Include OS-specific variables
      include_vars: "vars/{{ ansible_os_family }}.yml"
    
    - name: Include OS-specific tasks
      include_tasks: "tasks/{{ ansible_os_family | lower }}.yml"
```

**`vars/RedHat.yml`**
```yaml
---
package_manager: yum
web_package: httpd
web_service: httpd
```

**`vars/Debian.yml`**
```yaml
---
package_manager: apt
web_package: apache2
web_service: apache2
```

### Example 3: Include Handlers

**`handlers/main.yml`**
```yaml
---
- name: Restart nginx
  service:
    name: nginx
    state: restarted

- name: Reload nginx
  service:
    name: nginx
    state: reloaded
```

**`playbook.yml`**
```yaml
---
- name: Web Server Setup
  hosts: webservers
  become: yes
  
  handlers:
    - include_tasks: handlers/main.yml
  
  tasks:
    - name: Update nginx config
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: Restart nginx
```

---

## 📋 Quick Reference

### Include/Import Tasks

```yaml
# Dynamic (runtime)
- include_tasks: tasks/file.yml
- include_tasks: tasks/file.yml
  when: condition
- include_tasks: tasks/file.yml
  loop: [a, b, c]

# Static (parse time)
- import_tasks: tasks/file.yml
- import_tasks: tasks/file.yml
  tags: [tag1, tag2]
```

### Import Playbook

```yaml
# In master playbook
- import_playbook: playbooks/common.yml
- import_playbook: playbooks/webservers.yml
```

### Include Variables

```yaml
# Include variable file
- include_vars: vars/secrets.yml
- include_vars: "vars/{{ env }}.yml"
```

---

## 💡 Best Practices

1. **Use `import_tasks` for fixed structure** - Known at playbook start
2. **Use `include_tasks` for dynamic needs** - Conditional, loops
3. **Organize by function** - `tasks/install.yml`, `tasks/configure.yml`
4. **Use meaningful names** - `install_docker.yml` not `task1.yml`
5. **Keep included files focused** - Single responsibility

---

## 🔗 Next Steps

- [Ansible Roles](Ansible%20Roles.md) - Full modularization
- [Ansible Loops](Ansible%20Loop.md) - Loop with includes

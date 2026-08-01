# Practical Ansible Modules

<div class="page-header">
  <span class="difficulty-badge intermediate">Intermediate</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 30 min</span>
</div>

> Real-world examples of commonly used Ansible modules for file management, configuration, and system administration.

---

## 📚 Modules Covered

| Module | Purpose |
|--------|---------|
| 📝 `lineinfile` | Manage single lines in files |
| 📄 `blockinfile` | Manage blocks of text in files |
| 🔄 `reboot` | Reboot and wait for systems |
| 📦 `git` | Clone and manage repositories |
| 📋 `copy` | Copy files to remote hosts |
| 📥 `fetch` | Download files from remote hosts |

---

## 📝 lineinfile Module

Manage individual lines in text files - add, modify, or remove specific lines.

> **Use Cases:**
> - Add configuration options to files
> - Modify specific settings
> - Ensure a line exists or is absent
> - Update values matching a pattern

### Parameters

| Parameter | Description |
|-----------|-------------|
| `path` | File to modify |
| `line` | Line to add/ensure |
| `regexp` | Pattern to search for |
| `state` | `present` or `absent` |
| `insertafter` | Insert after this pattern (or `EOF`, `BOF`) |
| `insertbefore` | Insert before this pattern |
| `backup` | Create backup before editing |

### Example: Manage Configuration File

```yaml
---
- name: Manage Configuration with lineinfile
  hosts: all
  become: yes
  
  tasks:
    - name: Ensure config file exists
      file:
        path: /etc/myapp/app.conf
        state: touch
        mode: '0644'
    
    - name: Add timeout setting
      lineinfile:
        path: /etc/myapp/app.conf
        line: "timeout = 60"
        state: present
    
    - name: Add line after specific pattern
      lineinfile:
        path: /etc/myapp/app.conf
        line: "max_connections = 100"
        insertafter: "^timeout"
    
    - name: Replace existing value
      lineinfile:
        path: /etc/myapp/app.conf
        regexp: "^ssl_enabled.*"
        line: "ssl_enabled = true"
    
    - name: Add comment at beginning
      lineinfile:
        path: /etc/myapp/app.conf
        line: "# Managed by Ansible"
        insertbefore: BOF
    
    - name: Remove a line
      lineinfile:
        path: /etc/myapp/app.conf
        regexp: "^debug_mode.*"
        state: absent
    
    - name: Verify file contents
      command: cat /etc/myapp/app.conf
      register: file_content
    
    - name: Display contents
      debug:
        msg: "{{ file_content.stdout_lines }}"
```

### Example: SSH Configuration

```yaml
---
- name: Secure SSH Configuration
  hosts: all
  become: yes
  
  tasks:
    - name: Disable root login
      lineinfile:
        path: /etc/ssh/sshd_config
        regexp: "^#?PermitRootLogin"
        line: "PermitRootLogin no"
        backup: yes
      notify: Restart SSH
    
    - name: Disable password authentication
      lineinfile:
        path: /etc/ssh/sshd_config
        regexp: "^#?PasswordAuthentication"
        line: "PasswordAuthentication no"
      notify: Restart SSH
    
    - name: Set SSH port
      lineinfile:
        path: /etc/ssh/sshd_config
        regexp: "^#?Port"
        line: "Port 22"
      notify: Restart SSH
  
  handlers:
    - name: Restart SSH
      service:
        name: sshd
        state: restarted
```

---

## 📄 blockinfile Module

Manage multi-line blocks of text with markers.

> **Use Cases:**
> - Add configuration sections
> - Insert multi-line content
> - Manage blocks that need to stay together
> - Update entire sections atomically

### Parameters

| Parameter | Description |
|-----------|-------------|
| `path` | File to modify |
| `block` | Multi-line content to insert |
| `marker` | Marker for identifying block |
| `state` | `present` or `absent` |
| `insertafter` | Insert after pattern |
| `backup` | Create backup |

### Example: Nginx Configuration Block

```yaml
---
- name: Manage Nginx Configuration
  hosts: webservers
  become: yes
  
  tasks:
    - name: Add API proxy configuration
      blockinfile:
        path: /etc/nginx/conf.d/default.conf
        marker: "# {mark} ANSIBLE MANAGED - API PROXY"
        insertafter: "server {"
        block: |
          # API Proxy Configuration
          location /api {
              proxy_pass http://backend:8080;
              proxy_set_header Host $host;
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              proxy_connect_timeout 30s;
              proxy_read_timeout 60s;
          }
      notify: Reload Nginx
    
    - name: Add WebSocket configuration
      blockinfile:
        path: /etc/nginx/conf.d/default.conf
        marker: "# {mark} ANSIBLE MANAGED - WEBSOCKET"
        block: |
          location /ws {
              proxy_pass http://backend:8081;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection "upgrade";
          }
      notify: Reload Nginx
  
  handlers:
    - name: Reload Nginx
      service:
        name: nginx
        state: reloaded
```

### Example: Hosts File Management

```yaml
---
- name: Manage /etc/hosts
  hosts: all
  become: yes
  
  tasks:
    - name: Add internal hosts
      blockinfile:
        path: /etc/hosts
        marker: "# {mark} ANSIBLE MANAGED - INTERNAL HOSTS"
        block: |
          192.168.1.10  web1.internal web1
          192.168.1.11  web2.internal web2
          192.168.1.20  db1.internal db1
          192.168.1.30  cache1.internal cache1
```

---

## 🔄 reboot Module

Safely reboot systems and wait for them to come back online.

> **Use Cases:**
> - Kernel updates requiring restart
> - Configuration changes requiring reboot
> - Maintenance procedures

### Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `msg` | Reboot message | "Reboot initiated by Ansible" |
| `reboot_timeout` | Max wait time | 600 seconds |
| `pre_reboot_delay` | Delay before reboot | 0 seconds |
| `post_reboot_delay` | Delay after reboot | 0 seconds |
| `test_command` | Command to verify system | `whoami` |

### Example: Kernel Update with Reboot

```yaml
---
- name: Kernel Update and Reboot
  hosts: all
  become: yes
  
  tasks:
    - name: Update all packages
      apt:
        update_cache: yes
        upgrade: dist
      when: ansible_os_family == "Debian"
      register: update_result
    
    - name: Check if reboot is required
      stat:
        path: /var/run/reboot-required
      register: reboot_required
      when: ansible_os_family == "Debian"
    
    - name: Reboot if required
      reboot:
        msg: "Rebooting for kernel update"
        reboot_timeout: 300
        pre_reboot_delay: 10
        post_reboot_delay: 30
        test_command: uptime
      when: reboot_required.stat.exists | default(false)
    
    - name: Verify system is back online
      command: uptime
      register: uptime_result
    
    - name: Display uptime
      debug:
        msg: "System uptime: {{ uptime_result.stdout }}"
```

### Example: Rolling Reboot

```yaml
---
- name: Rolling Reboot of Servers
  hosts: webservers
  serial: 1  # One server at a time
  become: yes
  
  tasks:
    - name: Disable from load balancer
      uri:
        url: "http://lb.example.com/api/disable/{{ inventory_hostname }}"
        method: POST
      delegate_to: localhost
    
    - name: Wait for connections to drain
      pause:
        seconds: 30
    
    - name: Reboot server
      reboot:
        msg: "Scheduled maintenance reboot"
        reboot_timeout: 300
        post_reboot_delay: 60
    
    - name: Health check
      uri:
        url: "http://{{ inventory_hostname }}:80/health"
        status_code: 200
      retries: 5
      delay: 10
    
    - name: Re-enable in load balancer
      uri:
        url: "http://lb.example.com/api/enable/{{ inventory_hostname }}"
        method: POST
      delegate_to: localhost
```

---

## 📦 git Module

Clone and manage Git repositories.

> **Use Cases:**
> - Deploy application code
> - Manage configuration repositories
> - Pull updates from remote repositories

### Parameters

| Parameter | Description |
|-----------|-------------|
| `repo` | Repository URL (required) |
| `dest` | Destination path (required) |
| `version` | Branch, tag, or commit |
| `force` | Discard local changes |
| `update` | Pull updates if exists |
| `depth` | Shallow clone depth |

### Example: Deploy Application

```yaml
---
- name: Deploy Application from Git
  hosts: webservers
  become: yes
  
  vars:
    app_repo: "https://github.com/example/myapp.git"
    app_version: "v2.1.0"
    app_dest: "/opt/myapp"
    app_user: "appuser"
  
  tasks:
    - name: Ensure git is installed
      package:
        name: git
        state: present
    
    - name: Create application user
      user:
        name: "{{ app_user }}"
        state: present
        shell: /bin/bash
    
    - name: Clone application repository
      git:
        repo: "{{ app_repo }}"
        dest: "{{ app_dest }}"
        version: "{{ app_version }}"
        force: yes
        update: yes
      become_user: "{{ app_user }}"
      notify: Restart Application
    
    - name: Install dependencies
      command: npm install --production
      args:
        chdir: "{{ app_dest }}"
      become_user: "{{ app_user }}"
  
  handlers:
    - name: Restart Application
      service:
        name: myapp
        state: restarted
```

---

## 📋 copy Module

Copy files from control node to remote hosts.

### Parameters

| Parameter | Description |
|-----------|-------------|
| `src` | Source file path |
| `dest` | Destination path (required) |
| `content` | Direct content (instead of src) |
| `owner` | File owner |
| `group` | File group |
| `mode` | File permissions |
| `backup` | Create backup |

### Example: Deploy Configuration Files

```yaml
---
- name: Deploy Configuration Files
  hosts: all
  become: yes
  
  tasks:
    - name: Copy nginx configuration
      copy:
        src: files/nginx.conf
        dest: /etc/nginx/nginx.conf
        owner: root
        group: root
        mode: '0644'
        backup: yes
      notify: Reload Nginx
    
    - name: Create config from content
      copy:
        dest: /etc/myapp/version.txt
        content: |
          Application Version: 2.1.0
          Deployed: {{ ansible_date_time.date }}
          Deployed by: Ansible
        mode: '0644'
    
    - name: Copy directory recursively
      copy:
        src: files/app/
        dest: /opt/myapp/
        owner: appuser
        group: appuser
        mode: '0755'
  
  handlers:
    - name: Reload Nginx
      service:
        name: nginx
        state: reloaded
```

---

## 📥 fetch Module

Download files from remote hosts to control node.

### Parameters

| Parameter | Description |
|-----------|-------------|
| `src` | Remote file path (required) |
| `dest` | Local destination (required) |
| `flat` | Don't add hostname to path |
| `validate_checksum` | Verify checksum |

### Example: Collect Log Files

```yaml
---
- name: Collect Logs from Servers
  hosts: webservers
  
  tasks:
    - name: Create logs directory
      delegate_to: localhost
      file:
        path: ./collected_logs/{{ inventory_hostname }}
        state: directory
      run_once: false
    
    - name: Fetch application logs
      fetch:
        src: /var/log/myapp/app.log
        dest: ./collected_logs/{{ inventory_hostname }}/
        flat: yes
    
    - name: Fetch nginx access log
      fetch:
        src: /var/log/nginx/access.log
        dest: ./collected_logs/{{ inventory_hostname }}/
        flat: yes
```

### Example: Backup Configuration

```yaml
---
- name: Backup Server Configurations
  hosts: all
  
  vars:
    backup_dir: "./backups/{{ inventory_hostname }}/{{ ansible_date_time.date }}"
  
  tasks:
    - name: Create backup directory
      delegate_to: localhost
      file:
        path: "{{ backup_dir }}"
        state: directory
    
    - name: Backup critical configs
      fetch:
        src: "{{ item }}"
        dest: "{{ backup_dir }}/"
        flat: yes
      loop:
        - /etc/nginx/nginx.conf
        - /etc/ssh/sshd_config
        - /etc/hosts
      ignore_errors: yes
```

---

## 📋 Quick Reference

| Module | Primary Use |
|--------|-------------|
| `lineinfile` | Single line management |
| `blockinfile` | Multi-line block management |
| `reboot` | Safe system reboot |
| `git` | Repository management |
| `copy` | Upload files |
| `fetch` | Download files |

---

## 🔗 Next Steps

- [Ansible Roles](Ansible%20Roles.md) - Package these modules into roles
- [Ansible Vault](Ansible%20Vault.md) - Secure sensitive data

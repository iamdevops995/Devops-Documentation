# Ansible File Operations

<div class="page-header">
  <span class="difficulty-badge beginner">Beginner</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 15 min</span>
</div>

> Learn how to manage files and directories on remote hosts using Ansible's file module and related modules.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 📄 **Create Files** | Touch files, set permissions |
| 📁 **Create Directories** | Make directory structures |
| 🗑️ **Delete Files** | Remove files and directories |
| 🔐 **Set Permissions** | Configure owner, group, mode |

---

## 🎓 Theory: File Module

> **The `file` module manages:**
> - Creating/deleting files and directories
> - Setting permissions (mode)
> - Setting ownership (owner, group)
> - Creating symbolic links

### Common States

| State | Purpose |
|-------|---------|
| `touch` | Create empty file |
| `directory` | Create directory |
| `absent` | Delete file/directory |
| `link` | Create symbolic link |
| `hard` | Create hard link |
| `file` | Ensure file exists (no create) |

---

## 🔧 Ad-hoc Commands

### Create a File

```bash
# Basic file creation
ansible webservers -m file -a "dest=/tmp/test.txt state=touch"

# With permissions
ansible webservers -m file -a "dest=/tmp/script.sh state=touch mode='0755'"

# With owner and group
ansible webservers -m file -a "dest=/tmp/app.log state=touch owner=nginx group=nginx mode='0644'"
```

### Create a Directory

```bash
# Create directory
ansible webservers -m file -a "dest=/opt/myapp state=directory"

# With permissions
ansible webservers -m file -a "dest=/opt/myapp state=directory mode='0755' owner=appuser"

# Nested directories (creates parent dirs)
ansible webservers -m file -a "dest=/opt/myapp/logs/archive state=directory"
```

### Delete Files or Directories

```bash
# Delete a file
ansible webservers -m file -a "dest=/tmp/test.txt state=absent"

# Delete a directory (recursive)
ansible webservers -m file -a "dest=/tmp/old_data state=absent"
```

---

## 📝 Playbook Examples

### Example 1: Create Application Directory Structure

```yaml
---
- name: Setup Application Directories
  hosts: all
  become: yes
  
  vars:
    app_name: myapp
    app_user: appuser
    base_dir: /opt
    
  tasks:
    - name: Create application user
      user:
        name: "{{ app_user }}"
        state: present
        shell: /bin/bash
    
    - name: Create main application directory
      file:
        path: "{{ base_dir }}/{{ app_name }}"
        state: directory
        owner: "{{ app_user }}"
        group: "{{ app_user }}"
        mode: '0755'
    
    - name: Create subdirectories
      file:
        path: "{{ base_dir }}/{{ app_name }}/{{ item }}"
        state: directory
        owner: "{{ app_user }}"
        group: "{{ app_user }}"
        mode: '0755'
      loop:
        - bin
        - config
        - logs
        - data
        - tmp
    
    - name: Create log file
      file:
        path: "{{ base_dir }}/{{ app_name }}/logs/app.log"
        state: touch
        owner: "{{ app_user }}"
        group: "{{ app_user }}"
        mode: '0644'
```

### Example 2: Manage Configuration Files

```yaml
---
- name: Manage Config Files
  hosts: all
  become: yes
  
  tasks:
    - name: Ensure config directory exists
      file:
        path: /etc/myapp
        state: directory
        mode: '0755'
    
    - name: Create config file with specific permissions
      file:
        path: /etc/myapp/settings.conf
        state: touch
        mode: '0600'  # Only root can read/write
        owner: root
        group: root
    
    - name: Create public config (readable by all)
      file:
        path: /etc/myapp/public.conf
        state: touch
        mode: '0644'  # Owner write, all read
```

### Example 3: Create Symbolic Links

```yaml
---
- name: Manage Symbolic Links
  hosts: all
  become: yes
  
  tasks:
    - name: Create symlink for current release
      file:
        src: /opt/myapp/releases/v2.0
        dest: /opt/myapp/current
        state: link
        owner: appuser
        group: appuser
    
    - name: Link config to shared location
      file:
        src: /opt/myapp/shared/config.yml
        dest: /opt/myapp/current/config.yml
        state: link
```

### Example 4: Cleanup Old Files

```yaml
---
- name: Cleanup Old Files
  hosts: all
  become: yes
  
  tasks:
    - name: Remove temporary files
      file:
        path: "{{ item }}"
        state: absent
      loop:
        - /tmp/old_cache
        - /tmp/temp_data
        - /var/log/old_logs
    
    - name: Find and remove old log files
      find:
        paths: /var/log/myapp
        patterns: "*.log"
        age: 30d
      register: old_logs
    
    - name: Delete old log files
      file:
        path: "{{ item.path }}"
        state: absent
      loop: "{{ old_logs.files }}"
```

---

## 🔐 Permission Reference

### Numeric Mode (Octal)

| Mode | Meaning |
|------|---------|
| `0755` | rwxr-xr-x (owner full, others read+execute) |
| `0644` | rw-r--r-- (owner read+write, others read) |
| `0600` | rw------- (owner only) |
| `0777` | rwxrwxrwx (everyone full access) |
| `0750` | rwxr-x--- (owner full, group read+execute) |

### Symbolic Mode

```yaml
# Using symbolic notation
- file:
    path: /opt/script.sh
    mode: u=rwx,g=rx,o=rx  # Same as 0755
    
- file:
    path: /etc/secret.conf
    mode: u=rw,g=,o=       # Same as 0600
```

---

## 📋 Quick Reference

### Ad-hoc Commands

```bash
# Create file
ansible hosts -m file -a "path=/tmp/file.txt state=touch"

# Create directory
ansible hosts -m file -a "path=/opt/mydir state=directory"

# Delete
ansible hosts -m file -a "path=/tmp/old state=absent"

# Set permissions
ansible hosts -m file -a "path=/opt/script.sh mode=0755"

# Create symlink
ansible hosts -m file -a "src=/opt/v1 dest=/opt/current state=link"
```

### Common Parameters

| Parameter | Description |
|-----------|-------------|
| `path` / `dest` | Target path |
| `state` | touch, directory, absent, link, hard |
| `mode` | Permissions (0755 or u=rwx,g=rx,o=rx) |
| `owner` | File owner |
| `group` | File group |
| `src` | Source for links |
| `recurse` | Apply recursively (directories) |

---

## 🔗 Related Modules

| Module | Purpose |
|--------|---------|
| `copy` | Copy files from control node |
| `template` | Deploy Jinja2 templates |
| `fetch` | Download files from remote |
| `synchronize` | rsync wrapper |
| `find` | Find files matching criteria |
| `lineinfile` | Manage lines in files |
| `blockinfile` | Manage blocks in files |

---

## 🔗 Next Steps

- [Practical Playbooks](Practical%20ansible%20playbook.md) - Copy, template, and more
- [Ansible Loops](Ansible%20Loop.md) - Create multiple files

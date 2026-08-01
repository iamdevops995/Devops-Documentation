# Ansible Handlers

<div class="page-header">
  <span class="difficulty-badge intermediate">Intermediate</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 10 min</span>
</div>

> Handlers are special tasks that only run when notified by other tasks. They're essential for actions that should only happen when changes occur.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 🔔 **Understand Handlers** | What handlers are and when to use them |
| 🔗 **Notify Mechanism** | How tasks trigger handlers |
| 🔄 **Multiple Handlers** | Notifying multiple handlers from one task |
| ✅ **Best Practices** | When to use handlers vs regular tasks |

---

## 🎓 Theory: Understanding Handlers

> **What are Handlers?**
>
> Handlers are tasks that only execute when:
> 1. They are **notified** by another task
> 2. The notifying task made a **change** (status: changed)
>
> **Key Characteristics:**
> - Run only **once** at the end of a play, even if notified multiple times
> - Execute in the **order they are defined**, not the order they are notified
> - Perfect for **service restarts** after configuration changes

### When to Use Handlers

| Scenario | Use Handler? | Why |
|----------|--------------|-----|
| Restart service after config change | ✅ Yes | Only restart if config actually changed |
| Install a package | ❌ No | Package install is the main task |
| Reload firewall after adding rules | ✅ Yes | Only reload if rules were added |
| Create a user | ❌ No | User creation is the main task |

---

## 🔧 Practical Examples

### Example 1: Basic Handler Usage

```yaml
---
- name: Install and Configure Apache
  hosts: all
  become: yes
  
  tasks:
    - name: Install Apache
      yum:
        name: httpd
        state: present
      notify: Start Apache
      
  handlers:
    - name: Start Apache
      service:
        name: httpd
        state: started
```

?> ✅ **How it works:** If Apache is newly installed → Handler runs → Service starts. If Apache already installed → Handler does NOT run → No unnecessary restart.

---

### Example 2: Multiple Handlers

```yaml
---
- name: Installing WebServer
  hosts: all
  become: yes
  
  tasks:
    - name: Ensure Apache is at the Latest Version
      yum:
        name: httpd
        state: present
      notify:
        - Start Apache
        - Restart Apache
        
  handlers:
    - name: Start Apache
      service:
        name: httpd
        state: started
        
    - name: Restart Apache
      service:
        name: httpd
        state: restarted
```

---

### Example 3: Using `register` and `when` (Alternative Approach)

Sometimes you may want more control than handlers provide. Use `register` with `when`:

```yaml
---
- name: Installing WebServer with Conditional Tasks
  hosts: all
  become: yes
  
  tasks:
    - name: Ensure Apache is at the Latest Version
      yum:
        name: httpd
        state: present
      register: httpd_install_status
      
    - name: Start Apache if newly installed
      service:
        name: httpd
        state: started
      when: httpd_install_status.changed
```

> **Handler vs Register+When:**
>
> | Aspect | Handler | Register+When |
> |--------|---------|---------------|
> | Runs at | End of play | Immediately after condition |
> | Multiple notifications | Runs once | Runs each time |
> | Complexity | Simple | More flexible |

---

### Example 4: Real-World Web Server Setup

```yaml
---
- name: Complete Web Server Setup with Handlers
  hosts: webservers
  become: yes
  
  vars:
    http_port: 80
    server_name: example.com
    
  tasks:
    - name: Install Apache
      yum:
        name: httpd
        state: present
      notify: Enable Apache
      
    - name: Deploy Apache Configuration
      template:
        src: httpd.conf.j2
        dest: /etc/httpd/conf/httpd.conf
        mode: '0644'
      notify: Restart Apache
      
    - name: Deploy Website Content
      copy:
        src: index.html
        dest: /var/www/html/index.html
        mode: '0644'
      notify: Reload Apache
      
    - name: Open Firewall Port
      firewalld:
        port: "{{ http_port }}/tcp"
        permanent: yes
        state: enabled
      notify: Reload Firewall
        
  handlers:
    - name: Enable Apache
      service:
        name: httpd
        enabled: yes
        state: started
        
    - name: Restart Apache
      service:
        name: httpd
        state: restarted
        
    - name: Reload Apache
      service:
        name: httpd
        state: reloaded
        
    - name: Reload Firewall
      service:
        name: firewalld
        state: reloaded
```

---

## 💡 Handler Best Practices

### 1. Use Descriptive Names

```yaml
# ❌ Bad
handlers:
  - name: restart
    service: name=httpd state=restarted

# ✅ Good  
handlers:
  - name: Restart Apache Web Server
    service:
      name: httpd
      state: restarted
```

### 2. Flush Handlers When Needed

Force handlers to run immediately (before play ends):

```yaml
tasks:
  - name: Update Config
    template:
      src: config.j2
      dest: /etc/app/config.conf
    notify: Restart App
    
  - name: Force handler to run now
    meta: flush_handlers
    
  - name: Verify app is running
    uri:
      url: http://localhost:8080/health
      status_code: 200
```

### 3. Listen for Multiple Events

```yaml
tasks:
  - name: Update main config
    template:
      src: main.conf.j2
      dest: /etc/app/main.conf
    notify: Config changed
    
  - name: Update logging config
    template:
      src: logging.conf.j2
      dest: /etc/app/logging.conf
    notify: Config changed
    
handlers:
  - name: Restart application
    service:
      name: myapp
      state: restarted
    listen: Config changed
```

---

## 📋 Quick Reference

| Keyword | Purpose |
|---------|---------|
| `notify` | Trigger a handler from a task |
| `handlers` | Define handler tasks |
| `listen` | Handler responds to multiple events |
| `meta: flush_handlers` | Force handlers to run immediately |

---

## 🔗 Next Steps

- [Ansible Loops](Ansible%20Loop.md) - Iterate over items
- [Ansible Conditions](Ansible%20Operators%20%26%20Condition%20statement.md) - Conditional execution

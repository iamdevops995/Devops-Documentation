# Ansible Operators & Conditionals

<div class="page-header">
  <span class="difficulty-badge intermediate">Intermediate</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 15 min</span>
</div>

> Learn how to use comparison, logical, and membership operators along with conditional statements to control task execution in Ansible.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| ⚖️ **Comparison Operators** | Compare values (==, !=, >, <) |
| 🔍 **Membership Operators** | Check if item in list (in, not in) |
| 🧪 **Test Operators** | Validate types and states |
| 🔀 **Logical Operators** | Combine conditions (and, or, not) |
| ❓ **When Statement** | Conditional task execution |

---

## ⚖️ Comparison Operators

Compare two values and return `True` or `False`.

| Operator | Meaning | Example |
|----------|---------|---------|
| `==` | Equal to | `a == b` |
| `!=` | Not equal to | `a != b` |
| `>` | Greater than | `a > b` |
| `<` | Less than | `a < b` |
| `>=` | Greater than or equal | `a >= b` |
| `<=` | Less than or equal | `a <= b` |

### Example: Comparison Operators

```yaml
---
- name: Demonstrate Comparison Operators
  hosts: localhost
  gather_facts: false
  
  vars:
    cpu_count: 4
    min_required: 2
    max_allowed: 8
    version: "2.0"
    required_version: "2.0"
    
  tasks:
    - name: Check CPU requirements
      debug:
        msg:
          - "CPU Count: {{ cpu_count }}"
          - "Meets minimum (>= {{ min_required }}): {{ cpu_count >= min_required }}"
          - "Under maximum (<= {{ max_allowed }}): {{ cpu_count <= max_allowed }}"
          - "Exactly 4 CPUs: {{ cpu_count == 4 }}"
          - "Not 2 CPUs: {{ cpu_count != 2 }}"
    
    - name: Check version match
      debug:
        msg: "Version {{ version }} matches required: {{ version == required_version }}"
```

---

## 🔍 Membership Operators

Check if a value exists in a collection.

| Operator | Meaning | Example |
|----------|---------|---------|
| `in` | Is member of | `item in list` |
| `not in` | Is not member of | `item not in list` |

### Example: Membership Operators

```yaml
---
- name: Demonstrate Membership Operators
  hosts: localhost
  gather_facts: false
  
  vars:
    allowed_users:
      - alice
      - bob
      - charlie
    current_user: alice
    blocked_user: mallory
    supported_os:
      - Ubuntu
      - CentOS
      - Debian
    
  tasks:
    - name: Check user permissions
      debug:
        msg:
          - "{{ current_user }} is allowed: {{ current_user in allowed_users }}"
          - "{{ blocked_user }} is allowed: {{ blocked_user in allowed_users }}"
          - "{{ blocked_user }} is blocked: {{ blocked_user not in allowed_users }}"
    
    - name: Check OS support
      debug:
        msg: "Ubuntu supported: {{ 'Ubuntu' in supported_os }}"
```

---

## 🧪 Test Operators

Validate variable types, states, and properties.

### Variable Tests

| Test | Purpose |
|------|---------|
| `is defined` | Variable exists |
| `is undefined` | Variable doesn't exist |
| `is none` | Variable is null |

### String Tests

| Test | Purpose |
|------|---------|
| `is string` | Is a string |
| `is upper` | All uppercase |
| `is lower` | All lowercase |

### Number Tests

| Test | Purpose |
|------|---------|
| `is number` | Is numeric |
| `is even` | Is even number |
| `is odd` | Is odd number |

### File Tests

| Test | Purpose |
|------|---------|
| `is file` | Path is a file |
| `is directory` | Path is a directory |
| `is link` | Path is a symlink |
| `is exists` | Path exists |

### Example: Test Operators

```yaml
---
- name: Demonstrate Test Operators
  hosts: localhost
  gather_facts: false
  
  vars:
    username: "ADMIN"
    port: 8080
    optional_var: null
    config_path: "/etc/ansible/ansible.cfg"
    
  tasks:
    - name: Variable tests
      debug:
        msg:
          - "username is defined: {{ username is defined }}"
          - "missing_var is defined: {{ missing_var is defined | default(false) }}"
          - "optional_var is none: {{ optional_var is none }}"
    
    - name: String tests
      debug:
        msg:
          - "username is string: {{ username is string }}"
          - "username is upper: {{ username is upper }}"
          - "username is lower: {{ username is lower }}"
    
    - name: Number tests
      debug:
        msg:
          - "port is number: {{ port is number }}"
          - "port is even: {{ port is even }}"
          - "port is odd: {{ port is odd }}"
    
    - name: File tests
      debug:
        msg:
          - "config_path is file: {{ config_path is file }}"
          - "config_path is directory: {{ config_path is directory }}"
```

---

## 🔀 Logical Operators

Combine multiple conditions.

| Operator | Meaning | Example |
|----------|---------|---------|
| `and` | Both true | `a and b` |
| `or` | Either true | `a or b` |
| `not` | Negation | `not a` |

### Example: Logical Operators

```yaml
---
- name: Demonstrate Logical Operators
  hosts: localhost
  gather_facts: false
  
  vars:
    is_production: true
    is_enabled: true
    has_permission: false
    debug_mode: false
    
  tasks:
    - name: Logical AND
      debug:
        msg: "Production AND Enabled: {{ is_production and is_enabled }}"
    
    - name: Logical OR
      debug:
        msg: "Has permission OR Debug mode: {{ has_permission or debug_mode }}"
    
    - name: Logical NOT
      debug:
        msg: "NOT debug mode: {{ not debug_mode }}"
    
    - name: Combined logic
      debug:
        msg: "Complex condition: {{ (is_production and is_enabled) or debug_mode }}"
```

---

## ❓ Conditional Statements (when)

The `when` statement controls whether a task runs.

### Basic Usage

```yaml
---
- name: Conditional Task Execution
  hosts: all
  become: yes
  
  vars:
    install_nginx: true
    environment: production
    
  tasks:
    - name: Install nginx (only if flag is true)
      yum:
        name: nginx
        state: present
      when: install_nginx
    
    - name: Enable debug logging (not in production)
      lineinfile:
        path: /etc/app/config.conf
        line: "debug=true"
      when: environment != "production"
```

### Multiple Conditions

```yaml
---
- name: Multiple Conditions
  hosts: all
  become: yes
  
  tasks:
    # Using 'and'
    - name: Run only on CentOS 7
      debug:
        msg: "This is CentOS 7"
      when: 
        - ansible_distribution == "CentOS"
        - ansible_distribution_major_version == "7"
    
    # Alternative syntax with 'and'
    - name: Run on CentOS 7 (alt syntax)
      debug:
        msg: "This is CentOS 7"
      when: ansible_distribution == "CentOS" and ansible_distribution_major_version == "7"
    
    # Using 'or'
    - name: Run on Debian-based systems
      debug:
        msg: "Debian-based system"
      when: ansible_distribution == "Ubuntu" or ansible_distribution == "Debian"
```

### Using Facts in Conditions

```yaml
---
- name: Conditional Based on Facts
  hosts: all
  become: yes
  
  tasks:
    - name: Install on RedHat family
      yum:
        name: httpd
        state: present
      when: ansible_os_family == "RedHat"
    
    - name: Install on Debian family
      apt:
        name: apache2
        state: present
      when: ansible_os_family == "Debian"
    
    - name: Configure for high memory systems
      template:
        src: high_mem_config.j2
        dest: /etc/app/config.conf
      when: ansible_memtotal_mb >= 8192
```

### Conditional with Registered Variables

```yaml
---
- name: Conditional with Register
  hosts: all
  
  tasks:
    - name: Check if file exists
      stat:
        path: /etc/app/config.conf
      register: config_file
    
    - name: Create config if missing
      template:
        src: config.j2
        dest: /etc/app/config.conf
      when: not config_file.stat.exists
    
    - name: Check service status
      command: systemctl is-active nginx
      register: nginx_status
      ignore_errors: yes
    
    - name: Start nginx if not running
      service:
        name: nginx
        state: started
      when: nginx_status.rc != 0
```

---

## 📝 Real-World Examples

### Example: OS-Specific Package Installation

```yaml
---
- name: Cross-Platform Package Installation
  hosts: all
  become: yes
  
  tasks:
    - name: Install packages (RedHat)
      yum:
        name: "{{ item }}"
        state: present
      loop:
        - httpd
        - vim
        - git
      when: ansible_os_family == "RedHat"
    
    - name: Install packages (Debian)
      apt:
        name: "{{ item }}"
        state: present
        update_cache: yes
      loop:
        - apache2
        - vim
        - git
      when: ansible_os_family == "Debian"
```

### Example: Environment-Based Configuration

```yaml
---
- name: Environment-Specific Setup
  hosts: all
  become: yes
  
  vars:
    env: "{{ lookup('env', 'DEPLOY_ENV') | default('development') }}"
    
  tasks:
    - name: Deploy production config
      template:
        src: prod-config.j2
        dest: /etc/app/config.yml
      when: env == "production"
    
    - name: Deploy development config
      template:
        src: dev-config.j2
        dest: /etc/app/config.yml
      when: env == "development"
    
    - name: Enable monitoring (production only)
      service:
        name: monitoring-agent
        state: started
        enabled: yes
      when: env == "production"
```

---

## 📋 Quick Reference

| Operator Type | Operators | Example |
|---------------|-----------|---------|
| Comparison | `==, !=, >, <, >=, <=` | `x >= 10` |
| Membership | `in, not in` | `'a' in list` |
| Logical | `and, or, not` | `a and b` |
| Test | `is defined, is file, is number` | `var is defined` |

### When Statement Patterns

```yaml
# Single condition
when: variable == "value"

# Multiple conditions (AND)
when:
  - condition1
  - condition2

# OR condition
when: condition1 or condition2

# NOT condition
when: not condition

# Combined
when: (a and b) or c
```

---

## 🔗 Next Steps

- [Ansible Loops](Ansible%20Loop.md) - Combine loops with conditions
- [Ansible Handlers](Ansible%20Handler.md) - Trigger on changes

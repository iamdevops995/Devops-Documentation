# Ansible Loops

<div class="page-header">
  <span class="difficulty-badge intermediate">Intermediate</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 15 min</span>
</div>

> Loops in Ansible allow you to repeat tasks for multiple items, reducing code duplication and making playbooks more maintainable.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 🔁 **Basic Loops** | Iterate over simple lists |
| 📦 **Complex Items** | Loop with dictionaries |
| 🔢 **Indexed Loops** | Access item index while looping |
| 🎲 **Special Loops** | Random choice and until loops |

---

## 🎓 Theory: Loop Types

> **Ansible Loop Keywords:**

| Keyword | Use Case | Example |
|---------|----------|---------|
| `loop` | Modern, preferred method | `loop: [a, b, c]` |
| `with_items` | Legacy, still supported | `with_items: [a, b, c]` |
| `with_together` | Parallel iteration | Combine two lists |
| `with_indexed_items` | Access index | Get position in list |
| `with_random_choice` | Random selection | Pick one randomly |

---

## 🔧 Practical Examples

### Example 1: Basic Loop - Create Multiple Users

```yaml
---
- name: Create Multiple Users
  hosts: all
  become: yes
  
  tasks:
    - name: Add several users
      user:
        name: "{{ item }}"
        state: present
        groups: "developers"
      loop:
        - alice
        - bob
        - charlie
        - david
```

**Output:**
```
TASK [Add several users] ***
changed: [server1] => (item=alice)
changed: [server1] => (item=bob)
changed: [server1] => (item=charlie)
changed: [server1] => (item=david)
```

---

### Example 2: Loop with Dictionaries

Create users with specific groups:

```yaml
---
- name: Create Users with Different Groups
  hosts: all
  become: yes
  
  tasks:
    - name: Add users with specific groups
      user:
        name: "{{ item.name }}"
        state: present
        groups: "{{ item.groups }}"
        shell: "{{ item.shell | default('/bin/bash') }}"
      loop:
        - { name: 'alice', groups: 'developers' }
        - { name: 'bob', groups: 'developers' }
        - { name: 'charlie', groups: 'admins' }
        - { name: 'david', groups: 'devops', shell: '/bin/zsh' }
```

---

### Example 3: Install Multiple Packages

```yaml
---
- name: Install Development Tools
  hosts: all
  become: yes
  
  vars:
    packages:
      - git
      - vim
      - curl
      - wget
      - unzip
      - htop
  
  tasks:
    - name: Install multiple packages
      yum:
        name: "{{ item }}"
        state: present
      loop: "{{ packages }}"
```

?> 💡 **Pro Tip:** For package installation, you can also pass the entire list directly - this is more efficient as it makes a single API call!

```yaml
- name: Install packages (optimized)
  yum:
    name: "{{ packages }}"
    state: present
```

---

### Example 4: Parallel Iteration with `with_together`

Combine two lists element by element:

```yaml
---
- name: Parallel Loop Example
  hosts: localhost
  gather_facts: false
  
  vars:
    users: ['alice', 'bob', 'charlie']
    uids: [1001, 1002, 1003]
  
  tasks:
    - name: Display user with UID
      debug:
        msg: "User {{ item.0 }} has UID {{ item.1 }}"
      with_together:
        - "{{ users }}"
        - "{{ uids }}"
```

**Output:**
```
User alice has UID 1001
User bob has UID 1002
User charlie has UID 1003
```

---

### Example 5: Indexed Loop

Access the index position while looping:

```yaml
---
- name: Loop with Index
  hosts: localhost
  gather_facts: false
  
  vars:
    servers:
      - web-server
      - db-server
      - cache-server
  
  tasks:
    - name: Display server with position
      debug:
        msg: "Position {{ item.0 }}: {{ item.1 }}"
      with_indexed_items: "{{ servers }}"
```

**Output:**
```
Position 0: web-server
Position 1: db-server
Position 2: cache-server
```

---

### Example 6: Random Choice

Select a random item from a list:

```yaml
---
- name: Random Selection
  hosts: localhost
  gather_facts: false
  
  tasks:
    - name: Choose random action
      debug:
        msg: "Selected action: {{ item }}"
      with_random_choice:
        - "Deploy to production"
        - "Run tests"
        - "Generate report"
        - "Send notification"
```

---

### Example 7: Until Loop (Retry Until Condition)

Retry a task until a condition is met:

```yaml
---
- name: Until Loop - Wait for Service
  hosts: all
  become: yes
  
  tasks:
    - name: Start Apache
      service:
        name: httpd
        state: started
    
    - name: Wait for Apache to respond
      uri:
        url: http://localhost:80
        status_code: 200
      register: result
      until: result.status == 200
      retries: 10
      delay: 5
```

> **Until Loop Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `retries` | 3 | Number of retry attempts |
| `delay` | 5 | Seconds between retries |
| `until` | - | Condition to check |

---

### Example 8: Loop with Register

Capture output from each iteration:

```yaml
---
- name: Loop with Register
  hosts: localhost
  gather_facts: false
  
  tasks:
    - name: Check multiple URLs
      uri:
        url: "{{ item }}"
        status_code: 200
      loop:
        - https://google.com
        - https://github.com
        - https://ansible.com
      register: url_checks
      ignore_errors: yes
    
    - name: Display results
      debug:
        msg: "{{ item.item }} - Status: {{ item.status | default('FAILED') }}"
      loop: "{{ url_checks.results }}"
```

---

## 📋 Loop Comparison Table

| Loop Type | Syntax | Use Case |
|-----------|--------|----------|
| `loop` | `loop: [a, b, c]` | Simple list iteration |
| `with_items` | `with_items: [a, b, c]` | Legacy, same as loop |
| `with_together` | `with_together: [list1, list2]` | Parallel iteration |
| `with_indexed_items` | `with_indexed_items: list` | Need item index |
| `with_random_choice` | `with_random_choice: list` | Pick random item |
| `until` | `until: condition` | Retry until success |

---

## 💡 Best Practices

### 1. Use `loop` for New Playbooks

```yaml
# ✅ Preferred (Ansible 2.5+)
loop:
  - item1
  - item2

# ⚠️ Legacy (still works)
with_items:
  - item1
  - item2
```

### 2. Use Loop Control for Complex Scenarios

```yaml
- name: Loop with custom label
  debug:
    msg: "Processing {{ item.name }}"
  loop:
    - { name: 'alice', role: 'admin' }
    - { name: 'bob', role: 'user' }
  loop_control:
    label: "{{ item.name }}"  # Shows only name in output
    pause: 1                   # 1 second pause between items
```

### 3. Flatten Nested Lists

```yaml
vars:
  all_packages:
    - [git, vim]
    - [curl, wget]

tasks:
  - name: Install all packages
    yum:
      name: "{{ item }}"
      state: present
    loop: "{{ all_packages | flatten }}"
```

---

## 🔗 Next Steps

- [Ansible Conditions](Ansible%20Operators%20%26%20Condition%20statement.md) - Conditional execution
- [Ansible Handlers](Ansible%20Handler.md) - Trigger on changes

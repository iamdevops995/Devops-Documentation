# Ansible

<div class="page-header">
  <span class="difficulty-badge beginner">Beginner to Advanced</span>
  <span class="time-badge"><i class="fas fa-book"></i> 15+ Tutorials</span>
</div>

> **Ansible** is an agentless IT automation engine that automates cloud provisioning, configuration management, application deployment, and many other IT needs.

<div class="concept-box">

**Why Learn Ansible?**

- 🚀 **Simple**: Uses YAML syntax, easy to read and write
- 🔗 **Agentless**: No software to install on managed nodes
- 🔄 **Idempotent**: Safe to run multiple times
- 📦 **Powerful**: 3000+ built-in modules
- 🌐 **Scalable**: Manage thousands of servers

</div>

---

## 📚 Learning Path

### 🟢 Beginner (Start Here)

| Topic | Description | Time |
|-------|-------------|------|
| [📖 Complete Guide](/Ansible/Ansible/Ansible%20Complete%20Guide.md) | **Recommended** - Theory + Hands-on Labs | 45 min |
| [🔧 Installation](/Ansible/Ansible/Ansible%20Installations.md) | Install Ansible on Ubuntu/RHEL/Amazon Linux | 10 min |
| [⚙️ Config Setup](/Ansible/Ansible/Ansible%20Config%20setup.md) | Configure ansible.cfg and inventory | 15 min |
| [📝 Ansible Doc](/Ansible/Ansible/Ansible%20Doc.md) | Core concepts and ad-hoc commands | 20 min |

### 🟡 Intermediate (Playbooks)

| Topic | Description | Time |
|-------|-------------|------|
| [▶️ Playbook Basics](/Ansible/Ansible/playbook/Playbook-intro.md) | Write your first playbook | 20 min |
| [📋 Playbook Examples](/Ansible/Ansible/Playbooks.md) | Real-world playbook patterns | 25 min |
| [🔀 Variables](/Ansible/Ansible/playbook/Variables.md) | Variable types and precedence | 15 min |
| [🔔 Handlers](/Ansible/Ansible/Ansible%20Handler.md) | Trigger actions on changes | 10 min |
| [🔁 Loops](/Ansible/Ansible/Ansible%20Loop.md) | Iterate over lists and dictionaries | 15 min |
| [❓ Conditions](/Ansible/Ansible/Ansible%20Operators%20%26%20Condition%20statement.md) | Conditionals and operators | 15 min |
| [📦 Include & Import](/Ansible/Ansible/Include%26import%20module.md) | Modularize your playbooks | 15 min |
| [📁 File Operations](/Ansible/Ansible/Ansible%20File%20creation.md) | Create, copy, template files | 15 min |

### 🔴 Advanced

| Topic | Description | Time |
|-------|-------------|------|
| [🎭 Roles](/Ansible/Ansible/Ansible%20Roles.md) | Organize code with reusable roles | 30 min |
| [🔐 Vault](/Ansible/Ansible/Ansible%20Vault.md) | Encrypt sensitive data | 20 min |
| [🐛 Debug & Logging](/Ansible/Ansible/playbook/Ansible%20Logging%20-%20debug%20playbook.md) | Troubleshoot playbooks | 15 min |
| [🏠 Local Action](/Ansible/Ansible/playbook/local%20action.md) | Run tasks on control node | 10 min |

---

## 🎯 Real-World Projects

<div class="lab-box">

**Hands-on Practice**

</div>

| Project | What You'll Build | Difficulty |
|---------|-------------------|------------|
| [🌐 Deploy Web Server](/Ansible/Ansible/Practical%20ansible%20playbook.md) | Apache/Nginx with custom config | 🟢 Easy |
| [☸️ K8s Deployment](/Ansible/Ansible/Ansible_kube/Deploy%20App.md) | Deploy apps to Kubernetes | 🔴 Advanced |
| [🔧 EC2 Recovery](/Ansible/Ansible/ec2%20Pem%20Lost.md) | Recover access to EC2 instances | 🟡 Medium |

---

## 🏗️ Architecture

![Ansible Architecture](/assets/images/diagrams/ansible-architecture.svg)

---

## 🔗 Quick Reference

### Essential Commands

```bash
# Check version
ansible --version

# Test connectivity
ansible all -m ping -i inventory

# Run ad-hoc command
ansible webservers -a "uptime" -i inventory

# Execute playbook
ansible-playbook site.yml -i inventory

# Syntax check
ansible-playbook site.yml --syntax-check

# Dry run
ansible-playbook site.yml --check --diff
```

### Common Modules

| Module | Purpose |
|--------|---------|
| `apt` / `yum` | Package management |
| `service` | Manage services |
| `copy` | Copy files |
| `template` | Deploy Jinja2 templates |
| `file` | Manage files/directories |
| `user` | Manage users |
| `git` | Git operations |

---

## 📖 Additional Resources

- [Official Ansible Documentation](https://docs.ansible.com/)
- [Ansible Galaxy](https://galaxy.ansible.com/) - Community roles
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/tips_tricks/ansible_tips_tricks.html)

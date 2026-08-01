# Ansible Installation Guide

<div class="page-header">
  <span class="difficulty-badge beginner">Beginner</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 10 min</span>
</div>

> Learn how to install Ansible on various Linux distributions using different methods.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 🐧 **Install on Ubuntu/Debian** | Using apt package manager |
| 🎩 **Install on RHEL/CentOS** | Using yum/dnf package manager |
| 🐍 **Install via Python pip** | Universal method using virtualenv |
| ✅ **Verify Installation** | Confirm Ansible is working |

---

## 🎓 Prerequisites

> **Before You Begin:**
> - Linux system (Ubuntu 20.04+, CentOS 7+, or Amazon Linux 2)
> - `sudo` or root access
> - Python 3.8 or higher installed
> - Internet connection for package downloads

---

## 🔧 Installation Methods

### Method 1: Ubuntu/Debian (APT)

?> **Recommended for:** Ubuntu, Debian, Linux Mint

```bash
# Update package index
sudo apt update

# Install software-properties-common (for add-apt-repository)
sudo apt install -y software-properties-common

# Add official Ansible PPA
sudo add-apt-repository --yes --update ppa:ansible/ansible

# Install Ansible
sudo apt install -y ansible

# Verify installation
ansible --version
```

---

### Method 2: RHEL/CentOS/Amazon Linux (YUM)

?> **Recommended for:** RHEL, CentOS, Fedora, Amazon Linux

```bash
# For Amazon Linux 2
sudo amazon-linux-extras install epel -y
sudo yum install -y ansible

# For RHEL/CentOS 7
sudo yum install -y epel-release
sudo yum install -y ansible

# For RHEL/CentOS 8+ (dnf)
sudo dnf install -y epel-release
sudo dnf install -y ansible

# Verify installation
ansible --version
```

---

### Method 3: Python pip with Virtual Environment (Recommended)

?> **Recommended for:** Getting the latest version, isolated environment

#### Step 1: Verify Python Installation

```bash
python3 --version
```

If Python is not installed:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y python3 python3-pip python3-venv

# RHEL/CentOS
sudo yum install -y python3 python3-pip
```

#### Step 2: Install Dependencies

```bash
# Ubuntu/Debian
sudo apt-get install -y python3-minimal python3-virtualenv python3-dev build-essential

# RHEL/CentOS
sudo yum install -y python3-virtualenv python3-devel gcc
```

#### Step 3: Create Virtual Environment

```bash
# Create project directory
mkdir ~/ansible-env
cd ~/ansible-env

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

!> ⚠️ **Note:** Your prompt will change to `(venv)` indicating the virtual environment is active.

#### Step 4: Install Ansible

```bash
# Upgrade pip first
pip install --upgrade pip

# Install Ansible
pip install ansible

# Verify installation
ansible --version
```

#### Step 5: Deactivate When Done

```bash
# To exit virtual environment
deactivate
```

---

## ✅ Verify Installation

After installation, verify Ansible is working:

```bash
# Check version
ansible --version
```

**Expected Output:**
```
ansible [core 2.15.x]
  config file = /etc/ansible/ansible.cfg
  configured module search path = ['/home/user/.ansible/plugins/modules']
  ansible python module location = /usr/lib/python3/dist-packages/ansible
  executable location = /usr/bin/ansible
  python version = 3.10.x
```

### Quick Test

```bash
# Test localhost connection
ansible localhost -m ping
```

**Expected Output:**
```
localhost | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

---

## 📋 Quick Reference

| Distribution | Command |
|--------------|---------|
| Ubuntu/Debian | `sudo apt install ansible` |
| RHEL/CentOS 7 | `sudo yum install ansible` |
| RHEL/CentOS 8+ | `sudo dnf install ansible` |
| Amazon Linux 2 | `sudo amazon-linux-extras install epel && sudo yum install ansible` |
| pip (any) | `pip install ansible` |

---

## 🔗 Next Steps

After installation, proceed to:
- [Ansible Configuration Setup](Ansible%20Config%20setup.md) - Configure ansible.cfg
- [Ansible Documentation](Ansible%20Doc.md) - Core concepts and commands

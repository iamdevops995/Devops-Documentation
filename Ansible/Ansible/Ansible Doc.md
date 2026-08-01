# Ansible: Configuration Automation

## What is Ansible?

Ansible is an **open-source Configuration Management and Automation tool** used to:

- Configure existing servers (Cloud / On-Premises)
- Install and manage software packages
- Automate system administration tasks
- Deploy applications
- Manage services
- Orchestrate multi-server environments

### Key Features

- **Agentless Architecture** (No agent installation required on managed nodes)
- Uses **SSH** (Linux) and **WinRM** (Windows) for communication
- Uses **YAML** for writing Playbooks
- Push-based automation model
- Simple and easy to learn

---

## Ansible Concepts

### Push-Based Architecture

Ansible follows a **Push Mechanism**, where the Control Node pushes configurations to the Managed Nodes.

```
Control Node
      |
      | SSH / WinRM
      |
-----------------------------
|            |              |
Server 1   Server 2      Server 3
```

---

## Mutable Infrastructure

Ansible follows a **Mutable Infrastructure** approach.

It modifies the existing servers by installing packages, updating configurations, restarting services, etc., instead of recreating the infrastructure.

---

## Idempotency

Ansible is **Idempotent**.

Running the same playbook multiple times will always produce the same desired state without making unnecessary changes.

Example:

- Install Apache → Installed once
- Run again → No changes
- Run again → Still no changes

---

# Prerequisites

## Control Node (Master Node)

Install:

- Python
- Ansible

> **Note:** Ansible Control Node is supported only on Linux-based operating systems.

---

## Managed Nodes (Slave Nodes)

Install:

- Python
- SSH Server (Linux)

Managed Nodes can be:

- Linux
- Cloud Virtual Machines
- On-Premises Servers

---

## SSH Key Pair

Each managed machine should have access using an SSH Key Pair.

Files:

- `.pem`
- `.ppk`

Example:

```bash
chmod 400 LaptopKey.pem

ssh -i "LaptopKey.pem" username@IP_ADDRESS
```

Without key:

```bash
ssh username@IP_ADDRESS
```

---

# Connecting to Remote Machines

| Source | Destination | Method |
|---------|-------------|---------|
| Linux | Linux | SSH |
| Windows | Linux | PuTTY |
| Windows | Windows | Remote Desktop (RDP) |

---

# Ansible Directory Structure

Default files after installation using package manager:

```
Inventory File:
/etc/ansible/hosts

Configuration File:
/etc/ansible/ansible.cfg
```

Custom inventory example:

```bash
vi slaves.txt
```

Add private IPs:

```
172.31.10.100

172.31.10.101

172.31.10.102
```

Check installation:

```bash
ansible --version
```

---

# Installing Ansible

Using pip:

```bash
sudo pip install ansible
```

Using yum (Amazon Linux / RHEL):

```bash
sudo yum install ansible -y
```

Using apt (Ubuntu):

```bash
sudo apt update

sudo apt install ansible -y
```

Verify installation:

```bash
ansible --version
```

---

# Important Ansible Topics

- Inventory
- Adhoc Commands
- Playbooks
- Variables
- Vault
- Roles

---

# Commonly Used Modules

| Module | Purpose |
|---------|----------|
| ping | Test connectivity |
| yum | Install packages (RHEL/Amazon Linux) |
| apt | Install packages (Ubuntu/Debian) |
| service | Start/Stop services |
| copy | Copy files |
| command | Execute commands |
| shell | Execute shell commands |

---

# Common States

Packages

- present
- absent

Services

- started
- stopped
- restarted

---

# Adhoc Commands

## Ping all servers

```bash
ansible all -i slaves.txt -m ping
```

---

## Check OS Information

```bash
ansible all -i slaves.txt -a "uname -a"
```

---

## Check Uptime

```bash
ansible all -i slaves.txt -a "uptime"
```

---

## Display Running Processes

```bash
ansible all -i slaves.txt -a "top"
```

---

## Install Apache HTTPD

```bash
ansible all -i slaves.txt \
-m yum \
-a "name=httpd state=present" \
-b
```

`-b` means **Become (sudo privilege)**.

---

## Start Apache Service

```bash
ansible all -i slaves.txt \
-m service \
-a "name=httpd state=started" \
-b
```

---

## Stop Apache Service

```bash
ansible all -i slaves.txt \
-m service \
-a "name=httpd state=stopped" \
-b
```

---

## Restart Apache Service

```bash
ansible all -i slaves.txt \
-m service \
-a "name=httpd state=restarted" \
-b
```

---

# Copy Files to Managed Nodes

Create a sample web page:

```bash
vi index.html
```

Copy it to all managed nodes:

```bash
ansible all \
-i slaves.txt \
-m copy \
-a "src=/home/ec2-user/index.html dest=/var/www/html/index.html mode=0644" \
-b
```

---

# Running Playbooks

Execute a playbook:

```bash
ansible-playbook user.yml
```

Execute using sudo:

```bash
ansible-playbook user.yml --ask-become-pass
```

---

# Frequently Used Options

| Option | Description |
|---------|-------------|
| -i | Inventory File |
| -m | Module |
| -a | Module Arguments |
| -b | Become (sudo) |
| --ask-become-pass | Prompt for sudo password |
| --version | Show Ansible version |

---

# Workflow

```
Write Inventory
        ↓
Verify Connectivity (ping)
        ↓
Run Adhoc Commands
        ↓
Create Playbooks
        ↓
Execute Playbooks
        ↓
Manage Infrastructure
```
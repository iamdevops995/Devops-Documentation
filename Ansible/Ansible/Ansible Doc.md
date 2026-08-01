#Ansible: Configuration Automation

Terraform -> civil engg(it user create new cloud infra)
Ansible -> interior designer(installing the tool in existing infra (cloud /on-prem))
Ansible -> Linux commands ->push mech
Chef /puppet -> ruby/groovy script ->pull mech
Salt ->  deployment tool -> both mech
Ansible is mutable
Ansible is idempotent

### Ansible documentation
**-> Prerequisites
-> Master node(control node) :Python + Ansible (windows will not support)
-> managed node(slave node) :Python (all OS will support)
-> Each and every machine will have pem /ppk key(private key)

### Connecting Methods Linux/Windows Machines 
*WIN - WIN -RDC*
*WIN - LIN -Putty*
*LIN -LIN -SSH*
#### Connecting to slave-node machine through Master-Node
```
IP : IP Address of Slave Machine
UserName: User name slave machine
pem/ppk --> Key pair files
vi Laptopkey.pem
chmod 400 Laptopkey.pem
ssh -i "Laptopkey.pem" UserName@IP
ssh username@ipaddress -> paygent automated
```

### Ansible Topics
- ADHOC COMMANDS
- Playbook -> Important in ansible
- vault
- roles
#### Ansible Installation 
***pip-package manager(in python) for installing ansible
```
sudo pip install ansible
```

```
inventory file ->/etc/ansible/hosts-> while giving yum/apt
config file ->/etc/ansible/ansible.cfg-> while giving yum/apt
inventory file->vi slaves.txt
config file->wget link
ansible --version
vi slaves.txt-> give private ip address
 config file download in google get raw link
wget link
```
**Module used for below Task/cmds.
1. yum
2. service
3. copy
**States
- Install -> present
- Uninstall-> absent
- Stop-> stopped
- Start-> started
- Restart-> restarted
#### ADHOC Commands For Single Task
```
ansible all -i slaves.txt -m ping          # -m module
ansible all -i slaves.txt -a "uname -a"         # -a Action
ansible all -i slaves.txt -a "uptime"
ansible all -i slaves.txt -a "top"
ansible all -i slaves.txt -m yum -a "name=httpd state=present" -b 
#  -a arguments with yum it will argument    #  -b sudo
ansible all -i slaves.txt -m service -a "name=httpd state=started" -b
# -b => become =>sudo

 ansible-playbook user.yml --ask-become-pass
```
#### Sample Apache HTTPD configuration using ADHOC 
```
vi index.html -> content should insert
ansible all -i slaves.txt -m copy -a "src=MasterNodePath dest=SlaveNodePath" -b
ansible all -i slaves.txt -m copy -a "src=/home/ec2-user/index.html dest=/var/www/html/index.html mode=777" -b
ansible all -i slaves.txt -m service -a "name=httpd state=started" -b
ansible all -i slaves.txt -m service -a "name=httpd state=stopped" -b
ansible all -i slaves.txt -m service -a "name=httpd state=restarted" -b
```

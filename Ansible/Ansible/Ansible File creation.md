**User can create Files or directories on Ansible Clients from Ansible Controller.**
Syntax 
```shell
ansible [group] -m file -a “dest=file/dir destination location 
state=<State>”
```
**Create file**
```shell
ansible [group] -m file -a "dest=file destination location state=touch"

Eg: ansible web -m file -a "dest=/tmp/test_file.txt state=touch"
```
 **Delete file**
```shell
ansible [group] -m file -a "dest=file destination location state=absent"
eg: ansible web -m file -a "dest=/tmp/test_file.txt state=absent"
```
*Ansible Automation*
 **Create file with specific permission**
```shell
ansible [group] -m file -a "dest=file destination location state=touch mode='permissions'"
eg: ansible web -m file -a "dest=/tmp/test.py state=touch mode='0775'"
```

**Create  directory**
```shell
ansible [group] -m file -a "dest=directory destination location 
state=directory"
eg: ansible web -m file -a "dest=/tmp/temp/logesh state=directory"
```
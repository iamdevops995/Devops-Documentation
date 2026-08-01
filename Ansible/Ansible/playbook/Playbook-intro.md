##### Ansible Automation
**Two ways to execute Tasks on Ansible Clients**
- Ad-Hoc Commands
- Playbooks
**Why do you need Playbooks?**
     - To execute multiple configuration.
**Playbook is a YAML file, which contains multiple tasks.**
**Along with task, user have option to use dynamic things.**
    - Variables, Files & Templates etc.
**Playbooks are useful for multiple things like**
	- Configuration Management, Deployment, Orchestration etc.
**Structure of Playbooks**
Concepts:
	- Tasks
	- Play
	 - Playbooks
**Play -** Play is combination of Tasks + Targets.
**Task -** Operation, user wants to perform

**Playbooks -** Playbook is combination of Plays or List or sequence of Plays.
##### Executing Playbooks without providing execution commands.
*Verify Playbook Syntax before execution*
- --syntax-check
*Execute Playbook in Dry Run Mode*
- --check
*Execute Playbook with verbose output.*
 - -v
Playbook Sample :
``` yaml
- name: Playbook
    hosts: all
    become: yes
    become_user: root
    tasks:
      - name: ensure apache is at the latest version
        yum:
          name: httpd
          state: lates
```

----------------------------
Intro-playbook.yaml
```yaml
#!/root/ansible/myansible/bin/ansible-playbook
- name: Introduction Ansible Playbooks
  hosts: all
  remote_user: ec2-user
  become: 'yes'
  become_user: root
  tasks:
    - name: Checking Connection via Ping
      ping:
    - name: Uninstall Apache WebServer
      yum:
        name: httpd
        state: absent
```

Install-apache2.yaml
```yaml
#!/root/ansible/myansible/bin/ansible-playbook
- name: Installing WebServer
  hosts: all
  remote_user: ec2-user
  become: 'yes'
  become_user: root
  tasks:
    - name: Ensure Apache is at the Latest Version
      yum:
        name: httpd
        state: latest
    - name: Ensure Apache is Running
      service:
        name: httpd
        state: started
```

**Handlers:** Running operations on change

```yaml
#!/usr/local/bin/ansible-playbook
- name: Installing WebServer
  hosts: all
  remote_user: ec2-user
  become: 'yes'
  become_user: root

  tasks:
    - name: Ensure Apache is at the Latest Version
      yum:
        name: httpd
        state: present
      notify:
        - Ensure Apache is Running
        - Ensure Apache restart 
  handlers:
    - name: Ensure Apache is Running
      service:
        name: httpd
        state: started
    - name: Ensure Apache restart
      service:
        name: httpd
        state: restarted
```


```yaml
#!/usr/local/bin/ansible-playbook
- name: Installing WebServer
  hosts: all
  remote_user: ec2-user
  become: 'yes'
  become_user: root

  tasks:
    - name: Ensure Apache is at the Latest Version
      yum:
        name: httpd
        state: present
      register: httpd_installation_status
    - name: Ensure Apache is Running
      service:
        name: httpd
        state: started
      when: httpd_installation_status.changed == True 
```


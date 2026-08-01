##### Dynamic variable

```yaml
#!/usr/local/bin/ansible-playbook
- name: Pass the variable at runtime.
  hosts: web
  become: true
  vars:
    var1: value_1
    var2: value_2
  tasks:  
    - name: print the value for variable
      debug:
        msg: "print var1: {{var1}} and var2 {{var2}}"
```

<img src="/Devops-Documentation/Ansible/Ansible/images/variable-dynamic-1.png" alt="Dynamic Variable Example 1" />

<img src="/Devops-Documentation/Ansible/Ansible/images/variable-dynamic-2.png" alt="Dynamic Variable Example 2" width="400" />

***Ansible hostname/ inventory hostname***

```yaml
#!/usr/local/bin/ansible-playbook
- name: This is the hostname variable
  hosts: all
  become: yes
  tasks:
    - name: print inventory hostname
      debug:
        msg: "print inventory hostname {{inventory_hostname}}"
    - name: print ansible hostname
      debug:
        msg:  "print ansible hostname: {{ansible_hostname}}"
```

***Running playbook to specific host:***
**delegate_to: hostname** -> we can mention specific host for tsk
**local_action:  cmd** -> only for localhost

```yaml
- hosts: localhost
  tasks:
    - name: Run a command on the local machine
      command: echo "Running on the local host"
  tags: scenario1


- hosts: all
  tasks:
    - name: Run a command on the remote hosts
      command: echo "Running on remote host"
    
    - name: Run a command on the local machine
      command: echo "Running on the local host"
      delegate_to: localhost 
  tags: scenario2


- hosts: all
  tasks:
    - name: Run a command on the remote hosts
      command: echo "Running on remote host"
    
    - name: Run a command on the local machine
      local_action: command echo "Running on the local host"
  tags: scenario3
```

Shell and command module:
```yaml
---
- hosts: all
  tasks:
    - name: Using command module to list files
      command: ls /usr/bin
      register: command_output

    - name: Display command output
      debug:
        msg: "{{ command_output.stdout_lines }}"

    - name: Using shell module to list files and filter with grep
      shell: ls /usr/bin | grep 'vim'
      register: shell_output

    - name: Display shell output
      debug:
        var: shell_output.stdout
        
```


```yaml
- hosts: all
vars:
  list1:
  - apple
  - banana
  - fig

  list2:
  - peach
  - plum
  - pear

tasks:
- name: Combine list1 and list2 into a merged_list var
  ansible.builtin.set_fact:
    merged_list: "{{ list1 + list2 }}"
```
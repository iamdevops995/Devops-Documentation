#### Local Action

- Ansible playbook and tasks are always tend on ansible remote machines or ansible clients.
- Sometimes user needs to work on ansible controller node generate some data to do some modification in between of playbook.
- Ansible local_action is used to process the module task on local machine i.e Ansible controller machine.
	- Mostly modules used with local action are shell command

```yaml
- name: local action in
  hosts: all
  # remote_user: user_name
  become: yes
  become_user: root
  tasks:

    - name: This will create a local file /tmp/local_file.ini
      local_action: command touch /tmp/"{{ ansible_hostname }}"_local_file.ini
    - name: Here we copy the local file to remote
      copy:
        src: /tmp/{{ ansible_hostname }}_local_file.ini
        dest: /var/tmp/
```

- Ansible **delegate_to** module is used when user wants to execute specific tasks to specific module.
- Ansible **delegate_to** is a directive , not an individual module. It integrates with other modules and it controlers the tasks execution by deciding which hosts run the tasks at runtime.

```yaml
- name: Ansible delegate module
  hosts: all
  become: yes
  become_user: root
  vars:
    tmplog: /tmp/connection.log
  tasks:
  - name: create tmplog
    shell: test ! -f {{ tmplog }} && touch {{ tmplog }}
    failed_when: false
  - name: delegate_to
    shell: echo "delegate to {{ inventory_hostname }} $(hostname) " >> {{ tmplog }}
    delegate_to: localhost
```
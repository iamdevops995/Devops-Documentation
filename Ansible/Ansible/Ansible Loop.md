- Loops in ansible is helpful to iterate over items.
- Loops are helpful if user wants to perform many things in one task, such as create a lot of users, install a lot of packages, or repeat a polling step until a certain result is reached.
- standard loop with `with_items`.
- multiple items to iterate with `with_items`.
- Loop over the collection variables ` with_together:`.

```yaml
#!/usr/local/bin/ansible-playbook
- name: Loops in Ansible Playbook Part I
  hosts: all
  remote_user: ec2-user
  become: 'yes'
  become_user: root

  vars:
    alpha: [ 'a', 'b', 'c', 'd' ]
    numbers:  [ 1, 2, 3, 4 ]

  tasks:
    # Add Multiple User's in one go
    - name: add several users in one go
      user:
        name: "{{ item }}"
        state: present
        groups: "games"
      with_items:
        - testuser1
        - testuser2
        - testuser3
        - testuser4
        - testuser5
    
    - name: add several users
      user:
        name: "{{ item.name }}"
        state: present
        groups: "{{ item.groups }}"
      with_items:
        - { name: 'testuser6', groups: 'nobody' }
        - { name: 'testuser7', groups: 'nobody' }
        - { name: 'testuser8', groups: 'postfix' }
        - { name: 'testuser9', groups: 'postfix' }
    
    - name: Loop Over Set of Collection variable
      debug:
        msg: "{{ item.0 }} and {{ item.1 }}"
      with_together:
        - "{{ alpha }}"
        - "{{ numbers }}"
```

- Random choice loops.
- Do-until Loop -To retry a task until a certain condtion is met.
- Default value for `retries` is 3 and `delay` is 5.
- Looping over the list with Index.

```yaml
#!/usr/local/bin/ansible-playbook
- name: Loops in Ansible Playbook Part II
  hosts: all
  remote_user: ec2-user
  become: 'yes'
  become_user: root

  vars:
    alpha: [ 'a', 'b', 'c', 'd' ]
    numbers:  [ 1, 2, 3, 4 ]

  tasks:
    # Add Multiple User's in one go
    - name : Random Looping Example
      debug:
        msg: "{{ item }}"
      with_random_choice:
        - "go through the door"
        - "drink from the goblet"
        - "press the red button"
        - "do nothing"
    
    # Looping Over A List With An Index
    - name: Looping over a List
      debug:
        msg: "At array position {{ item.0 }} there is a value {{ item.1 }}"
      with_indexed_items:
        - "{{ alpha }}"

    # Do Until Loop
    - name: Ensure Apache is Running
      service:
        name: httpd
        state: started
      register: result
      until: result.changed == True
      retries: 10
      delay: 4
```

```yaml
#!/usr/local/bin/ansible-playbook
- name: Loops in Ansible Playbook Part III
  hosts: all
  remote_user: ec2-user
  become: 'yes'
  become_user: root

  vars:
    packages: [ 'gettext-devel', 'openssl-devel', 'perl-CPAN', 'perl-devel', 'zlib-devel', 'unzip', 'curl', 'wget' ]
  tasks:
    - name: Install Multiple Packages using Loop
      yum:
        name: '{{ item }}'
        state: present
      loop:
        - gettext-devel
        - openssl-devel
        - perl-CPAN
        - perl-devel
        - zlib-devel
        - unzip
        - curl
        - wget

    - name: UnInstall Multiple Packages using Index Loop
      yum:
        name: '{{ item.1 }}'
        state: absent
      with_indexed_items:
        - "{{ packages }}"


    - name: Install Multiple Packages using Index Loop
      yum:
        name: '{{ item.0 }}'
        state: present
      with_together:
        - "{{ packages }}"

```
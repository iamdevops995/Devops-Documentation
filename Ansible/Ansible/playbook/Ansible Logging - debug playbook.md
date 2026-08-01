*User needs to put some debug information/print information while  executing the stuff.*
Ansible use debug module for such print statements.
1. debug Module is helpful for debugging variables and expressions. 
2. debug Module accepts three parameters.
  - **msg -** print or logging statement
  - **var**- variable which value user wants to print
  - **verbosity -** Define verbosity of messages.
ansible_debug.yaml
```yaml
#!/usr/local/bin/ansible-playbook
- name: This is Overview of Ansible Debug Module
  hosts: all
  remote_user: ec2-user
  become: 'yes'
  become_user: root

  tasks:
    - name: Task for Debug Module Messaging
      debug:
        msg: "Hi, this is Custom message for Debug Module"
    
    - name: Prints two lines of messages
      debug:
        msg:
        - "Hi This is multiline message."
        - "And I am line number 2..."
    
    - name: Print Varaible in messages
      debug:
        msg: 
        - "Host IP is - {{ inventory_hostname }}"
        - Host IP is - {{ inventory_hostname }}
        - System {{ inventory_hostname }} has gateway {{ ansible_default_ipv4.gateway }}
    
    - name: debug module var parameter
      debug:
        var: inventory_hostname 
    
    - name: verbocity in debug module
      debug:
        msg: "Hi this is deep logging at deub level 2"
        verbocity: 2
```

##### Variables in ansible

```yaml
#!/usr/local/bin/ansible-playbook
- name: This is Overview of Ansible Debug Module
  hosts: all
  remote_user: ec2-user
  become: 'yes'
  become_user: root

  vars:
    test: hello, this is dummy value
    my_name: logesh
    my_age: 25
    my_height: 5.11
    is_male: true

  tasks:
    - name: Reading Ansible Playbook varaible
      debug:
        var: test

    - name: Reading Ansible Playbook varaibles
      debug:
        msg:
        - My name is {{ my_name }}
        - I am {{ my_age }} years old.
        - And I am {{ my_height }} long, my gender is male - {{ is_male }}
```

##### Data collection in Ansible

*Data Collection or Data Store is used to store multiple values.* 
- You can have sequence data structure.
- You can have map data structure.

```yaml
#!/usr/local/bin/ansible-playbook
- name: This is the ansible data collection module
  hosts: web
  remote_user: root
  become: true
  become_user: root
  vars:
    packages: ['wget','unzip','vim']
    cities:
    - New York
    - London
    - scotland
    - india
    - singapore
  web_server: {'linux':'httpd','unix':'apache2'}
  tasks:  
    - name: This is data collection retrievel
      debug:
        var: packages
    - name: This is data collection F1
      debug:
        var: cities
    - name: THis is data collection F2
      debug:
        var: web_server
```

#### Uses of Set_Fact and Register
**Ansible Modules generally returns a data structure.** 
- User can store the output of module using ansible registers module.
- User can use the value of registers in different scenarios like conditional 
**statement, logging etc.**
- Set_fact is used to store the Variable.
```yaml
#!/usr/local/bin/ansible-playbook
- name: This is the ansible data set_fact and register module
  hosts: web
  remote_user: root
  become: true
  become_user: root
  tasks:
    - name: This is the taks collect the shell version
      shell: "bash --version"
      register: bash_ver
    - set_fact:
       "bash_version" : "{{bash_ver.stdout_lines[0].split()[3]}}"
    - debug:
        var: bash_version
```

##### Arithmetic operation in ansible

```yaml
#!/usr/local/bin/ansible-playbook
- name: This is to Display Arithmetic Opeations on Varaibles
  hosts: localhost
  gather_facts: false

  vars:
    a : 10
    b : 20 

  tasks:
    - name: Operations on variables
      debug: 
        msg:
        - "value of a is : {{a}}"
        - "value of b is : {{b}}"
        - "Addtion of a & b : {{a + b}}"
        - "Subs of a & b : {{a - b}}"
        - "Multi of a & b : {{a * b}}"
        - "Devide of a & b : {{a/b}}"
```

```yaml
#!/usr/local/bin/ansible-playbook
- name: This is to Display Arithmetic Opeations on Varaibles
  hosts: localhost
  gather_facts: false

  vars:
    a : 10
    b : "{{a*10}}"

  vars_prompt:
    - name : x
      prompt: Please enter Value of x 
      private: no

    - name : y
      prompt: Please eneter value of y
      private: no

  tasks:
    - name: Operations on variables
      debug: 
        msg:
        - "value of a is : {{a}}"
        - "value of b is : {{b}}"
        - "Addition of User Defined Values x, y is : {{x+y}}"
        - "Addition of User Defined Values x, y is : {{x|int + y|int}}"
        - "Multiple of User Defined Values x, y is : {{x|int * y|int}}"
```

##### Filters and methods on ansible:

*Filter and methods are ways to perform operations on your variables*
**Filters:** Inbuilt operation definition in ansible(Jinja2 format)
**Methods:** Python methods, custom filter
How to use:
- Use | for inbuild filter on variables
- Use . for methods on variables
```yaml
#!/usr/local/bin/ansible-playbook
- name: This is to Display filter and method Opeations on Varaibles
  hosts: localhost
  gather_facts: false

  vars:
    a : "HeLLo tHiS is logesh and i aM a SoftWARE enginEER"
    b : 10
    c : "20"

  tasks:
    - name: Operations on variables
      debug: 
        msg:
        - "value of a is : {{a}}"
        - "value of b + c is : {{b+c|int}}"
        - "Small case value of a : {{a|lower}}"
        - "Capital case Value of a: {{a|upper}}"
        - "Title Case value of a : {{a|title}}"
        - "Small case value of a : {{a.lower()}}"
        - "Capital case Value of a: {{a.upper()}}"
        - " Split of String a : {{a.split()}} " 
```

##### Pause Module:

```yaml
#!/usr/local/bin/ansible-playbook
- name: This is pause module playbook
  hosts: web
  remote_user: root
  gather_facts: false
  become: true
  become_user: root
  tasks:
    - name: Notigy about maintenance
      debug: 
        msg: "maintenance window"
    - name: Pause the maintenance
      pause:
        prompt: "Pres 'Enter' to continue the maintenance is completed"
    - name: resume operation post-maintenance
      shell: echo "maintenance completed"
  tags: scenario1
- name: Install and start apache HttP server on ubuntu
  hosts: web
  become: yes
  tasks:
    - name: Update apt packages index
      apt:
        update_cache: yes
    - name: Install apache http package
      apt:
        name: apache2
        state: present
    - name: pause to allow the web service to start
      pause:
        seconds: 30
    - name: Ensure apache2 is running
      systemd:
        name: apache2
        state: started
      register: http_status
    - name: Display the apache status
      debug:
        msg: "Apache is {{ http_status.state }} and enabled"
  tags: scenario2
- name: Getting username passowrd using ansible
  become: yes
  gather_facts: false

  tasks:
    - name: Pause for 30 seconds
      pause:
        seconds: 30
    - name: pause for user confirmation
      pause:
        prompt: "Press 'Enter' to continue after verifying the backup"
    - name: pause for username input
      pause:
        prompt: "Enter your username"
        echo: yes
    - name: Pause for passowrd
      pause:
        prompt: "ENter the passowrd"
        echo: No
  tags: scenario3
```
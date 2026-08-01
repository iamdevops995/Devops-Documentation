
#### Installing Apache HTTPD using playbook.
```yaml
- hosts: all
  remote_user: ec2-user
  become: yes
  tasks:
  - name: install the latest version of Apache
     yum:
       name: httpd
       state: present
  - name: Start service httpd, if not started
    service:
      name: httpd
      state: started
  - name: Copy file with owner and permissions
    copy:
      src: /home/ec2-user/index.html
      dest: /var/www/html/index.html
      mode: '777'
```
***To execute the playbook
```shell
ansible-playbook -i slaves.txt basic.yaml
```
#### Loops topic
Installing the below Application
- php
- MySQL
- unzip
- HTTP present
```yaml
- hosts: all
  remote_user: ec2-user
  become: yes
  tasks:
  - name: install the latest version of tools
    yum:
      name: "{{item}}"
      state: present
    loop:
      - php
      - mysql
      - unzip
      - http_present
```
***To execute the playbook
```shell
vi loop.yaml
ansible-playbook -i slaves.txt loop.yaml
```
Green color - (OK)it will skip the existing one if it present in server
Yellow color - (changed) newly added
Red color - failed example;http_present package is not available

-------------------------------------------------------------------------
#### Multiple Plays in Playbook

--> *A playbook is a YAML file containing a list of one or more plays.*
--> *This can be very useful when orchestrating a complex deployment which may involve different tasks on different hosts.*

---
```yaml
- name: Enable intranet services
  hosts: servera.lab.example.com
  become: yes
  tasks:
    - name: Latest version of httpd firewalld installed
      yum:
        name:
          - httpd
          - firewalld
        state: latest
    - name: test html page is installed
      copy:
        content: "Welcome to the example.com intranet!\n"
        dest: /var/www/html/index.html
    - name: firewalld enabled and running
      service:
        name: firewalld
        enabled: true
        state: started
    - name: Firewalld permits access to httpd service
      firewalld:
        service: http
        permanent: true
        state: enabled
        immediate: yes
    - name: httpd enabled and running
      service:
        name: httpd
        enabled: true
        state: started
- name: Test intranet wen server
  hosts: localhost
  become: no
  tasks:
    - name: connect to intranet web server
      uri:
        url: http://servera.lab.example.com
        return_content: yes
        status_code: 200
```

```shell
ansible-playbook --syntax-check internet.yaml
```

---------------
```yaml
---
- name: Enable internet services
  hosts: serverb.lab.example.com
  become: yes
  tasks:
    - name: Install latest versions of applications
      yum:
        name:
          - httpd
          - mariadb-server
          - php
          - php-mysqlnd
        state: latest
    - name: Start the firewalld service
      service:
        name: firewalld
        enabled: true
        state: started
    - name: Enable firewalld services and running
      firewalld:
        service: http
        state: enabled
        permanent: true
        immediate: yes
    - name: Enable httpd is running
      service:
        name: httpd
        enabled: true
        state: started
    - name: Enable maraidb service running
      service:
        name: maraidb
        enabled: true
        state: started
    - name: test php page is intalled
      get_url:
        url: http://materials.example.com/labs/playbook-review/index.php
        dest: /var/www/html/index.html
        mode: 644
- name: web server testing
  hosts: localhost
  become: no
  tasks:
    - name: testing the page
      uri:
        url: http://serverb.lab.example.com
        return_content: true
        status_code: 200

```

```shell
ansible-playbook --syntax-check internet.yaml
```

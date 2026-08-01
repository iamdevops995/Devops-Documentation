#### lineinfile module: 
- This module is used to manage lines in text files.
- It ensures that a particular line present in a file or replaces an existing line matching a pattern.
- This module is particularly useful for configuration management, where you often need to ensure specific setting are present in configuration files.

| Parameters   | Explanation                                                                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| path         | The path to the file want to edit                                                                                                                        |
| line         | The line to be inserted or ensured in the file                                                                                                           |
| regexp       | A regular expression to search for in the file. if found the line will be replaced. if not found, the line will be added                                 |
| state        | Whether the line should be present (present ,default) or absent (absent)                                                                                 |
| insertafter  | Specifies where to insert the line if the pattern specified in regexp is not found. Possible values include BOF (beginning of line) or EOF (end of file) |
| insertbefore | Specifies where to insert the line if the pattern specified in regex found, possible value include (BOF or EOF)                                          |
```yaml
- name: lineinfile module demo
  hosts: localhost
  gather_facts: no
  become: false
  tasks:
    - name: check if file is present
      file:
        path: sample.conf
        state: touch
    - name: Add a line if doesn't exist
      lineinfile:
        path: sample.conf
        line: "timeout 60"
        state: present
        insertafter: "^port"
    - name: Replace line if exist
      lineinfile:
        path: sample.conf
        regexp: "^ssl_enabled.*"
        line: "ssl_enabled false"
    - name:
      lineinfile:
        path: sample.conf
        line: "#This is comment"
        insertbefore: BOF
    - name: Read file content
      command: cat sample.conf
      register: file_content
    - name: Read the file content
      debug:
        msg: "{{ file_content.stdout }}"
    - name:  remove line for file
      lineinfile:
        path: sample.conf
        regexp: "^server_name*"
        state: absent
```
sample.conf
```c
# Sample Configuration File
server_name example.com
port 80
ssl_enabled true
```




-------------------------------------------
#### Blockinfile Module:

- This  module is used to insert or update a block of text in a file
- It's particularly useful for managing configuration files where you need to add or modify a section of text without altering the rest of the file.

| parameters            | Explanation                                                                                                                                                                                                                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| path                  | The path to the file you want to edit                                                                                                                                                                                                                                                                                      |
| block                 | The block of the that you want to insert or update in the file                                                                                                                                                                                                                                                             |
| marker                | - Specifies a unique marker that will be used to identify where to insert or update the block  of text.<br>- If the marker doesn't exist, the module will append the block of text to the end of the file.                                                                                                                 |
| backup                | If set to `yes`, creates a backup of the original file before making changes<br>Default to` no`                                                                                                                                                                                                                            |
| block_begin/block_end | Allow you to specify the start and end patterns for the block text<br>These parameter are mutually exclusive with marker parameter                                                                                                                                                                                         |
| state                 | Possible values are present, absent, before ,after<br>`present`: Ensures that the block of the text is present in the file<br>`absent`: Ensures that the block of the text is absent from the file<br>`before`: Inserts the block of the text before the marker<br>`after`: Inserts the block of the text after the marker |
| mode                  | Specifies the permissions of the file                                                                                                                                                                                                                                                                                      |
| validate              | specifies a script or command to validate the file after making changes                                                                                                                                                                                                                                                    |
nfinx.conf
```c
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80;
        server_name  localhost;

        # Sample location block for serving static files
        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        # This is where the playbook will add or modify blocks
        # START OF NEW BLOCK
    }
}
```

```yaml
---
- name: Manage Nginx Configuration File
  hosts: localhost
  tasks:
    - name: Add a new block of text after a marker
      blockinfile:
        path: /etc/nginx/nginx.conf
        marker: "# START OF NEW BLOCK"
        block: |
          # New block of text
          location /api {
              proxy_pass http://backend_servers;
              proxy_set_header Host $host;
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          }
      register: block_result

    - name: Print the blockinfile result
      debug:
        var: block_result

    - name: Replace a block of text between markers
      blockinfile:
        path: /etc/nginx/nginx.conf
        marker: "# START OF NEW BLOCK"
        block: |
          # Updated block of text
          location /api {
              proxy_pass http://new_backend_servers;
              proxy_set_header Host $host;
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          }
      when: "'# START OF NEW BLOCK' in block_result.changed"

    - name: Remove a block of text between markers
      blockinfile:
        path: /etc/nginx/nginx.conf
        marker: "# START OF NEW BLOCK"
        state: absent
      when: "'# START OF NEW BLOCK' in block_result.changed"
```


----------------------------------------------------
#### Reboot Module

- This module is used to reboot target machines and wait for them to come back online.
- It's ensures that the machine is back online and ready for further operations before proceeding.
- This module is particularly useful when you need to reboot servers as part of a deployment or maintenance process.

| Parameters                            | Explanation                                                                                                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| msg                                   | A message to display before rebooting. Default is "Reboot initiated by ansible"                                                                                                |
| reboot_timeout                        | Maximum wait time for the system to reboot and respond to a test command. Default is 600 seconds (10minutes)                                                                   |
| test_command                          | Command to test the system after reboot. Default is `whoami`                                                                                                                   |
| connect_timeout                       | Maximum wait time for a successful connection to the managed host before trying again. Default is `5 seconds`                                                                  |
| pre_reboot_delay<br>post_reboot_delay | Delay in seconds before rebooting the system. Default is 0 seconds<br>Delay in seconds after rebooting before starting the connection attempts. Default is `0 seconds`<br><br> |

```yaml
---
- name: Gather and display OS family
  hosts: all
  gather_facts: yes
  tasks:
    - name: Display the OS family
      debug:
        msg: "The OS family is {{ ansible_os_family }}"

- name: Reboot Servers Example
  hosts: all
  become: yes  # Ensure that the playbook runs with elevated privileges
  tasks:
    - name: Apply updates and reboot
      block:
        - name: Update all packages
          apt:
            update_cache: yes
            upgrade: dist
          when: ansible_os_family == 'Debian'

        - name: Reboot the server
          reboot:
            msg: "Reboot initiated by Ansible for updates"
            reboot_timeout: 300
            post_reboot_delay: 30

        - name: Ensure the server is up and running
          command: uptime
          register: uptime_result

        - name: Print uptime
          debug:
            var: uptime_result.stdout

      when: ansible_os_family == 'Debian'  # Adjust this condition as needed for your environment
```


#### Git module
- This module is used to manage git repositories.
- This includes cloning repositories, checking out specific branches or tags and pulling updates from remote repositories.
- It is useful for deploying code, configuration or any other files managed in git repository to your server.

**Use Case:**
1. A common use case for the git module is deploying application code from a Git repository to a set of servers.
2. This could be part of a continuous deployment pipeline where you automatically deploy code changes to your servers.


| Parameters     | Explanation                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| repo(required) | The URL of the Git repository to clone from                                          |
| dest(required) | The path where the repository should be cloned on the remote host                    |
| version        | The `branch`,`tag`,`commit` to check out, Default to the repository's default branch |
| force          | If `yes` any local modification in the repository will be discarded. Default to `no` |


```yaml
---
- name: Clone GitHub repository and perform tasks
  hosts: all
  become: yes
  tasks:
    - name: Ensure Git is installed
      ansible.builtin.package:
        name: git
        state: present

    - name: Clone the GitHub repository
      ansible.builtin.git:
        repo: https://github.com/ansible/ansible-examples.git
        dest: /tmp/ansible-examples
        update: yes
        version: master

    - name: Print the contents of a file from the repository
      ansible.builtin.shell: cat /tmp/ansible-examples/README.md
      register: readme_contents

    - name: Display the contents of the file
      debug:
        msg: "{{ readme_contents.stdout }}"
```

----------------------------------------


#### COPY Module:
- This module is used to copy files or directory from the local Ansible control machine to remote host.
- It allows you to transfer files and set permissions, ownership and other attributes an needed.
Use case:
1. The copy module is commonly used in ansible playbook to deploy configuration files, scripts or other resources to remote hosts . for example you might use it to deploy a custom configuration file for an application copy over SSL certificates or distributes scripts for automation tasks.

| Parameters         | Explanation                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| src (required)     | The path of the file on the local host                                                                                      |
| dest(required)     | The path where the file will be stored on the remote host                                                                   |
| backup             | If set to `yes` creates a backup of the destination file before copying Default to `no`                                     |
| force              | If set to `yes` forces the copy operation even if the destination file already exists and is not writable. Default to `yes` |
| owner , group,mode | Allows you to set the `owner` `group` permissions of the copied file or directory                                           |
| remote_src         | If set to `yes` specifies that the src file is located on the remote hosts. Default to `no`                                 |

```yaml
---
- name: Copy nginx.conf to remote host
  hosts: all
  tasks:
    - name: Copy nginx.conf
      copy:
        src: /etc/nginx/nginx.conf    # Local path of the file
        dest: /root/ansible/nginx.conf    # Destination path on remote host
        owner: root
        group: root
        mode: '0644'
      become: yes
```


#### Fetch Module:
- This module is used to fetch files from remote hosts and store on the control node(the machine running ansible)
- It's particularly useful when you need to retrieve files from multiple remote hosts and centralize them for further analysis or processing

Use Case:
1. The fetch module is commonly used in scenarios where you need to collect logfiles,configuration or other artifacts from multiple remote hosts for troubleshooting, auditing or backup purposes.

| parameters         | Explanation                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| src(required)      | The path of the file on the remote host                                                                            |
| dest(required)     | The path where the file will be be stored on the control node                                                      |
| flat               | If set to `yes` the file will be fetched and stored without the hostname appended to its filename, default to `no` |
| validate_checksum  | If set to `yes` validates the checksum of the file after it has been transferred. Default to `no`                  |
| checksum_algorithm | Specifies the checksum algorithm to use for the validating the file. Default th e `sha1`                           |

```yaml
--- 
- name: Generating the logs on remote machines/hosts
  hosts: all
  tasks:
    - name: create a log directory if doesn't exists
      file:
        path: /var/log
        state: directory
    - name: genrate example log file
      shell:
        echo "This is sample log message.." >> /vat/log/example.log
---
  - name: Fetch the example log from remote hosts
    hosts: all
    tasks:
      - name: Fetch example logs file from remote hosts
        fetch: 
          src: /var/log/example.log
          dest: /tmp/logs
          flat: yes
```









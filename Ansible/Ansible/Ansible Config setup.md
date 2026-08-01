 ### Path Preferences
 **ANSIBLE_CONFIG**  -->  Env Variable
 **Current Dir** --> ./ansible.cfg
 **Hidden file in Home Dir** -->  ~/.ansible.cfg
 **Ansible config at etc** -->  /etc/ansible/ansible.cfg
 
 ---------------------------------------------------------------------------------------
**Create ansible config as env:**
![[Pasted image 20250820094321.png]]

**Create ansible on current directory:**
![[Pasted image 20250820094547.png]]**create ansible config file on user home directory:**

![[Pasted image 20250820094836.png]]


ANSIBLE_KEEP_REMOTE_FILE=1 ansible-playbook lineinfile.yaml
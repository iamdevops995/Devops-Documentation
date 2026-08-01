#### Ansible Vault


Ansible vault is feature in ansible that allows  you to keep sensitive data such as password, private keys, and other secrets secure.
**Key features:**
	*Encryption and decryption:* Ansible vault uses AES256 symmetric encryption. you can encrypt and decrypt entire files or individual variables within playbooks
	*Integration with ansible playbooks:* Vault-encrypted files and variables can be seamlessly integrated into your ansible playbook and roles.
	*Password management:* You can use command-line options environment variable or file to manage vault passwords
- *It is used to encrypt files, playbooks*
- *Technique: AES256(used by Facebook)*
- *Vault will store our data very safely and securely*
- *If we want to access the any data which is in the we need to give a password*
```shell
ansible-vault encrypt_String 'admin' -name "securePassword" --vault-password-file /root/ansible/ansible_vault
```
```shell
vi creds.txt > user=Logeshkumar , password=test123
```
Note: we can restrict the users to access the playbooks
```
1) ansible-vault create creds.txt  --> To create a vault
2) ansible-vault edit creds.txt     -->  To edit the vault file
3) ansible-vault rekey creds.txt    --> To change password
4) ansible-vault decrypt creds.txt  --> To decrypt the file
5) ansible-vault encrypt creds.txt  --> To encrypt the file
6) ansible-vault view creds.txt    -->  To view the data in the file without decrypt
```
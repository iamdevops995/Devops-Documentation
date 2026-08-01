# Ansible Vault

<div class="page-header">
  <span class="difficulty-badge intermediate">Intermediate</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 20 min</span>
</div>

> Ansible Vault provides encryption for sensitive data like passwords, API keys, and certificates, allowing you to store secrets securely in version control.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 🔐 **Encrypt Files** | Secure entire playbooks or variable files |
| 🔑 **Encrypt Strings** | Protect individual values |
| 📝 **Edit Encrypted Files** | Modify vault-protected content |
| 🚀 **Use in Playbooks** | Integrate secrets into automation |

---

## 🎓 Theory: Understanding Vault

<div class="concept-box">

**What is Ansible Vault?**

Ansible Vault encrypts sensitive data using **AES256** symmetric encryption (the same standard used by major tech companies like Facebook).

**Key Features:**
- 🔒 Encrypt entire files or individual variables
- 🔑 Password or key-file authentication
- 📦 Version control safe (encrypted content can be committed)
- 🔄 Seamless integration with playbooks

</div>

<div class="warning-box">

⚠️ **Security Best Practice:**

Never store passwords, API keys, private keys, or certificates in plain text files!

</div>

---

## 🔧 Vault Commands

### Quick Reference

| Command | Purpose |
|---------|---------|
| `ansible-vault create` | Create new encrypted file |
| `ansible-vault encrypt` | Encrypt existing file |
| `ansible-vault decrypt` | Decrypt file (removes encryption) |
| `ansible-vault edit` | Edit encrypted file |
| `ansible-vault view` | View encrypted file content |
| `ansible-vault rekey` | Change vault password |
| `ansible-vault encrypt_string` | Encrypt a single string |

---

## 📝 Practical Examples

### Example 1: Create Encrypted File

```bash
# Create new encrypted file
ansible-vault create secrets.yml

# You'll be prompted for a password
# Then an editor opens to add content
```

**Content of `secrets.yml`:**
```yaml
---
db_password: "SuperSecret123!"
api_key: "sk-1234567890abcdef"
admin_password: "AdminP@ss2024"
```

---

### Example 2: Encrypt Existing File

```bash
# Create a plain text file first
cat > credentials.yml << EOF
---
mysql_root_password: "rootpass123"
app_secret_key: "my-secret-key"
EOF

# Encrypt the file
ansible-vault encrypt credentials.yml

# File is now encrypted (try cat to see)
cat credentials.yml
```

**Encrypted output looks like:**
```
$ANSIBLE_VAULT;1.1;AES256
61626364656667686970716B6C6D6E6F707172737475767778797A...
```

---

### Example 3: View Encrypted File

```bash
# View without decrypting
ansible-vault view credentials.yml

# Enter password when prompted
```

---

### Example 4: Edit Encrypted File

```bash
# Open in editor (decrypts, edits, re-encrypts)
ansible-vault edit credentials.yml
```

---

### Example 5: Change Password (Rekey)

```bash
# Change vault password
ansible-vault rekey credentials.yml

# Enter old password, then new password
```

---

### Example 6: Decrypt File

```bash
# Remove encryption (converts to plain text)
ansible-vault decrypt credentials.yml

# ⚠️ Warning: File is now unencrypted!
```

---

### Example 7: Encrypt Individual String

Perfect for embedding single secrets in otherwise unencrypted files:

```bash
# Encrypt a string
ansible-vault encrypt_string 'SuperSecretPassword' --name 'db_password'

# Output:
# db_password: !vault |
#           $ANSIBLE_VAULT;1.1;AES256
#           61626364656667...
```

**Use in playbook:**
```yaml
---
- name: Deploy with encrypted variable
  hosts: all
  vars:
    db_password: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          61626364656667686970716B6C6D6E6F707172737475767778797A...
  tasks:
    - name: Configure database
      template:
        src: db-config.j2
        dest: /etc/app/database.conf
```

---

## 🚀 Using Vault in Playbooks

### Method 1: Include Encrypted Variables File

**`secrets.yml`** (encrypted):
```yaml
---
db_password: "Secret123"
api_token: "tok_abc123"
```

**`playbook.yml`**:
```yaml
---
- name: Deploy Application
  hosts: all
  vars_files:
    - secrets.yml
  
  tasks:
    - name: Configure application
      template:
        src: app-config.j2
        dest: /etc/app/config.yml
```

### Method 2: Multiple Vault Files

```yaml
---
- name: Multi-environment deployment
  hosts: all
  vars_files:
    - vars/common.yml
    - "vars/{{ env }}_secrets.yml"  # encrypted
  
  tasks:
    - name: Deploy configuration
      template:
        src: config.j2
        dest: /etc/app/config.yml
```

---

## 🔑 Password Management

### Option 1: Prompt for Password

```bash
ansible-playbook site.yml --ask-vault-pass
```

### Option 2: Password File

```bash
# Create password file
echo "MyVaultPassword" > ~/.vault_pass
chmod 600 ~/.vault_pass

# Use password file
ansible-playbook site.yml --vault-password-file ~/.vault_pass
```

### Option 3: Environment Variable

```bash
# Set environment variable
export ANSIBLE_VAULT_PASSWORD_FILE=~/.vault_pass

# Now run without specifying password
ansible-playbook site.yml
```

### Option 4: ansible.cfg

**`ansible.cfg`**:
```ini
[defaults]
vault_password_file = ~/.vault_pass
```

---

## 🏷️ Multiple Vault IDs

For different passwords per environment:

```bash
# Create with vault ID
ansible-vault create --vault-id prod@prompt secrets_prod.yml
ansible-vault create --vault-id dev@prompt secrets_dev.yml

# Run playbook with multiple vault IDs
ansible-playbook site.yml \
  --vault-id dev@~/.vault_pass_dev \
  --vault-id prod@~/.vault_pass_prod
```

---

## 💡 Best Practices

### 1. Separate Secrets from Code

```
project/
├── group_vars/
│   ├── all/
│   │   ├── vars.yml          # Regular variables
│   │   └── vault.yml         # Encrypted secrets
│   └── production/
│       ├── vars.yml
│       └── vault.yml         # Production secrets
└── playbook.yml
```

### 2. Use Descriptive Names

```yaml
# ❌ Bad
password: "abc123"

# ✅ Good
mysql_root_password: "abc123"
app_api_secret_key: "xyz789"
```

### 3. Document Your Secrets

```yaml
---
# secrets.yml - Encrypted with ansible-vault
# Contains: Database passwords, API keys
# Last updated: 2024-01-15
# Contact: devops@example.com

mysql_root_password: "..."
redis_password: "..."
api_secret_key: "..."
```

### 4. Rotate Passwords Regularly

```bash
# Rekey all vault files
for f in $(find . -name "*vault*.yml"); do
  ansible-vault rekey "$f"
done
```

---

## 📋 Quick Reference

```bash
# Create encrypted file
ansible-vault create secrets.yml

# Encrypt existing file
ansible-vault encrypt vars.yml

# Decrypt file
ansible-vault decrypt vars.yml

# View encrypted file
ansible-vault view secrets.yml

# Edit encrypted file
ansible-vault edit secrets.yml

# Change password
ansible-vault rekey secrets.yml

# Encrypt string
ansible-vault encrypt_string 'password' --name 'var_name'

# Run playbook with vault
ansible-playbook site.yml --ask-vault-pass
ansible-playbook site.yml --vault-password-file ~/.vault_pass
```

---

## 🔗 Next Steps

- [Ansible Roles](Ansible%20Roles.md) - Organize automation with roles
- [Practical Playbooks](Practical%20ansible%20playbook.md) - Real-world examples

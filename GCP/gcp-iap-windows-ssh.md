# GCP IAP SSH Access with Windows OpenSSH

## 1. Project Overview

The initial objective of the project was to enable secure SSH access to Windows GCP VMs using **Identity-Aware Proxy (IAP)**.

The implementation was completed in two stages:

1. Configure and validate SSH access through **GCP IAP**.
2. Implement SSH key-based authentication using **GCP VM metadata**.

The final setup allows users or automation tools such as Azure DevOps to connect to Windows VMs using SSH keys instead of passwords.

---

## 2. Initial IAP SSH Implementation

### Objective

The first phase was to establish SSH connectivity to Windows VMs through GCP IAP.

The architecture was:

```text
Developer / Azure DevOps
        |
        | SSH
        v
GCP IAP Tunnel
        |
        | TCP 22
        v
Windows GCP VM
        |
        v
OpenSSH Server
```

IAP provides secure access to the VM without requiring the SSH port to be directly exposed to the internet.

---

## 3. Windows OpenSSH Configuration

The Windows VM was configured with the OpenSSH Server.

**Verify the SSH service:**

```powershell
Get-Service sshd
```

Expected:

```
Status   Name
------   ----
Running  sshd
```

**Verify that SSH is listening:**

```powershell
Get-NetTCPConnection -LocalPort 22
```

Expected:

```
LocalPort    State
---------    -----
22           Listen
```

The OpenSSH server was listening on:

- `0.0.0.0:22`
- `[::]:22`

---

## 4. IAP SSH Connectivity

IAP was used to establish a secure tunnel from the client to the Windows VM.

The local tunnel exposed the VM SSH service through a local port.

**Example:**

```bash
gcloud compute start-iap-tunnel VM_NAME 22 \
    --local-host-port=localhost:2222 \
    --zone=ZONE \
    --project=PROJECT_ID
```

This creates:

```text
localhost:2222
      |
      v
GCP IAP
      |
      v
Windows VM:22
```

SSH can then connect through the local tunnel:

```bash
ssh -p 2222 vsts@localhost
```

---

## 5. Password Authentication Validation

Initially, password authentication was used to validate that the SSH service and IAP tunnel were working correctly.

**Example:**

```bash
ssh -p 2222 vsts@localhost
```

The Windows OpenSSH logs confirmed successful authentication:

```
Accepted password for vsts
```

This proved that:

- IAP tunnel was working
- Network connectivity was working
- Windows OpenSSH was working
- The `vsts` Windows user existed
- SSH authentication was functioning

---

## 6. Move to SSH Key Authentication

After validating IAP connectivity, the next phase was to remove the dependency on passwords and implement SSH public-key authentication.

**Generate the SSH key pair on the Linux client:**

```bash
ssh-keygen -t ed25519 -C "logesh-test"
```

The generated files were:

- `~/.ssh/windows_vsts` (private key)
- `~/.ssh/windows_vsts.pub` (public key)

**Verify the public key fingerprint:**

```bash
ssh-keygen -lf ~/.ssh/windows_vsts.pub
```

Output:

```
256 SHA256:5vPNWEBa1eSJ7ogODWq97igLyAficR0eF0HEmmDsNlQ logesh-test (ED25519)
```

---

## 7. Configure Authorized Keys on Windows

The public key was added to the Windows user's SSH authorized keys file:

```
C:\Users\vsts\.ssh\authorized_keys
```

The file contained:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK7n8/BMsrrKHFelkDxXuJBdfeBEczLv/MU85MNwEfXs logesh-test
```

The fingerprint of the public key matched the key on the Linux client, confirming that the correct public key was installed.

---

## 8. Windows User Validation

**Verify the Windows vsts account:**

```powershell
Get-LocalUser vsts | Select-Object Name,Enabled,SID
```

Example:

```
Name     Enabled SID
----     ------- ---
vsts     True    S-1-5-21-...-1001
```

**Confirm the user is a member of the local Administrators group:**

```powershell
Get-LocalGroupMember Administrators
```

Output:

```
User  WINDOWS-IAP-VM\Administrator
User  WINDOWS-IAP-VM\labadmin
User  WINDOWS-IAP-VM\vsts
```

---

## 9. Authorized Keys Permissions

**Check the permissions on the .ssh directory:**

```powershell
icacls "C:\Users\vsts\.ssh"
```

Output:

```
BUILTIN\Administrators:(OI)(CI)(F)
NT AUTHORITY\SYSTEM:(OI)(CI)(F)
WINDOWS-IAP-VM\vsts:(OI)(CI)(F)
```

The `vsts` user has access to the SSH directory and authorized keys.

**Check the authorized keys file ACL:**

```powershell
Get-Acl "C:\Users\vsts\.ssh\authorized_keys" | Format-List
```

---

## 10. OpenSSH AuthorizedKeysFile Configuration

**Check the OpenSSH configuration:**

```powershell
Select-String `
    -Path "C:\ProgramData\ssh\sshd_config" `
    -Pattern "Match Group|AuthorizedKeysFile"
```

The configuration contained:

```
AuthorizedKeysFile .ssh/authorized_keys

Match Group administrators
    AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

This is an important OpenSSH behavior:

- For **normal users**, the configuration uses: `.ssh/authorized_keys`
- For **members of the administrators group**, the configuration can use: `__PROGRAMDATA__/ssh/administrators_authorized_keys`

---

## 11. Important Troubleshooting Issue

The `vsts` user was a member of the local Administrators group.

Therefore, the following configuration became important:

```
Match Group administrators
    AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

**Check if the administrator-specific file exists:**

```powershell
Test-Path "C:\ProgramData\ssh\administrators_authorized_keys"
```

Result: `False`

**Check the effective SSH configuration:**

```powershell
sshd.exe -T | Select-String "authorizedkeysfile|pubkeyauthentication"
```

Output:

```
pubkeyauthentication yes
authorizedkeysfile .ssh/authorized_keys
```

This confirmed that the effective configuration was using `.ssh/authorized_keys`.

---

## 12. SSH Public Key Authentication Test

Password authentication was explicitly disabled from the client side to ensure that the SSH key was actually being used.

**Command:**

```bash
ssh -vvv \
    -o PreferredAuthentications=publickey \
    -o PasswordAuthentication=no \
    -i ~/.ssh/windows_vsts \
    -p 2222 \
    vsts@localhost
```

The SSH client offered the key:

```
Offering public key:
 /home/logesh/.ssh/windows_vsts
```

Fingerprint:

```
SHA256:5vPNWEBa1eSJ7ogODWq97igLyAficR0eF0HEmmDsNlQ
```

---

## 13. Initial Public Key Failure

Initially, the Windows OpenSSH log showed:

```
Failed publickey for vsts
```

The fingerprint reported by Windows was:

```
ED25519
SHA256:5vPNWEBa1eSJ7ogODWq97igLyAficR0eF0HEmmDsNlQ
```

This confirmed that:

- The client was sending the expected SSH key
- Windows OpenSSH was receiving the key
- The failure was occurring during server-side key authorization
- The issue was not related to IAP connectivity

---

## 14. Verification of the Public Key

**Check the public key on the Linux machine:**

```bash
ssh-keygen -lf ~/.ssh/windows_vsts.pub
```

Output:

```
256 SHA256:5vPNWEBa1eSJ7ogODWq97igLyAficR0eF0HEmmDsNlQ logesh-test (ED25519)
```

**Check the Windows authorized keys file:**

```powershell
Get-Content "C:\Users\vsts\.ssh\authorized_keys"
```

It contained the matching public key:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK7n8/BMsrrKHFelkDxXuJBdfeBEczLv/MU85MNwEfXs logesh-test
```

The matching fingerprint confirmed that the correct public key was deployed.

---

## 15. Final Successful Configuration

After correcting the OpenSSH configuration/authorization behavior, SSH key authentication was successfully established.

**The final authentication flow:**

```text
Linux Client
    |
    | Private Key
    | ~/.ssh/windows_vsts
    |
    v
GCP IAP
    |
    | SSH Tunnel
    |
    v
Windows VM
    |
    | OpenSSH :22
    |
    v
vsts User
    |
    | Public Key Validation
    |
    v
C:\Users\vsts\.ssh\authorized_keys
```

**Connect using:**

```bash
ssh \
    -o PreferredAuthentications=publickey \
    -o PasswordAuthentication=no \
    -i ~/.ssh/windows_vsts \
    -p 2222 \
    vsts@localhost
```

The connection succeeds without requesting a password.

---

## 16. GCP Metadata-Based SSH Keys

After successfully implementing IAP SSH access and local SSH key authentication, the implementation was extended to use GCP VM metadata for SSH key management.

**Purpose:** Make SSH key provisioning easier to automate and manage consistently across multiple VMs.

**Architecture:**

```text
SSH Public Key
      |
      v
GCP Metadata
      |
      v
Windows VM
      |
      v
OpenSSH
      |
      v
Windows User
```

The private key remains on the client/automation system. Only the public key is distributed to the VM.

---

## 17. Security Model

> ⚠️ **Important:** The private key must never be stored in GCP VM metadata.

**Correct model:**

```text
Client / Azure DevOps
    |
    | Private Key
    |  ~/.ssh/windows_vsts
    |
    +--------------------+
                         |
                         v
                       IAP
                         |
                         v
                    Windows VM
                         ^
                         |
                  Public Key
                         |
                  GCP Metadata
```

The private key remains protected on the client or CI/CD environment.

---

## 18. Validation Checklist

### IAP

```bash
gcloud compute start-iap-tunnel ...
```

Confirm the local tunnel is listening on the expected port.

### Windows OpenSSH

```powershell
Get-Service sshd
```

Verify port:

```powershell
Get-NetTCPConnection -LocalPort 22
```

### User

```powershell
Get-LocalUser vsts
```

### SSH Key

Verify local fingerprint:

```bash
ssh-keygen -lf ~/.ssh/windows_vsts.pub
```

### Authorized Keys

```powershell
Get-Content "C:\Users\vsts\.ssh\authorized_keys"
```

### Permissions

```powershell
icacls "C:\Users\vsts\.ssh"
```

### OpenSSH Configuration

```powershell
Select-String `
    -Path "C:\ProgramData\ssh\sshd_config" `
    -Pattern "Match Group|AuthorizedKeysFile"
```

### Effective Configuration

```powershell
sshd.exe -T | Select-String "authorizedkeysfile|pubkeyauthentication"
```

Expected:

```
pubkeyauthentication yes
authorizedkeysfile .ssh/authorized_keys
```

### OpenSSH Logs

```powershell
Get-WinEvent `
    -LogName "OpenSSH/Operational" `
    -MaxEvents 30 |
    Format-List TimeCreated, Id, LevelDisplayName, Message
```

Successful key authentication should show an accepted authentication event rather than `Failed publickey`.

---

## 19. Final Outcome

The project was successfully implemented in phases:

### Phase 1 — IAP SSH

- Enabled secure SSH access through GCP IAP
- Validated Windows OpenSSH connectivity
- Verified SSH connectivity using the `vsts` user

### Phase 2 — SSH Key Authentication

- Generated an ED25519 SSH key pair
- Configured the public key for the Windows `vsts` account
- Validated SSH key fingerprints
- Verified Windows ACLs
- Troubleshot OpenSSH AuthorizedKeysFile behavior
- Disabled password authentication during testing
- Successfully authenticated using the SSH private key

### Phase 3 — GCP Metadata Integration

- Extended the solution to use GCP VM metadata for SSH public-key provisioning
- Kept private keys outside the VM and GCP metadata
- Established a model suitable for automation and CI/CD environments

---

## 20. Key Lessons Learned

| Lesson | Description |
|--------|-------------|
| **IAP and SSH are separate layers** | IAP Tunnel → Network Connectivity; OpenSSH → User Authentication |
| **IAP success ≠ SSH success** | A successful IAP tunnel does not guarantee successful SSH authentication |
| **Verify fingerprints** | Always verify the SSH public-key fingerprint on both sides |
| **Group membership matters** | Windows OpenSSH behavior can depend on the user's group membership and `Match Group` configuration |
| **Use sshd.exe -T** | Useful for checking the effective OpenSSH configuration |
| **Check OpenSSH logs** | Critical for identifying failures related to connectivity, user lookup, public-key authentication, authorized keys, or permissions |
| **Private keys stay on client** | Private keys should remain on the client or CI/CD system |
| **Metadata = public key only** | GCP metadata should contain only the public key |

---

## 21. Final Architecture

```text
                    +----------------------+
                    |  Developer / CI/CD   |
                    |                      |
                    | Private SSH Key      |
                    +----------+-----------+
                               |
                               | SSH
                               v
                    +----------------------+
                    |      GCP IAP         |
                    |   Secure Tunnel      |
                    +----------+-----------+
                               |
                               | TCP/22
                               v
                    +----------------------+
                    |    Windows GCP VM    |
                    |                      |
                    |     OpenSSH          |
                    |        :22           |
                    +----------+-----------+
                               |
                               | Public Key
                               v
                    +----------------------+
                    | Windows vsts User    |
                    |                      |
                    | .ssh/authorized_keys |
                    +----------------------+

                         ^
                         |
                 GCP VM Metadata
                 Public SSH Key
```

---

## Result

✅ **IAP + Windows OpenSSH + SSH public-key authentication + GCP metadata-based key provisioning** provides a secure and automation-friendly SSH access model for Windows GCP VMs.

---

## Ansible Configuration

The equivalent Ansible inventory configuration:

```ini
[windows]
windows-vm ansible_host=<WINDOWS_VM_IP>

[windows:vars]
ansible_connection=ssh
ansible_user=vsts
ansible_ssh_private_key_file=~/.ssh/windows_vsts
ansible_port=22
```

**Test Ansible connectivity:**

```bash
ansible windows -i inventory.ini -m ansible.windows.win_ping
```

---

## Quick Reference Commands

### SSH Connection (via IAP tunnel)

```bash
ssh -i ~/.ssh/windows_vsts -p 2222 vsts@localhost
```

### SSH Connection (direct to VM)

```bash
ssh -i ~/.ssh/windows_vsts vsts@<WINDOWS_VM_IP>
```

### Start IAP Tunnel

```bash
gcloud compute start-iap-tunnel VM_NAME 22 \
    --local-host-port=localhost:2222 \
    --zone=ZONE \
    --project=PROJECT_ID
```

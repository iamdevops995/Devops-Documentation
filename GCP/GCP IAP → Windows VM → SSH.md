# GCP IAP → Windows VM → SSH

## Overview

This guide explains how to build and test a secure SSH connection to a **Windows VM in Google Cloud Platform (GCP)** using **Identity-Aware Proxy (IAP)**.

The setup can be created in a personal GCP account for learning and testing.

## Architecture Diagram

![GCP IAP Architecture](/assets/images/diagrams/gcp-iap-architecture.svg)

The final architecture:

```text
Your PC
   |
   | gcloud + SSH
   v
GCP IAP
   |
   | TCP tunnel :22
   v
Private Windows VM
   |
   v
Windows OpenSSH
   |
   v
Windows User
```

The Windows VM does not need a public IP address for SSH access when using IAP.

---

# 1. Prerequisites

You need:

- A GCP account
- A GCP project
- Billing enabled
- Google Cloud CLI (`gcloud`) installed on your PC
- SSH client
- A Windows VM running in GCP
- Required IAM permissions for IAP and Compute Engine

Verify the Google Cloud CLI:

```bash
gcloud version
```

Authenticate:

```bash
gcloud auth login
```

Set the project:

```bash
gcloud config set project PROJECT_ID
```

Verify:

```bash
gcloud config get-value project
```

---

# 2. Create a VPC Network

Create a dedicated VPC for the lab:

```bash
gcloud compute networks create iap-lab-vpc \
    --subnet-mode=custom
```

Create a subnet:

```bash
gcloud compute networks subnets create iap-lab-subnet \
    --network=iap-lab-vpc \
    --region=REGION \
    --range=10.10.0.0/24
```

Example:

```bash
gcloud compute networks subnets create iap-lab-subnet \
    --network=iap-lab-vpc \
    --region=asia-south1 \
    --range=10.10.0.0/24
```

---

# 3. Create Firewall Rules

## Allow IAP TCP/22

IAP TCP forwarding uses Google's IAP TCP forwarding IP range.

Create a firewall rule allowing SSH from IAP:

```bash
gcloud compute firewall-rules create allow-iap-ssh \
    --network=iap-lab-vpc \
    --direction=INGRESS \
    --action=ALLOW \
    --rules=tcp:22 \
    --source-ranges=35.235.240.0/20
```

This allows IAP to reach TCP port `22` on the Windows VM.

---

# 4. Create the Windows VM

Create a Windows Server VM.

Example:

```bash
gcloud compute instances create windows-iap-vm \
    --zone=asia-south1-a \
    --machine-type=e2-standard-2 \
    --network=iap-lab-vpc \
    --subnet=iap-lab-subnet \
    --no-address \
    --image-family=windows-2022 \
    --image-project=windows-cloud
```

Important:

```text
--no-address
```

means the VM does **not** receive an external IP address.

The architecture is therefore:

```text
Internet
   X
   |
   X
Windows VM
   |
Private IP
```

Access will be provided through IAP.

---

# 5. Verify the Windows VM

List the VM:

```bash
gcloud compute instances list
```

Example:

```text
NAME              ZONE            INTERNAL_IP
windows-iap-vm    asia-south1-a   10.10.0.2
```

Confirm that there is no external IP:

```bash
gcloud compute instances describe windows-iap-vm \
    --zone=asia-south1-a \
    --format="get(networkInterfaces[0].accessConfigs)"
```

The result should be empty.

---

# 6. Configure Windows OpenSSH

Connect to the Windows VM using the GCP console or another available management method.

Install OpenSSH Server if it is not already installed.

Run PowerShell as Administrator:

```powershell
Get-WindowsCapability -Online |
    Where-Object Name -like 'OpenSSH.Server*'
```

Install:

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

Start the SSH service:

```powershell
Start-Service sshd
```

Configure the service to start automatically:

```powershell
Set-Service -Name sshd -StartupType Automatic
```

Verify:

```powershell
Get-Service sshd
```

Expected:

```text
Status   Name
------   ----
Running  sshd
```

---

# 7. Verify Windows SSH Port

Check port `22`:

```powershell
Get-NetTCPConnection -LocalPort 22
```

Expected:

```text
LocalPort    State
---------    -----
22           Listen
```

You can also check:

```powershell
netstat -ano | findstr :22
```

Expected:

```text
0.0.0.0:22
[::]:22
```

---

# 8. Create a Windows SSH User

Create a dedicated user for SSH automation.

Example:

```powershell
$Password = Read-Host "Enter password" -AsSecureString

New-LocalUser `
    -Name "vsts" `
    -Password $Password `
    -Description "SSH automation user"
```

Verify:

```powershell
Get-LocalUser vsts
```

If the account needs administrative access:

```powershell
Add-LocalGroupMember `
    -Group "Administrators" `
    -Member "vsts"
```

Verify:

```powershell
Get-LocalGroupMember Administrators
```

---

# 9. Generate an SSH Key Pair

On your Linux/Ubuntu PC:

```bash
ssh-keygen -t ed25519 -C "logesh-test"
```

Example:

```text
Enter file in which to save the key:
/home/logesh/.ssh/windows_vsts
```

This creates:

```text
~/.ssh/windows_vsts
~/.ssh/windows_vsts.pub
```

The files are:

```text
windows_vsts       -> Private key
windows_vsts.pub   -> Public key
```

The private key must remain on your PC.

---

# 10. Verify the SSH Key Fingerprint

Run:

```bash
ssh-keygen -lf ~/.ssh/windows_vsts.pub
```

Example:

```text
256 SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx logesh-test (ED25519)
```

The fingerprint is useful when troubleshooting authentication.

---

# 11. Configure Windows Authorized Keys

Create the SSH directory:

```powershell
New-Item `
    -ItemType Directory `
    -Path "C:\Users\vsts\.ssh" `
    -Force
```

Copy the public key into:

```text
C:\Users\vsts\.ssh\authorized_keys
```

The file should contain one public key per line.

Example:

```text
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... logesh-test
```

Verify:

```powershell
Get-Content "C:\Users\vsts\.ssh\authorized_keys"
```

---

# 12. Configure SSH Key Permissions

Check permissions:

```powershell
icacls "C:\Users\vsts\.ssh"
```

The `vsts` user should have access to the directory and authorized keys.

Example:

```text
BUILTIN\Administrators:(OI)(CI)(F)
NT AUTHORITY\SYSTEM:(OI)(CI)(F)
WINDOWS-IAP-VM\vsts:(OI)(CI)(F)
```

---

# 13. Check OpenSSH Configuration

The Windows OpenSSH configuration is located at:

```text
C:\ProgramData\ssh\sshd_config
```

Instead of using Notepad, PowerShell can be used to inspect it.

```powershell
Get-Content "C:\ProgramData\ssh\sshd_config"
```

Search for SSH key configuration:

```powershell
Select-String `
    -Path "C:\ProgramData\ssh\sshd_config" `
    -Pattern "Match Group|AuthorizedKeysFile"
```

Typical configuration:

```text
AuthorizedKeysFile .ssh/authorized_keys

Match Group administrators
    AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

---

# 14. Check Effective SSH Configuration

Use:

```powershell
sshd.exe -T
```

To check public-key authentication:

```powershell
sshd.exe -T |
    Select-String "authorizedkeysfile|pubkeyauthentication"
```

Expected:

```text
pubkeyauthentication yes
authorizedkeysfile .ssh/authorized_keys
```

This is useful because the effective configuration can differ from what is expected based only on the configuration file.

---

# 15. Restart OpenSSH

After configuration changes:

```powershell
Restart-Service sshd
```

Verify:

```powershell
Get-Service sshd
```

Expected:

```text
Running
```

---

# 16. Create the IAP Tunnel

From your PC, create an IAP TCP tunnel.

```bash
gcloud compute start-iap-tunnel windows-iap-vm 22 \
    --local-host-port=localhost:2222 \
    --zone=asia-south1-a
```

The tunnel looks like:

```text
Your PC
   |
localhost:2222
   |
   v
GCP IAP
   |
   | TCP 22
   v
Windows VM
   |
   | 10.10.0.2:22
   v
OpenSSH
```

Keep this terminal running.

---

# 17. Test SSH Through IAP

Open another terminal.

Test with:

```bash
ssh -p 2222 vsts@localhost
```

If password authentication is enabled, SSH may ask for the Windows password.

This confirms:

```text
PC
 |
 v
localhost:2222
 |
 v
IAP
 |
 v
Windows VM
 |
 v
OpenSSH
 |
 v
vsts
```

---

# 18. Test SSH Key Authentication

Use the private key:

```bash
ssh \
    -i ~/.ssh/windows_vsts \
    -p 2222 \
    vsts@localhost
```

To make sure the password is not being used:

```bash
ssh -vvv \
    -o PreferredAuthentications=publickey \
    -o PasswordAuthentication=no \
    -i ~/.ssh/windows_vsts \
    -p 2222 \
    vsts@localhost
```

The important debug message is:

```text
Offering public key:
 /home/logesh/.ssh/windows_vsts
```

A successful authentication should proceed without asking for a password.

---

# 19. Troubleshooting SSH Authentication

If authentication fails, use verbose SSH output:

```bash
ssh -vvv \
    -o PreferredAuthentications=publickey \
    -o PasswordAuthentication=no \
    -i ~/.ssh/windows_vsts \
    -p 2222 \
    vsts@localhost
```

Look for:

```text
Offering public key
```

If the server rejects it, check Windows OpenSSH logs.

---

# 20. Check Windows OpenSSH Logs

Run on Windows:

```powershell
Get-WinEvent `
    -LogName "OpenSSH/Operational" `
    -MaxEvents 30 |
    Format-List TimeCreated, Id, LevelDisplayName, Message
```

A failed public-key authentication may show:

```text
Failed publickey for vsts
```

A successful password authentication may show:

```text
Accepted password for vsts
```

Successful public-key authentication should show an accepted public-key authentication event.

---

# 21. Verify the Key Fingerprint

On Linux:

```bash
ssh-keygen -lf ~/.ssh/windows_vsts.pub
```

On Windows, if the public key is available:

```powershell
ssh-keygen -lf "C:\Users\vsts\.ssh\authorized_keys"
```

The fingerprints must match.

Example:

```text
Linux:
SHA256:5vPNWEBa1eSJ7ogODWq97igLyAficR0eF0HEmmDsNlQ

Windows:
SHA256:5vPNWEBa1eSJ7ogODWq97igLyAficR0eF0HEmmDsNlQ
```

---

# 22. GCP Metadata-Based SSH Keys

After the basic IAP + SSH setup is working, SSH keys can be managed through GCP VM metadata.

The concept is:

```text
GCP Project / VM Metadata
          |
          | Public SSH Key
          v
     Windows VM
          |
          v
      OpenSSH
          |
          v
     Windows User
```

The private key should never be stored in metadata.

Only the public key should be distributed.

---

# 23. Recommended Learning Sequence

Follow the implementation in this order:

```text
1. Create GCP project
       |
       v
2. Create VPC + subnet
       |
       v
3. Create private Windows VM
       |
       v
4. Configure Windows OpenSSH
       |
       v
5. Create IAP firewall rule
       |
       v
6. Create IAP tunnel
       |
       v
7. Test password SSH
       |
       v
8. Generate SSH key pair
       |
       v
9. Configure authorized_keys
       |
       v
10. Test public-key SSH
       |
       v
11. Move SSH key provisioning to GCP metadata
       |
       v
12. Automate with Terraform / Ansible
```

---

# 24. Final Architecture

## Traffic Flow Diagram

![GCP IAP Traffic Flow](/assets/images/diagrams/gcp-iap-traffic-flow.svg)

The completed learning environment will look like this:

```text
                       Your PC
                         |
                         |
                 gcloud + SSH
                         |
                         v
                 +---------------+
                 |    GCP IAP    |
                 |               |
                 | TCP forwarding|
                 +-------+-------+
                         |
                         | TCP 22
                         |
                         v
              +----------------------+
              |   Private Windows VM |
              |                      |
              |  Internal IP only    |
              |                      |
              |  OpenSSH :22         |
              +----------+-----------+
                         |
                         |
                         v
                 +---------------+
                 | Windows User  |
                 |     vsts      |
                 +---------------+
```

## Key Concept

The important distinction is:

```text
IAP
 |
 +-- Provides secure network connectivity
 |
 v
Windows OpenSSH
 |
 +-- Provides SSH authentication
 |
 v
SSH Public Key
 |
 +-- Authenticates the Windows user
 |
 v
Windows Session
```

This setup gives you a good foundation for learning how **GCP IAP, private VMs, Windows OpenSSH, SSH keys, VM metadata, Terraform, and Ansible** work together.
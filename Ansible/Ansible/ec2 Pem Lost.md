# EC2 PEM Key Recovery

<div class="page-header">
  <span class="difficulty-badge advanced">Advanced</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 20 min</span>
</div>

> Step-by-step guide to recover access to an EC2 instance when you've lost the SSH private key (.pem file).

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 🔧 **Recovery Process** | Step-by-step key recovery |
| 💾 **Volume Management** | Detach and reattach EBS volumes |
| 🔑 **Key Injection** | Add new SSH public key |
| ✅ **Verification** | Confirm recovered access |

---

## 🎓 Overview

!> ⚠️ **Lost your EC2 PEM key?** Don't panic! You can recover access by: 1) Using a helper instance to mount the volume, 2) Injecting a new public key, 3) Reattaching the volume to the original instance

### Prerequisites

- AWS Console access
- Ability to create EC2 instances
- A new or existing key pair you have access to

---

## 📋 Recovery Steps

### Step 1: Create a Helper EC2 Instance

?> **🔬 Lab:** Create a helper instance with the requirements below

| Requirement | Details |
|-------------|---------|
| **VPC** | Same VPC as target instance |
| **Availability Zone** | Same AZ as target instance ⚠️ Important |
| **Key Pair** | Use a known-good key pair (e.g., `helper-key.pem`) |
| **Security Group** | Allow inbound SSH (port 22) |
| **AMI** | Same OS family as target (Amazon Linux/Ubuntu) |

```bash
# Verify you have the helper key
ls -la ~/helper-key.pem
chmod 400 ~/helper-key.pem
```

---

### Step 2: Stop the Target EC2 Instance

!> ⚠️ **STOP, don't terminate!** Terminating will delete your instance and data.

1. Go to **EC2 → Instances**
2. Select the target instance (lost-key instance)
3. Click **Instance State → Stop Instance**
4. Wait for state to change to `Stopped`

---

### Step 3: Detach the Root EBS Volume

1. Go to **EC2 → Volumes**
2. Find the root volume of your stopped instance
   - Filter by: `attachment.instance-id = i-xxxxxxxxx`
3. Right-click → **Detach Volume**
4. Confirm detachment
5. Note the **Volume ID** (e.g., `vol-0abc123def456`)

> **How to identify the root volume:**
> - Check the "Attachment information" column
> - Root volume device is usually `/dev/sda1` or `/dev/xvda`

---

### Step 4: Attach Volume to Helper Instance

1. Select the detached volume
2. Right-click → **Attach Volume**
3. Select your **helper instance**
4. Device name: `/dev/sdf` (will appear as `/dev/xvdf` inside)
5. Click **Attach**

---

### Step 5: Login to Helper EC2 Instance

```bash
# SSH into helper instance
ssh -i helper-key.pem ec2-user@<helper-public-ip>

# For Ubuntu AMI
ssh -i helper-key.pem ubuntu@<helper-public-ip>
```

---

### Step 6: Mount the Secondary Volume

```bash
# List available disks
lsblk

# Create mount point
sudo mkdir /mnt/rescue

# Mount the volume (check actual device name with lsblk)
# Usually /dev/xvdf1 or /dev/nvme1n1p1
sudo mount /dev/xvdf1 /mnt/rescue

# Verify mount
df -h /mnt/rescue
ls -la /mnt/rescue/
```

> **Device naming varies by instance type:**

| Instance Type | Device Name |
|--------------|-------------|
| t2, m4 (older) | `/dev/xvdf1` |
| t3, m5 (nitro) | `/dev/nvme1n1p1` |

Use `lsblk` to confirm the actual device name.

---

### Step 7: Inject Your Public Key

#### For Amazon Linux / CentOS (ec2-user)

```bash
# Navigate to SSH directory
sudo mkdir -p /mnt/rescue/home/ec2-user/.ssh

# Copy your public key (Option A: Copy from helper)
sudo cp ~/.ssh/authorized_keys /mnt/rescue/home/ec2-user/.ssh/

# Option B: Add your public key directly
sudo bash -c 'echo "ssh-rsa AAAA...your-public-key... user@host" >> /mnt/rescue/home/ec2-user/.ssh/authorized_keys'

# Set correct permissions
sudo chown -R 1000:1000 /mnt/rescue/home/ec2-user/.ssh/
sudo chmod 700 /mnt/rescue/home/ec2-user/.ssh/
sudo chmod 600 /mnt/rescue/home/ec2-user/.ssh/authorized_keys

# Verify
cat /mnt/rescue/home/ec2-user/.ssh/authorized_keys
```

#### For Ubuntu (ubuntu user)

```bash
# Navigate to SSH directory
sudo mkdir -p /mnt/rescue/home/ubuntu/.ssh

# Copy your public key
sudo cp ~/.ssh/authorized_keys /mnt/rescue/home/ubuntu/.ssh/

# Set correct permissions
sudo chown -R 1000:1000 /mnt/rescue/home/ubuntu/.ssh/
sudo chmod 700 /mnt/rescue/home/ubuntu/.ssh/
sudo chmod 600 /mnt/rescue/home/ubuntu/.ssh/authorized_keys
```

#### For Root User (if needed)

```bash
sudo mkdir -p /mnt/rescue/root/.ssh
sudo cp ~/.ssh/authorized_keys /mnt/rescue/root/.ssh/
sudo chown root:root /mnt/rescue/root/.ssh/authorized_keys
sudo chmod 600 /mnt/rescue/root/.ssh/authorized_keys
```

---

### Step 8: Unmount and Detach Volume

```bash
# Unmount the volume
sudo umount /mnt/rescue

# Verify unmounted
df -h
```

In AWS Console:
1. Go to **EC2 → Volumes**
2. Select the volume
3. Right-click → **Detach Volume**

---

### Step 9: Reattach Volume to Original Instance

1. Select the volume
2. Right-click → **Attach Volume**
3. Select the **original (recovered) instance**
4. Device name: `/dev/sda1` (or original root device)
5. Click **Attach**

---

### Step 10: Start and Connect

```bash
# Start the original instance in AWS Console
# Wait for "running" state and status checks to pass

# Connect using the helper key
ssh -i helper-key.pem ec2-user@<recovered-instance-ip>

# For Ubuntu
ssh -i helper-key.pem ubuntu@<recovered-instance-ip>
```

?> ✅ **Success!** You should now have SSH access to your recovered instance.

---

### Step 11: Cleanup

```bash
# On recovered instance - verify access works
whoami
hostname
```

**AWS Console Cleanup:**
- ✅ Terminate helper instance (if no longer needed)
- ✅ Delete old key pair from AWS
- ✅ Update any automation scripts with new key
- ✅ Document the new key pair being used

---

## 💡 Prevention Tips

> **Avoid this situation in the future:**
> 1. **Backup your PEM keys** securely (password manager, encrypted storage)
> 2. **Use AWS Systems Manager Session Manager** (no SSH keys needed)
> 3. **Use EC2 Instance Connect** for temporary access
> 4. **Set up multiple key pairs** per instance
> 5. **Use Ansible AWX/Tower** with centralized key management

### Enable Session Manager (Recommended)

```bash
# Install SSM agent (usually pre-installed on Amazon Linux 2)
sudo yum install -y amazon-ssm-agent
sudo systemctl enable amazon-ssm-agent
sudo systemctl start amazon-ssm-agent
```

Then connect via AWS Console → Systems Manager → Session Manager.

---

## 📋 Quick Reference

| Step | Action |
|------|--------|
| 1 | Create helper instance (same AZ) |
| 2 | Stop target instance |
| 3 | Detach root volume |
| 4 | Attach to helper |
| 5 | SSH to helper |
| 6 | Mount volume |
| 7 | Add public key |
| 8 | Unmount & detach |
| 9 | Reattach to original |
| 10 | Start & connect |

---

## 🔗 Related Topics

- [Ansible Installation](Ansible%20Installations.md) - Set up Ansible with new keys
- [Ansible Vault](Ansible%20Vault.md) - Securely store credentials

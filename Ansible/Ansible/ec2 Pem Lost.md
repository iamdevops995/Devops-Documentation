#### Create the Helper EC2 Instance

--> *In the same VPC and Availability Zone as the target (lost-key) instance*
--> *Use a known-good .pem key pair (e.g., helper-key.pem) for future SSH*
--> *Ensure the security group allows inbound SSH (port 22)*

#### Stop the Target EC2 Instance

--> *Important: Don't terminate it—just stop it*
#### Detach the Root EBS Volume

--> *Identify the root volume of the stopped target instance from the EC2 → Volumes section*
--> *Right-click → Detach Volume*
#### Attach to Helper Instance

--> *Attach the volume to the helper instance*
--> *Suggested device name: /dev/sdf (will be seen as /dev/xvdf1 inside instance)*
#### Login to Helper EC2 Instance

```shell
ssh -i helper-key.pem ec2-user@<helper-public-ip>
```

#### Mount the Secondary Volume

```bash
sudo mkdir /mnt/rescue
sudo mount /dev/xvdf1 /mnt/rescue

```
#### Inject Your Public Key
```bash
sudo mkdir -p /mnt/rescue/root/.ssh
sudo cp ~/.ssh/authorized_keys /mnt/rescue/root/.ssh/  # Or echo your public key directly
sudo chown root:root /mnt/rescue/root/.ssh/authorized_keys
sudo chmod 600 /mnt/rescue/root/.ssh/authorized_keys
```
#### Unmount and Detach Volume

```bash
sudo umount /mnt/rescue
```
#### Reattach the Volume to the Original Instance

--> *Attach as /dev/sda1 (original root device)*
--> *Start the original instance*

#### SSH into the Recovered Instance

```bash
ssh -i helper-key.pem root@<recovered-instance-ip>
```
#### Cleanup

--> *Terminate the helper instance if it’s no longer needed*
--> *Rotate credentials and verify access policies*
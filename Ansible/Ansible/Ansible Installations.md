*Run Instructions :* Install Ansible Using Python VirtualEnv

#### Install Ansible

**Verify Python3 is installed.**

```shell
python3 --version
apt install python3-pip
```

**If Missing Install python3**

```shell
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.8
sudo apt install python3-pip
python3 --version
```

**Install Dependencies**

```shell
sudo apt-get install python3-minimal python3-virtualenv python3-dev build-essential
```

**Set up virtualenv**

```shell
mkdir ansible
cd ansible
virtualenv myansible
```

**Activate Virtual Env**

```shell
source myansible/bin/activate
```

**Install Ansible**

```shell
pip3 install ansible
```

**Verify Ansible version**

```shell
ansible --version
```

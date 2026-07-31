#!/bin/bash

set -e

echo "==============================================="
echo " Creating DevOps Documentation Structure"
echo "==============================================="

# Root directories
directories=(
    "assets"
    "assets/css"
    "assets/js"
    "assets/images"

    "AWS"
    "Azure"
    "GCP"
    "Kubernetes"
    "Docker"
    "Terraform"
    "Ansible"
    "Jenkins"
    "PowerShell"
    "Linux"
    "Git"
    "Networking"
    "Security"
    "Monitoring"
    "Interview"
    "RCA"
    "Troubleshooting"
)

# Create directories
for dir in "${directories[@]}"; do
    mkdir -p "$dir"
    echo "Created: $dir"
done

echo ""
echo "==============================================="
echo " Creating placeholder README.md files"
echo "==============================================="

# Create README.md for each section
sections=(
    AWS
    Azure
    GCP
    Kubernetes
    Docker
    Terraform
    Ansible
    Jenkins
    PowerShell
    Linux
    Git
    Networking
    Security
    Monitoring
    Interview
    RCA
    Troubleshooting
)

for section in "${sections[@]}"; do
cat <<EOF > "$section/README.md"
# $section

> Documentation coming soon.

EOF
echo "Created: $section/README.md"
done

echo ""
echo "==============================================="
echo " Creating root files"
echo "==============================================="

touch index.html
touch README.md
touch _sidebar.md
touch _navbar.md
touch coverpage.md
touch .nojekyll

echo "Created: index.html"
echo "Created: README.md"
echo "Created: _sidebar.md"
echo "Created: _navbar.md"
echo "Created: coverpage.md"
echo "Created: .nojekyll"

echo ""
echo "==============================================="
echo " Project structure created successfully!"
echo "==============================================="

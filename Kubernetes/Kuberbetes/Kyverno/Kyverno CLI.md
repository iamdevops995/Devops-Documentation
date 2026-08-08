## Why Kyverno CLI?

### Simplifying Policy Testing

Kyverno CLI offers a simplified way to test policies against Kubernetes resources without applying them to a live cluster. This approach helps identify potential issues or misconfigurations before they can impact the cluster.

### Fast Feedback Loop

By testing policies locally, developers and administrators can quickly iterate over policy definitions, receiving immediate feedback. This accelerates the development and refinement of policies.

### Integration into CI/CD Pipelines

Kyverno CLI can be integrated into Continuous Integration/Continuous Deployment (CI/CD) pipelines, automating policy compliance checks as part of the deployment process. This ensures that only compliant resources are deployed to the cluster.

## Installing Kyverno CLI

Kyverno CLI can be installed on Linux, macOS, and Windows platforms. Below are the steps for each platform.

### Linux

```sh
curl -L -o kyverno https://github.com/kyverno/kyverno/releases/download/v1.5.2/kyverno-cli_v1.5.2_linux_x86_64
chmod +x kyverno
sudo mv kyverno /usr/local/bin/
```

```
curl -LO https://github.com/kyverno/kyverno/releases/download/v1.12.0/kyverno-cli_v1.12.0_linux_x86_64.tar.gz
tar -xvf kyverno-cli_v1.12.0_linux_x86_64.tar.gz
sudo cp kyverno /usr/local/bin/
```

![[Pasted image 20251120182155.png]]

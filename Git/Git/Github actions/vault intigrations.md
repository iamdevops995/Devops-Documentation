# HashiCorp Vault Integration with GitHub Actions

<div class="page-header">
  <span class="difficulty-badge advanced">Advanced</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 30 min</span>
</div>

> Learn how to integrate HashiCorp Vault with GitHub Actions for secure secrets management.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 🔐 **JWT Authentication** | Configure Vault for GitHub OIDC |
| 📝 **Create Policies** | Define access permissions |
| 🔗 **Configure Roles** | Map GitHub repos to Vault roles |
| 🚀 **Use in Workflows** | Access Vault secrets in Actions |

---

## 🎓 Prerequisites

> **Before You Begin:**
> - HashiCorp Vault server (running and accessible)
> - Vault CLI installed
> - Admin access to Vault
> - GitHub repository with Actions enabled

---

## 🔧 Step 1: Enable JWT Authentication

First, enable the JWT auth method in Vault.

```bash
# Check existing auth methods
vault auth list
```

**Output:**

```
Path      Type     Accessor               Description
----      ----     --------               -----------
token/    token    auth_token_5b9c251a    token based credentials
```

**Enable JWT auth:**

```bash
vault auth enable jwt
```

**Output:**

```
Success! Enabled jwt auth method at: jwt/
```


---

## 🔧 Step 2: Configure JWT Auth

Configure JWT auth to trust GitHub's OIDC provider.

```bash
vault write auth/jwt/config \
  bound_issuer="https://token.actions.githubusercontent.com" \
  jwks_url="https://token.actions.githubusercontent.com/.well-known/jwks"
```

**Output:**

```
Success! Data written to: auth/jwt/config
```

**Verify configuration:**

```bash
vault read auth/jwt/config
```

---

## 🔧 Step 3: Create Vault Policy

Create a policy that defines what secrets GitHub Actions can access.

**Create policy file `github-policy.hcl`:**

```hcl
# Allow GitHub Actions to read secrets
path "kv/data/github/*" {
  capabilities = ["read"]
}

# Allow listing metadata (optional but recommended)
path "kv/metadata/github/*" {
  capabilities = ["list"]
}

# Allow reading specific application secrets
path "kv/data/myapp/*" {
  capabilities = ["read"]
}
```

**Upload the policy:**

```bash
vault policy write github-policy github-policy.hcl
```

**Output:**

```
Success! Uploaded policy: github-policy
```

**Verify policy:**

```bash
vault policy read github-policy
```

---

## 🔧 Step 4: Create JWT Role

Create a role that maps GitHub repository to Vault policy.

```bash
vault write auth/jwt/role/github \
  role_type="jwt" \
  user_claim="sub" \
  bound_audiences="sts.amazonaws.com" \
  bound_subject="repo:iamdevops995/GitHub-action-1:ref:refs/heads/main" \
  policies="github-policy" \
  ttl="45m"
```

**Output:**

```
Success! Data written to: auth/jwt/role/github
```

### Role Parameters Explained

| Parameter | Description |
|-----------|-------------|
| `role_type` | Set to `jwt` for JWT authentication |
| `user_claim` | Claim to use for user identity (`sub` recommended) |
| `bound_audiences` | Expected audience claim |
| `bound_subject` | GitHub repo and ref pattern to allow |
| `policies` | Vault policies to attach |
| `ttl` | Token time-to-live |

### Bound Subject Patterns

| Pattern | Allows |
|---------|--------|
| `repo:owner/repo:ref:refs/heads/main` | Only main branch |
| `repo:owner/repo:ref:refs/heads/*` | Any branch |
| `repo:owner/repo:pull_request` | Pull requests |
| `repo:owner/repo:environment:prod` | Specific environment |

---

## 🔧 Step 5: Store Secrets in Vault

Store secrets that GitHub Actions will access.

```bash
# Enable KV secrets engine (if not already enabled)
vault secrets enable -path=kv kv-v2

# Store a secret
vault kv put kv/github/myapp \
  api_key="super-secret-api-key" \
  database_url="postgres://user:pass@host:5432/db"

# Verify
vault kv get kv/github/myapp
```

---

## 🚀 Step 6: Use Vault in GitHub Actions

### Using hashicorp/vault-action

```yaml
name: Deploy with Vault Secrets

on:
  push:
    branches: [main]

permissions:
  id-token: write   # Required for OIDC
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Import Secrets from Vault
        uses: hashicorp/vault-action@v2
        id: secrets
        with:
          url: https://vault.example.com:8200
          method: jwt
          role: github
          secrets: |
            kv/data/github/myapp api_key | API_KEY ;
            kv/data/github/myapp database_url | DATABASE_URL
      
      - name: Use Secrets
        run: |
          echo "Deploying with secrets..."
          # Secrets are available as environment variables
          # ${{ steps.secrets.outputs.API_KEY }}
        env:
          API_KEY: ${{ steps.secrets.outputs.API_KEY }}
          DATABASE_URL: ${{ steps.secrets.outputs.DATABASE_URL }}
```

### Using Vault CLI Directly

```yaml
- name: Authenticate to Vault
  run: |
    export VAULT_ADDR="https://vault.example.com:8200"
    export VAULT_TOKEN=$(vault write -field=token auth/jwt/login \
      role=github \
      jwt=${{ secrets.GITHUB_TOKEN }})
    
    # Get secrets
    vault kv get -field=api_key kv/github/myapp
```

---

## 📋 Complete Vault Setup Summary

```bash
# 1. Enable JWT auth
vault auth enable jwt

# 2. Configure JWT auth for GitHub
vault write auth/jwt/config \
  bound_issuer="https://token.actions.githubusercontent.com" \
  jwks_url="https://token.actions.githubusercontent.com/.well-known/jwks"

# 3. Create policy
vault policy write github-policy github-policy.hcl

# 4. Create role
vault write auth/jwt/role/github \
  role_type="jwt" \
  user_claim="sub" \
  bound_audiences="sts.amazonaws.com" \
  bound_subject="repo:OWNER/REPO:ref:refs/heads/main" \
  policies="github-policy" \
  ttl="45m"

# 5. Store secrets
vault kv put kv/github/myapp api_key="secret-value"
```

---

## ❌ Troubleshooting

### Error: Permission Denied

**Cause:** Policy doesn't allow access to the path.

**Solution:** Check policy paths match secret paths:

```bash
vault policy read github-policy
```

### Error: Invalid Role

**Cause:** `bound_subject` doesn't match the workflow context.

**Solution:** Verify the repository and ref pattern:

```bash
vault read auth/jwt/role/github
```

### Error: Token Expired

**Cause:** TTL too short for workflow duration.

**Solution:** Increase TTL:

```bash
vault write auth/jwt/role/github ttl="2h"
```

---

## 💡 Best Practices

| Practice | Description |
|----------|-------------|
| 🔒 **Least Privilege** | Grant minimal required permissions |
| ⏰ **Short TTL** | Use short token lifetimes |
| 🎯 **Specific Bindings** | Bind to specific repos and branches |
| 📝 **Audit Logging** | Enable Vault audit logs |
| 🔄 **Rotate Secrets** | Regularly rotate stored secrets |

---

## 🔗 Next Steps

- [GitHub Actions Intro](/Git/Git/Github%20actions/GitHub%20Actions%20Intro.md) - Fundamentals
- [Configure Workflows](/Git/Git/Github%20actions/Configure%20Actions%20Workflow.md) - Events and triggers
- [Git Overview](/Git/README.md) - Return to Git documentation

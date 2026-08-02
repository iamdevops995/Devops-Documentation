# Configure GitHub Actions Workflow

<div class="page-header">
  <span class="difficulty-badge intermediate">Intermediate</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 20 min</span>
</div>

> Learn how to configure workflow triggers, events, and conditional execution.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| ⏰ **Scheduled Events** | Run workflows on a schedule |
| 🪝 **Webhook Events** | Trigger on GitHub events |
| 🖱️ **Manual Events** | User-triggered workflows |
| 🔀 **Conditional Keywords** | Control execution flow |
| 🐛 **Debug Logging** | Enable verbose logging |

---

## ⏰ Scheduled Events

Configure workflows to run at specific times using POSIX cron syntax.

### Cron Syntax

| Field | Values | Description |
|-------|--------|-------------|
| 1st | 0-59 | Minute |
| 2nd | 0-23 | Hour |
| 3rd | 1-31 | Day of month |
| 4th | 1-12 | Month |
| 5th | 0-6 | Day of week (0=Sunday) |


### Examples

**Run every 15 minutes:**

```yaml
on:
  schedule:
    - cron: '*/15 * * * *'
```

**Run every Sunday at 3 AM UTC:**

```yaml
on:
  schedule:
    - cron: '0 3 * * SUN'
```

**Run at midnight on the first of each month:**

```yaml
on:
  schedule:
    - cron: '0 0 1 * *'
```

?> **Note:** Scheduled workflows run on the default branch only.

---

## 🪝 Webhook Events

Trigger workflows when specific GitHub events occur.

### Common Webhook Events

| Event | Trigger |
|-------|---------|
| `push` | Code pushed to repository |
| `pull_request` | PR opened, synced, or reopened |
| `issues` | Issue created or modified |
| `release` | Release published |
| `workflow_dispatch` | Manual trigger |

### Filter by Activity Type

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
  
  issues:
    types: [opened, labeled]
  
  check_run:
    types: [rerequested, requested_action]
```

### Filter by Branch

```yaml
on:
  push:
    branches:
      - main
      - 'releases/**'
    branches-ignore:
      - 'feature/**'
```

### Filter by Path

```yaml
on:
  push:
    paths:
      - 'src/**'
      - '*.js'
    paths-ignore:
      - 'docs/**'
      - '*.md'
```

---

## 🖱️ Manual Events

### workflow_dispatch

Manually trigger workflows from the GitHub UI or REST API.

```yaml
name: Manual Deployment

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
      
      log_level:
        description: 'Log verbosity level'
        required: false
        default: 'warning'
        type: string
      
      dry_run:
        description: 'Run without making changes'
        required: false
        default: false
        type: boolean

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: |
          echo "Environment: ${{ inputs.environment }}"
          echo "Log Level: ${{ inputs.log_level }}"
          echo "Dry Run: ${{ inputs.dry_run }}"
```

**Trigger via REST API:**

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/actions/workflows/deploy.yml/dispatches \
  -d '{"ref":"main","inputs":{"environment":"production"}}'
```

### repository_dispatch

Trigger workflows from external systems.

```yaml
name: External Trigger

on:
  repository_dispatch:
    types: [run-tests, deploy-to-prod]

jobs:
  handle-dispatch:
    runs-on: ubuntu-latest
    steps:
      - name: Process event
        run: |
          echo "Event type: ${{ github.event.action }}"
          echo "Payload: ${{ github.event.client_payload.env }}"
```

**Trigger via REST API:**

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/dispatches \
  -d '{"event_type":"run-tests","client_payload":{"env":"staging"}}'
```

!> Requires a Personal Access Token (PAT) with `repo` scope.

---

## 🔀 Conditional Keywords

Control job and step execution with `if` conditionals.

### Basic Conditional

```yaml
jobs:
  production-deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: ./deploy.sh
```

### Common Conditions

| Condition | Description |
|-----------|-------------|
| `github.ref == 'refs/heads/main'` | Only on main branch |
| `github.event_name == 'push'` | Only on push events |
| `contains(github.event.head_commit.message, '[skip ci]')` | Check commit message |
| `github.actor == 'dependabot[bot]'` | Check who triggered |
| `success()` | Previous steps succeeded |
| `failure()` | Any previous step failed |
| `always()` | Run regardless of status |
| `cancelled()` | Workflow was cancelled |

### Examples

**Run only on PRs from specific user:**

```yaml
jobs:
  review:
    if: github.event_name == 'pull_request' && github.actor != 'dependabot[bot]'
    runs-on: ubuntu-latest
```

**Run cleanup even on failure:**

```yaml
steps:
  - name: Tests
    run: npm test
  
  - name: Cleanup
    if: always()
    run: ./cleanup.sh
```

**Skip CI based on commit message:**

```yaml
jobs:
  build:
    if: "!contains(github.event.head_commit.message, '[skip ci]')"
```

---

## 🐛 Enable Debug Logging

When default logs aren't enough, enable debug logging.

### Enable Runner Debug Logging

Add repository secret:
- **Name:** `ACTIONS_RUNNER_DEBUG`
- **Value:** `true`

### Enable Step Debug Logging

Add repository secret:
- **Name:** `ACTIONS_STEP_DEBUG`
- **Value:** `true`

?> Both require admin access to the repository to set.

---

## 📊 Context Objects

Access workflow information through context objects.

### Common Contexts

| Context | Description | Example |
|---------|-------------|---------|
| `github` | Workflow run info | `github.ref`, `github.actor` |
| `env` | Environment variables | `env.MY_VAR` |
| `job` | Current job info | `job.status` |
| `steps` | Step outputs | `steps.build.outputs.result` |
| `runner` | Runner info | `runner.os`, `runner.arch` |
| `secrets` | Repository secrets | `secrets.API_KEY` |
| `inputs` | Workflow inputs | `inputs.environment` |

### Using Contexts

```yaml
jobs:
  info:
    runs-on: ubuntu-latest
    steps:
      - name: Show context info
        run: |
          echo "Repository: ${{ github.repository }}"
          echo "Branch: ${{ github.ref_name }}"
          echo "Actor: ${{ github.actor }}"
          echo "Runner OS: ${{ runner.os }}"
          echo "Event: ${{ github.event_name }}"
```

---

## 📋 Quick Reference

| Trigger Type | Syntax |
|--------------|--------|
| Push | `on: push` |
| Pull Request | `on: pull_request` |
| Schedule | `on: schedule: - cron: '...'` |
| Manual | `on: workflow_dispatch` |
| External | `on: repository_dispatch` |
| Multiple | `on: [push, pull_request]` |

---

## 🔗 Next Steps

- [GitHub Actions Intro](/Git/Git/Github%20actions/GitHub%20Actions%20Intro.md) - Fundamentals
- [Custom Actions](/Git/Git/Github%20actions/Custom%20action.md) - Build your own
- [Vault Integration](/Git/Git/Github%20actions/vault%20intigrations.md) - Secrets management
- [Git Overview](/Git/README.md) - Return to Git documentation

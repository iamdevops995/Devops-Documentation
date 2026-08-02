# GitHub Actions Introduction

<div class="page-header">
  <span class="difficulty-badge beginner">Beginner</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 20 min</span>
</div>

> Learn the fundamentals of GitHub Actions for CI/CD automation.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 🤖 **What is GitHub Actions** | Understanding CI/CD automation |
| 📝 **Action Types** | Container, JavaScript, and Composite actions |
| 🔄 **Workflows** | Creating automated pipelines |
| 🧩 **Components** | Jobs, Steps, Actions, and Runners |

---

## 🎓 What is GitHub Actions?

**GitHub Actions** are packaged scripts to automate tasks in a software development workflow. You can configure GitHub Actions to trigger complex workflows that meet your organization's needs.

?> **Key Benefits:**
> - Automate builds, tests, and deployments
> - Trigger on code changes, schedules, or manual events
> - Reduce development time with reliable automation
> - Integrate with thousands of community actions

---

## 📦 Types of GitHub Actions

| Type | Environment | Languages | Speed | Best For |
|------|-------------|-----------|-------|----------|
| **Container Actions** | Docker | Any | Slower | Custom environments |
| **JavaScript Actions** | Node.js VM | JavaScript | Faster | Cross-platform |
| **Composite Actions** | Shell | Any | Fast | Bundling commands |


### Container Actions

The environment is part of the action's code. These actions run in a consistent, isolated environment because all dependencies are within the container.

```yaml
# Container action example
runs:
  using: 'docker'
  image: 'Dockerfile'
```

?> **Pros:** Consistent environment, supports any language
!> **Cons:** Slower execution, Linux only

### JavaScript Actions

Run directly on the runner machine. The action code is separate from the execution environment.

```yaml
# JavaScript action example
runs:
  using: 'node20'
  main: 'index.js'
```

?> **Pros:** Fast execution, cross-platform (Linux, macOS, Windows)

### Composite Actions

Combine multiple workflow steps into a single reusable action.

```yaml
# Composite action example
runs:
  using: 'composite'
  steps:
    - run: npm install
      shell: bash
    - run: npm test
      shell: bash
```

?> **Pros:** Easy to create, reuse existing scripts

---

## 🔄 What is a Workflow?

A **workflow** is a configurable automated process made up of one or more jobs. Workflows are defined in YAML files stored in `.github/workflows/` directory.

### Basic Workflow Structure

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
```

---

## 🧩 Workflow Components

### 1. Workflows

The automated process defined in a YAML file.

| Property | Description |
|----------|-------------|
| `name` | Display name for the workflow |
| `on` | Events that trigger the workflow |
| `jobs` | Collection of jobs to execute |

### 2. Jobs

A section of the workflow associated with a runner.

| Property | Description |
|----------|-------------|
| `runs-on` | Runner type (e.g., `ubuntu-latest`) |
| `steps` | Sequential tasks within the job |
| `needs` | Job dependencies |
| `if` | Conditional execution |

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
  
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

### 3. Steps

Individual tasks within a job. Steps run sequentially.

| Property | Description |
|----------|-------------|
| `name` | Step description |
| `uses` | Action to execute |
| `run` | Shell command to run |
| `with` | Input parameters |
| `env` | Environment variables |

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v4
  
  - name: Run custom script
    run: |
      echo "Hello, World!"
      npm run build
    env:
      NODE_ENV: production
```

### 4. Actions

Standalone commands that can be:
- **Community actions**: `uses: actions/checkout@v4`
- **Custom actions**: `uses: ./.github/actions/my-action`
- **Docker actions**: `uses: docker://image:tag`

### 5. Runners

The machines that execute your workflows.

| Runner Type | Description |
|-------------|-------------|
| **GitHub-hosted** | Virtual machines managed by GitHub |
| **Self-hosted** | Your own machines |

```yaml
jobs:
  build:
    runs-on: ubuntu-latest    # GitHub-hosted
    
  deploy:
    runs-on: self-hosted      # Self-hosted
```

---

## 📋 Workflow File Location

```
repository/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── release.yml
├── src/
└── package.json
```

---

## 🔗 Next Steps

- [Configure Workflows](/Git/Git/Github%20actions/Configure%20Actions%20Workflow.md) - Events and triggers
- [Custom Actions](/Git/Git/Github%20actions/Custom%20action.md) - Build your own actions
- [Vault Integration](/Git/Git/Github%20actions/vault%20intigrations.md) - Secrets management
- [Git Overview](/Git/README.md) - Return to Git documentation

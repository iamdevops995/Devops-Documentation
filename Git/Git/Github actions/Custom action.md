# Creating Custom GitHub Actions

<div class="page-header">
  <span class="difficulty-badge intermediate">Intermediate</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 25 min</span>
</div>

> Learn how to build Docker container, JavaScript, and Composite actions.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 🐳 **Docker Actions** | Build containerized actions |
| 📦 **JavaScript Actions** | Create Node.js-based actions |
| 🔗 **Composite Actions** | Bundle workflow steps |
| 🔄 **Action Lifecycle** | Understand execution flow |

---

## 🐳 Docker Container Actions

Docker containers package the environment with the action code, providing a consistent and reliable execution environment.

?> **Best For:** Actions requiring specific OS configurations or languages other than JavaScript.

### Prerequisites

- Basic understanding of Docker
- Dockerfile knowledge
- Environment variables familiarity

### Files Required

```
my-docker-action/
├── action.yml          # Action metadata
├── Dockerfile          # Docker image definition
├── entrypoint.sh       # Entry point script
└── README.md           # Documentation
```


### Step 1: Create action.yml

```yaml
name: 'My Docker Action'
description: 'A custom Docker container action'
author: 'Your Name'

inputs:
  greeting:
    description: 'Who to greet'
    required: true
    default: 'World'

outputs:
  response:
    description: 'The greeting response'

runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.greeting }}
```

### Step 2: Create Dockerfile

```dockerfile
FROM alpine:3.18

RUN apk add --no-cache bash

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
```

### Step 3: Create entrypoint.sh

```bash
#!/bin/bash

GREETING=$1
echo "Hello, $GREETING!"

# Set output
echo "response=Hello, $GREETING!" >> $GITHUB_OUTPUT
```

### Step 4: Use the Action

```yaml
- name: Run my action
  uses: ./my-docker-action
  with:
    greeting: 'DevOps Team'
```

!> ⚠️ Docker container actions only run on Linux runners.

---

## 📦 JavaScript Actions

JavaScript actions run directly on the runner machine without containerization, making them faster and cross-platform.

?> **Best For:** Cross-platform actions, faster execution, simpler setup.

### Prerequisites

- Node.js installed
- npm knowledge
- GitHub Actions Toolkit (optional but recommended)

### Files Required

```
my-js-action/
├── action.yml          # Action metadata
├── index.js            # Main action code
├── package.json        # Dependencies
├── node_modules/       # Installed packages
└── README.md           # Documentation
```

### Step 1: Initialize Project

```bash
mkdir my-js-action && cd my-js-action
npm init -y
npm install @actions/core @actions/github
```

### Step 2: Create action.yml

```yaml
name: 'My JavaScript Action'
description: 'A custom JavaScript action'
author: 'Your Name'

inputs:
  name:
    description: 'Name to greet'
    required: true
    default: 'World'

outputs:
  greeting:
    description: 'The greeting message'

runs:
  using: 'node20'
  main: 'index.js'
```

### Step 3: Create index.js

```javascript
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // Get input
    const name = core.getInput('name');
    
    // Log to console
    console.log(`Hello, ${name}!`);
    
    // Get context info
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`Event payload: ${payload}`);
    
    // Set output
    core.setOutput('greeting', `Hello, ${name}!`);
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
```

### Step 4: Use the Action

```yaml
- name: Run my JS action
  id: greet
  uses: ./my-js-action
  with:
    name: 'DevOps Engineer'

- name: Use output
  run: echo "Result: ${{ steps.greet.outputs.greeting }}"
```

---

## 🔗 Composite Actions

Composite actions bundle multiple workflow steps together, perfect for reusing shell scripts across workflows.

?> **Best For:** Reusing existing scripts, combining multiple commands.

### Files Required

```
my-composite-action/
├── action.yml          # Action metadata with steps
└── README.md           # Documentation
```

### Create action.yml

```yaml
name: 'Build and Test'
description: 'Composite action for build and test'
author: 'Your Name'

inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '20'

outputs:
  test-result:
    description: 'Test results'
    value: ${{ steps.test.outputs.result }}

runs:
  using: 'composite'
  steps:
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
    
    - name: Install dependencies
      run: npm ci
      shell: bash
    
    - name: Build
      run: npm run build
      shell: bash
    
    - name: Test
      id: test
      run: |
        npm test
        echo "result=passed" >> $GITHUB_OUTPUT
      shell: bash
```

### Use the Action

```yaml
- name: Build and Test
  uses: ./my-composite-action
  with:
    node-version: '20'
```

---

## 🔄 Docker Action Lifecycle

Understanding how Docker actions execute:

| Step | Description |
|------|-------------|
| **1. Workflow Trigger** | Event triggers workflow (`push`, `pull_request`, etc.) |
| **2. Runner Setup** | GitHub provisions a fresh VM |
| **3. Action Resolution** | GitHub identifies `runs.using: docker` |
| **4. Image Build/Pull** | Docker image is built from Dockerfile |
| **5. Container Execution** | Container runs with workspace mounted |
| **6. Entrypoint Runs** | Custom script executes inside container |
| **7. Result Handling** | Outputs captured, container destroyed |

!> Docker containers run in clean, isolated environments. All dependencies must be in the Dockerfile.

---

## 📋 Action Type Comparison

| Feature | Docker | JavaScript | Composite |
|---------|--------|------------|-----------|
| **Speed** | Slower | Fast | Fast |
| **Platform** | Linux only | All | All |
| **Environment** | Isolated | Shared | Shared |
| **Languages** | Any | JavaScript | Any (shell) |
| **Complexity** | Higher | Medium | Lower |

---

## 💡 Best Practices

### 1. Version Your Actions

```yaml
# Use specific versions
- uses: actions/checkout@v4
- uses: my-org/my-action@v1.2.0
```

### 2. Validate Inputs

```javascript
const input = core.getInput('required-input', { required: true });
if (!input) {
  core.setFailed('required-input is required');
}
```

### 3. Handle Errors

```javascript
try {
  // Action logic
} catch (error) {
  core.setFailed(`Action failed: ${error.message}`);
}
```

### 4. Document Your Action

Include a comprehensive README.md with:
- Description and usage
- Input/output documentation
- Examples
- Requirements

---

## 🔗 Next Steps

- [Configure Workflows](/Git/Git/Github%20actions/Configure%20Actions%20Workflow.md) - Events and triggers
- [GitHub Actions Intro](/Git/Git/Github%20actions/GitHub%20Actions%20Intro.md) - Basics
- [Git Overview](/Git/README.md) - Return to Git documentation

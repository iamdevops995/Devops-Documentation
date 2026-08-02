# GitHub Actions Practice Questions

<div class="page-header">
  <span class="difficulty-badge intermediate">Interview Prep</span>
  <span class="time-badge"><i class="fas fa-clock"></i> Practice</span>
</div>

> Practice questions and answers for GitHub Actions certification and interviews.

---

## 📚 Topics Covered

| Category | Description |
|----------|-------------|
| 🔧 **Workflow Configuration** | YAML syntax and structure |
| 🔐 **Security** | Secrets, permissions, and access |
| 📦 **Artifacts & Caching** | Data persistence between jobs |
| 🖥️ **Runners** | Self-hosted vs GitHub-hosted |
| 🤖 **Custom Actions** | Building and using actions |

---

## 📝 Practice Questions

### Question 1: Workflow Indentation

**Q:** Refer to the exhibit and select the line with wrong indentation.

```yaml
name: CI
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
```

**A:** The `uses` keyword should be at the same indentation level as `name` within a step. The correct format uses actions with the `uses:` keyword for pre-built actions from the marketplace.

---

### Question 2: Debug Logging

**Q:** How can you enable step debug logging for a workflow?

**A:** Set the `ACTIONS_STEP_DEBUG` secret or environment variable to `true` in the repository settings.

?> **Reference:** [GitHub Docs - Enabling debug logging](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging)

---

### Question 3: Self-Hosted Runner Autoscaling

**Q:** Which event can be used to autoscale self-hosted runners?

**A:** Webhook events can be used to automatically scale self-hosted runners.

?> **Reference:** [GitHub Docs - Autoscaling with self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/autoscaling-with-self-hosted-runners)

---

### Question 4: Artifacts vs Caching

**Q:** Which statement is TRUE about storing workflow data as artifacts?

**A:** Use artifacts when you want to save files produced by a job to view after a workflow run has ended, such as built binaries or build logs.

---

### Question 5: Docker Image Sharing

**Q:** How can you guarantee a Docker image built in one step is accessible for pushing in another step?

**A:** Use artifacts to upload the image and download it in the subsequent job.

---

### Question 6: CodeQL Setup

**Q:** Which action sets up CodeQL tools for scanning within GitHub Actions?

**A:** `github/codeql-action/init@v3`

This action:
1. Initializes the CodeQL environment on the runner
2. Downloads and installs necessary CodeQL tools and libraries

---

### Question 7: Private Action Storage

**Q:** You're building an action for internal use only. What's the recommended storage location?

**A:** Store actions in the `.github` directory. For example: `.github/actions/action-a`

---

### Question 8: Service Containers

**Q:** How can a job step access a service container named `mongodb-service`?

**A:** `mongodb://mongodb-service:27017`

When jobs run in containers on the same user-defined bridge network, all ports are exposed to each other.

---

### Question 9: Self-Hosted Runner Logs

**Q:** Where are log files stored for self-hosted runners?

**A:** Log files are kept in the `_diag` directory.

---

### Question 10: Docker Action Platforms

**Q:** On which runners can Docker container actions execute?

**A:** Linux only. Docker container actions can only execute on runners with a Linux operating system.

---

### Question 11: Private Repository Actions

**Q:** Can actions in private repositories be used by other repositories?

**A:** Yes, but only by other private repositories owned by the same organization or user. They cannot be used in public repositories.

---

### Question 12: Deprecation Warnings

**Q:** Can you set a deprecation warning in an action's metadata file?

**A:** Yes, using `inputs.<input_id>.deprecationMessage`

---

### Question 13: Deleting Artifacts

**Q:** What methods can delete GitHub Action artifacts?

**A:** 
- Using GitHub REST API
- GitHub Actions UI
- Setting retention period
- Default 90-day auto-deletion

---

### Question 14: Workflow Failure Diagnosis

**Q:** What's the first step when diagnosing a failed workflow?

**A:** Examine the workflow run details page, focusing on overall job statuses and error messages.

---

### Question 15: Reusable Workflow Variables

**Q:** How can a reusable workflow access environment variables from the caller workflow?

**A:** Environment variables defined in the caller workflow's `env` context are NOT propagated. Use `inputs` or repository variables instead.

---

### Question 16: Step-Level Environment Variables

**Q:** Can step-level environment variables be accessed by consecutive steps?

**A:** No. Custom environment variables specified at a step level can only be used in that step alone.

---

### Question 17: Conditional Secrets

**Q:** How do you conditionally run a step based on whether a secret exists?

**A:** Secrets cannot be directly referenced in `if:` conditionals. Set the secret as an environment variable first:

```yaml
env:
  api_key_variable: ${{ secrets.PROD_API_KEY }}
steps:
  - name: Access Secret
    if: env.api_key_variable != ''
    run: echo "Secret exists"
```

---

### Question 18: Job Dependencies

**Q:** If a `build` job fails, what happens to dependent and independent jobs?

**A:** 
- Dependent jobs (with `needs: build`) are skipped
- Independent jobs run normally

---

### Question 19: Concurrency Cancellation

**Q:** Can a workflow cancel in-progress jobs when receiving a new trigger?

**A:** Yes, using the `concurrency` key with `cancel-in-progress: true`

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

---

### Question 20: Container Registry Push Permissions

**Q:** What permission is needed to push images to GitHub Container Registry?

**A:** `packages: write` permission

```yaml
permissions:
  packages: write
```

---

## 📋 Quick Reference Links

| Topic | Documentation |
|-------|---------------|
| Workflow syntax | [GitHub Docs](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions) |
| Contexts | [GitHub Docs](https://docs.github.com/en/actions/learn-github-actions/contexts) |
| Expressions | [GitHub Docs](https://docs.github.com/en/actions/learn-github-actions/expressions) |
| Secrets | [GitHub Docs](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) |

---

## 🔗 Next Steps

- [GitHub Actions Intro](/Git/Git/Github%20actions/GitHub%20Actions%20Intro.md) - Fundamentals
- [Configure Workflows](/Git/Git/Github%20actions/Configure%20Actions%20Workflow.md) - Events and triggers
- [Git Overview](/Git/README.md) - Return to Git documentation

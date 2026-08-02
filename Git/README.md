# Git

<div class="page-header">
  <span class="difficulty-badge beginner">Beginner to Advanced</span>
  <span class="time-badge"><i class="fas fa-clock"></i> Comprehensive Guide</span>
</div>

> Master Git version control - from everyday commands to advanced recovery techniques.

---

## 📚 What You'll Learn

| Topic | Description |
|-------|-------------|
| 🌿 **Branching** | Trunk-based vs GitFlow, naming conventions, protection rules |
| 🔀 **Merging & Rebasing** | Fast-forward, merge commits, interactive rebase, conflict resolution |
| ⏪ **Undo & Recovery** | reset vs revert vs restore, reflog recovery, removing files from history |
| 🪝 **Hooks** | Client-side and server-side hooks, pre-commit checks |
| 📦 **Stash** | Temporarily save work without committing |
| 🗜️ **Squashing** | Combine multiple commits into one |
| ⚡ **Aliases** | Productivity shortcuts for common commands |
| 🤖 **GitHub Actions** | CI/CD automation with GitHub workflows |

---

## 🌿 Branching

### Branching Strategies

| Strategy | Best For | Description |
|----------|----------|-------------|
| **Trunk-Based** | Small teams, CI/CD | Short-lived branches, frequent merges to main |
| **GitFlow** | Release cycles | Dedicated develop, release, and hotfix branches |
| **GitHub Flow** | Web apps | Simple feature branch → main workflow |

### Branch Naming Conventions

```bash
# Feature branches
feature/add-user-authentication
feature/JIRA-123-payment-integration

# Bug fixes
bugfix/fix-login-redirect
fix/JIRA-456-null-pointer

# Hotfixes (production)
hotfix/security-patch-v2.1
hotfix/critical-payment-bug

# Release branches
release/v1.2.0
release/2024-Q1
```

### Branch Protection Rules

?> **Recommended Settings** for `main` branch:

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Restrict who can push to matching branches

---

## 🔀 Merging and Rebasing

### Merge Types Comparison

| Type | Command | Result | When to Use |
|------|---------|--------|-------------|
| **Fast-Forward** | `git merge --ff-only feature` | Linear history | Feature is ahead of main |
| **Merge Commit** | `git merge --no-ff feature` | Merge commit created | Preserve branch history |
| **Squash Merge** | `git merge --squash feature` | Single commit | Clean history |

### Interactive Rebase

```bash
# Rebase last 5 commits
git rebase -i HEAD~5

# Rebase onto main
git rebase -i main
```

**Rebase Commands:**
| Command | Action |
|---------|--------|
| `pick` | Keep commit as-is |
| `reword` | Keep commit, edit message |
| `edit` | Stop for amending |
| `squash` | Combine with previous commit |
| `fixup` | Combine, discard message |
| `drop` | Remove commit |

### Conflict Resolution

```bash
# View conflicting files
git status

# After resolving conflicts
git add <resolved-files>
git rebase --continue   # If rebasing
git merge --continue    # If merging

# Abort if needed
git rebase --abort
git merge --abort
```

!> ⚠️ **Golden Rule:** Never rebase commits that have been pushed to a shared branch.

---

## ⏪ Undo and Recovery

### Comparison: reset vs revert vs restore

| Command | Scope | History | Use Case |
|---------|-------|---------|----------|
| `git reset` | Commits | Rewrites | Undo local commits |
| `git revert` | Commits | Preserves | Undo shared commits |
| `git restore` | Files | N/A | Discard file changes |

### Reset Modes

```bash
# Soft: Keep changes staged
git reset --soft HEAD~1

# Mixed (default): Keep changes unstaged
git reset HEAD~1

# Hard: Discard all changes
git reset --hard HEAD~1
```

### Recover with Reflog

```bash
# View reflog
git reflog

# Recover lost commit
git checkout <commit-hash>
git branch recovery-branch

# Or reset to recovered commit
git reset --hard <commit-hash>
```

### Remove Files from History

```bash
# Using git-filter-repo (recommended)
pip install git-filter-repo

# Remove file from all history
git filter-repo --path secrets.txt --invert-paths

# Remove folder
git filter-repo --path config/secrets/ --invert-paths
```

---

## 🪝 Hooks

### Client-Side Hooks

| Hook | Trigger | Use Case |
|------|---------|----------|
| `pre-commit` | Before commit | Lint, format, tests |
| `prepare-commit-msg` | Before editor opens | Template messages |
| `commit-msg` | After message entered | Validate format |
| `pre-push` | Before push | Run full test suite |

### Example Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linting
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Fix errors before committing."
    exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Fix tests before committing."
    exit 1
fi

echo "✅ Pre-commit checks passed!"
exit 0
```

### Server-Side Hooks

| Hook | Trigger | Use Case |
|------|---------|----------|
| `pre-receive` | Before accepting push | Validate commits |
| `update` | Per branch update | Branch-specific rules |
| `post-receive` | After push completes | Deploy, notify |

---

## 📖 Git Learning Resources

| Topic | Documentation |
|-------|---------------|
| [Git Stash](/Git/Git/Git%20stash.md) | Temporarily save uncommitted changes |
| [Git Squashing](/Git/Git/Git%20Squashing.md) | Combine multiple commits |
| [Git Aliases](/Git/Git/Git%20Aliases.md) | Productivity shortcuts |
| [Author Rewrite](/Git/Author-rewrite.md) | Fix commit author information |
| [GitHub Actions](/Git/Git/Github%20actions/GitHub%20Actions%20Intro.md) | CI/CD automation |

---

## 🔗 Quick Reference

```bash
# Essential Commands
git status              # Check working directory state
git log --oneline -10   # View recent commits
git diff                # View unstaged changes
git diff --staged       # View staged changes

# Branching
git branch -a           # List all branches
git checkout -b feature # Create and switch branch
git branch -d feature   # Delete merged branch
git branch -D feature   # Force delete branch

# Remote Operations
git fetch --all         # Fetch all remotes
git pull --rebase       # Pull with rebase
git push -u origin main # Push and set upstream
```

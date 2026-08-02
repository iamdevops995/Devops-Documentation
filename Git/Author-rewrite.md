# Fix Git Commit Author

<div class="page-header">
  <span class="difficulty-badge intermediate">Intermediate</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 15 min</span>
</div>

> Learn how to change Git commit author information after commits have been pushed to GitHub.

---

## 📚 What You'll Learn

| Objective | Description |
|:----------|:------------|
| 🔍 **Understand the Issue** | Why commits show wrong author |
| ✏️ **Fix Last Commit** | Amend single commit author |
| 🔄 **Fix Multiple Commits** | Interactive rebase for recent commits |
| 🗄️ **Fix Entire Repository** | Using git-filter-repo for bulk changes |
| 🚀 **Push Changes** | Force push rewritten history safely |

---

## 🎓 Prerequisites

Before you begin, ensure you have:

- Git installed on your system
- Access to the repository you want to modify
- Python/pip installed (for git-filter-repo method)

!> ⚠️ **Warning:** Rewriting Git history affects all collaborators. Coordinate with your team before force pushing.

---

## ❓ Why Does This Happen?

Git stores **three different pieces of information**:

| Item | Used For |
|:-----|:---------|
| **GitHub Account** | Authentication (Push/Pull) |
| **Git Username** (`user.name`) | Commit Author Name |
| **Git Email** (`user.email`) | Commit Author Email |

When you push to GitHub, authentication uses your PAT, SSH key, or credential manager. However, the **commit author** comes from your local Git configuration.

**Example Problem:**

```
Commit: Move user profile to bottom footer
Author: Vibilesh <vibilesh@example.com>   ← Wrong!
Expected: Logesh Kumar <iamdevops995@gmail.com>
```

?> The commit author is set at commit time, not push time.

---

## 🔍 Check Current Git Configuration

**Global configuration:**

```bash
git config --global user.name
git config --global user.email
```

**Repository-specific configuration:**

```bash
git config --local user.name
git config --local user.email
```

**View all configurations with source:**

```bash
git config --list --show-origin
```

---

## ⚙️ Update Git Author Configuration

Set the correct author information for future commits:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Verify the change:**

```bash
git config --global --list
```

?> Use the email associated with your GitHub account so commits are properly linked to your profile.

---

## ✏️ Method 1: Fix Only the Last Commit

If only the latest commit has the wrong author:

```bash
git commit --amend --author="Your Name <your.email@example.com>" --no-edit
```

**Verify the change:**

```bash
git log --format=fuller -1
```

**Push the updated commit:**

```bash
git push --force-with-lease
```

---

## 🔄 Method 2: Fix Multiple Recent Commits

If the last few commits have the wrong author, use interactive rebase:

**Step 1: Start interactive rebase**

```bash
git rebase -i HEAD~5    # Replace 5 with number of commits
```

**Step 2: Mark commits for editing**

Change `pick` to `edit` for each commit you want to fix:

```
edit a1b2c3d Commit message 1
edit b2c3d4e Commit message 2
pick c3d4e5f Commit message 3 (keep this one)
```

**Step 3: Amend each stopped commit**

```bash
git commit --amend --author="Your Name <your.email@example.com>" --no-edit
git rebase --continue
```

Repeat for each commit marked with `edit`.

**Step 4: Push the changes**

```bash
git push --force-with-lease
```

---

## 🗄️ Method 3: Fix Entire Repository

For many commits (20, 30, 100+), use **git-filter-repo**.

### Install git-filter-repo

```bash
pip install git-filter-repo
```

**Verify installation:**

```bash
git filter-repo --version
```

### Rewrite All Commits

```bash
git filter-repo --force \
    --name-callback 'return b"Your Name"' \
    --email-callback 'return b"your.email@example.com"'
```

!> ⚠️ This rewrites ALL commits in the repository.

### Re-add Remote (Required)

After running `git filter-repo`, the remote is intentionally removed:

```bash
# Check remotes (will be empty)
git remote -v

# Add remote back
git remote add origin https://github.com/username/repository.git

# Or using SSH
git remote add origin git@github.com:username/repository.git
```

### Push Rewritten History

```bash
# Push specific branch
git push --force -u origin main

# Push all branches
git push --force --all

# Push all tags
git push --force --tags
```

---

## ❌ Common Errors & Solutions

### Error: Invalid Author Format

```
fatal: --author is not 'Name <email>'
```

**Wrong:**

```bash
git commit --amend --author="Name email@example.com"
```

**Correct:**

```bash
git commit --amend --author="Name <email@example.com>"
```

---

### Error: No Push Destination

```
fatal: No configured push destination
```

**Solution:** Re-add the remote:

```bash
git remote add origin <repository-url>
```

---

### Error: Origin Not Found

```
fatal: 'origin' does not appear to be a git repository
```

**Solution:** Add the remote:

```bash
git remote add origin https://github.com/username/repository.git
```

---

## ✅ Verify Commit Authors

**Show author for all commits:**

```bash
git log --pretty=format:"%h %an <%ae>"
```

**Detailed view:**

```bash
git log --format=fuller
```

**Latest commit only:**

```bash
git log --format=fuller -1
```

---

## 💡 Best Practices

| Practice | Description |
|:---------|:------------|
| ⚙️ **Configure Early** | Set `user.name` and `user.email` before first commit |
| 📧 **Use GitHub Email** | Match your GitHub account email |
| 🛡️ **Safe Force Push** | Use `--force-with-lease` instead of `--force` |
| 🤝 **Coordinate** | Inform collaborators before force pushing |
| 📝 **Rewrite Sparingly** | Only rewrite history when necessary |

---

## 📋 Quick Reference

| Scenario | Solution |
|:---------|:---------|
| Wrong author on last commit | `git commit --amend --author="..."` |
| Wrong author on few commits | Interactive rebase with `edit` |
| Wrong author on many commits | `git filter-repo` |
| Remote disappeared | `git remote add origin <url>` |
| Push rewritten history | `git push --force-with-lease` |

---

## 🔗 References

- [Git Commit Documentation](https://git-scm.com/docs/git-commit)
- [Git Rebase Documentation](https://git-scm.com/docs/git-rebase)
- [Git Filter Repo](https://github.com/newren/git-filter-repo)

---

## 🔗 Next Steps

- [Git Stash](/Git/Git/Git%20stash.md) - Save work temporarily
- [Git Squashing](/Git/Git/Git%20Squashing.md) - Combine commits
- [Git Overview](/Git/README.md) - Return to Git documentation

---
title: Fix Git Commit Author After Pushing to GitHub
description: Learn how to change Git commit author information after commits have been pushed to GitHub using git commit --amend, git rebase, and git filter-repo.
tags:
  - Git
  - GitHub
  - Version Control
  - DevOps
  - Troubleshooting
---

# Fix Git Commit Author After Pushing to GitHub

Sometimes you may notice that your GitHub commits show an incorrect author name, even though you pushed them using your own GitHub account.

For example:

```
Move user profile to bottom footer

Author:
Vibilesh
```

Instead of:

```
Logesh Kumar
```

This guide explains why it happens and how to fix it.

---

# Why does this happen?

Git stores **three different pieces of information**:

| Item | Used For |
|-------|----------|
| GitHub Account | Authentication (Push/Pull) |
| Git Username (`user.name`) | Commit Author Name |
| Git Email (`user.email`) | Commit Author Email |

When you push to GitHub, authentication is performed using:

- Personal Access Token (PAT)
- SSH Key
- Git Credential Manager

However, the **commit author** comes from your local Git configuration.

Example:

```bash
git config --global user.name
git config --global user.email
```

Output:

```text
Vibilesh
Vibilesh@example.com
```

Every commit created with this configuration will use that author.

---

# Check Current Git Configuration

Global configuration:

```bash
git config --global user.name
git config --global user.email
```

Repository-specific configuration:

```bash
git config --local user.name
git config --local user.email
```

View everything:

```bash
git config --list --show-origin
```

---

# Update Git Author

Configure the correct author information.

```bash
git config --global user.name "Logesh Kumar"
git config --global user.email "iamdevops995@gmail.com"
```

Verify:

```bash
git config --global --list
```

---

# Fix Only the Last Commit

If only the latest commit has the wrong author:

```bash
git commit --amend --author="Logesh Kumar <iamdevops995@gmail.com>" --no-edit
```

Verify:

```bash
git log --format=fuller -1
```

Example:

```
Author: Logesh Kumar <iamdevops995@gmail.com>
```

Push the updated commit:

```bash
git push --force-with-lease
```

---

# Fix Multiple Recent Commits

If the last few commits have the wrong author:

```bash
git rebase -i HEAD~5
```

Replace every

```
pick
```

with

```
edit
```

For every stopped commit:

```bash
git commit --amend --author="Logesh Kumar <iamdevops995@gmail.com>" --no-edit
git rebase --continue
```

Finally:

```bash
git push --force-with-lease
```

---

# Fix an Entire Repository (Recommended)

If **many commits** (20, 30, 100+) have the wrong author, use **git-filter-repo**.

Install:

```bash
pip install git-filter-repo
```

Verify:

```bash
git filter-repo --version
```

Rewrite every commit:

```bash
git filter-repo --force \
    --name-callback '
return b"Logesh Kumar"
' \
    --email-callback '
return b"iamdevops995@gmail.com"
'
```

This updates every commit in the repository.

---

# Why Did My Remote Disappear?

After running `git filter-repo`, you may see:

```
fatal: No configured push destination
```

or

```
fatal: 'origin' does not appear to be a git repository
```

This is expected.

**git-filter-repo intentionally removes the remote** to prevent accidentally force-pushing rewritten history.

Check:

```bash
git remote -v
```

Output:

```
(no output)
```

---

# Add the Remote Again

HTTPS:

```bash
git remote add origin https://github.com/<username>/<repository>.git
```

SSH:

```bash
git remote add origin git@github.com:<username>/<repository>.git
```

Verify:

```bash
git remote -v
```

Example:

```
origin  https://github.com/iamdevops995/Devops-Documentation.git (fetch)
origin  https://github.com/iamdevops995/Devops-Documentation.git (push)
```

---

# Push Rewritten History

Push a branch:

```bash
git push --force -u origin docsify-redesign
```

Push all branches:

```bash
git push --force --all
```

Push tags:

```bash
git push --force --tags
```

---

# Common Errors

## Error 1

```
fatal: --author is not 'Name <email>'
```

Wrong:

```bash
git commit --amend --author="Logesh Kumar iamdevops995@gmail.com"
```

Correct:

```bash
git commit --amend --author="Logesh Kumar <iamdevops995@gmail.com>"
```

---

## Error 2

```
fatal: No configured push destination
```

Reason:

Remote repository has been removed.

Solution:

```bash
git remote add origin <repository-url>
```

---

## Error 3

```
fatal: 'origin' does not appear to be a git repository
```

Reason:

No remote named `origin` exists.

Solution:

```bash
git remote add origin https://github.com/<username>/<repository>.git
```

---

# Verify Commit Authors

Show author information:

```bash
git log --pretty=format:"%h %an <%ae>"
```

Detailed view:

```bash
git log --format=fuller
```

Latest commit only:

```bash
git log --format=fuller -1
```

---

# Best Practices

- Configure `user.name` and `user.email` before making your first commit.
- Use the email associated with your GitHub account.
- Prefer `git push --force-with-lease` instead of `--force`.
- Rewrite history only when necessary.
- Avoid force-pushing shared branches without coordinating with collaborators.

---

# Summary

| Scenario | Solution |
|----------|----------|
| Wrong author on last commit | `git commit --amend` |
| Wrong author on a few commits | Interactive rebase |
| Wrong author on many commits | `git filter-repo` |
| Remote disappeared | Re-add `origin` |
| Need to update GitHub | Force push rewritten history |

---

# References

- Git Commit Documentation: https://git-scm.com/docs/git-commit
- Git Rebase Documentation: https://git-scm.com/docs/git-rebase
- Git Filter Repo: https://github.com/newren/git-filter-repo
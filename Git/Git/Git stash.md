# Git Stash

<div class="page-header">
  <span class="difficulty-badge beginner">Beginner</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 10 min</span>
</div>

> Learn how to temporarily save uncommitted changes using Git Stash.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 💾 **Save Changes** | Stash modified and staged files |
| 📋 **List Stashes** | View your stash history |
| 🔄 **Restore Changes** | Apply or pop stashed work |
| 🗑️ **Manage Stashes** | Delete and organize stashes |
| 🌿 **Create Branches** | Convert stash to a new branch |

---

## 🎓 What is Git Stash?

Git Stash temporarily saves your uncommitted changes (modified, staged, or untracked files) so you can switch branches, pull updates, or work on something else without losing progress.

?> **Think of it as:** A clipboard for your work-in-progress code.

---

## 🤔 When Should You Use Git Stash?

| Scenario | Why Stash Helps |
|----------|-----------------|
| 🔀 Switching branches with uncommitted changes | Avoid "uncommitted changes" error |
| 📥 Pulling remote updates | Clean working directory required |
| 🧪 Temporarily storing experimental code | Test something else quickly |
| 🚫 Avoiding "WIP" commits | Keep commit history clean |

---

## 🔧 Essential Git Stash Commands

### 1. Stash Your Changes

**Save all modified and staged files (excluding untracked):**

```bash
git stash
```

**Save including untracked files:**

```bash
git stash -u
# or
git stash --include-untracked
```

**Save with a descriptive message:**

```bash
git stash save "Feature X - WIP login form"
# or (newer syntax)
git stash push -m "Feature X - WIP login form"
```

**Stash only specific files:**

```bash
git stash push -m "Partial stash" -- file1.js file2.js
```

---

### 2. List All Stashes

View your stash history:

```bash
git stash list
```

**Example Output:**

```
stash@{0}: On main: Feature X - WIP login form
stash@{1}: On dev: Bugfix Y - partial implementation
stash@{2}: WIP on main: abc1234 Previous commit message
```

?> **Note:** Stashes are numbered from `0` (most recent) to `n` (oldest).

---

### 3. Apply (Restore) a Stash

**Restore the latest stash (keeps it in the stash list):**

```bash
git stash apply
```

**Restore a specific stash:**

```bash
git stash apply stash@{1}
```

**Apply and restore staged state:**

```bash
git stash apply --index
```

!> ⚠️ `apply` keeps the stash in the list. Use `pop` to apply and remove it.

---

### 4. Pop a Stash (Apply & Delete)

**Restore the latest stash and remove it from the list:**

```bash
git stash pop
```

**Pop a specific stash:**

```bash
git stash pop stash@{2}
```

---

### 5. View Stash Contents

**Show what's in a stash:**

```bash
git stash show
```

**Show with full diff:**

```bash
git stash show -p
# or
git stash show --patch
```

**Show specific stash:**

```bash
git stash show -p stash@{1}
```

---

### 6. Delete Stashes

**Remove a specific stash:**

```bash
git stash drop stash@{1}
```

**Clear all stashes:**

```bash
git stash clear
```

!> ⚠️ **Warning:** `git stash clear` permanently deletes all stashes. Use with caution!

---

### 7. Create a Branch from a Stash

If your stash conflicts with current changes, create a new branch:

```bash
git stash branch new-feature-branch
```

**From a specific stash:**

```bash
git stash branch new-branch stash@{1}
```

?> This creates a new branch, checks it out, applies the stash, and drops it if successful.

---

## 📋 Quick Reference

| Command | Description |
|---------|-------------|
| `git stash` | Stash tracked changes |
| `git stash -u` | Include untracked files |
| `git stash push -m "msg"` | Stash with message |
| `git stash list` | List all stashes |
| `git stash show -p` | View stash contents |
| `git stash apply` | Apply latest stash (keep in list) |
| `git stash pop` | Apply and remove latest stash |
| `git stash drop stash@{n}` | Delete specific stash |
| `git stash clear` | Delete all stashes |
| `git stash branch <name>` | Create branch from stash |

---

## 💡 Pro Tips

### Stash with Keep-Index

Keep staged changes while stashing unstaged:

```bash
git stash --keep-index
```

### Stash Everything Including Ignored Files

```bash
git stash --all
```

### Interactive Stashing

Choose which hunks to stash:

```bash
git stash -p
# or
git stash --patch
```

---

## 🔗 Next Steps

- [Git Squashing](/Git/Git/Git%20Squashing.md) - Combine multiple commits
- [Git Aliases](/Git/Git/Git%20Aliases.md) - Productivity shortcuts
- [Git Overview](/Git/README.md) - Return to Git documentation

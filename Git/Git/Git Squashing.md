# Git Squashing

<div class="page-header">
  <span class="difficulty-badge intermediate">Intermediate</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 15 min</span>
</div>

> Learn how to combine multiple commits into a single, clean commit using Git squash.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| 🗜️ **Interactive Rebase** | Squash commits using rebase |
| ⚡ **Quick Squash** | Squash all commits into one |
| 📝 **Edit Messages** | Combine and rewrite commit messages |
| 🔄 **Push Updates** | Force push squashed commits |

---

## 🎓 What is Git Squashing?

Squashing combines multiple commits into a single commit. This is useful for:

| Use Case | Benefit |
|----------|---------|
| 🧹 **Clean History** | Remove "WIP" and "fix typo" commits |
| 📦 **Feature Commits** | One commit per feature/PR |
| 👀 **Code Review** | Easier to review single commits |
| 📋 **Changelog** | Cleaner release notes |

---

## 🔧 Method 1: Interactive Rebase

### Step-by-Step Example

**1. Create test commits:**

```bash
# Create first commit
echo "Mario" > game.txt
git add game.txt
git commit -m "Add Mario"

# Create second commit
echo "Mario & Luigi" > game.txt
git commit -a -m "Add Luigi"

# Create third commit
echo "Mario & Luigi & Peach" > game.txt
git commit -a -m "Add Peach"
```

**2. Verify commits:**

```bash
git log --oneline
```

**Output:**

```
c3d4e5f (HEAD -> main) Add Peach
b2c3d4e Add Luigi
a1b2c3d Add Mario
```

**3. Start interactive rebase:**

```bash
git rebase -i HEAD~3
```

**4. Editor opens with:**

```
pick a1b2c3d Add Mario
pick b2c3d4e Add Luigi
pick c3d4e5f Add Peach
```

**5. Change `pick` to `squash` (or `s`):**

```
pick a1b2c3d Add Mario
squash b2c3d4e Add Luigi
squash c3d4e5f Add Peach
```

**6. Save and close. New editor opens for commit message:**

```
# This is a combination of 3 commits.
# This is the 1st commit message:

Add Mario

# This is the commit message #2:

Add Luigi

# This is the commit message #3:

Add Peach
```

**7. Write your new combined message:**

```
Add all game characters

- Added Mario as the main character
- Added Luigi as player 2
- Added Princess Peach
```

**8. Save and close. Verify:**

```bash
git log --oneline
```

**Output:**

```
f6g7h8i (HEAD -> main) Add all game characters
```

---

## ⚡ Method 2: Quick Squash All Commits

**Squash entire repository history into one commit:**

```bash
# Reset to first commit, keep changes staged
git reset --soft $(git rev-list --max-parents=0 HEAD)

# Create new single commit
git commit -m "Initial commit with all features"
```

!> ⚠️ **Warning:** This rewrites ALL history. Only use on personal branches or new repos.

---

## 🔀 Method 3: Squash Merge

**Squash when merging a feature branch:**

```bash
# On main branch
git merge --squash feature-branch

# Creates staged changes, then commit
git commit -m "Add feature X (squashed from feature-branch)"
```

?> This is the cleanest way to bring feature work into main with a single commit.

---

## 📤 Push Squashed Commits

After squashing commits that were already pushed:

```bash
# Force push (use with caution!)
git push --force-with-lease origin branch-name
```

!> ⚠️ **Warning:** Never force push to shared branches without team coordination!

**Safer alternative:**

```bash
# Only force push if no one else has pushed
git push --force-with-lease
```

---

## 📋 Rebase Commands Reference

Use these commands in the interactive rebase editor:

| Command | Short | Action |
|:--------|:-----:|:-------|
| `pick` | `p` | Keep commit as-is |
| `reword` | `r` | Keep commit, edit message |
| `edit` | `e` | Stop for amending |
| `squash` | `s` | Combine with previous, keep message |
| `fixup` | `f` | Combine with previous, discard message |
| `drop` | `d` | Remove commit entirely |

---

## ❌ Common Errors & Solutions

### Error 1: Invalid Upstream

```
fatal: invalid upstream 'HEAD~2'
```

**Cause:** Not enough commits exist.

**Solution:**

```bash
# Use --root for first commits
git rebase -i --root
```

### Error 2: Conflicts During Rebase

```
CONFLICT (content): Merge conflict in file.txt
```

**Solution:**

```bash
# Fix conflicts manually, then
git add <resolved-files>
git rebase --continue

# Or abort
git rebase --abort
```

### Error 3: Push Rejected

```
! [rejected] main -> main (non-fast-forward)
```

**Solution:**

```bash
git push --force-with-lease origin main
```

---

## 💡 Pro Tips

### Autosquash with Fixup Commits

```bash
# Create a fixup commit for a specific commit
git commit --fixup=<commit-hash>

# Later, autosquash during rebase
git rebase -i --autosquash HEAD~5
```

### Squash Last N Commits Quickly

```bash
# Squash last 3 commits
git reset --soft HEAD~3
git commit -m "Combined commit message"
```

### Configure Default Rebase Editor

```bash
# Use VS Code
git config --global core.editor "code --wait"

# Use Vim
git config --global core.editor "vim"
```

---

## 📋 Quick Reference

| Task | Command |
|------|---------|
| Squash last N commits | `git rebase -i HEAD~N` |
| Squash all history | `git reset --soft $(git rev-list --max-parents=0 HEAD)` |
| Squash merge branch | `git merge --squash feature-branch` |
| Force push after squash | `git push --force-with-lease` |
| Abort rebase | `git rebase --abort` |

---

## 🔗 Next Steps

- [Git Stash](/Git/Git/Git%20stash.md) - Save work temporarily
- [Git Aliases](/Git/Git/Git%20Aliases.md) - Productivity shortcuts
- [Git Overview](/Git/README.md) - Return to Git documentation

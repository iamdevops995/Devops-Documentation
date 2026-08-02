# Git Aliases

<div class="page-header">
  <span class="difficulty-badge beginner">Beginner</span>
  <span class="time-badge"><i class="fas fa-clock"></i> 5 min</span>
</div>

> Boost your Git productivity with powerful shell aliases from Oh My Zsh.

---

## 📚 What You'll Learn

| Objective | Description |
|-----------|-------------|
| ⚡ **Common Aliases** | Frequently used Git shortcuts |
| 📝 **Commit Aliases** | Faster commits and amendments |
| 🌿 **Branch Aliases** | Quick branch management |
| 🔄 **Sync Aliases** | Pull and push shortcuts |

---

## 🎓 Prerequisites

> These aliases are from the [Oh My Zsh Git plugin](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git).
> Install Oh My Zsh and enable the git plugin in your `.zshrc`.

---

## ⚡ Most Common Aliases

| Alias | Command | Description |
|:------|:--------|:------------|
| `g` | `git` | Git shortcut |
| `gst` | `git status` | Check status |
| `gss` | `git status --short` | Short status |
| `ga` | `git add` | Stage files |
| `gaa` | `git add --all` | Stage all files |
| `gc` | `git commit --verbose` | Commit with diff |
| `gcmsg` | `git commit --message` | Commit with message |
| `gd` | `git diff` | View changes |
| `gds` | `git diff --staged` | View staged changes |
| `gl` | `git pull` | Pull changes |
| `gp` | `git push` | Push changes |


---

## 📝 Commit Aliases

| Alias | Command | Description |
|:------|:--------|:------------|
| `gc` | `git commit --verbose` | Commit with diff shown |
| `gc!` | `git commit --verbose --amend` | Amend last commit |
| `gca` | `git commit --verbose --all` | Commit all tracked |
| `gca!` | `git commit --verbose --all --amend` | Amend with all changes |
| `gcam` | `git commit --all --message` | Commit all with message |
| `gcan!` | `git commit --verbose --all --no-edit --amend` | Amend without editing |
| `gcmsg` | `git commit --message` | Commit with message |
| `gcsm` | `git commit --signoff --message` | Signed commit |
| `gcs` | `git commit -S` | GPG signed commit |
| `gcf` | `git config --list` | List config |
| `gcfu` | `git commit --fixup` | Create fixup commit |

---

## 🌿 Branch Aliases

| Alias | Command | Description |
|:------|:--------|:------------|
| `gb` | `git branch` | List branches |
| `gba` | `git branch --all` | List all branches |
| `gbd` | `git branch --delete` | Delete branch |
| `gbD` | `git branch --delete --force` | Force delete branch |
| `gbm` | `git branch --move` | Rename branch |
| `gbnm` | `git branch --no-merged` | List unmerged branches |
| `gbr` | `git branch --remote` | List remote branches |
| `gco` | `git checkout` | Checkout branch |
| `gcb` | `git checkout -b` | Create and checkout branch |
| `gcd` | `git checkout $(git_develop_branch)` | Checkout develop |
| `gcm` | `git checkout $(git_main_branch)` | Checkout main |
| `gsw` | `git switch` | Switch branch |
| `gswc` | `git switch -c` | Create and switch branch |

---

## 🔄 Sync Aliases (Pull/Push)

| Alias | Command | Description |
|:------|:--------|:------------|
| `gl` | `git pull` | Pull changes |
| `gpr` | `git pull --rebase` | Pull with rebase |
| `gpra` | `git pull --rebase --autostash` | Rebase with autostash |
| `gp` | `git push` | Push changes |
| `gpf` | `git push --force-with-lease` | Safe force push |
| `gpf!` | `git push --force` | Force push (dangerous) |
| `gpsup` | `git push --set-upstream origin $(branch)` | Push and set upstream |
| `ggpull` | `git pull origin "$(current_branch)"` | Pull current branch |
| `ggpush` | `git push origin "$(current_branch)"` | Push current branch |
| `gpoat` | `git push origin --all && git push origin --tags` | Push all + tags |

---

## 🔍 Log Aliases

| Alias | Command | Description |
|:------|:--------|:------------|
| `glog` | `git log --oneline --decorate --graph` | Pretty graph log |
| `gloga` | `git log --oneline --decorate --graph --all` | Graph all branches |
| `glo` | `git log --oneline --decorate` | One-line log |
| `glol` | `git log --graph --pretty=format` | Detailed graph |
| `glg` | `git log --stat` | Log with stats |
| `glgp` | `git log --stat --patch` | Log with diff |

---

## 🗃️ Stash Aliases

| Alias | Command | Description |
|:------|:--------|:------------|
| `gsta` | `git stash push` | Stash changes |
| `gstaa` | `git stash apply` | Apply stash |
| `gstp` | `git stash pop` | Pop stash |
| `gstl` | `git stash list` | List stashes |
| `gsts` | `git stash show --patch` | Show stash diff |
| `gstd` | `git stash drop` | Drop stash |
| `gstc` | `git stash clear` | Clear all stashes |
| `gstu` | `git stash --include-untracked` | Stash with untracked |
| `gstall` | `git stash --all` | Stash everything |

---

## 🔀 Merge & Rebase Aliases

| Alias | Command | Description |
|:------|:--------|:------------|
| `gm` | `git merge` | Merge branch |
| `gma` | `git merge --abort` | Abort merge |
| `gmc` | `git merge --continue` | Continue merge |
| `gms` | `git merge --squash` | Squash merge |
| `gmff` | `git merge --ff-only` | Fast-forward only |
| `grb` | `git rebase` | Rebase |
| `grba` | `git rebase --abort` | Abort rebase |
| `grbc` | `git rebase --continue` | Continue rebase |
| `grbi` | `git rebase --interactive` | Interactive rebase |
| `grbs` | `git rebase --skip` | Skip rebase step |
| `grbm` | `git rebase $(git_main_branch)` | Rebase onto main |

---

## ⏪ Reset & Restore Aliases

| Alias | Command | Description |
|:------|:--------|:------------|
| `grh` | `git reset` | Reset |
| `grhh` | `git reset --hard` | Hard reset |
| `grhs` | `git reset --soft` | Soft reset |
| `grs` | `git restore` | Restore file |
| `grst` | `git restore --staged` | Unstage file |
| `grev` | `git revert` | Revert commit |
| `grf` | `git reflog` | View reflog |
| `gpristine` | `git reset --hard && git clean -dfx` | Clean everything |

---

## 🌐 Remote Aliases

| Alias | Command | Description |
|:------|:--------|:------------|
| `gr` | `git remote` | List remotes |
| `grv` | `git remote --verbose` | Verbose remote list |
| `gra` | `git remote add` | Add remote |
| `grrm` | `git remote remove` | Remove remote |
| `grmv` | `git remote rename` | Rename remote |
| `grset` | `git remote set-url` | Set remote URL |
| `gf` | `git fetch` | Fetch remote |
| `gfa` | `git fetch --all --tags --prune` | Fetch all + cleanup |
| `gfo` | `git fetch origin` | Fetch origin |

---

## 📋 Quick Reference

| Task | Alias |
|------|-------|
| Status | `gst` |
| Add all | `gaa` |
| Commit with message | `gcmsg "message"` |
| Pull with rebase | `gpr` |
| Push | `gp` |
| Create branch | `gcb branch-name` |
| Switch to main | `gcm` |
| View log | `glog` |
| Stash changes | `gsta` |
| Pop stash | `gstp` |

---

## 🔗 Next Steps

- [Git Stash](/Git/Git/Git%20stash.md) - Save work temporarily
- [Git Squashing](/Git/Git/Git%20Squashing.md) - Combine commits
- [Git Overview](/Git/README.md) - Return to Git documentation

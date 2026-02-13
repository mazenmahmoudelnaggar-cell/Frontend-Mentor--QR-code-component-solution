#!/bin/bash
# =========================================
# 🔧 Full Persistent Cloud Shell Setup Script
# Ensures configs, projects, downloads, and local tools persist across sessions
# Author: Mazen Mahmoud
# =========================================

# --------- 0. Variables (change as needed) ---------
DOTFILES_REPO="https://github.com/<your-username>/cloudshell-dotfiles.git"
DOTFILES_DIR="$HOME/cloudshell-dotfiles"
DOWNLOADS_DIR="$HOME/downloads"
TOOLS_DIR="$HOME/tools"
BACKUP_REMOTE="gdrive:cloudshell-backup"  # Optional remote for rsync backup

# --------- 1. Ensure essential folders exist ---------
mkdir -p "$DOTFILES_DIR" "$DOWNLOADS_DIR" "$TOOLS_DIR"

# --------- 2. Clone or update dotfiles repo ---------
if [ ! -d "$DOTFILES_DIR/.git" ]; then
    git clone "$DOTFILES_REPO" "$DOTFILES_DIR"
else
    cd "$DOTFILES_DIR" && git pull origin main
fi

# --------- 3. Symlink key configs ---------
# Editor config
ln -sf "$DOTFILES_DIR/editor" "$HOME/.editor"
# Bash / shell config
ln -sf "$DOTFILES_DIR/bashrc" "$HOME/.bashrc"
# Vim config
ln -sf "$DOTFILES_DIR/vimrc" "$HOME/.vimrc"

# --------- 4. Restore downloads & local tools (optional) ---------
mkdir -p "$DOWNLOADS_DIR" "$TOOLS_DIR"
# Uncomment if using cloud storage backup
# rsync -avz "$BACKUP_REMOTE/downloads/" "$DOWNLOADS_DIR/"
# rsync -avz "$BACKUP_REMOTE/tools/" "$TOOLS_DIR/"

# Add local tools to PATH
export PATH="$TOOLS_DIR/bin:$PATH"

# --------- 5. Install / Restore language environments inside $HOME ---------
# Python via pyenv
if [ ! -d "$TOOLS_DIR/pyenv" ]; then
    git clone https://github.com/pyenv/pyenv.git "$TOOLS_DIR/pyenv"
fi
export PYENV_ROOT="$TOOLS_DIR/pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"

# Node.js via nvm
if [ ! -d "$TOOLS_DIR/nvm" ]; then
    git clone https://github.com/nvm-sh/nvm.git "$TOOLS_DIR/nvm"
    cd "$TOOLS_DIR/nvm" && git checkout v0.39.6
fi
export NVM_DIR="$TOOLS_DIR/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# GoLang local installation
if [ ! -d "$TOOLS_DIR/go" ]; then
    mkdir -p "$TOOLS_DIR/go"
    # Manual download recommended, then extract to $TOOLS_DIR/go
fi
export PATH="$TOOLS_DIR/go/bin:$PATH"
export GOPATH="$HOME/go"

# --------- 6. Optional automated backup (to remote) ---------
# Uncomment to push home directories to cloud storage periodically
# rsync -avz "$HOME/" "$BACKUP_REMOTE/"

# --------- 7. Final messages ---------
echo "✅ Cloud Shell environment restored!"
echo "Configs symlinked, downloads/tools ready, local language envs initialized."
echo "Remember: install any system packages locally in $TOOLS_DIR to persist."

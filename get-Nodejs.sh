#! /bin/bash

echo ">> checking bash profile exists"
touch ~/.bashrc
touch ~/.bash_profile

echo ">> downloading and installing node version manager..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
echo ">> nvm version:" $(nvm --version)

echo ">> install latest node version..."
nvm install node

echo ">> get yarn package manager..."
corepack enable
echo ">> yarn version:" $(yarn --version)

echo ">> completed Nodejs installation!!"
echo "
▒█▄░▒█ █▀▀█ █▀▀▄ █▀▀ ░░▀ █▀▀ 
▒█▒█▒█ █░░█ █░░█ █▀▀ ░░█ ▀▀█ 
▒█░░▀█ ▀▀▀▀ ▀▀▀░ ▀▀▀ █▄█ ▀▀▀"
echo ">>>>> Run 'yarn' to install this project's dependencies defined in it's package.json file <<<<<"
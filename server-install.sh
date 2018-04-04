#!/bin/bash

set -exuo pipefail

# Fedora 21 install script.

dnf upgrade -y

dnf install -y nodejs npm git

cd /opt/
git clone https://github.com/marczych/business-team.git

cd business-team

npm install

cp business-team.service /usr/lib/systemd/system/

systemctl daemon-reload
systemctl enable business-team
systemctl start business-team

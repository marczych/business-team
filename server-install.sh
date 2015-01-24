#!/bin/bash -ex

# Fedora 21 install script.

yum update -y

yum install -y nodejs npm git

cd /opt/
git clone https://github.com/marczych/business-team.git

cd business-team

npm install

cp business-team.service /usr/lib/systemd/system/

systemctl daemon-reload
systemctl start business-team

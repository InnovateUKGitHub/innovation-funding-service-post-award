#!/bin/bash
set -eux

function ubuntu(){
    apt update

    # Poached these directions from
    # https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user

    wget -qO- https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs

    apt-get install -y openjdk-8-jdk apt-transport-https ca-certificates curl software-properties-common

    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

    sudo apt-key fingerprint 0EBFCD88

    sudo add-apt-repository \
       "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
       $(lsb_release -cs) \
       stable edge"

    sudo apt-get update

    apt-get install -y docker-ce --allow-unauthenticated
    sudo usermod -aG docker vagrant
    bindir='/usr/local/bin/oc'
}

function rhel()
{
    sudo yum install docker curl openjdk-8-jdk vim git -y
    sudo usermod -aG dockerroot vagrant
    sudo systemctl enable docker.service
    sudo systemctl start docker
    bindir='/usr/bin/oc'
    sudo chown root:dockerroot /var/run/docker.sock

}

if [ -f /etc/redhat-release ]; then
   rhel
elif [ -f /etc/lsb-release ]; then
   ubuntu
else
   echo "Operating system undetected"
   exit 1
fi

# Append /etc/default/docker file to allow IP range for insecure registry
echo '{ "insecure-registries": ["172.30.0.0/16"] }' > /etc/docker/daemon.json
sudo service docker restart

# Download Openshift, create Symlink to PATH
OCTOOLS=$(pwd)/openshift-origin-client-tools-v3.6.0-c4dd4cf-linux-64bit.tar.gz
if [ -f $OCTOOLS ]; then
   echo "Tools exist no need to download"
else
   wget -nv https://github.com/openshift/origin/releases/download/v3.6.0/openshift-origin-client-tools-v3.6.0-c4dd4cf-linux-64bit.tar.gz -q
fi

tar -xvzf openshift-origin-client-tools-v3.6.0-c4dd4cf-linux-64bit.tar.gz
sudo ln -s /home/vagrant/openshift-origin-client-tools-v3.6.0-c4dd4cf-linux-64bit/oc $bindir


# # # Pull Repo for testing purposes. Final work will create image and run app with one command.
# # git clone https://Daniel.Watson:OTQwMDcxMDkwMzI5Ou8QQw83yGSL96%2Fu0+r2m6J79oBR@devops.innovateuk.org/code-repository/scm/acc/acc-ui.git
# # git clone --single-branch -b develop https://Daniel.Watson:OTQwMDcxMDkwMzI5Ou8QQw83yGSL96%2Fu0+r2m6J79oBR@devops.innovateuk.org/code-repository/scm/acc/acc-ui.git

oc cluster up
oc login -u system:admin
oc adm policy add-cluster-role-to-user cluster-admin system

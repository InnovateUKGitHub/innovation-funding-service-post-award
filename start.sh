#!/bin/bash

echo "Enter the Openshift Admin Password"
oc login https://localhost:8443 -u system
oc adm policy add-cluster-role-to-user cluster-admin system
oc new-project acc-secrets

echo "Enter the acc-openshift password"
oc secret new-basicauth acc-openshift --username=acc-openshift --prompt
oc create sa acc-bamboo

echo 'Adding acc-bambo user to roles'
oc adm policy add-cluster-role-to-user cluster-admin system:serviceaccount:acc-secrets:acc-bamboo
oc adm policy add-cluster-role-to-user self-provisioner system:serviceaccount:acc-secrets:acc-bamboo

export bamboo_SALESFORCEPASSWORD=bjss1nnovate
export bamboo_SALESFORCETOKEN=vE28qwV64UrRSLQKeEnBD3Hra
export bamboo_SALESFORCEUSERNAME=iuk.accproject@bjss.com.bjsspoc

#oc sa get-token acc-bamboo
oc login https://localhost:8443 --token="$(oc sa get-token acc-bamboo)"
cd /vagrant/acc-ui
sed -i '/oc login/d' openshift/acc-ui-dev/scripts/create-env.sh
#sed -i 's/daniel.watson/richard.rees/g' openshift/acc-ui-dev/scripts/create-env.sh
sudo sed -i 's/127.0.0.1       localhost/127.0.0.1       localhost ***/g' /etc/hosts
openshift/acc-ui-dev/scripts/create-env.sh

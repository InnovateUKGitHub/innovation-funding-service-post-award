#
# Source this file (source [path/aliases.sh] then use -:
# skaffold_help
# k8s_help
#

# Git
alias git_pull='git gc && git pull'
alias git_pull_dev='git gc && git pull origin development'
alias git_push='git gc && git push'
alias git_fetch='git gc && git fetch'

# Deployments
# View state/events for dev/custom in firefox
alias skaffold_state="open -a Firefox http://localhost:50052/v1/state"
alias skaffold_events="open -a Firefox http://localhost:50052/v1/events"
alias dev_home="open -a Firefox https://host.docker.internal:8443/"

# shortcuts for k8s gets
alias k8s_po="kubectl get po"
alias k8s_dep="kubectl get deployments"
alias k8s_svc="kubectl get svc"
alias k8s_configmap="kubectl get configmap"
alias k8s_secrets="kubectl get secrets"

alias skaffoldrender="python3 scripts/skaffoldrender"
alias sopsman="python3 scripts/sopsman"

skaffold_e() {
  _assert_context
  # Use sensible defaults to deploy 'external' resources
  skaffold dev -f skaffold-EXT.yml --rpc-http-port=50054 --rpc-port=50053 --auto-build=false --auto-sync=false --auto-deploy=false --status-check=true --wait-for-deletions=true --tail=false
}

skaffold_dx() {
  _assert_context
  # Use sensible defaults to deploy dev and custom builds in a faster mode (use one at a time)
  skaffold dev --watch-image='[]' --cache-artifacts=false --auto-build=false --auto-sync=false --auto-deploy=false --status-check=false --wait-for-deletions=true --tail=false
}

skaffold_cx() {
  _assert_context
  skaffold dev -f skaffold-CUSTOM.yml --cache-artifacts=false --watch-image='[]' --auto-build=false --auto-sync=false --auto-deploy=false --status-check=false --wait-for-deletions=true --tail=false
}

skaffold_dev() {
  _assert_context
  skaffold dev -f skaffold-ADHOC.yml -p $1 --watch-image='[]' --cache-artifacts=false --auto-build=false --auto-sync=false --auto-deploy=false --status-check=false --wait-for-deletions=true --tail=true
}

skaffold_debug() {
  _assert_context
  skaffold debug -f skaffold-ADHOC.yml -p $1 --watch-image='[]' --cache-artifacts=false --auto-build=false --auto-sync=false --auto-deploy=false --status-check=false --wait-for-deletions=true --tail=true
}

# Use k8s_dep alias then the name is the first arg here e.g. 'k8s_log application-svc'
k8s_log() {
  pod=$(kubectl get pod -l app="$1" -o name)
  kubectl logs -f $pod
}

k8s_wp() {
  watch kubectl get po
}

k8s_logs() {
  k8s_log "$1"
}

k8s_describe() {
  pod=$(kubectl get pod -l app="$1" -o name)
  kubectl describe $pod
}

# Use k8s_dep alias then the name is the first arg here e.g. 'k8s_exec application-svc'
k8s_exec() {
  pod=$(kubectl get pod -l app="$1" -o name)
  kubectl exec --stdin --tty $pod -- /bin/bash
}

# Use k8s_dep alias then the name is the first arg here e.g. 'k8s_delete application-svc'
k8s_delete() {
  pod=$(kubectl get pod -l app="$1" -o name)
  kubectl delete $pod
}

k8s_describe() {
  pod=$(kubectl get pod -l app="$1" -o name)
  kubectl describe $pod
}

k8s_sync_ldap_all_users() {
  _assert_context
  if [[ -z "${TEST_USER_PASSWORD}" ]]; then
    echo 'IFS_TEST_USER_PASSWORD env var is not set so using default of Passw0rd1357'
    pass=$(slappasswd -s "Passw0rd1357" | base64)
  else
    echo 'IFS_TEST_USER_PASSWORD is set as env var'
    pass=$TEST_USER_PASSWORD
  fi
  POD=$(kubectl get pod -l app=ldap -o name)
  kubectl exec "$POD" -- bash -c "export IFS_TEST_USER_PASSWORD=$pass && /usr/local/bin/ldap-sync-from-ifs-db.sh"
}

k8s_sync_ldap_one_user() {
  _assert_context
  if [[ -z "${TEST_USER_PASSWORD}" ]]; then
    echo 'IFS_TEST_USER_PASSWORD env var is not set so using default of Passw0rd1357'
    pass=$(slappasswd -s "Passw0rd1357" | base64)
  else
    echo 'IFS_TEST_USER_PASSWORD is set as env var'
    pass=$TEST_USER_PASSWORD
  fi
  POD=$(kubectl get pod -l app=ldap -o name)
  kubectl exec "$POD" -- bash -c "export IFS_TEST_USER_PASSWORD=$pass && /usr/local/bin/ldap-sync-one-user.sh $1"
}

k8s_find_anon_user() {
  if [ $# -lt 1 ]; then
    echo "Specify one or more non-anonymised emails to find."
    return
  fi
  for EMAIL in "$@"; do
    echo "$EMAIL" | tr -d '\n' | tr '[:upper:]' '[:lower:]' | md5sum | sed 's/[- ]//g' | echo "$EMAIL - $(cat -)@example.com"
  done
}

_assert_context() {
  if [[ $(kubectl config current-context) != "docker-desktop" ]]; then
    echo "Context set to docker-desktop...!"
    kubectl config use-context docker-desktop
  fi
}

k8s_wait() {
  while [[ $(kubectl get pods -l app=$1 -o 'jsonpath={..status.conditions[?(@.type=="Ready")].status}') != "True" ]]; do
    echo "waiting for pod $1" && sleep 5
  done
}

k8s_clean_svc() {
  _assert_context
  kubectl delete svc acc-ui-service
}

k8s_clean_all() {
  _assert_context
  kubectl delete deployment --all
  kubectl delete statefulset --all
  kubectl delete svc acc-ui-service
  kubectl delete configmap acc-ui-configmap
  kubectl delete secrets acc-ui-secrets
}

skaffold_help() {
  echo '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
  echo 'Having sourced this file all commands prefixed skaffold_ should tab auto-complete'
  echo 'Skaffold_e, _dx, _ports is the full dev env but there are many ways to run this'
  echo ''
  echo '    skaffold_e - auth, cache, mail, sil and ifs-database '
  echo '    skaffold_dx - runs data and web tier '
  echo '    skaffold_dev [file] runs fast dev mode on specified skaffold file'
  echo '    skaffold_debug [file] runs fast debug mode on specified skaffold file'
  echo ''
  echo '    It is quite easy to create ad-hoc configurations for any dev/ops purpose'
  echo '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
}

k8s_help() {
  echo '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
  echo 'Having sourced this file all commands prefixed k8s_ should tab auto-complete'
  echo ''
  echo 'Developer utility scripts -:'
  echo '    k8s_clean_all - clean the k8s namespace'
  echo '    k8s_clean_svc - clean non ext services'
  echo '    k8s_rebuild_db - rebuilds the database and ldap entries'
  echo '    k8s_sync_ldap_all_users - syncs all db users with ldap'
  echo '    k8s_sync_ldap_one_user - syncs given db user with ldap'
  echo '    k8s_find_anon_user - takes a given non-anonymised prod email and prints its anonymised version'
  echo ''
  echo 'Shortcuts (save typing) -:'
  echo '    k8s_po - get the list of pods'
  echo '    k8s_dep - get the list of deployments'
  echo '    k8s_svc - get the list of services'
  echo '    k8s_configmap - get the list of configmaps'
  echo '    k8s_secrets - get the list of secrets'
  echo ''
  echo 'Helpers (where there is one pod per deployment) and the name matches k8s_dep output -:'
  echo '    k8s_log [name] - tails the log of the pod matching the deployment'
  echo '    k8s_exec [name] - opens into the pods terminal matching the deployment'
  echo '    k8s_delete [name] - deletes the pod matching the deployment'
  echo '    k8s_describe [name] - deletes the pod matching the deployment'
  echo '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
}

docker_upload_node() {
  VERSION=$1
  docker pull --platform=linux/amd64 node:$VERSION
  docker tag node:$VERSION docker-ifs.devops.innovateuk.org/acc/node:$VERSION
  docker push docker-ifs.devops.innovateuk.org/acc/node:$VERSION
}

acc_clone_secrets() {
  # Clone or Git Pull the latest acc-secrets
  git -C kustomize/acc-secrets/ pull || git clone $(git config --get remote.origin.url)/../acc-secrets.git kustomize/acc-secrets
}

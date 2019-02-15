#!/bin/bash

if [[ $# -ne 6 ]] ; then
  echo "\nExactly 6 parameters expected, you provided $#.
Usage: ws.sh <Lib_Paths_as_CSV> <Extensions_as_CSV> <Resolve_all_dep> <Force_check_all_dep> <Incl_dev_deps> <Fail_on_violation> \n"
  exit 1
fi

LIB_PATHS=$1
INCL_EXT=$2
RESOLVE_ALL=$3
FORCE_CHECK_ALL=$4
INCL_DEV_DEPS=$5
FAIL_ON_VIOLATION=$6

ROOT=${bamboo_build_working_directory}

APIKEY=$(${ROOT}/whitesource/scripts/ssm-key.sh ${bamboo_nexus_repo_user} ${bamboo_nexus_repo_pass} ${bamboo_nexus_repo_url} "/CI/IFS/ws_api_key_password" | base64 -d);
PROJECTTOKEN=$(${ROOT}/whitesource/scripts/ssm-key.sh ${bamboo_nexus_repo_user} ${bamboo_nexus_repo_pass} ${bamboo_nexus_repo_url} "/CI/ACC/ws_project_token_password" | base64 -d);
PRODUCTTOKEN=$(${ROOT}/whitesource/scripts/ssm-key.sh ${bamboo_nexus_repo_user} ${bamboo_nexus_repo_pass} ${bamboo_nexus_repo_url} "/CI/ACC/ws_product_token_password" | base64 -d);

# Parse 2nd param (e.g. "ts,jar,tar.gz") and
# format for 'includes' string (e.g. "**/*.ts **/*.js **/*.tar.gz ")
for e in $(echo ${INCL_EXT} | sed "s/,/ /g") ; do
  EXTENSIONS="${EXTENSIONS}**/*.$e "
done

curl -LJo whitesource-fs-agent.jar https://github.com/whitesource/fs-agent-distribution/raw/master/standAlone/whitesource-fs-agent.jar

# Whitesource config
cat <<EOF > whitesource-fs-agent.config
apiKey=${APIKEY}
projectToken=${PROJECTTOKEN}
productToken=${PRODUCTTOKEN}
forceUpdate=true
forceUpdate.failBuildOnPolicyViolation=${FAIL_ON_VIOLATION}
checkPolicies=true
forceCheckAllDependencies=${FORCE_CHECK_ALL}
offline=false
showProgressBar=false
includes=${EXTENSIONS}
resolveAllDependencies=${RESOLVE_ALL}
npm.resolveDependencies=true
npm.includeDevDependencies=${INCL_DEV_DEPS}
npm.ignoreSourceFiles=false
EOF

WS_OUTPUT=whitesource/output.txt

java -jar whitesource-fs-agent.jar -c whitesource-fs-agent.config -d ${LIB_PATHS} 2>&1 > $WS_OUTPUT
EXIT_CODE=$(expr $? % 256)
grep -v '^productToken=' $WS_OUTPUT | grep -v '^projectToken='

rm whitesource-fs-agent.config
rm whitesource-fs-agent.jar
rm $WS_OUTPUT

exit ${EXIT_CODE}

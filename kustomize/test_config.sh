kustomize build base --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on base'

kustomize build components/acc-ui --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on base'

kustomize build env/env-base --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on env base'
kustomize build env/aws/aws-base --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on aws base'
kustomize build env/aws/demo --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on aws demo'
kustomize build env/aws/perf --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on aws perf'
kustomize build env/aws/preprod --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on aws preprod'
kustomize build env/aws/prod --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on aws prod'
kustomize build env/aws/sysint --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on aws sysint'
kustomize build env/aws/uat --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on aws uat'
kustomize build env/aws/at --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on aws at'

kustomize build env/stub/custom --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on aws custom'
kustomize build env/stub/local/dev --enable-alpha-plugins=true --enable-exec=true > /dev/null || echo 'xxx error on local dev'

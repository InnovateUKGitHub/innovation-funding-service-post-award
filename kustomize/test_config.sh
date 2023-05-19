kustomize build base > /dev/null || echo 'xxx error on base'

kustomize build components/acc-ui > /dev/null || echo 'xxx error on base'

kustomize build env/env-base > /dev/null || echo 'xxx error on env base'
kustomize build env/aws/aws-base > /dev/null || echo 'xxx error on aws base'
kustomize build env/aws/demo > /dev/null || echo 'xxx error on aws demo'
kustomize build env/aws/perf > /dev/null || echo 'xxx error on aws perf'
kustomize build env/aws/prod > /dev/null || echo 'xxx error on aws prod'
kustomize build env/aws/sysint > /dev/null || echo 'xxx error on aws sysint'
kustomize build env/aws/uat > /dev/null || echo 'xxx error on aws uat'

kustomize build env/stub/at > /dev/null || echo 'xxx error on aws at'
kustomize build env/stub/custom > /dev/null || echo 'xxx error on aws custom'
kustomize build env/stub/local/dev > /dev/null || echo 'xxx error on local dev'


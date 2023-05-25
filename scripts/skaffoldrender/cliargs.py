import argparse
from os import environ

# TODO: Update to Python 3.7, uncomment below two lines, un-quote the list[str], and remove __init__ method.
# from dataclasses import dataclass
# @dataclass
class _SkaffoldArguments:
    config_prefix: str
    deployment_prefix: str
    environments: "list[str]"
    tag: str

    def __init__(self, config_prefix: str, deployment_prefix: str, environments: "list[str]", tag: str):
        self.config_prefix = config_prefix
        self.deployment_prefix = deployment_prefix
        self.environments = environments
        self.tag = tag

_parser = argparse.ArgumentParser(
    description="A helpful command line tool to automate Skaffold operations",
    epilog="Feel free to punch Leo for using Python in a TypeScript project.",
)
_parser.add_argument(
    "--config-prefix",
    help="The file prefix for rendered k8s ConfigMap files",
    default="render-acc-ui-configmap",
)
_parser.add_argument(
    "--deployment-prefix",
    help="The file prefix for rendered k8s Deployment files",
    default="render-acc-ui-deployment",
)
_parser.add_argument(
    "--env",
    help="Environment to render. Use multiple times to render multiple environments.",
    required=True,
    action="append",
    choices=[
        "custom",
        "demo",
        "perf",
        "preprod",
        "prod",
        "sysint",
        "uat",
    ],
    dest="environments",
)
_parser.add_argument(
    "--tag",
    help=f"Name to tag the Docker image with. '{environ.get('USER')}-LOCAL-BUILD' by default.",
    default=environ.get("TAG") or f"{environ.get('USER')}-LOCAL-BUILD",
)

cliargs = _SkaffoldArguments(**vars(_parser.parse_args()))

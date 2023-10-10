import argparse


# TODO: Update to Python 3.7, uncomment below two lines, un-quote the list[str], and remove __init__ method.
# from dataclasses import dataclass
# @dataclass
class _SkaffoldArguments:
    environments: str
    filename: str
    encrypt: bool
    decrypt: bool

    def __init__(
        self, environments: "list[str]", filename: str, encrypt: bool, decrypt: bool
    ):
        self.environments = environments
        self.filename = filename
        self.encrypt = encrypt
        self.decrypt = decrypt


_parser = argparse.ArgumentParser(
    description="A helpful command line tool to encrypt and decrypt YAML files for SOPS",
    epilog="Feel free to punch Leo for using Python in a TypeScript project.",
)
_parser.add_argument(
    "--env",
    help="Environment to process. Use multiple times to process multiple environments.",
    required=True,
    action="append",
    choices=[
        "demo",
        "dev",
        "perf",
        "preprod",
        "prod",
        "sysint",
        "uat",
        "local",
        "custom",
        "at"
    ],
    dest="environments",
)
_parser.add_argument(
    "--filename",
    help=f"Secret file to encrypt/decrypt",
    default="acc-ui-secrets.yml",
)

_actionGroup = _parser.add_mutually_exclusive_group(required=True)
_actionGroup.add_argument("--encrypt", help="Encrypt file", action="store_true")
_actionGroup.add_argument("--decrypt", help="Decrypt file", action="store_true")

cliargs = _SkaffoldArguments(**vars(_parser.parse_args()))

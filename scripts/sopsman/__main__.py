#!/usr/bin/python3

from cliargs import cliargs
from subprocess import run
from environment import Environment, secrets_folder
from os.path import join

pgp_map = {
    "local": "68B30A0146AD5875C9C77D079E278C8B3F654B2C",
    "named": "FD616914094FACB25AF974FD122E1F140DACA0F9",
    "prod": "2751917B04E90FA76EAA208D774CEFB1E50B7F68",
}

environment_map = {
    # Production Environment
    "prod": Environment(pgp=pgp_map["prod"], folder="env/aws/prod/"),
    # Named Environments
    "demo": Environment(pgp=pgp_map["named"], folder="env/aws/demo/"),
    "dev": Environment(pgp=pgp_map["named"], folder="env/aws/dev/"),
    "custom": Environment(pgp=pgp_map["named"], folder="env/aws/custom/"),
    "perf": Environment(pgp=pgp_map["named"], folder="env/aws/perf/"),
    "preprod": Environment(pgp=pgp_map["named"], folder="env/aws/preprod/"),
    "sysint": Environment(pgp=pgp_map["named"], folder="env/aws/sysint/"),
    "uat": Environment(pgp=pgp_map["named"], folder="env/aws/uat/"),
    "at": Environment(pgp=pgp_map["named"], folder="env/aws/at/"),
    # Local Environments
    "local": Environment(pgp=pgp_map["local"], folder="env/local/"),
}


def encrypt(file: str, env: str):
    env_info = environment_map[env]
    run(
        f"sops --encrypt --pgp {env_info.pgp} --in-place {join(env_info.folder, file)}",
        shell=True,
        cwd=secrets_folder,
    )


def decrypt(file: str, env: str):
    env_info = environment_map[env]
    run(
        f"sops --decrypt --in-place {join(env_info.folder, file)}",
        shell=True,
        cwd=secrets_folder,
    )


def main():
    for environment in cliargs.environments:
        if cliargs.encrypt:
            encrypt(file=cliargs.filename, env=environment)
        if cliargs.decrypt:
            decrypt(file=cliargs.filename, env=environment)

if __name__ == "__main__":
    main()

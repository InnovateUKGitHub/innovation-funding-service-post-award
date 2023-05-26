#!/usr/bin/python3

from cliargs import cliargs
from subprocess import run
from environment import Environment, secrets_folder
from os.path import join

pgp_map = {
    "local": "B53767C365EDCD31C3F9C3840D0214D502A89362",
    "named": "887175989B24BF72F14B12D980EE689D30DF3F30",
    "prod": "C34A72D77C79E76EAE8F3DF119D34C037E4F8EFE",
}

environment_map = {
    # Production Environment
    "prod": Environment(pgp=pgp_map["prod"], folder="env/aws/prod/"),
    # Named Environments
    "demo": Environment(pgp=pgp_map["named"], folder="env/aws/demo/"),
    "dev": Environment(pgp=pgp_map["named"], folder="env/aws/dev/"),
    "perf": Environment(pgp=pgp_map["named"], folder="env/aws/perf/"),
    "preprod": Environment(pgp=pgp_map["named"], folder="env/aws/preprod/"),
    "sysint": Environment(pgp=pgp_map["named"], folder="env/aws/sysint/"),
    "uat": Environment(pgp=pgp_map["named"], folder="env/aws/uat/"),
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
    if cliargs.encrypt:
        encrypt(file=cliargs.filename, env=cliargs.environment)
    if cliargs.decrypt:
        decrypt(file=cliargs.filename, env=cliargs.environment)

if __name__ == "__main__":
    main()

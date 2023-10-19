#!/usr/bin/python3

from cliargs import cliargs
from subprocess import run
from environment import Environment

environment_map = {
    # Production Environment
    "prod": Environment(name="prod", skaffold_file="skaffold-FAST.yml"),
    # Named Environments
    "demo": Environment(name="named", skaffold_file="skaffold-FAST.yml"),
    "dev": Environment(name="named", skaffold_file="skaffold-FAST.yml"),
    "custom": Environment(name="named", skaffold_file="skaffold-FAST.yml"),
    "perf": Environment(name="named", skaffold_file="skaffold-FAST.yml"),
    "preprod": Environment(name="named", skaffold_file="skaffold-FAST.yml"),
    "sysint": Environment(name="named", skaffold_file="skaffold-FAST.yml"),
    "uat": Environment(name="named", skaffold_file="skaffold-FAST.yml"),
    "at": Environment(name="named", skaffold_file="skaffold-AT.yml"),
    # Local Environments
    "local": Environment(name="local", skaffold_file="skaffold-FAST.yml"),
}


def build_and_push_docker_image(file: str, nexus: str, tag: str) -> None:
    """Build and push Docker image onto Sonatype Nexus

    Args:
        nexus (str): The Docker repository URL
        tag (str): Docker tag name
    """
    run(
        f"skaffold build -f {file} --cache-artifacts=false -p buildonly --default-repo={nexus} --file-output=acc-ui-docker-image.json --tag={tag}",
        shell=True,
    )


def render_config_map(file_prefix: "str | None", env: str) -> None:
    """Render a k8s ConfigMap

    Args:
        file_prefix (str): The name of the prefix for the output file
        env (str): The environment to render
    """

    filename = ""
    if file_prefix:
        filename += f"{file_prefix}-"
    filename += f"{env}.yml"

    print(f"Rendering '{filename}'...")
    run(
        f"skaffold render -p {env} --output={filename} --cache-artifacts=false -f skaffold-CONFIG.yml --loud=true",
        shell=True,
    )


def render_deployment(file_prefix: "str | None", env: str, nexus: str) -> None:
    """Render a k8s Deployment

    Args:
        file_prefix (str): The name of the prefix for the output file
        env (str): The environment to render
        nexus (str): Link to the Nexus repository
    """

    env_info = environment_map[env];

    filename = ""
    if file_prefix:
        filename += f"{file_prefix}-"
    filename += f"{env}.yml"

    print(f"Rendering '{filename}'...")
    run(
        f"skaffold render -p {env} --output={filename} --build-artifacts=acc-ui-docker-image.json -f {env_info.skaffold_file} --default-repo={nexus} --loud=true",
        shell=True,
    )


def main():
    """Render Kustomize"""
    nexus = "docker-ifs.devops.innovateuk.org/snapshots"

    images_to_build = set()

    # For each environment...
    for i in cliargs.environments:
        env_info = environment_map[i];

        # Render a config map.
        render_config_map(file_prefix=cliargs.config_prefix, env=i)
        render_deployment(file_prefix=cliargs.deployment_prefix, env=i, nexus=nexus)
        images_to_build.add(env_info.skaffold_file)

    for file in images_to_build:
        build_and_push_docker_image(file=file, tag=cliargs.tag, nexus=nexus)


if __name__ == "__main__":
    main()

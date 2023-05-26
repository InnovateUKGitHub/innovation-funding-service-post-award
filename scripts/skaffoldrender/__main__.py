#!/usr/bin/python3

from cliargs import cliargs
from subprocess import run


def build_and_push_docker_image(nexus: str, tag: str) -> None:
    """Build and push Docker image onto Sonatype Nexus

    Args:
        nexus (str): The Docker repository URL
        tag (str): Docker tag name
    """
    run(
        f"skaffold build -f skaffold-FAST.yml --cache-artifacts=false -p buildonly --default-repo={nexus} --file-output=acc-ui-docker-image.json --tag={tag}",
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

    filename = ""
    if file_prefix:
        filename += f"{file_prefix}-"
    filename += f"{env}.yml"

    print(f"Rendering '{filename}'...")
    run(
        f"skaffold render -p {env} --output={filename} --build-artifacts=acc-ui-docker-image.json -f skaffold-FAST.yml --default-repo={nexus} --loud=true",
        shell=True,
    )


def main():
    """Render Kustomize"""
    nexus = "docker-ifs.devops.innovateuk.org/snapshots"

    # Build and push the Docker image onto Nexus
    build_and_push_docker_image(tag=cliargs.tag, nexus=nexus)

    # For each environment...
    for i in cliargs.environments:
        # Render a config map.
        render_config_map(file_prefix=cliargs.config_prefix, env=i)
        render_deployment(file_prefix=cliargs.deployment_prefix, env=i, nexus=nexus)


if __name__ == "__main__":
    main()

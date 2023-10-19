from os.path import join

secrets_folder = join("kustomize", "secrets-mgmt")

class Environment:
    name: str
    skaffold_file: str

    def __init__(self, name: str, skaffold_file: str) -> None:
        self.name = name
        self.skaffold_file = skaffold_file

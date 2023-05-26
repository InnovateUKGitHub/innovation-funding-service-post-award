from os.path import join

secrets_folder = join("kustomize", "secrets-mgmt")

class Environment:
    pgp: str
    folder: str

    def __init__(self, pgp: str, folder: str) -> None:
        self.pgp = pgp
        self.folder = folder

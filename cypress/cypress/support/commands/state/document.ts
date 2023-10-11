const computeSha256 = async (file: ArrayBuffer | Uint8Array): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest("SHA-256", file);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};

const downloadFile = (href: string) => {
  return cy.url().then({ timeout: Cypress.env("SALESFORCE_TIMEOUT") }, async path => {
    const pathToFetch = new URL(path);
    if (href.startsWith("/")) pathToFetch.pathname = href;

    const res = await fetch(pathToFetch);
    const file = await res.arrayBuffer();
    const headers = [...(res.headers as any)] as [[string, string]];

    return {
      headers: Object.fromEntries(headers),
      ok: res.ok,
      redirected: res.redirected,
      statusText: res.statusText,
      status: res.status,
      type: res.type,
      url: res.url,
      sha256: await computeSha256(file),
    };
  });
};

const computeSha256FromDisk = (path: string) => {
  return cy.readFile(`cypress/documents/${path}`, null).then((contents: BufferType) => {
    return computeSha256(contents as unknown as Uint8Array);
  });
};

const setFileFromDisk = (path: string, fileName?: string) => {
  cy.log("**setFileFromDisk**");
  return cy.readFile(`cypress/documents/${path}`, null).then((contents: BufferType) => {
    cy.getFileInput().selectFile({
      fileName,
      contents: contents,
    });
  });
};

const setFile = (contents: string, fileName: string) => {
  cy.log("**setFileFromString**");

  cy.getFileInput().selectFile({
    fileName,
    contents: Cypress.Buffer.from(contents),
  });
};

const documentCommands = {
  downloadFile,
  computeSha256FromDisk,
  setFileFromDisk,
  setFile,
};

export { documentCommands };

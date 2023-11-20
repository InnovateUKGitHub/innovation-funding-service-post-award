# Documents

## This folder

To select a document from this folder, use...

```ts
// From this folder, upload the README.md file
// but named "testfile.txt"
cy.setFileFromDisk("README.md", "testfile.txt");

// From this folder, upload the README.md file
cy.setFileFromDisk("README.md");
```

## From string

To upload from a string, use...

```ts
// Upload a file named "testfile.txt" with the content "mutex".
cy.setFile("mutex", "testfile.txt");
```

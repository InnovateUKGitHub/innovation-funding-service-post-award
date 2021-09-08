const sass = require("sass");
const path = require("path");
const fs = require("fs");

const { minify } = require("terser");

async function minifyJS(content) {
  try {
    const output = await minify(content, { mangle: true, compress: { passes: 3 } });

    return output.code;
  } catch (error) {
    throw Error(`minifyJS could not complete the request '${error?.message}'`);
  }
}

async function copyFolder(from, to) {
  // Create directory if there is not one
  if (!fs.existsSync(to)) fs.mkdirSync(to);

  const targetFiles = fs.readdirSync(from);

  for (let index = 0; index < targetFiles.length; index++) {
    const file = targetFiles[index];

    const fromPath = path.join(from, file);
    const toPath = path.join(to, file);
    const fileStatus = fs.lstatSync(fromPath);

    if (fileStatus.isFile()) {
      await fs.promises.copyFile(fromPath, toPath);
    } else {
      await copyFolder(fromPath, toPath);
    }
  }

  return Promise.resolve();
}

async function createGovukStyles() {
  // Get Sass directory to parse
  const govFrontendPackageJson = require(require.resolve("govuk-frontend/package.json"));

  // Check location exists in newer versions
  if (!govFrontendPackageJson.sass) {
    throw Error("Cannot find the sass path to govuk-frontend");
  }

  // Get exact gov-frontend main sass location
  const govFrontendAllSass = `node_modules/govuk-frontend/${govFrontendPackageJson.sass}`;

  // Parse SCSS -> CSS
  const parsedSassResponse = sass.renderSync({ file: govFrontendAllSass, outputStyle: "compressed" });
  const parsedCssContent = Buffer.from(parsedSassResponse.css).toString("utf8");

  if (!parsedCssContent.length) throw Error("No css was parsed :(");

  const outputFileName = `govuk-frontend-${govFrontendPackageJson.version}.min.css`;
  const outputDirectory = path.resolve(process.cwd(), "public", outputFileName);

  try {
    await fs.promises.writeFile(outputDirectory, parsedCssContent, { encoding: "utf8" });

    const [targetFile, outputFile, timeTaken] = [
      govFrontendAllSass,
      outputDirectory,
      parsedSassResponse.stats.duration,
    ];

    console.log(
      `createGovukStyles: Completed in '${timeTaken}ms', using file '${targetFile}', output file '${outputFile}'.`,
    );

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getGovukMainScript() {
  // Get Sass directory to parse
  const govFrontendPackageJson = require(require.resolve("govuk-frontend/package.json"));

  // Check location exists in newer versions
  if (!govFrontendPackageJson.main) {
    throw Error("Cannot find the main JS path to govuk-frontend");
  }

  // Get exact gov-frontend main JS location
  const govFrontendAllJs = `node_modules/govuk-frontend/${govFrontendPackageJson.main}`;
  const targetAssets = path.resolve(process.cwd(), govFrontendAllJs);

  const targetPath = fs.readFileSync(targetAssets).toString();

  if (!targetPath.length) {
    throw Error("There was a problem, there was no code available to minify.");
  }

  const compiledCode = await minifyJS(targetPath);

  if (compiledCode?.length === 0) {
    throw Error("There was a problem when trying to minify.");
  }

  const outputFileName = `govuk-frontend-${govFrontendPackageJson.version}.min.js`;
  const outputDirectory = path.resolve(process.cwd(), "public", outputFileName);

  try {
    await fs.promises.writeFile(outputDirectory, compiledCode, { encoding: "utf8" });

    console.log(`getGovukMainScript: Completed using file '${outputFileName}', output file '${outputDirectory}'.`);

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getGovukImagesAndFonts() {
  const nodeModulesGovukAssets = `node_modules/govuk-frontend/govuk/assets`;
  const targetAssets = path.resolve(process.cwd(), nodeModulesGovukAssets);

  const publicGovukAssets = path.resolve(process.cwd(), "public", "assets");

  await copyFolder(targetAssets, publicGovukAssets);

  console.log(`getGovukImagesAndFonts: Completed migrating fonts/images.`);

  return Promise.resolve();
}

async function updateGovukFrontend() {
  const workflowItems = [createGovukStyles(), getGovukMainScript(), getGovukImagesAndFonts()];

  try {
    await Promise.all(workflowItems);
  } catch (error) {
    console.log("updateGovukFrontend: There was an error", error);
  }
}

// Run code!
(async () => await updateGovukFrontend())();

import path from "node:path";
import { exists, mkdir, readFile, writeFile } from "node:fs/promises";

type GitHubReleaseData = {
  tag_name: string;
};

const cwd = process.cwd();
const packageJsonPath = path.join(cwd, "package.json");
const libPath = path.join(cwd, "lib");
const jarPath = path.join(libPath, "ktfmt.jar");

const readJson = async (path: string) =>
  JSON.parse(await readFile(path, { encoding: "utf-8" }));
const readPackageJson = () => readJson(packageJsonPath);

function isGitHubReleaseData(data: unknown): data is GitHubReleaseData {
  return (
    typeof data === "object" &&
    data !== null &&
    "tag_name" in data &&
    typeof data.tag_name === "string"
  );
}

async function bumpPackageJsonVersion(version: string) {
  const packageJson = await readPackageJson();
  packageJson.version = version;
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
}

async function getVersionFromPackageJson() {
  const packageJson = await readPackageJson();
  return packageJson.version.replace(/^v/, "").replace("-ktfmt", "");
}

function normalizeClocVersion(version: string) {
  const parts = version.split(".");
  if (parts.length === 2) {
    parts.push("0");
  }
  return parts.map((p) => Number(p)).join(".");
}

const latestVersion = await fetch(
  "https://api.github.com/repos/facebook/ktfmt/releases/latest"
)
  .then((res) => res.json())
  .then((data) => {
    if (!isGitHubReleaseData(data)) {
      throw new Error("Invalid GitHub release data");
    }

    return data.tag_name;
  });

const latestVersionWithoutV = latestVersion.replace(/^v/, "");

const normalizedVersion = normalizeClocVersion(latestVersionWithoutV);

const lastCheckedVersion = await getVersionFromPackageJson();

if (normalizedVersion === lastCheckedVersion) {
  console.log("Already up to date");
  process.exit(1);
}

console.log(`Updating from v${lastCheckedVersion} to ${normalizedVersion}`);

if (!(await exists(libPath))) {
  await mkdir(libPath);
}

const assetResponse = await fetch(
  `https://github.com/facebook/ktfmt/releases/download/${latestVersion}/ktfmt-${latestVersionWithoutV}-with-dependencies.jar`
);

if (!assetResponse.ok) {
  throw new Error(
    `Invalid URL: https://github.com/facebook/ktfmt/releases/download/${latestVersion}/ktfmt-${latestVersionWithoutV}-with-dependencies.jar`
  );
}

console.time("Downloaded asset");

const arrayBuffer = await assetResponse.arrayBuffer();

console.timeEnd("Downloaded asset");

await Bun.write(jarPath, arrayBuffer);

await bumpPackageJsonVersion(normalizedVersion + "-ktfmt");
console.log("Done");

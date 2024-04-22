import { $, Glob } from "bun"
import { readFile, writeFile } from "fs/promises"
import { semver } from "bun"
import { load, dump } from "js-yaml"

const branch = (await $`git rev-parse --abbrev-ref HEAD`.text()).trim();

if (branch !== "main") {
  console.error("Release is only allowed from main branch");
  process.exit(1);
}

const newVersion = process.argv[2];
if (!newVersion) {
  console.error("Version is required");
  process.exit(1);
}

const packagesGlob = new Glob("{**,*,.}/{*,.}/package.json");

console.info('patching all js packages to', newVersion);
for await (const p of packagesGlob.scan()) {
  if (p.includes("node_modules")) continue;
  const data = JSON.parse(await readFile(p, "utf-8"));
  const version = data.version || "0.0.0";
  const name = data.name;
  const diff = semver.order(newVersion, version);
  if (!diff) {
    console.log('no change for', `${name}@${version},`, "semver diff:", diff);
    continue
  }
  console.log(`patching ${name}@${version} -> ${name}@${newVersion}`);
  data.version = newVersion;
  await writeFile(p, JSON.stringify(data, null, 2));
  await $`git add ${p}`;
}

console.log('patching home assistant add-ons to', newVersion);
const addonsGlob = new Glob("{server}/config.{yml,yaml}");
for await (const p of addonsGlob.scan()) {
  const data = load(await readFile(p, "utf-8")) as any;
  const version = data.version || "0.0.0";
  const name = data.name;
  const diff = semver.order(newVersion, version);
  if (!diff) {
    console.log('no change for', `${name}@${version},`, "semver diff:", diff);
    continue
  }

  console.log(`patching ${name}@${version} -> ${name}@${newVersion}`);
  data.version = newVersion;
  await writeFile(p, dump(data));
  await $`git add ${p}`;
}

console.log('installing dependencies to update lock files');
await $`bun install`;

console.log('committing changes');
await $`git commit -m "${newVersion}"`;
await $`git tag -a ${newVersion}`;
await $`git push origin main --tags`;

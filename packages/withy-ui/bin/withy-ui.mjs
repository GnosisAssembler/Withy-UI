#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillName = "withy-ui";
const source = fileURLToPath(new URL(`../skills/${skillName}`, import.meta.url));

const usage = `Usage: npx withy-ui add-skill [options]

Copies the Withy UI agent skill into this project, so AI agents follow the design system.
By default it goes to .claude/skills/withy-ui, which Claude Code and Cursor both read.

Options:
  --cursor       Install to .cursor/skills instead, read by Cursor only
  --global       Install to your home folder, for every project
  --dir <path>   Install to <path>/withy-ui
  -h, --help     Show this help`;

function fail(message) {
  console.error(`${message}\n\n${usage}`);
  process.exit(1);
}

function display(target) {
  const home = homedir();
  if (target.startsWith(home + path.sep)) return `~${target.slice(home.length)}`;
  const relative = path.relative(process.cwd(), target);
  return relative && !relative.startsWith("..") ? relative : target;
}

const [command, ...args] = process.argv.slice(2);

if (!command || command === "help" || command === "-h" || command === "--help") {
  console.log(usage);
  process.exit(0);
}

if (command !== "add-skill") fail(`Unknown command: ${command}`);

let cursor = false;
let global = false;
let dir;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--cursor") {
    cursor = true;
  } else if (arg === "--global") {
    global = true;
  } else if (arg === "--dir") {
    dir = args[index + 1];
    index += 1;
    if (!dir) fail("--dir needs a path.");
  } else if (arg === "-h" || arg === "--help") {
    console.log(usage);
    process.exit(0);
  } else {
    fail(`Unknown option: ${arg}`);
  }
}

if (!existsSync(path.join(source, "SKILL.md"))) {
  fail(`The skill files are missing from ${source}. Reinstall withy-ui and try again.`);
}

const root = global ? homedir() : process.cwd();
const base = dir ? path.resolve(dir) : path.join(root, cursor ? ".cursor" : ".claude", "skills");
const target = path.join(base, skillName);

mkdirSync(base, { recursive: true });
rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });

console.log(`Added the Withy UI skill to ${display(target)}.`);

if (!dir) {
  const other = path.join(root, cursor ? ".claude" : ".cursor", "skills", skillName);
  if (existsSync(other)) {
    console.log(`${display(other)} has a copy too. Cursor reads both folders, so delete one.`);
  }
}

console.log("Start a new agent chat so it picks up the skill.");

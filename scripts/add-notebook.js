#!/usr/bin/env node
const { exec } = require("child_process");

const fileName = process.argv[2];

if (!fileName) {
  console.log("Please provide a file name in kebab-case ie new-notebook");
  process.exit(1);
}

exec(`hugo new notebooks/${fileName}/index.md`);

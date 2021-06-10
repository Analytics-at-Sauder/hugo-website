#!/usr/bin/env node
const { exec } = require("child_process");

const fileName = process.argv[2];

if (!fileName) {
  console.log("Please provide a title name in kebab-case ie new-blog-post");
  process.exit(1);
}

exec(`hugo new blog/${fileName}/index.md`);

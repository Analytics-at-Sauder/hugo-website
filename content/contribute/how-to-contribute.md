---
title: "Contribute"
description: "Add new blog posts or notebooks to Analytics at Sauder"
date: 2021-06-10T10:43:12-07:00
lastmod: 2021-06-10T10:43:12-07:00
draft: false
images: []
menu:
  contribute:
    parent: "contribute"
toc: true
---

## Requirements

Analytics at Sauder uses npm to centralize dependency management

- Download and install [Node.js](https://nodejs.org/) (it includes npm) for your platform.

## Getting the site onto your local machine

Create a new site, change directories, install dependencies, and start development server.

#### Cloning the repository

```bash
git clone https://github.com/Analytics-at-Sauder/hugo-website
```

### Change directories

```bash
cd hugo-website
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run start
```

Npm will start the Hugo development webserver accessible by default at `http://localhost:1313`. Saved changes will live reload in the browser.

## Creating a new blog post or notebook

[View the guide to create a new blog post →]({{< relref "creating-a-blog-post" >}})

[View the guide to create a new notebook →]({{< relref "creating-a-notebook" >}})

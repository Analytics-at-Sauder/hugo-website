---
title: "Creating a New Blog Post"
description: "Guide to create a blog post"
date: 2021-06-10T10:43:12-07:00
lastmod: 2021-06-10T10:43:12-07:00
draft: false
images: []
menu:
  contribute:
    parent: "Creating Content"
toc: true
---

There are two ways to create a notebook.

1. By cloning the project and using the create command
2. By uploading your files to github directly

It is easier create a notebook using the first method.

## Cloning the project and using the create command

Make sure you have the project on your local computer and have the dependencies installed. You can [follow the guide here]({{< relref "how-to-contribute" >}}).

### Step 1 - run the create command

Run this command to create a new folder in the directory `/content/blog/<your-blog-title>`. Make sure to include a blog title in kebab-case.

{{< btn-copy text="npm run create:notebook your-notebook-name" >}}

```bash
npm run create:blog your-blog-title
```

After running this command, you should see a folder created along with an index.md file inside of it.

### Step 2 - Write your blog post

Open the newly created index.md and begin writing your blog post in markdown. If you need to add any photos, place them in the same directory.

### Step 3 - Check the preview (optional)

Run the site using `npm start` and navigate to `localhost:1313/blog/your-blog-title`. If it all looks good, it's time to upload! otherwise make content edits as necessary.

### Step 4 - Upload the changes

Create a new branch on github and push to it. Open a pull request so that other people can approve it before it's published on the site.

## By uploading your files to github directly

work in progress

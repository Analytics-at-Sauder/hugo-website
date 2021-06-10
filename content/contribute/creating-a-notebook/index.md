---
title: "Creating a New Notebook"
description: "Guide to create a new notebook"
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

Run this command to create a new folder in the directory `/content/notebooks/<your-notebook-name>`. Make sure to include a notebook name in kebab-case.

{{< btn-copy text="npm run create:notebook your-notebook-name" >}}

```bash
npm run create:notebook your-notebook-name
```

After running this command, you should see a folder created along with an index.md file inside of it.

![png](folder-structure.png)

### Step 2 - Download your Jypter Notebook

Go to your Jupyter Notebook and navigate through the menu File -> Download as -> Markdown (.md)

![png](download.png)

### Step 3 - Append the markdown contents

Append the markdown contents of the notebook you just downloaded into the newly created index.md in step 1. If there are any photos in the notebook, place them in the same directory.

### Step 4 - Check the preview (optional)

Run the site using `npm start` and navigate to `localhost:1313/notebooks/your-notebook`. If it all looks good, it's time to upload! otherwise make content edits as necessary.

### Step 5 - Upload the changes

Create a new branch on github and push to it. Open a pull request so that other people can approve it before it's published on the site.

## By uploading your files to github directly

work in progress

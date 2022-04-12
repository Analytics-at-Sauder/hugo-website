---
title: "Browse Notebooks"
description: "Browse all notebooks"
lead: ""
date: 2020-11-17T20:11:42+01:00
lastmod: 2020-11-17T20:11:42+01:00
draft: false
images: []
menu:
  notebooks:
    parent: "all notebooks"
weight: 010
toc: false
hide: true
---

<script src="https://code.jquery.com/jquery-1.9.1.min.js"></script>

<script>

function renderNotebooks (notebooks) {
  const notebookContainer = $('#notebook-container')
  notebookContainer.empty()
  notebooks.forEach((notebook) => {
    let badges = []
    if (notebook.topics) badges = badges.concat(notebook.topics);
    if (notebook.skills) badges = badges.concat(notebook.skills);
    badges = badges.map((name) => `<span class="badge bg-primary me-1">${name}</span>`).join('') ?? ''

    notebookContainer.append(`
      <div class="shadow-sm px-3 py-3 rounded card mt-2">
        <div class="d-flex flex-wrap">
        <a class="me-2" href="${notebook.permalink}">
        <h5 class="my-0">${notebook.title}</h5>
        </a>
        <span>
          ${badges}
        </span>
        <div>
        ${ notebook.author ? `<subtitle>
          by: ${ notebook.authorslink ? `<a href="${notebook.authorslink}">Author</a>}` : notebook.author}
        </subtitle>` : ''}
        <p class="my-0 mt-1">${notebook.description}</p>
      </div>
    `)
  })
}

function renderFilters(notebooks) {
  const topics = [...new Set(notebooks.reduce((acc, {topics}) => topics ? acc.concat(topics) : acc , []))]
  const skills = [...new Set(notebooks.reduce((acc, {skills}) => skills ? acc.concat(skills) : acc , []))]

  const topicFilter = $('#topic-filter')
  const skillFilter = $('#skill-filter')

  topics.forEach((topic) => {
    topicFilter.append(`<option value="${topic}">${topic}</option>`)
  })

  skills.forEach((skill) => {
    skillFilter.append(`<option value="${skill}">${skill}</option>`)
  })
}

// global notebooks variable
let notebooks;

$( document ).ready(function () {
  // bind select listeners to the filters
  $('#topic-filter').change(function () {
    renderNotebooks(notebooks.filter(({topics}) => topics && topics.includes($(this).val())))
    $('#skill-filter').prop('selectedIndex',0);
  })

  $('#skill-filter').change(function () {
    renderNotebooks(notebooks.filter(({skills}) => skills && skills.includes($(this).val())))
    $('#topic-filter').prop('selectedIndex',0);
  })

  $('#notebook-search').keyup(function () {
    $('#skill-filter').prop('selectedIndex',0);
    $('#topic-filter').prop('selectedIndex',0);
    const value = $('#notebook-search').val().toLowerCase()
    renderNotebooks(
      notebooks.filter(({ description, title, author }) => [description, title, author].some((val) => {
        return val.toLowerCase().includes(value)
      })))
  })

  // fetch all notebooks
  fetch("/notebooks/index.json")
    .then(response => response.json())
    .then(({data}) => {
      notebooks = data.filter((notebook) => !notebook.hide)
      renderNotebooks(notebooks)
      renderFilters(notebooks)
    })
})
</script>

<div class="input-group mb-3">
  <input id="notebook-search" type="text" class="form-control" placeholder="Search..." aria-label="Search" aria-describedby="search">
</div>

<div class="d-flex mb-3">
  <select id="topic-filter" class="form-select" aria-label="Topic Filter" onselect="">
    <option selected>Filter by Topics</option>
  </select>
  <select id="skill-filter" class="form-select ms-5" aria-label="Skill filter">
    <option selected>Filter by Skills</option>
  </select>
</div>

<div id="notebook-container">
</div>

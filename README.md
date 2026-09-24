# Book Finder

A small book search application built with **HTML, CSS, and vanilla JavaScript** using the [Open Library API](https://openlibrary.org/developers/api).

## Features

* Search books by title or author
* Display book covers, authors, publication year, and edition count
* Filter books by publication year
* Sort results by relevance, year, or title
* Add and remove books from favorites
* View detailed information about a selected book
* Loading, error, and empty-result states

## Technologies

* HTML5
* CSS3
* JavaScript (ES Modules)
* Fetch API
* Open Library API

## Run locally

```bash
npm install
npx serve .
```

Then open the local address provided by `serve`.

## Project structure

```text
book-finder/
├── index.html
├── package.json
├── css/
│   └── style.css
└── src/
    ├── main.js
    ├── api.js
    └── utils.js
```

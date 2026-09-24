console.log("Book finder started")

import {searchBooks} from "./api.js";
import {getCoverUrl} from "./utils.js";

const form = document.querySelector("form")
const input = document.querySelector("input")
const resultContainer = document.querySelector("#results")
const status = document.querySelector("#status")
const favoritesContainer = document.querySelector("#favorites")
const filterSelect = document.querySelector("select")
const sortSelect = document.querySelectorAll("select")[1]
const detailsContainer = document.querySelector("#details")

status.textContent = "Search for a book"

let books = [];
let favorites = [];
let currentFilter = "all";
let currentSort = "relevance"
let selectedBook = null;

function createBookCard(book, isFavorite = false) {
    const card = document.createElement("div")
    card.classList.add("book-card")

    card.addEventListener("click", () => {
        selectBook(book.key);
    })
    
    const cover = document.createElement("img")
    cover.classList.add("book-cover")
    const coverUrl = getCoverUrl(book.cover_i)
    if (coverUrl) {
        cover.setAttribute(
            "src",
            coverUrl
        )
        cover.setAttribute(
            "alt",
            book.title ?? "Book cover"
        )
    }

    const editions = document.createElement("p")
    editions.classList.add("book-editions")
    editions.textContent = book.edition_count
        ? `Editions: ${book.edition_count}`
        : "Editions: unknown";

    const title = document.createElement("h3")
    title.classList.add("book-title")
    title.textContent = book.title;
            
    const author = document.createElement("p")
    author.classList.add("book-author")
    author.textContent = book.author_name
        ? book.author_name[0]
        : "Unknown author";
            
    const year = document.createElement("p")
    year.classList.add("book-year")
    year.textContent = book.first_publish_year
        ? `First published: ${book.first_publish_year}`
        : "Publication year unknown";

    const favoriteButton = document.createElement("button")
    favoriteButton.classList.add("favorite-button")
    favoriteButton.textContent = isFavorite
        ? "Remove from favorites"
        : "Add to favorites";
        
    favoriteButton.addEventListener("click", (event) => {
        event.stopPropagation();

        const isFavorite = favorites.some(
            (favorite) => favorite.key === book.key
        );

        if (isFavorite) {
            const index = favorites.findIndex(
                (favorite) => favorite.key === book.key
            );

            favorites.splice(index, 1)
        } else {
            favorites.push(book);
        }

        renderBooks(getSortedBooks(getFilteredBooks()))
        renderFavorites()
    })

    card.append(cover);
    card.append(title);
    card.append(author);
    card.append(year);
    card.append(editions)
    card.append(favoriteButton)

    return card;
}

function selectBook(bookKey) {
    const book = books.find((book) => book.key === bookKey)

    if (!book) {
        return;
    }

    selectedBook = book;
    renderBookDetails();
}

function renderBooks(books) {
    resultContainer.innerHTML = ""

    books.forEach((book) => {
        const isFavorite = favorites.some(
            (favorite) => favorite.key === book.key
        )

        const card = createBookCard(book, isFavorite);

        resultContainer.append(card);
    })
}

function renderFavorites() {
    favoritesContainer.innerHTML = "";

    if(!favorites.length) {
        favoritesContainer.textContent = "No favorite books"
        return
    }

    favorites.forEach((book) => {
        const card = createBookCard(book, true);

        favoritesContainer.append(card);
    })
}

function getFilteredBooks() {
    if (currentFilter === "with-year") {
        return books.filter((book) => book.first_publish_year)
    }

    return books;
}

function getSortedBooks(booksToSort) {
    const sortedBooks = [...booksToSort];

    if (currentSort === "newest") {
        sortedBooks.sort((a,b) => {
            return (b.first_publish_year ?? 0) - (a.first_publish_year ?? 0);
        })
    }

    if (currentSort === "oldest") {
        sortedBooks.sort((a,b) => {
            return (a.first_publish_year ?? 0) - (b.first_publish_year ?? 0);
        })
    }

    if (currentSort === "title") {
        sortedBooks.sort((a,b) => {
            return (a.title ?? "").localeCompare(b.title ?? "");
        })
    }

    return sortedBooks;
}


function renderBookDetails() {
    detailsContainer.innerHTML = "";

    if (!selectedBook) {
        return;
    }

    const detailsContent = document.createElement("div");
    detailsContent.classList.add("details-content");

    
    const cover = document.createElement("img");
    cover.classList.add("details-cover");
    
    const coverUrl = getCoverUrl(selectedBook.cover_i, "L");
    
    if (coverUrl) {
        cover.setAttribute("src", coverUrl);
        cover.setAttribute(
            "alt",
            selectedBook.title ?? "Book cover"
        );
    }
    
    const info = document.createElement("div");
    info.classList.add("details-info");
    
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    
    closeButton.addEventListener("click", () => {
        selectedBook = null;
        renderBookDetails();
    });
    
    const title = document.createElement("h2");
    title.textContent = selectedBook.title ?? "Unknown title";
    
    const header = document.createElement("h2")
    header.textContent = `About ${selectedBook.title ?? "choosen book"}`

    const author = document.createElement("p");
    author.textContent = selectedBook.author_name
        ? `Author: ${selectedBook.author_name.join(", ")}`
        : "Author: Unknown";

    const year = document.createElement("p");
    year.textContent = selectedBook.first_publish_year
        ? `First published: ${selectedBook.first_publish_year}`
        : "Publication year unknown";

    const editions = document.createElement("p");
    editions.textContent = selectedBook.edition_count
        ? `Editions: ${selectedBook.edition_count}`
        : "Editions: unknown";

    info.append(closeButton);
    info.append(title);
    info.append(author);
    info.append(year);
    info.append(editions);

    detailsContent.append(cover);
    detailsContent.append(info);
    
    detailsContainer.append(header);
    detailsContainer.append(detailsContent);
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try{
        const query = input.value;

        if(!query) {
            status.textContent = "Enter a book title or author"
            return;
        }

        resultContainer.innerHTML = "";
        selectedBook = null;
        renderBookDetails()

        status.textContent = "Loading..."

        books = await searchBooks(query);

        if(!books.length) {
            status.textContent = "No books found"
            return
        }

        renderBooks(getSortedBooks(getFilteredBooks()));

        status.textContent = "";

    } catch (error) {
        console.log(error)
        status.textContent = "Failed to load books"
    } finally {
        console.log("Search finished")
    }
})

filterSelect.addEventListener("change", () => {
    currentFilter = filterSelect.value;

    renderBooks(getSortedBooks(getFilteredBooks()))
})

sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;

    renderBooks(getSortedBooks(getFilteredBooks()))
})

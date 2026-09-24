function getCoverUrl(coverId, size = "M") {
    if (!coverId) {
        return null
    }

    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
}

export {
    getCoverUrl
}
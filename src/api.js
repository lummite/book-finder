async function searchBooks(query) {
    try{
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;

        const response = await fetch(url)

        if(!response.ok){
            throw new Error("response error")
        }

        const data = await response.json();

        return data.docs;
    } catch(error) {
        console.log(error.message)
        throw error;
    }
}

export{
    searchBooks
};


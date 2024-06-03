const titleInput = document.querySelector('.input-title-book')
const writerInput = document.querySelector('.input-writer-book')
const yearInput = document.querySelector('.input-year-book')
const isReadInput = document.querySelector('.input-read-book')
const buttonForm = document.querySelector('.button-form')
const listNotReadBook = document.querySelector('.list-not-read')
const listReadBook = document.querySelector('.list-read')
const dialogDeleteBook = document.querySelector('.dialog-delete-book')
const titleDialogDelete = document.querySelector('.title-delete-book')
const buttonCancelDelete = document.querySelector('.button-cancel-delete')
const buttonConfirmDelete = document.querySelector('.button-confirm-delete')
const titleForm = document.querySelector('.title-form')
const inputSearch = document.querySelector('.input-search')
const buttonSearch = document.querySelector('.button-search')

const book = {
    title: '',
    author: '',
    year: '',
    isComplete: false
}

let state = 'add'
let search = ''

titleInput.addEventListener('input', (e) => {
    const value = e.target.value
    book.title = value
})

writerInput.addEventListener('input', (e) => {
    const value = e.target.value
    book.author = value
})

yearInput.addEventListener('input', (e) => {
    const value = e.target.value
    book.year = parseInt(value)
})

isReadInput.addEventListener('input', (e) => {
    const value = e.target.checked
    book.isComplete = value
})

buttonForm.addEventListener('click', (e) => {
    e.preventDefault()
    let listBook = localStorage.getItem('books')

    if (state == 'add') {
        if (listBook == null) {
            listBook = []

            const date = new Date()
            book.id = date.getTime()
            listBook.push(book)

            localStorage.setItem('books', JSON.stringify(listBook))
        } else {
            listBook = JSON.parse(listBook)

            const date = new Date()
            book.id = date.getTime()
            listBook.push(book)

            localStorage.setItem('books', JSON.stringify(listBook))
        }
    } else {
        listBook = JSON.parse(listBook)
        const id = e.target.getAttribute('data-id')
        const indexBook = listBook.findIndex((book) => book.id == id)

        book.id = parseInt(id)
        listBook[indexBook] = book

        localStorage.setItem('books', JSON.stringify(listBook))
        state = 'add'
    }
    setBook()
    showBooks()
})

inputSearch.addEventListener('input', (e) => {
    const value = e.target.value
    search = value
})

buttonSearch.addEventListener('click', () => {
    let listBook = localStorage.getItem('books')
    listBook = JSON.parse(listBook)

    let newBooks = listBook.filter((book) => book.title.includes(search))

    newBooks = newBooks.sort((a, b) => b.id - a.id)

    showBooks(newBooks)

})

 
function setBook(title = '', author = '', year = '', isComplete = false) {
    book.title = title
    book.author = author
    book.year = year
    book.isComplete = isComplete

    titleInput.value = book.title
    writerInput.value = book.author
    yearInput.value = book.year
    isReadInput.checked = book.isComplete
}


function handleCompleteBook(event) {
    setBook()
    let listBook = localStorage.getItem('books')
    listBook = JSON.parse(listBook)

    const id = event.target.getAttribute('data-id')

    const indexBook = listBook.findIndex((book) => book.id == id)
    if (indexBook < 0) {
        return
    }

    const dataBook = listBook[indexBook]
    listBook[indexBook] = {
        ...dataBook,
        isComplete: !dataBook.isComplete
    }

    localStorage.setItem('books', JSON.stringify(listBook))
    showBooks()
}

function handleDialogDeleteBook(event) {
    setBook()
    const id = event.target.getAttribute('data-id')
    const title = event.target.getAttribute('data-title')


    dialogDeleteBook.classList.add('show')
    titleDialogDelete.innerHTML = title

    buttonCancelDelete.addEventListener('click', () => {
        dialogDeleteBook.classList.remove('show')
    })

    buttonConfirmDelete.addEventListener('click', () => {
        handleDeleteBook(id)
    })

}

function handleDeleteBook(id) {
    let listBook = localStorage.getItem('books')
    listBook = JSON.parse(listBook)

    listBook = listBook.filter((book) => book.id != id)

    localStorage.setItem('books', JSON.stringify(listBook))

    dialogDeleteBook.classList.remove('show')
    showBooks()
}

function handleEditBook(event) {
    const id = event.target.getAttribute('data-id')
    state = 'edit'

    titleForm.innerHTML = 'Edit Buku'
    buttonForm.innerHTML = 'Edit Buku'
    buttonForm.setAttribute('data-id', id)

    let listBook = localStorage.getItem('books')
    listBook = JSON.parse(listBook)

    const book = listBook.find((book) => book.id == id)

    setBook(book.title, book.author, book.year, book.isComplete)
}


function showBooks(books = false) {

    let listBook = !books ? localStorage.getItem('books') : books
    if (listBook !== null) {
        listBook = typeof listBook == 'string' ? JSON.parse(listBook) : listBook
        let elementNotRead = ''
        let elementRead = ''

        listBook = listBook.sort((a, b) => b.id - a.id)

        listBook.forEach((book) => {
            if (!book.isComplete) {
                elementNotRead += `<div class="book">
                    <h3 class="title-book title-not-read">${book.title}</h3>
                    <div class="data-book">
                        <span class="label-data">Penulis</span>
                        <span class="value-data writer-label">: ${book.author}</span>
                    </div>
                    <div class="data-book">
                        <span class="label-data">Tahun</span>
                        <span class="value-data year-label">: ${book.year}</span>
                    </div>
                    <div class="buttons">
                        <button class="button-book type-button" data-id="${book.id}">Tandai Selesai</button>
                        <button class="button-book edit-button" data-id="${book.id}">Edit</button>
                        <button class="button-book delete-button" data-id="${book.id}" data-title="${book.title}">Hapus Buku</button>
                    </div>
                </div>`
            } else {
                elementRead += `<div class="book">
                    <h3 class="title-book title-read">${book.title}</h3>
                    <div class="data-book">
                        <span class="label-data">Penulis</span>
                        <span class="value-data writer-label">: ${book.author}</span>
                    </div>
                    <div class="data-book">
                        <span class="label-data">Tahun</span>
                        <span class="value-data year-label">: ${book.year}</span>
                    </div>
                    <div class="buttons">
                        <button class="button-book type-button" data-id="${book.id}">Tandai Belum Selesai</button>
                        <button class="button-book edit-button" data-id="${book.id}">Edit</button>
                        <button class="button-book delete-button" data-id="${book.id}" data-title="${book.title}">Hapus Buku</button>
                    </div>
                </div>`
            }

        })

        listNotReadBook.innerHTML = elementNotRead
        listReadBook.innerHTML = elementRead

        const typeButtons = Array.from(document.querySelectorAll('.type-button'))
        typeButtons.forEach((button) => {
            button.addEventListener('click', handleCompleteBook)
        })

        const deleteButtons = Array.from(document.querySelectorAll('.delete-button'))
        deleteButtons.forEach((button) => {
            button.addEventListener('click', handleDialogDeleteBook)
        })

        const editButtons = Array.from(document.querySelectorAll('.edit-button'))
        editButtons.forEach((button) => {
            button.addEventListener('click', handleEditBook)
        })

    }

}

showBooks()
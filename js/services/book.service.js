'use strict'

const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 3

var elPrev = document.querySelector('.prev-page')
var elNext = document.querySelector('.next-page')

var gPageIdx = 0
var gBooks
var gFilterBy = {maxPrice: 200, minRate: 0, title: ''}

_createBooks()

function _createBooks(){
    var books = loadFromStorage(STORAGE_KEY)
    // console.log(books);
    if(!books || !books.length){
        books = []
        for(var i = 0 ; i < 11; i++){
            books.push(_createBook())
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function _createBook(title = 'Half Blood Prince', price = getRandomIntInclusive(1,200)){
    return {
        id: makeId(),
        title: title,    
        price: price, 
        img: `img/book${getRandomIntInclusive(1,6)}.jpg`,
        rate: 0,
        desc: makeLorem(500),
        }
}

function _saveBooksToStorage(){
    saveToStorage(STORAGE_KEY, gBooks)
}

function getBooksToShow(){
    var books = gBooks.filter( book => book.rate >= gFilterBy.minRate && book.price <= gFilterBy.maxPrice && book.title.toLowerCase().includes(gFilterBy.title.toLowerCase()))
    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)    
    return books
}

function deleteBook(bookId){
    const bookIndex = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIndex, 1)
    console.log('The book id: ' + bookId + ' has deleted');
    _saveBooksToStorage()
}


function getBookById(bookId){
    const book = gBooks.find( book => bookId === book.id)
    return book
}

function updateBook(bookId, newPrice){
    const book = gBooks.find(book => bookId === book.id )
    book.price = newPrice
    _saveBooksToStorage()
    return book
}

function setRateByBook(bookId , newRate){
    const book = getBookById(bookId)
    book.rate= newRate
    _saveBooksToStorage()
    return book 
}

function addBook(title, price){
    const book = _createBook(title, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function setBookFilter(filterBy = {}){
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    if(filterBy.title !== undefined) gFilterBy.title = filterBy.title
    return gFilterBy
}

function setBookSort(sortBy = {}){
    if(sortBy.maxPrice !== undefined){
        gBooks.sort( (b1, b2) => (b1.maxPrice - b2.maxPrice))
    }
}

function nextPage() {
    gPageIdx++
    elPrev.removeAttribute('disabled', '')
    if ((gPageIdx*PAGE_SIZE) + PAGE_SIZE >= gBooks.length) {
        elNext.setAttribute('disabled', '')
        elPrev.removeAttribute('disabled', '')
    }
}

function previewPage(){
    gPageIdx--
    elNext.removeAttribute('disabled', '')
    if(gPageIdx === 0){
        elPrev.setAttribute('disabled', '')
        elNext.removeAttribute('disabled', '')
    }  
}





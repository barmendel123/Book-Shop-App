'use strict'

function onInit(){
    renderFilterByQueryStringParams()
    renderBooks()
}

function renderBooks(){
    
    const books = getBooksToShow()

    var strHTMLs = `
      <thead>
          <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Price</th>
              <th>Rating Book</th>
              <th>Cover</th>
              <th>Actions</th>
          </tr>
      </thead>

      <tbody>
      `
      books.map(book => {
        return (strHTMLs += `
              <tr>
                  <th>${book.id}</th>
                  <th>${book.title}</th>
                  <th>${book.price}$</th>
                  <th>
                   <label 
                    class="rating-label" onclick="onRateBook(event , '${book.id}')">
                    <input name="book-rate${book.id}" class="rating" max="5" style="--value:${book.rate}"
                    oninput="this.style.setProperty('--value', this.value)" step="0.5" type="range">
                   </label>
                  </th>
                  <th><img src="${book.img}" width=150px height=150px></th>
                  <th>
                    <button onclick="onReadBook('${book.id}')">Read</button>
                    <button onclick="onUpdateBook('${book.id}')">Update</button>
                    <button onclick="onDeleteBook('${book.id}')">Delete</button>
                  </th>
              </tr>`)
      })
    strHTMLs += `</tbody>`
    document.querySelector('.table-books').innerHTML = strHTMLs
}

function onDeleteBook(bookId) {
    if(!confirm('Are you sure?')) return
    deleteBook(bookId)
    renderBooks()
    
    flashMsg(`Book has Deleted`)
}

function onAddBook(){
    
    var titleBook = prompt(`Book's name?`)
    while(!titleBook){
        alert('Must give a name to the book')
        titleBook = prompt(`Book's name?`)
    }
    var priceBook = +prompt(`Book's price?`)
    while(priceBook < 1 || priceBook > 200){   
        alert('Price Must be 0-200 $')
        priceBook = +prompt(`Book's price?`)
    }
    
    var book = addBook(titleBook, priceBook)
    // console.log(book);
    renderBooks()
    flashMsg(`Book added (id: ${book.id})`)
}

function onUpdateBook(bookId) {
    var book = getBookById(bookId)
    var newPrice = +prompt('Price?', book.price)
    while(newPrice < 1 || book.price === newPrice){
        alert('Wrong price, try again')
        newPrice = +prompt('Price?', book.price)
    }

    book = updateBook(bookId, newPrice)
    console.log('The book id' , bookId , 'has changed the price');
    renderBooks()
    flashMsg(`Price updated to: ${book.price}`)
    
}

function onRateBook(ev, bookId) {
    ev.preventDefault()
    const elRate = document.querySelector(`[name=book-rate${bookId}]`)
    const book = setRateByBook(bookId, +elRate.value)
    flashMsg(`Rate updated to ${book.rate}`)
}

function onReadBook(bookId) {
    const book = getBookById(bookId)
    if(!book) return
    const elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('h4 span').innerText = `${book.price}$`
    elModal.querySelector('h5 span').innerText = book.rate
    elModal.querySelector('.book-img').src = book.img
    elModal.querySelector('p').innerText = book.desc
    elModal.classList.add('open')
}

function onCloseModal(){
    document.querySelector('.modal').classList.remove('open')
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function onSetFilterBy(filterBy){
    console.log(filterBy);
    filterBy = setBookFilter(filterBy)
    console.log(`gFilterBy:`, gFilterBy)
    renderBooks()

    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}&title=${filterBy.title}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl )
}

function onGetBookByName(ev){
    ev.preventDefault()
    const elBookName = document.querySelector('[name=name-filter]')
    console.log(elBookName.value);
}

function onNextPage(){
    nextPage()
    renderBooks()
}

function onPrevPage(){
    previewPage()
    renderBooks()
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: queryStringParams.get('maxPrice') || 200,
        minRate: queryStringParams.get('minRate') || 0,
        title: queryStringParams.get('title') || '',
    }

    if (!filterBy.maxPrice && !filterBy.minRate && !filterBy.title) return

    document.querySelector('.filter-price-range').value = filterBy.maxPrice
    document.querySelector('.filter-rate-range').value = filterBy.minRate
    document.querySelector('.name-filter').value = filterBy.title

    setBookFilter(filterBy)
}





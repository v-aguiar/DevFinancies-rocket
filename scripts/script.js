// Handles opening, closing and other Modal functions
const Modal = {
  // Open Modal
  open() {
    const modal = document.querySelector('#modal')    
    modal.classList.add('active')
  },
  // Close Modal
  close() {
    const modal = document.querySelector('#modal')
    modal.classList.remove('active')
  }
}
// Handle storage actions
const Storage = {
  get(){
    let keys = []
    
    // getting and listing all localStorage keys from stack overflow answer at: https://stackoverflow.com/a/8419509/15816026
    for (i = 0; i < localStorage.length; i++ ) {
      keys.push(JSON.parse(localStorage.getItem( localStorage.key( i ) )))
    }

    return keys || []
  },

  set( transaction ) {
    localStorage.setItem( `key:${transaction.amount}`, JSON.stringify( transaction ) )

    App.reload()
  },

  clear() {
    localStorage.clear()
  },

  remove( transaction ) {
    localStorage.removeItem( `key:${transaction.amount}`)

    App.reload()
  }
}
// Handle all Transaction currency amount math operations to display the totals on Balance Section
const Transactions = {
  all: Storage.get(),

  add(transaction) {
    Storage.set( transaction )
  },

  remove(transaction) {
    Storage.remove( transaction )
  },

  incomes() {
    let sumIncomes = 0

    Storage.get().forEach((transaction) => {
      transaction.amount > 0 ? sumIncomes += Number(transaction.amount) : 0
    })
    return Utils.fomartCurrency(sumIncomes)
  },

  expenses() {
    let sumExpenses = 0

    Storage.get().forEach((transaction) => {
      transaction.amount < 0 ? sumExpenses += Number(transaction.amount) : 0
    })
    return Utils.fomartCurrency(sumExpenses)
  },

  total() {
    let sumTotal = 0

    Storage.get().forEach((transaction) => {
      sumTotal += Number(transaction.amount)
    })

    if( sumTotal < 0) {
      document.querySelector("#balance").lastElementChild.classList.remove('bg-lgreen')
      document.querySelector("#balance").lastElementChild.classList.add('bg-red')
    }
    if( sumTotal > 0) {
      document.querySelector("#balance").lastElementChild.classList.remove('bg-red')
      document.querySelector("#balance").lastElementChild.classList.add('bg-lgreen')
    }

    sumTotal = Utils.fomartCurrency(sumTotal)

    return sumTotal
  },

  updateBalance() {
    document.querySelector('.incomes .--amount-text').
    innerHTML = Transactions.incomes()
    document.querySelector('.expenses .--amount-text').
    innerHTML = Transactions.expenses()
    document.querySelector('.total .--amount-text').
    innerHTML = Transactions.total()
  }
}
// Utilities ---> format currency values
const Utils = {
  fomartCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ""

    value = String(value).replace(/\D+/g, "")

    value = Number(Number(value) / 100).toFixed(2).replace(".",",")

    value = value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    })

    return `${signal}$ ${value}`
  }
}
// Handle all data that goes into the Transaction table fields
const TransactionFields = {
  
  trContainer: document.querySelector('table tbody'),
  
  addTransaction(transaction) {
    const tr = document.createElement('tr')
    tr.innerHTML = TransactionFields.transactionInnerHTML(transaction)
    TransactionFields.trContainer.append(tr)
  },
  
  transactionInnerHTML(transaction){
    const classAmount = transaction.amount > 0 ? "--text-green" : "--text-red"
    const amount = Utils.fomartCurrency(transaction.amount)

    const html = `
      <td class="table-description-field">${transaction.description}</td>
      <td class="table-amount-field ${classAmount}">${amount}</td>
      <td class="table-date-field">${transaction.date}</td>
      <td>
      <img class="table-delete-icon" onclick="{TransactionFields.deleteCurrentTransaction(event)}" src="./assets/minus.svg" alt="Remove current row transaction">
      </td>
    `
    
    return html
  },

  clearTransactions() {
    TransactionFields.trContainer.innerHTML = ""
  },

  deleteCurrentTransaction(event) {    
    Storage.get().forEach( transaction => {
      event.path[2].innerText.trim().includes(transaction.description.trim()) ? Transactions.remove(transaction) : ''
    })
    App.reload()
  }
}
// Handle App inicialization and reloading
const App = {
  init() {
    // Initialize all transactions checking if there is any transaction stored at localStorage, and shows them on the screen
    Storage.get().forEach(( transaction ) => {TransactionFields.addTransaction( transaction )})
    
    // Update all balance values (incomes, expenses and total) with the current [stored | on screen] transactions
    Transactions.updateBalance()
  },
  
  reload() {
    TransactionFields.clearTransactions()
    App.init()
  }
}
// Handle form validation and data getting
const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description,
      amount: Form.amount,
      date: Form.date
    }
  },

  clearInputs( event ) {
    event.target[0].value = ""
    event.target[1].value = ""
    event.target[2].value = ""
  },

  submit( event ) {
    event.preventDefault()

    const description = event.target[0].value
    const amount = event.target[1].value * 100
    const date = event.target[2].value

    Storage.set({description: description, amount: amount, date: date})

    App.reload()
    Form.clearInputs( event )
    Modal.close()
  },
}


App.init()

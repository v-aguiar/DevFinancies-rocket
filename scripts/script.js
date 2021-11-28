const transactionsData = []
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
// Handle all Transaction currency amount math operations to display the totals on Balance Section
const Transactions = {
  all: transactionsData,

  add(transaction) {
    Transactions.all.push(transaction)
  },

  remove(index) {
    Transactions.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    let sumIncomes = 0

    transactionsData.forEach((transaction) => {
      transaction.amount > 0 ? sumIncomes += Number(transaction.amount) : 0
    })
    return Utils.fomartCurrency(sumIncomes)
  },

  expenses() {
    let sumExpenses = 0

    transactionsData.forEach((transaction) => {
      transaction.amount < 0 ? sumExpenses += Number(transaction.amount) : 0
    })
    return Utils.fomartCurrency(sumExpenses)
  },

  total() {
    let sumTotal = 0

    transactionsData.forEach((transaction) => {
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

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
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
    this.trContainer.innerHTML = ""
  },

  deleteCurrentTransaction(event) {
    // const currentTr = event.path[2]
    // currentTr.innerHTML = ""
    // console.log(Transactions.all)
    // console.log(event.path[2].innerText)

    let i = -1
    Transactions.all.forEach( transaction => {
      i++
      event.path[2].innerText.includes(transaction.description) ? Transactions.remove(i) : 'nothing to see here'
      Transactions.updateBalance()
    })
  }
}
// Handle App inicialization and reloading
const App = {
  init() {
    const isEmpty = ( Transactions.all.length !== 0 ) 

    // Add all transactions to the page 
    Transactions.all.forEach((transaction) => {
      isEmpty ? TransactionFields.addTransaction(transaction) : 0

      Transactions.updateBalance()
    })
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

    Transactions.add({description: description, amount: amount, date: date})

    App.reload()
    Form.clearInputs( event )
    Modal.close()
  },
}

App.init()


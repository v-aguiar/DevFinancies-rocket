const Modal = {
  
  open() {
    const modal = document.querySelector('#modal')
    
    modal.classList.add('active')
  },

  close() {
    const modal = document.querySelector('#modal')

    modal.classList.remove('active')
  }
}

const Transactions = {

  incomes() {
    let sumIncomes = 0

    transactionsData.forEach((transaction) => {
      transaction.amount > 0 ? sumIncomes += transaction.amount : 0
    })
    return Utils.fomartCurrency(sumIncomes)
  },

  expenses() {
    let sumExpenses = 0

    transactionsData.forEach((transaction) => {
      transaction.amount < 0 ? sumExpenses += transaction.amount : 0
    })
    return Utils.fomartCurrency(sumExpenses)
  },

  total() {
    let sumTotal = 0

    transactionsData.forEach((transaction) => {
      sumTotal += transaction.amount
    })
    
    return Utils.fomartCurrency(sumTotal)
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

const transactionsData = [
  {
    id:1,
    description: 'Electric Energy',
    amount: -50000,
    date: '2022-07-28',
  },
  {
    id:2,
    description: 'Water Supply',
    amount: -80000,
    date: '2022-07-29',
  },
  {
    id:3,
    description: 'Gambling',
    amount: 1500000,
    date: '2022-07-30',
  },
  
]

const TransactionFields = {
  
  trContainer: document.querySelector('table tbody'),
  
  addTransaction(transaction, id) {
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
      <img class="table-delete-icon" src="./assets/minus.svg" alt="Remove current row transaction">
      </td>
    `
    
    return html
  }
}


// Add all transactions to the page 
transactionsData.forEach((transaction) => {
  TransactionFields.addTransaction(transaction)
})

Transactions.updateBalance()
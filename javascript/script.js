'use strict';

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const appContainer = document.querySelector('.app');
const movementsContainer = document.querySelector('.movements');
const logo = document.querySelector('.logo');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// Displaying movements
const displayMovements = function (movements, sort = false) {
    movementsContainer.innerHTML = '';

    const currentMovements = sort ? movements.slice().sort((a, b) => a - b) : movements;

    currentMovements.forEach((movement, index) => {
        const type = movement > 0 ? 'deposit' : 'withdrawal';
        const html = `
       <div class="movements__row">
         <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
        <div class="movements__value">${movement}€</div>
      </div>
    `;
        movementsContainer.insertAdjacentHTML('afterbegin', html);
    });
};


// Creating usernames
const createUserNames = (accounts) => {
    accounts.forEach((account) => {
        account.username = account.owner.split(' ').map(element => element[0].toLowerCase()).join('');
    })
}


createUserNames(accounts);

// Calculating and Displaying Balance

const calculateDisplayBalance = (account) => {
    account.balance = account.movements.reduce((accumulator, movement) => accumulator + movement, 0);
    labelBalance.textContent = `${account.balance} €`;
}

// Calculating summary
const calculateDisplaySummary = (account) => {
    const incomes = account.movements.filter(movement => movement > 0).reduce((accumulator, movement) => accumulator + movement, 0);
    labelSumIn.textContent = `${incomes}€`;

    const outcomes = account.movements.filter(movement => movement < 0).reduce((accumulator, movement) => accumulator + movement, 0);
    labelSumOut.textContent = `${Math.abs(outcomes)}€`;

    const interest = account.movements.filter(movement => movement > 0).map(deposit => (deposit * account.interestRate) / 100).filter((interest) => interest >= 1).reduce((accumulator, movement) => accumulator + movement, 0);

    labelSumInterest.textContent = `${interest}€`
}

const updateUI = (account) => {
    // Display Movements
    displayMovements(account.movements);

    // Display Balance
    calculateDisplayBalance(account);

    // Display Summary
    calculateDisplaySummary(account);
}


// Implementing Login
let currentAccount;
btnLogin.addEventListener('click', (event) => {
    event.preventDefault();
    currentAccount = accounts.find(account => account.username === inputLoginUsername.value);
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        // Display Ui and Message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
        appContainer.style.opacity = 1;
    }

    // Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
});


// Implementing Transfers
btnTransfer.addEventListener('click', (event) => {
    event.preventDefault()
    let receiverAccount = accounts.find((account) => account.username === inputTransferTo.value);
    let transferAmount = Number(inputTransferAmount.value);

    inputTransferTo.value = inputTransferAmount.value = '';

    if (transferAmount > 0 && receiverAccount && currentAccount.balance >= transferAmount && receiverAccount?.username !== currentAccount.username) {
        currentAccount.movements.push(-Math.abs(transferAmount));
        receiverAccount.movements.push(transferAmount);
    }

    updateUI(currentAccount);
})

btnLoan.addEventListener('click', (event) => {
    event.preventDefault();
    const loanAmount = Number(inputLoanAmount.value);
    if (loanAmount > 0 && currentAccount.movements.some(movement => movement >= loanAmount * 0.1)) {
        currentAccount.movements.push(loanAmount);
        updateUI(currentAccount);
    }
    inputLoanAmount.textContent = '';
})


btnClose.addEventListener('click', (event) => {
    event.preventDefault();
    if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex(account => account.username === currentAccount.username);
        // Delete account
        accounts.splice(index, 1);

        // Hide Ui
        appContainer.style.opacity = 0;

        inputCloseUsername.value = inputClosePin.value = '';
        labelWelcome.textContent = `Login to get started`;
    }
});

let sorted = false;
btnSort.addEventListener('click', (event) => {
    event.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
});


















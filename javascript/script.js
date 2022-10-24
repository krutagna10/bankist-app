'use strict';

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
const displayMovements = function (movements) {
    movementsContainer.innerHTML = '';

    movements.forEach((movement, index) => {
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











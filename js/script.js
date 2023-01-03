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
        '2023-01-01T10:51:36.790Z',
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
const labelWelcome = document.querySelector('.header__welcome-text');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const appContainer = document.querySelector('.app');
const movementsContainer = document.querySelector('.movements');
const logo = document.querySelector('.header__logo');

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


// Calculating Days passed
const calcDaysPassed = (date1, date2) => {
    return Math.floor(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
};

const formatMovementDate = (date) => {
    const daysPassed = calcDaysPassed(new Date(), date)
    if (daysPassed === 0) {
        return 'Today';
    } else if (daysPassed === 1) {
        return 'Yesterday'
    } else if (daysPassed >= 1 && daysPassed <= 7) {
        return `${daysPassed} days ago`;
    } else {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}

const displayMovements = (account, sort = false) => {
    movementsContainer.innerHTML = '';

    const currentMovements = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;

    currentMovements.forEach((movement, index) => {
        const type = movement > 0 ? 'deposit' : 'withdrawal';
        let date = new Date(account.movementsDates[index]);
        let displayDate = formatMovementDate(date);

        const html = `
      <div class="movements__row">
            <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${movement.toFixed(2)}</div>
       </div>
        `;
        movementsContainer.insertAdjacentHTML('afterbegin', html);
    })
};

// Create usernames
const createUserNames = (accounts) => {
    accounts.forEach((account) => {
        account.username = account.owner.toLowerCase().split(' ').map(element => element[0]).join('');
    })
}
createUserNames(accounts);

// Calculating and displaying balance
const calculateDisplayBalance = (account) => {
    account.balance = account.movements.reduce((acc, movement) => acc + movement, 0);
    labelBalance.textContent = `${account.balance.toFixed(2)} €`;
}

// Calculating and displaying summary
const calculateDisplaySummary = (account) => {
    let incomes = account.movements.filter(movement => movement > 0).reduce((acc, movement) => acc + movement, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)}€`;

    let outcomes = account.movements.filter(movement => movement < 0).reduce((acc, movement) => acc + movement, 0);
    labelSumOut.textContent = `${outcomes.toFixed(2)}€`;

    const interest = account.movements.filter(movement => movement > 0).map(deposit => (deposit * account.interestRate) / 100).filter((interest) => interest >= 1).reduce((acc, movement) => acc + movement, 0);

    labelSumInterest.textContent = `${interest.toFixed(2)}€`
}

const updateUI = (account) => {
    // Display Movements
    displayMovements(account);

    // Display Balance
    calculateDisplayBalance(account);

    // Display Summary
    calculateDisplaySummary(account);
}

// Implementing login
let currentAccount = '';
currentAccount = account1;
updateUI(currentAccount);
appContainer.style.opacity = '1';

const currentDate = new Date();
const day = currentDate.getDate().toString().padStart(2, '0');
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const year = currentDate.getFullYear();
const hour = currentDate.getHours().toString().padStart(2, '0');
const minutes = currentDate.getMinutes().toString().padStart(2, '0');
console.log(day, month, year, hour, minutes)
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

// Login button
btnLogin.addEventListener('click', (event) => {
    event.preventDefault();
    currentAccount = accounts.find(account => account.username = inputLoginUsername.value)
    console.log(currentAccount);
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
        appContainer.style.opacity = '1';
    }
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);

})

// Transfer Button
btnTransfer.addEventListener('click', (event) => {
    event.preventDefault();
    let receiverAccount = accounts.find(account => account.username === inputTransferTo.value);
    let transferAmount = Number(inputTransferAmount.value);

    // Resetting values of form
    inputTransferTo.value = inputTransferAmount.value = '';

    if (transferAmount > 0 && receiverAccount && currentAccount.balance >= transferAmount && receiverAccount?.username !== currentAccount.username) {
        currentAccount.movements.push(-Math.abs(transferAmount));
        receiverAccount.movements.push(transferAmount);

        // Adding dates
        currentAccount.movementsDates.push(new Date().toISOString())
        receiverAccount.movementsDates.push(new Date().toISOString())
        updateUI(currentAccount);
    }
});


// Loan button
btnLoan.addEventListener('click', (event) => {
    event.preventDefault();
    const loanAmount = Math.floor(inputLoanAmount.value);
    if (loanAmount > 0 && currentAccount.movements.some(movement => movement >= loanAmount * 0.1)) {
        currentAccount.movements.push(loanAmount);
        currentAccount.movementsDates.push(new Date().toISOString());
        updateUI(currentAccount);
    }
});

btnClose.addEventListener('click', (event) => {
    event.preventDefault();
    if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex(account => account.username === currentAccount.username);
        // Delete account
        accounts.splice(index, 1);

        // Hide UI
        appContainer.style.opacity = '0';
        inputCloseUsername.value = inputClosePin.value = '';
        labelWelcome.textContent = 'Login to get started';
    }
})

let sorted = false;
btnSort.addEventListener('click', (event) => {
    event.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});




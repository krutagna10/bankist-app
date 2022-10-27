const dogs = [
    { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
    { weight: 8, curFood: 200, owners: ['Matilda'] },
    { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
    { weight: 32, curFood: 340, owners: ['Michael'] }
];

for (const dog of dogs) {
    dog.recommendedPortion = Math.trunc(dog.weight ** 0.75 * 28);
}

const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(sarahDog.curFood > sarahDog.recommendedPortion ? 'Sarah dog eats too much' : 'Sarah dog eat less');

const ownersEatMore = dogs.filter(dog => dog.curFood > dog.recommendedPortion).flatMap(dog => dog.owners);
const ownersEatLess = dogs.filter(dog => dog.curFood < dog.recommendedPortion).flatMap(dog => dog.owners);

console.log(ownersEatMore.join(' and ') + ' dogs eat too much');
console.log(ownersEatLess.join(' and ') + ' dogs eat too less');

console.log(dogs.some(dog => dog.recommendedPortion === dog.curFood));
console.log(dogs.some((dog) => dog.recommendedPortion > dog.curFood));

const okayAmountDogs = [];
for (const dog of dogs) {
    if (dog.curFood > (dog.recommendedPortion * 0.9) && dog.curFood < (dog.recommendedPortion * 1.1)) {
        okayAmountDogs.push(dog);
    }
}

const dogsCopy = [...dogs];

for (let i = 0; i < dogsCopy.length; i++) {
    for (let j = 1; j < dogsCopy.length - i - 1; j++) {
        if (dogsCopy[j].curFood < dogsCopy[j - 1].curFood) {
            let temp = dogsCopy[j];
            dogsCopy[j] = dogsCopy[j - 1];
            dogsCopy[j - 1] = temp;
        }
    }
}
console.log(dogsCopy);

let arr = [10, 8, 6, 4, 2];
arr.sort((a, b) => a - b);
console.log(arr);




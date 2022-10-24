'use strict';

const calculateHumanAge = (data) => {
  return data.map((element) => {
      if (element <= 2) {
          return element * 2;
      } else {
          return 16 + element * 4;
      }
  })
}


const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const convertedData1 = calculateHumanAge(data1).filter((element) => {
        return element > 18;
});

const averageAge = convertedData1.reduce((accumulator, element) => {
    return accumulator + element;
}, 0)

console.log(convertedData1);
console.log(`The average age is ${averageAge / data1.length}`);


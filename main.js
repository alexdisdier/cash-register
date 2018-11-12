/* main.js */

/* Cash Register */

function checkCashRegister(price, cash, cid) {

  // ****** UTILITIES ****** //

  function roundUp(n){
    return parseFloat(Math.round(n * 100) / 100).toFixed(2);
  }

  // Search Array function
  function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
          return myArray[i];
      }
    }
  }

  // ****** VARIABLES ****** //
  var cidTotal = 0;
  for (var key in cid) {
    cidTotal += cid[key][1];
  }

  var change = cash - price;
  var funds = cidTotal - change;

  var money = [
    { name: 'PENNY', value : 0.01 },
    { name: 'NICKEL', value:  0.05},
    { name: 'DIME', value:  0.1},
    { name: 'QUARTER', value: 0.25},
    { name: 'ONE', value: 1.00},
    { name: 'FIVE', value: 5.00},
    { name: 'TEN', value: 10.00},
    { name: 'TWENTY', value: 20.00},
    { name: 'ONE HUNDRED', value: 100.00}
  ];

  // ****** MAIN ****** //

  // cash-in-drawer is less than the change due
  if (funds < 0 ) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // cash-in-drawer as the value for the key change if it is equal to the change due.
  // I check if the cid values array includes the change amount
  else if (cid.map(e => e[1]).includes(change)) {
    return { status: "CLOSED", change: cid };
  }

  //
  else {
    var tempArr = [];
    var changeTemp = change;

    for (var key in cid.reverse()){
      // the bill or coins that exists within the cash register
      var cidFaceValue = (search(cid[key][0], money)).value;
      // the quantity of each bill or coin within the cash register
      var cidQuantity = cid[key][1];
      var maxChange = (Math.round((changeTemp - changeTemp % cidFaceValue) * 1e12) / 1e12);

      // if change is more than the bill or coin face value within the cash register and the change amount is more than the cash register quantity for that specific bill or coin.
      if (change > cidFaceValue && changeTemp >= cidQuantity){
        changeTemp = roundUp(changeTemp) - cidQuantity;
        cid[key][1] = cidQuantity;
        tempArr.push(cid[key]);
      }

      // if change is more than the bill or coin face value within the cash register and the change amount is less than the cash register quantity for that specific bill or coin.
      else if (changeTemp > cidFaceValue && changeTemp <= cidQuantity){
        changeTemp = changeTemp - maxChange;
        cidQuantity = maxChange;
        cid[key][1] = maxChange;
        tempArr.push(cid[key]);
      }
    }
    if (roundUp(changeTemp) == 0){
      return { status: "OPEN", change: tempArr };
    } else {
      return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

  }

  return "Not working";
}

// ****** TEST CASES ****** //

// checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
// => {status: "OPEN", change: sur 96.74
//                   [["TWENTY", 60],
//                   ["TEN", 20], il reste 16.74
//                   ["FIVE", 15],
//                   ["ONE", 1],
//                   ["QUARTER", 0.5],
//                   ["DIME", 0.2],
//                   ["PENNY", 0.04]]}.
checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);
// => {status: "INSUFFICIENT_FUNDS", change: []}.

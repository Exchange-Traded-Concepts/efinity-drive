export default class CalendarConfig {

  static async calcTable(year, month) {

    let arr = new Array(12);
    for (let x = 0; x < arr.length; x++) {
      arr[x] = new Array(6);
    }

    for (let x = 0; x < arr.length; x++) {
      for (let y = 0; y < arr[x].length; y++) {
        arr[x][y] = new Array(7);
      }
    }

  //  for (let month = 0; month < arr.length; month++) {
      // What day number the grid starts for the month
      let startDayInWeek = new Date(year, month, 0).getDay() + 1;

    // console.log(startDayInWeek)
      // Number of days in a month +1
      let monthLong = new Date(year, (month -(-1))  , 0).getDate() +1 ;

      let beforCount = 0;
      let counter = 1;
      let startCount = false;

    //  console.log('lV')
    //  console.log(arr[month].length)
    //  console.log('L^')
      for (let x = 0; x < 6; x++) {
        for (let y = 0; y < arr[month][x].length; y++) {

          if (beforCount == startDayInWeek) {
            startCount = true;
          } else {
            beforCount++;
          }

          if (startCount == true) {
            arr[month][x][y] = counter;
            counter++;
          } else {
            arr[month][x][y] = "";
          }
          if (counter > monthLong) {
            arr[month][x][y] = "";
          }
        }
      }
  // }
    return arr;
  }
}

module.exports = CalendarConfig

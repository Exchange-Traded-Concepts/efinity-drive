function sortTable(n, tName) {

   let table = document.getElementById("sortTable");

   if(tName) {
     table = document.getElementById(tName);
   }

  let  rows, cls, switching, i, x, y, shouldSwitch, dir, switchcount = 0;

  let sel = "thead th:nth-child(" + (n + 1) + ")",
      classList = table.querySelector(sel).classList;

  if (classList) {
    if (classList.contains("date")) {
      cls = "date";
    }
  }
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (cls == 'date') {
          if (Date.parse(x.innerHTML) > Date.parse(y.innerHTML)) {
            shouldSwitch = true
            break
          }
        } else {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }   else if (dir == "desc") {
        if(cls == 'date'){
          if (Date.parse(x.innerHTML) < Date.parse(y.innerHTML)) {
            shouldSwitch = true
            break
          }
        } else {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        console.log(switchcount)
        dir = "desc";
        switching = true;
      }
    }
  }
}

function date_check(){
  const start = document.getElementById('start_date').value;
  const end = document.getElementById('end_date').value;
 // if(end) {
   if (end && (start > end) ) {
     document.getElementById('eventButton').disabled = true;
     document.getElementById('alertDate').style.display = 'block'
   } else {
     document.getElementById('eventButton').disabled = false;
     document.getElementById('alertDate').style.display = 'none'
     return true
   }
// }
}

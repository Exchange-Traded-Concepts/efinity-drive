
function addFields(){
  // Generate a dynamic number of inputs
  //var number = document.getElementById("member").value;
  // Get the element where the inputs will be added to
  const container = document.getElementById("invoice_transactions");

  let table = document.getElementById("invoice_transactions");

  let totalRowCount = table.tBodies[0].rows.length;

//  console.log(totalRowCount);

  let row = table.tBodies[0].insertRow(-1 );

  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  let cell5 = row.insertCell(-1);

  cell1.innerHTML = "<label class='type_label'>Type:</label>" +
    "<select name='type["+eval(totalRowCount+1)+"]' class='invoice_input'>"  +
    "<option value='asset_based'>Asset Based</option>" +
    "<option value='board_expenses'>Board Expenses</option>" +
    "<option value='other'>Other</option>" +
    "<option value='escrow'>Escrow</option>" +
    "</select>";
  cell2.innerHTML = "<label class='desc_label'>Description:</label><input class='desc_input' name='description[]' type='text' onblur='stayLoggedIn()'>";
  cell3.innerHTML = "<label class='desc_label'>Min Pmnt.:</label><input name='min_payment[]' type='text' class='invoice_input' size='10' onblur='num_format(this)'>";
  cell4.innerHTML = " <label class='desc_label'>Calculated Pmnt.:</label><input name='calc_payment[]'  type='text' class='invoice_input' size='10' onblur='num_format(this)'>";
  cell5.innerHTML = "<label class='desc_label'>Total:&nbsp;</label><input name='total[]' type='text' id='total' class='invoice_input' onblur='calculateRowTotal(this)'>&nbsp;&nbsp;&nbsp;";
  cell5.className = "floatRight";
}

function calculateRowTotal(totalInput) {
  const row = totalInput.parentNode.parentNode; // Get the parent row
  const minPaymentInput = row.querySelector('input[name="min_payment[]"]');
  const calcPaymentInput = row.querySelector('input[name="calc_payment[]"]');

  // Parse the values as numbers
  const minPayment = parseFloat(minPaymentInput.value.replace(',', ''));
  const calcPayment = parseFloat(calcPaymentInput.value.replace(',', ''));

  // Determine the maximum payment
  let maxPayment = 0;
  if (calcPayment < 0) {
    maxPayment = calcPayment;
  } else {
    maxPayment = Math.max(minPayment, calcPayment);
  }

  // Set the value of the total input
  totalInput.value = parseFloat(maxPayment).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2});
  updateTotalSum();
  displayNet();
}

function calcExpSum(){
  const totalInputs = document.querySelectorAll('input[name="total[]"]');
  let sum = 0;

  // Loop through all the total inputs and add up their values
  totalInputs.forEach((totalInput) => {
    const value = parseFloat(totalInput.value.replace(',', ''));
    if (!isNaN(value)) {
      sum += value;
    }
  });
  return sum;
}


function updateTotalSum() {
  let sum = calcExpSum()
 // Set the text of the total span to the sum
  const totalSpan = document.getElementById('inv_total');
  totalSpan.textContent = parseFloat(sum).toLocaleString('en-US', {style: 'currency', currency: 'USD'}); // Round to 2 decimal places
}

function formatAll(){
  const mins = document.querySelectorAll('input[name="min_payment[]"]');
  const calcs = document.querySelectorAll('input[name="calc_payment[]"]');
  const totals = document.querySelectorAll('input[name="total[]"]');
  mins.forEach((min) => {
    const val = min.value.replace(',', '');
    min.value = parseFloat(val).toLocaleString('en-US' , {minimumFractionDigits: 2, maximumFractionDigits: 2});
  })
  calcs.forEach((calc) => {
    const val2 = calc.value.replace(',','');
    calc.value = parseFloat(val2).toLocaleString('en-US' , {minimumFractionDigits: 2, maximumFractionDigits: 2});
  })
  totals.forEach((total) => {
    const val3 = total.value.replace(',','');
    total.value = parseFloat(val3).toLocaleString('en-US' , {minimumFractionDigits: 2, maximumFractionDigits: 2});
  })
  updateTotalSum();
  displayNet();

}


function hideRow(button) {
  const row = button.parentNode.parentNode; // Get the parent row
  const descriptionInput = row.querySelector('input[name="description[]"]');
  const totalInput = row.querySelector('input[name="total[]"]');

  // Clear the description input field
  descriptionInput.value = '';
  totalInput.value=0;

  // Hide the row
  row.style.display = 'none';

  // Update the total sum
  updateTotalSum();
  displayNet();
}

function calcNet(){
  let exp = calcExpSum();
  let income = parseFloat(document.getElementById('income').value.replace(',',''));

  return parseFloat(income - exp)
}

function displayNet(){
  let sum = calcNet();
  const netSpan = document.getElementById('inv_net');
  netSpan.textContent = parseFloat(sum).toLocaleString('en-US', {style: 'currency', currency: 'USD'}); // Round to 2 decimal places
}

function confirmReturn(){
    let ask = window.confirm("Please make sure all updates have been submitted");
    if (ask) {
     // window.alert("This post was successfully deleted.");
        location.href = "/invoice_admin";
    }
}

function stayLoggedIn(){

  fetch('/logged').then(r => 'logged');

}


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
  cell2.innerHTML = "<label class='desc_label'>Description:</label><input class='desc_input' name='description[]' type='text'>";
  cell3.innerHTML = "<label class='desc_label'>Min Pmnt.:</label><input name='min_payment[]' type='text' class='invoice_input' size='10' onblur='num_format(this)'>";
  cell4.innerHTML = " <label class='desc_label'>Calculated Pmnt.:</label><input name='calc_payment[]'  type='text' class='invoice_input' size='10' onblur='num_format(this)'>";
  cell5.innerHTML = "<label class='desc_label'>Total:</label><input name='total[]' type='text' id='total' class='invoice_input' onblur='calculateRowTotal(this)'>";
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
  totalInput.value = parseFloat(maxPayment).toLocaleString();
  updateTotalSum();
}

function updateTotalSum() {
  const totalInputs = document.querySelectorAll('input[name="total[]"]');
  let sum = 0;

  // Loop through all the total inputs and add up their values
  totalInputs.forEach((totalInput) => {
    const value = parseFloat(totalInput.value.replace(',', ''));
    if (!isNaN(value)) {
      sum += value;
    }
  });

  // Set the text of the total span to the sum
  const totalSpan = document.getElementById('total');
  totalSpan.textContent = sum.toFixed(2); // Round to 2 decimal places
}

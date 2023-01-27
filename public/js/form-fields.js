function addFields(){
  // Generate a dynamic number of inputs
  //var number = document.getElementById("member").value;
  // Get the element where the inputs will be added to
  const container = document.getElementById("invoice_transactions");

  let table = document.getElementById("invoice_transactions");

  let totalRowCount = table.tBodies[0].rows.length;

  console.log(totalRowCount);

  let row = table.tBodies[0].insertRow(-1 );

  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  let cell5 = row.insertCell(4);
  let cell6 = row.insertCell(-1);

  cell1.innerHTML = "<label class='type_label'>Type:</label>" +
    "<select name='transaction_type["+eval(totalRowCount+1)+"]' class='invoice_input'>"  +
    "<option value='asset_based'>Asset Based</option>" +
    "<option value='board_expenses'>Board Expenses</option>" +
    "<option value='other'>Other</option>" +
    "<option value='escrow'>Escrow</option>" +
    "</select>";
  cell2.innerHTML = "<label class='desc_label'>Description:</label> <input class='desc_input' name='description["+eval(totalRowCount+1)+"]' type='text'>";
  cell3.innerHTML = "<label class='desc_label'>Qty:</label><input name='qty["+eval(totalRowCount+1)+"]' id='qty"+eval(totalRowCount+1)+ "' type='text' class='invoice_input' size='3' value='1'>";
  cell4.innerHTML = "<label class='desc_label'>Min Pmnt.:</label><input name='min_pmnt["+eval(totalRowCount+1)+"]' id='minpmnt"+eval(totalRowCount+1)+ "' type='text' class='invoice_input' size='10'>";
  cell5.innerHTML = " <label class='desc_label'>Calculated Pmnt.:</label><input name='calc_pmnt["+eval(totalRowCount+1)+"]' id='calc_pmnt"+eval(totalRowCount+1)+"' type='text' class='invoice_input' size='10'>";
  cell6.innerHTML = "<label class='desc_label'>Total:</label><input name='total["+eval(totalRowCount+1)+"]' type='text' id='total"+eval(totalRowCount+1)+ "' class='invoice_input' onblur='calc_row_total("+eval(totalRowCount+1)+")'>";
}

function add_etc_fees(){

  let basis_points = document.getElementById('bps').value;
  let days_in_month = document.getElementById('days_in_month').value;
  let avg_daily_assets = document.getElementById('avg_daily_assets').value;
  let total_etc = document.getElementById('bps_total').value;

  if(total_etc === 0.00 || !total_etc || eval(total_etc*1) == 0){
    return alert('Fees are not a valid Number')
  }

   let table = document.getElementById("invoice_transactions");

  let totalRowCount = table.tBodies[0].rows.length;

  console.log(totalRowCount);

  let row = table.tBodies[0].insertRow(0);

  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  let cell5 = row.insertCell(4);
  let cell6 = row.insertCell(-1);

  cell1.innerHTML = "<label class='type_label'>Type:</label>" +
    "<select name='transaction_type["+eval(totalRowCount+1)+"]' class='invoice_input'>"  +
    "<option value='asset_based' selected>Asset Based</option>" +
    "<option value='board_expenses'>Board Expenses</option>" +
    "<option value='other'>Other</option>" +
    "<option value='escrow'>Escrow</option>" +
    "</select>";
  cell2.innerHTML = "<label class='desc_label'>Description:</label> " +
    "<input class='desc_input' name='description["+eval(totalRowCount+1)+"]' type='text' value='ETC Fee "+basis_points+"(bps) -"+days_in_month+" Days'>";
  cell3.innerHTML = "<label class='desc_label'>Qty:</label><input name='qty["+eval(totalRowCount+1)+"]' id='qty"+eval(totalRowCount+1)+ "' type='text' class='invoice_input' size='3' value='1'>";
  cell4.innerHTML = "<label class='desc_label'>Min Pmnt.:</label><input name='min_pmnt["+eval(totalRowCount+1)+"]' id='minpmnt"+eval(totalRowCount+1)+ "' type='text' class='invoice_input' size='10'>";
  cell5.innerHTML = " <label class='desc_label'>Calculated Pmnt.:</label><input name='calc_pmnt["+eval(totalRowCount+1)+"]' id='calc_pmnt"+eval(totalRowCount+1)+"' type='text' class='invoice_input' size='10' value='"+total_etc+"'>";
  cell6.innerHTML = "<label class='desc_label'>Total:</label><input name='total["+eval(totalRowCount+1)+"]' type='text' id='total"+eval(totalRowCount+1)+ "' class='invoice_input' onblur='calc_row_total("+eval(totalRowCount+1)+")'>";

  calc_row_total(eval(totalRowCount+1));

}

function add_vendor_fees(){

  let v_bps = parseFloat(document.getElementById('vendor_bps').value);
  let days_in_month = document.getElementById('days_in_month').value;
  let avg_daily_assets = document.getElementById('avg_daily_assets').value;
  let vendor_total = document.getElementById('vendor_total').value;

  if(vendor_total === 0.00 || !vendor_total || eval(vendor_total*1) == 0){
    return alert('Fees are not a valid Number')
  }

  let table = document.getElementById("invoice_transactions");

  let totalRowCount = table.tBodies[0].rows.length;

  console.log(totalRowCount);

  let row = table.tBodies[0].insertRow();

  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  let cell5 = row.insertCell(4);
  let cell6 = row.insertCell(-1);

  cell1.innerHTML = "<label class='type_label'>Type:</label>" +
    "<select name='transaction_type["+eval(totalRowCount+1)+"]' class='invoice_input'>"  +
    "<option value='asset_based' selected>Asset Based</option>" +
    "<option value='board_expenses'>Board Expenses</option>" +
    "<option value='other'>Other</option>" +
    "<option value='escrow'>Escrow</option>" +
    "</select>";
  cell2.innerHTML = "<label class='desc_label'>Description:</label> " +
    "<input class='desc_input' name='description["+eval(totalRowCount+1)+"]' type='text' value='Vendor Fee "+v_bps+"(bps) -"+days_in_month+" Days'>";
  cell3.innerHTML = "<label class='desc_label'>Qty:</label><input name='qty["+eval(totalRowCount+1)+"]' id='qty"+eval(totalRowCount+1)+ "' type='text' class='invoice_input' size='3' value='1'>";
  cell4.innerHTML = "<label class='desc_label'>Min Pmnt.:</label><input name='min_pmnt["+eval(totalRowCount+1)+"]' id='minpmnt"+eval(totalRowCount+1)+ "' type='text' class='invoice_input' size='10'>";
  cell5.innerHTML = " <label class='desc_label'>Calculated Pmnt.:</label><input name='calc_pmnt["+eval(totalRowCount+1)+"]' id='calc_pmnt"+eval(totalRowCount+1)+"' type='text' class='invoice_input' size='10' value='"+vendor_total+"'>";
  cell6.innerHTML = "<label class='desc_label'>Total:</label><input name='total["+eval(totalRowCount+1)+"]' type='text' id='total"+eval(totalRowCount+1)+ "' class='invoice_input' onblur='calc_row_total("+eval(totalRowCount+1)+")'>";

  calc_row_total(eval(totalRowCount+1));

  add_etc_fees();
  calc_sheet()

}


function total_income(){
  let assets = document.getElementById('assets');
}

function etc_fee(){
  let basis_points = document.getElementById('bps').value;
  let days_in_month = document.getElementById('days_in_month').value;
  let days_in_yr = document.getElementById('days_in_yr').value;
  let avg_daily_assets = document.getElementById('avg_daily_assets').value;
  let total_etc = document.getElementById('bps_total');

  let total = eval((basis_points/days_in_yr) * ( days_in_month *avg_daily_assets ));

  vendor_fee();

  return total_etc.value=total.toFixed(2);

}

function vendor_fee(){
  let v_bps = parseFloat(document.getElementById('vendor_bps').value);
  let days_in_month = document.getElementById('days_in_month').value;
  let days_in_yr = document.getElementById('days_in_yr').value;
  let avg_daily_assets = document.getElementById('avg_daily_assets').value;
  let total_vendor = document.getElementById('vendor_total');

  let total = eval((v_bps/days_in_yr) * ( days_in_month *avg_daily_assets )).toFixed(2);

  return total_vendor.value=total;
}

function days_in_yr(){
  let fullDate = document.getElementById('invoice_for_date').value;
  let yr = fullDate.substring(0,3)
  if((yr % 4) ===0){
    document.getElementById('days_in_yr').value = 366;
  }
  else{
    document.getElementById('days_in_yr').value = 365;
  }

}

function calc_row_total(row_id){

  let qty = parseFloat(document.getElementById('qty'+row_id).value);
  let min_pmnt = parseFloat(document.getElementById('minpmnt'+row_id).value);
  let calc_pmnt = document.getElementById('calc_pmnt'+row_id).value;

  if (min_pmnt>=calc_pmnt){
    let cal_amount = eval(qty * min_pmnt);
    return document.getElementById('total'+row_id).value = cal_amount.toFixed(2);
   }else
   {
     let cal_amount = eval(qty * calc_pmnt);
     return document.getElementById('total'+row_id).value = cal_amount.toFixed(2);
   }

}

function calc_sheet(){
  let table = document.getElementById("invoice_transactions");
  let totalRowCount = table.tBodies[0].rows.length;
  let total =0;
  console.log(totalRowCount);

  let income = document.getElementById('income').value;

  for(let i =1; i<= totalRowCount; i++){
    total += parseFloat(document.getElementById('total'+i).value);
    console.log(total)
  }
  total = (1*total)
  total = parseFloat(income - total);
  return document.getElementById('sheet_total').value =total.toFixed(2);
  //alert(total)

}

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
  let min_pmnt = document.getElementById('minpmnt'+row_id).value;
  min_pmnt = min_pmnt.replaceAll(',','');
  let str = document.getElementById('calc_pmnt'+row_id).value;
  calc_pmnt = str.replaceAll(',','');


  if (min_pmnt>=calc_pmnt){
    let cal_amount = parseFloat(eval(qty * min_pmnt));
    cal_amount = number_format(cal_amount, 2, '.', ',')
    return document.getElementById('total'+row_id).value = cal_amount;
   }else
   {
     let cal_amount = parseFloat(eval(qty * calc_pmnt));
     cal_amount = number_format(cal_amount, 2, '.', ',')
     return document.getElementById('total'+row_id).value = cal_amount;
   }

}

function calc_sheet(){
  let table = document.getElementById("invoice_transactions");
  let totalRowCount = table.tBodies[0].rows.length;
  let total =0;
  console.log(totalRowCount);

  let income = document.getElementById('income').value;
  income = income.replaceAll(',','');

  for(let i =1; i<= totalRowCount; i++){
    total += parseFloat(document.getElementById('total'+i).value.replace(',', ''));
    console.log(total)
  }
  total = (1*total)
  total = parseFloat(income - total);

  total = number_format(total, 2, '.', ',')
  return document.getElementById('sheet_total').value =total;
  //alert(total)

}

function number_format (number, decimals, dec_point, thousands_sep) {
  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

async function populateList(year, month, day){

  let fye = await monthFetch(month)
  let annualReport = await monthFetch(annualReportArr(month))
  let semiAnnualReport = await monthFetch(semiAnnualArr(month))

  let HTML = '<div>';
  for(let i = 0; i< fye.length; i++){
   HTML += fye[i].ticker +  " FYE<br>"
  }
  HTML += '</div>'

  HTML += '<div>';
  for(let i = 0; i< annualReport.length; i++){
    HTML += annualReport[i].ticker +  " AR Due<br>"
  }
  HTML += '</div>'

  HTML += '<div>';
  for(let i = 0; i< semiAnnualReport.length; i++){
    HTML += semiAnnualReport[i].ticker +  " Semi-Annual Due<br>"
  }
  HTML += '</div>'

  if(month.length > 2){
    month = '0'+month
  }
  if(day.length >2){
    day = '0'+day
  }
  let date_string = year+'-'+month+'-'+day
  let calEvents = await dayFetch(date_string)
  console.log(calEvents)

  let HTML2 = '<div>';
  for(let i = 0; i< calEvents.length; i++){
    HTML2 += calEvents[i].title +  " "+calEvents[i].type +" Event<br>"
  }
  HTML2 += '</div>'

  let content = document.getElementById('list-events')
  let title = document.getElementById('calListHeader')
  let content2 = document.getElementById('dailyEvents')
  let titleText = showMonth(month) + " "+ year;

  title.innerHTML = titleText;
  content.innerHTML = HTML + HTML2;
  content2.innerHTML = HTML2;

}
async function getFYE(month){
  let fye = await populateList()
}

async function monthFetch(month) {
  let tickers;
  try {
    const response = await fetch('/cal_list_date_month/' + month, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    });
    const tickers = await response.json();
    return tickers;
  } catch (error) {
    throw new Error('Ooops! Something went wrong! ' + error);
  }
}

async function dayFetch(dateString) {
  let events;
  try {
    const response = await fetch('/cal_list_date/' + dateString, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    });
    const events = await response.json();
    return events;
  } catch (error) {
    throw new Error('Ooops! Something went wrong! ' + error);
  }
}

async

function semiAnnualArr(key){
 let  arr = {
    1:5,
    2:6,
    3:7,
    4:8,
    5:9,
    6:10,
    7:11,
    8:12,
    9:1,
    10:2,
    11:3,
    12:4
  };
 return arr[key];
}

function annualReportArr(key){

  let arr = {
      3:1,
      4:2,
      5:3,
      6:4,
      7:5,
      8:6,
      9:7,
      10:8,
      11:9,
      12:10,
      1:11,
      2:12
    }
  return arr[key]

}

function showMonth(month){

  let monthArr = {1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December"}
  return monthArr[month];ß
}

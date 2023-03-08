function num_format(el){
  let value = el.value
  let formatted_number = number_format(value, 2,'.', ',')
  return el.value = formatted_number;
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
   HTML += "<span class='fye' style='font-size:1rem;margin-bottom:4px;display:inline-block'>"+fye[i].ticker +  " FYE</span><br>"
  }
  HTML += '</div>'

  HTML += '<div>';
  for(let i = 0; i< annualReport.length; i++){
    HTML += "<span class='ar' style='font-size:1rem;margin-bottom:4px;display:inline-block'>"+annualReport[i].ticker +  " AR Due</span><br>"
  }
  HTML += '</div>'

  HTML += '<div>';
  for(let i = 0; i< semiAnnualReport.length; i++){
    HTML += "<span class='semi' style='font-size:1rem;margin-bottom:4px;display:inline-block'>"+semiAnnualReport[i].ticker +  " Semi-Annual Due</span><br>"
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

  let HTML2 = '<div>';
  for(let i = 0; i< calEvents.length; i++){
    HTML2 += "<div class="+calEvents[i].type+" style='font-size:1rem;margin-bottom:4px;'>"

      if(calEvents[i].type === 'time_off'){
        HTML2 += calEvents[i].createdBy.first_name+ " "+calEvents[i].createdBy.last_name+" ";
      }
      HTML2 += calEvents[i].title +  " "+checkContent(calEvents[i].notes) + "</div>"

  }
  HTML2 += '</div>'

  let content = document.getElementById('list-events')
  let title = document.getElementById('calListHeader')
  let content2 = document.getElementById('dailyEvents')
  let titleText = showMonth(month) + " "+day+", "+ year;

  title.innerHTML = titleText;
  content.innerHTML = HTML;
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

function checkContent(c){
  if(c === null){
    return "";
  }
  else return c;
}

function showMonth(month){

  let monthArr = {1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December"}
  return monthArr[month];ß
}

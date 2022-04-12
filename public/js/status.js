async function StatusUpdate(task_id, status_id){
  let inno = document.getElementById('t_'+task_id);
  let span_c = document.getElementById('t_s_'+task_id);
  let c = statusColor(status_id)

  await fetch('/task_status/'+task_id+'/'+status_id, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify(this.formData)
  })
    .then(()=>{
      console.log(inno);
      inno.innerHTML = tStatus(status_id);
      span_c.style.color = c;
    })
    .catch(() => {
      this.message = 'Ooops! Something went wrong!'
    })
}

async function StatusUpdateS(task_id, status_id){
  let inno = document.getElementById('ts_'+task_id);
  let span_c = document.getElementById('ts_s_'+task_id);
  let c = statusColor(status_id)

  await fetch('/sub_task_status/'+task_id+'/'+status_id, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify(this.formData)
  })
    .then(()=>{
      console.log(inno);
      inno.innerHTML = tStatus(status_id);
      span_c.style.color = c;
    })
    .catch(() => {
      this.message = 'Ooops! Something went wrong!'
    })
}

function statusColor(status){
  console.log(status)
  let s_s = 'N/A'
  switch(status) {
    case 1:
      sColor = '#AEBACC';
      break;
    case 2:
      sColor = '#E6B41D';
      break;
    case 3:
      sColor = '#27AE60';
      break;
    case 4:
      sColor = '#D52B1E';
      break;
    default:
       '#FFFFF0';
  }
  return sColor;
}

function tStatus(status){
  console.log(status)
  let p = 'N/A'
  switch(status) {
    case 1:
      p = 'No Progress';
      break;
    case 2:
      p = 'In Progress';
      break;
    case 3:
      p = 'Completed';
      break;
    case 4:
      p = 'Archive';
      break;
    default:
      'N/A';
  }
  return p;
}

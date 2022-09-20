
var code = document.getElementById("password");

var strengthbar = document.getElementById("meter");



var display = document.getElementsByClassName("textbox")[0];

code.addEventListener("keyup", function() {
  checkpassword(code.value);
});

function confirmPassword(){


  const val1 = document.getElementById('password').value
  const val2 = document.getElementById('password_confirmation').value

  if(val1.length < 6 ){
    document.getElementById('error_display').style.display = 'block'
    document.getElementById('error_display').innerHTML = "Password must be at least 6 characters long"
    document.getElementById('register_submit').disabled = true;
    return
  }

  if(val1 != val2){
    document.getElementById('register_submit').disabled = true;
    document.getElementById('error_display').style.display = 'block'
    document.getElementById('error_display').innerHTML = "Passwords do not match"
  }
  else {
    document.getElementById('error_display').style.display = 'none'
    document.getElementById('register_submit').disabled = false;
  }
}

function result() {

  var showHide = document.getElementById("toggle");

  var val= document.getElementById("passwordvalue")

  if (val.style.display==="block"){
    val.style.display="none";
    showHide.value="Hide";
  }

  else{
    val.style.display="block";}

  return (val.innerHTML ="The strength of your password is" + " " + strengthbar.value + "%");
}

function checkpassword(password) {
  var strength = 0;
  if (password.match(/[a-z]+/)) {
    strength += 1;
  }
  if (password.match(/[A-Z]+/)) {
    strength += 1;
  }
  if (password.match(/[0-9]+/)) {
    strength += 1;
  }
  if (password.match(/[$@#&!]+/)) {
    strength += 1;

  }

  if(password.length === 0){ display.innerHTML = "";
  }

  if (password.length < 6 && password.length !==0) {
    display.innerHTML = "minimum password length is 6";
  }
  if(password.length > 6 && password.length < 12) { display.innerHTML = "";

  }
  if (password.length > 12) {
    display.innerHTML = "maximum password length is 12";
  }

  switch (strength) {
    case 0:
      strengthbar.value = 0;
      break;

    case 1:
      strengthbar.value = 25;
      break;

    case 2:
      strengthbar.value = 50;
      break;

    case 3:
      strengthbar.value = 75;
      break;

    case 4:
      strengthbar.value = 100;
      break;
  }

}







/**
 var code = document.getElementById("password");

 var strengthbar = document.getElementById("meter");

 code.addEventListener("keyup",function(){

checkpassword(code.value)
})

 var display = document.getElementsByClassName("textbox")[0];

 function checkpassword(password)
 {

	var strength=0;

	if (password.match(/[a-z]+/)){
		strength+=1;
	}

	if (password.match(/[A-Z]+/)){
		strength+=1;
	}

	if (password.match(/[0-9]+/)){
		strength+=1;
	}

	if (password.match(/[$@#&!]+/)){
		strength+=1;

		}

	if (password.length < 6){
	display.innerHTML ="minimum number of characters is 6";
	}

	if (password.length > 12){
			display.innerHTML = "maximum number of characters is 12";
}


	switch(strength){
	case 0:
	    strengthbar.value=0;
	    break;

	case 1:
	    strengthbar.value=25;
	    break;

	case 2:
	    strengthbar.value=50;
	    break;

	case 3:
	    strengthbar.value=75;
	    break;

	case 4:
	    strengthbar.value=100;
	    break;
}

}

 **/


































/**
 $(document).ready(function(){

var input = $("#password").val();

if (input.length>0 && input.length<6){
$(".textbox").text("password must be at least six characters long");
}

else if (input.length>6 && input.length<12){$(".textbox").text("");}

else if (input.length>12){$(".textbox").text("you have exceeded the number of allowed characters");}
else {$(".textbox").text("");}
});

 **/





function isOnline(){
    return navigator.onLine;
}
function getStorage(name) {
    var value = window.localStorage.getItem(name);
    if(!value) return undefined;
    return value;
}

function setStorage(name, value) {
    window.localStorage.setItem(name, value);
}

function showAlert() {
	if(isMobile()){
		navigator.notification.alert(
        'Provide your email and password.',  // message
        alertDismissed,         // callback
        'Login',            // title
        'Ok'                  // buttonName
    	);
	}else{
		alert('Provide your email and password.');
	}
   
}
function showMessage(msg,header) {
    //alert(msg);
	if(isMobile()){
		 navigator.notification.alert(
	        msg,  // message
	        alertDismissed,         // callback
	        header,            // title
	        'Ok'                  // buttonName
    	);
	}else{
		alert(msg);
	}
   
}
function showError(msg,header) {
    if(isMobile()){
         navigator.notification.alert(
            msg,  // message
            alertDismissed,         // callback
            header,            // title
            'Ok'                  // buttonName
        );
    }else{
        alert(msg);
    }
   
}

function showDefaultError(){
	
	if(isMobile()){
		 navigator.notification.alert(
	        'Server error! Try again.',  // message
	        alertDismissed,         // callback
	        'Error',            // title
	        'Ok'                  // buttonName
    	);
	}else{
		alert('Server error! Try again');
	}
}
function alertDismissed() {
   
}
var AjaxLoader= function(){
	this.show = function(){
		$('.ajax-loader').show();	
	};
	this.close = function(){
		$('.ajax-loader').hide();	
	};
}

function isMobile() {
    ///<summary>Detecting whether the browser is a mobile browser or desktop browser</summary>
    ///<returns>A boolean value indicating whether the browser is a mobile browser or not</returns>

    if (sessionStorage.desktop) // desktop storage 
        return false;
    else if (localStorage.mobile) // mobile storage
        return true;

    // alternative
    var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile']; 
    for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

    // nothing found.. assume desktop
    return false;
}
function signuperror(){
	if(isMobile()){
		navigator.notification.alert(
		        'Unable to signup,Try again.',  // message
		        alertDismissed,         // callback
		        'Error',            // title
		        'Ok'                  // buttonName
	    	);
	}else{
		alert('Server error! Try again');
	}
}
function getFormData(dom_query){
    var out = {};
    var s_data = $(dom_query).serializeArray();
    //transform into simple data/value object
    for(var i = 0; i<s_data.length; i++){
        var record = s_data[i];
        out[record.name] = record.value;
    }
    return out;
}
function onPressBack(e) {
    e.preventDefault();
    navigator.notification.confirm("Are you sure you want to quit?", function(result){
        console.log("Exiting app");
        navigator.app.exitApp();
    }, 'Quit Champion Team', 'Cancel,Ok');

}
function checkDate(date1,date2){
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    //maximumEstimatedReturnDate
    var a = new Date(date1);
    if(!date2)
        var b = new Date();
    else
        var b = new Date(date2);

    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    var diff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    if(diff > 0){
        console.log('date1 is smaller/past');
        return -1;
    }else if(diff < 0){
        return 1;
        console.log('date1 is greater/future or today');
    }else{
        return 0;
        console.log('two dates are equal');
    }
    return false;
}
function countDown(date){
    var clock = document.getElementById("elapsed_time")
    , targetDate = new Date(date); // Jan 1, 2050;
    var timer = countdown(targetDate);
    clock.innerHTML = timer.days+'&nbsp:&nbsp'+timer.hours
                    +'&nbsp:&nbsp'+timer.minutes+'&nbsp:&nbsp'+timer.seconds;
    setInterval(function(){
        checkIfGameLock(app1.roundLock);
        var timer = countdown(targetDate);
        clock.innerHTML = timer.days+'&nbsp:&nbsp'+timer.hours+'&nbsp:&nbsp'+timer.minutes+'&nbsp:&nbsp'+timer.seconds;
        //00&nbsp:&nbsp01&nbsp:&nbsp56&nbsp:&nbsp06
    }, 1000);
}
function dateAdd(date, interval, units) {
  var ret = new Date(date); //don't change original date
  switch(interval.toLowerCase()) {
    case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
    case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
    case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
    case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
    case 'day'    :  ret.setDate(ret.getDate() + units);  break;
    case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
    case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
    case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
    default       :  ret = undefined;  break;
  }
  return ret;
}
function arrToObject(arr){
    var obj = arr.reduce(function(o, v, i) {
      o[v.RoundId] = v;
      return o;
    }, {});
    return obj;
}
roundWiseDetails = [
{
"roundId":1,
"roundName":"Round1",
"remainingSalary":122,
"teamValue":1000,
"roundPoints":200
},
{
"roundId":2,
"roundName":"Round2",
"remainingSalary":122,
"teamValue":8000,
"roundPoints":50
},
{
"roundId":3,
"roundName":"Round3",
"remainingSalary":122,
"teamValue":3000,
"roundPoints":60
},
{
"roundId":4,
"roundName":"Round4",
"remainingSalary":122,
"teamValue":4000,
"roundPoints":70
},
{
"roundId":5,
"roundName":"Round5",
"remainingSalary":122,
"teamValue":5000,
"roundPoints":80
},
{
"roundId":6,
"roundName":"Round6",
"remainingSalary":122,
"teamValue":2000,
"roundPoints":90
},
{
"roundId":7,
"roundName":"Round7",
"remainingSalary":122,
"teamValue":7777,
"roundPoints":30
},
{
"roundId":8,
"roundName":"Round8",
"remainingSalary":122,
"teamValue":8888,
"roundPoints":40
},
{
"roundId":9,
"roundName":"Round9",
"remainingSalary":122,
"teamValue":9999,
"roundPoints":20
}
]

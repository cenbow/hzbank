define(['zepto'],function(){
	
	function unitTip(elem){	
	  var ipt = elem.find('input');
	  ipt.on("keyup",function(){
		  this.value=this.value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,''); 
	  });
	  var tip = $('<span class="tip"></span>');
	  elem.addClass('unitTip');
	  tip.appendTo(elem);
	  var unitStr = ['empty','千','万','十万','百万','千万','亿','spilled'];
	  
	  function getVal(s){
	    return s.replace(/,/g, '').split('.');
	  }
	  
	  function getUnit(s){
		var l = s.length; 
		if(l > 3 && l < 10){
		  return unitStr[l-3];
		}else if(l < 4){
		  return unitStr[0];	
		}else{
		  return unitStr[7];
		}
	  }
	  
	  function setVal(e, arr){
	    var dec = arr[1], 
		    int = arr[0], 
			intArr = int.split(''), 
			intArrLg = intArr.length, 
			newStr = '';
		
		for(var i=0; i<intArrLg; i++){
		  var fir = intArrLg%3;
		  newStr += intArr[i];
		  if((fir != 0 && intArrLg > 3 && i+1 == fir) || ((i+1-fir)%3 == 0 && i+1 != intArrLg)){
	         newStr += ',';
			 
		  }
		}	
		if(typeof dec != 'undefined'){
		  newStr += '.'+dec;
		}
		e.focus();
		e.val('');
		e.val(newStr);
	  }
	  
	  function run(){
	    var curVal = getVal(ipt.val());  
		var curUnit = getUnit(curVal[0]);
		if(curUnit == 'empty'){
		  tip.hide();
		}else if(curUnit == 'spilled'){
		  tip.show().addClass('over').text('');
		}else{
		  tip.show().removeClass('over').text(curUnit);
		}
		setVal(ipt, curVal);
	  }
	  
	  ipt.on('input', run);
	  ipt.on('focus', run);
	  ipt.on('blur',function(){tip.hide()});
	}

	$.fn.unitTip = function(){
	  this.each(function(){
	    var $this = $(this);
	    new unitTip($this);
	  })
	};
})
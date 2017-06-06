define(['zepto'],function(){
  var TAG = "MUI.ifoDot";
  MUI.log(TAG,"----start---");
  
  function muiDot(elem , options){
     this.elem = $(elem);
	 this.options = options;
	 if(this.options.addDot){
	 	this.addDot();
	 }
	 if(this.options.removeDot){
	 	this.removeDot();
	 }
	 
  }
  
  muiDot.DEFAULTS = {
    type : 'simple',  //有两种type simple && ifo
	color : '' , //小点颜色
	dataIfo : ''  //红点提示内容
  }
  muiDot.prototype.addDot = function(){
	 this.removeDot();  
	 (this.options.type=="ifo") ?
	 $('<div style="background:'+this.options.color+';"><div/>').appendTo(this.elem).addClass('zen-dot-ifo').html(this.options.dataIfo) : this.elem.addClass('zen-dot');	 
  }
  muiDot.prototype.removeDot = function(){
	var aldot = this.elem.removeClass('zen-dot').find('.zen-dot-ifo'); 
    aldot && aldot.remove();
  }
  
  $.muiDot = muiDot;
  $.fn.muiDot = function (option) {
    return this.each(function(){
	  var $this = $(this);
	  var options = $.extend({}, muiDot.DEFAULTS, typeof option == 'object' && option);
	  if (!data) {
		  var data = new muiDot(this, options);
		  $this.data('muiDot',data); 
	  }
	  new muiDot(this, options);
	  if (typeof option == 'string') data[option]();
	
	})
  }
})
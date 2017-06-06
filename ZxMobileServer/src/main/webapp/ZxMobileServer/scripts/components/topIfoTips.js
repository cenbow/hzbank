define(['zepto'],function(){
	
  function topIfoTips(elem, options){
	 this.elem = $(elem);
	 this.options = options;
	 this.addTips();
  }
  
  topIfoTips.DEFAULTS = {
			text : '暂无消息',
		   align : 'left',
		   delay : '3000',
	  scrollText : false
  }
  
  topIfoTips.prototype.addTips = function(){
	  
	var $this = this;
	var textAlign = this.options.align;
	var ifoText = '<span>'+this.options.text+'</span>';
	$this.removeTips();
	if(this.options.scrollText){
	  ifoText = '<marquee>'+ifoText+'</marquee>';
	}
	$('<div class="zen-top-tips">'+
		 '<div class="text" style="text-align:'+textAlign+'">'+ifoText+'</div>'+
		 '<i class="close"></i>'+
	'</div>').prependTo(this.elem); 
	
	//倒计时关闭
	setTimeout(function(){
	  $this.removeTips();
	},this.options.delay);
	
	//关闭按钮绑定关闭事件
	 this.elem.find('.zen-top-tips .close').one('click',function(){
		 $this.removeTips();
	 });
	 
  }
  
  topIfoTips.prototype.removeTips = function(){
	this.elem.find('.zen-top-tips').remove();
  }
  
  $.fn.topIfoTips = function(option){
	 return this.each(function(){
	   var $this = $(this);
	   var options = $.extend({},topIfoTips.DEFAULTS, typeof option == 'object' && option);
	   new topIfoTips($this, options);
	 })
  }
  
})
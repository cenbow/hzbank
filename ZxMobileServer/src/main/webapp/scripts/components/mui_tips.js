define(['./mui_transition'],function(){
	
 //保证在header 节点加载完成后调用
 MUI.tips = {
    defaults : {
	  text : "无法获取信息",
	  delay : 2000,
	  type : 'words'
	},	
	
	//创建tips DOM节点插入body
	create : function(opts){
	  $('.ui-dialog-tips').remove(); 
      var def = this.defaults;
	  $.extend(true,def,opts);
	  var boxType = 'ui-dialog-tips';
	  def.type == 'words' ? null : boxType = 'ui-dialog-tips paragraph';
	  $('<div class="'+boxType+'" style="-webkit-animation-duration:'+def.delay+'ms; animation-duration:'+def.delay+'ms;">'+
         '<span class="tips-label">'+def.text+'</span>'+
      '</div>').appendTo('body');
	}	
 }
  return MUI;
})
define(function(require, exports, module){
	
	var goldGuideTpl = require("text!../template/goldGuide.html");
	
	var goldGuideView = module.exports = ItemView.extend({
		
		events : {
		},
		
		template : goldGuideTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			$('.director .list-item').on('click',function() {
				var me = $(this), cnt = me.next(), setH = cnt.find('.para').get(0).offsetHeight;
				me.hasClass('spr') ? me.removeClass('spr')
						&& cnt.css('height', 0) : me.addClass('spr')
						&& cnt.css('height', setH);
				me.parent().siblings().find(".list-item").hasClass('spr') ? me.parent().siblings().find(".list-item").removeClass('spr')
						&& me.parent().siblings().find(".list-item").next().css('height', 0) : null;
			});
		    Client.hideWaitPanel(1);
		},
		
		goBack : function(){
			App.back();
		}		
	
	});
});

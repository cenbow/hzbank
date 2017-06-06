define(function(require, exports, module){
	
	var goldDetailTpl = require("text!../template/goldDetail.html");
	
	var goldDetailView = module.exports = ItemView.extend({
		
		events : {
			"click #finance" : "finance",
			"click #bosera" : "bosera"
		},
		
		template : goldDetailTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			$('.director .list-item').on('click',function() {
				var me = $(this), cnt = me.next(), setH = cnt.find('.para')
						.get(0).offsetHeight;
				me.hasClass('spr') ? me.removeClass('spr')
						&& cnt.css('height', 0) : me.addClass('spr')
						&& cnt.css('height', setH);
				me.parent().siblings().find(".list-item").hasClass('spr') ? me.parent().siblings().find(".list-item").removeClass('spr')
						&& me.parent().siblings().find(".list-item").next().css('height', 0) : null;
			});
			// tab切换
			var $li = $('.mapping li');
			var $tabs = $('.tab .cell');
			$tabs.on('click', function() {
				var idx = $(this).index();
				$li.hide();
				$tabs.removeClass('active');
				$li.eq(idx).show();
				$tabs.eq(idx).addClass('active');
			});
			Client.hideWaitPanel(1);
		},
		
		goBack : function(){
			App.back();
		}
	});
});

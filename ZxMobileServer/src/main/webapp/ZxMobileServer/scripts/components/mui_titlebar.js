define(['zepto'],function(){
	var TAG = "MUI.Titlebar";
	MUI.log(TAG,"----start---");
	var leftbutton = '<a class="titlebar-left-btn"></a>';
	var rightbutton = '<a class="titlebar-right-btn"></a>';
	var tplstart = '<header class="nav-wrap"><div class="web-titlebar"><h1 class="web-title"></h1>';
    var tplEnd = '</div></header>';
	// 设置页面的标题栏；
	var me = MUI.Titlebar = {

		defaults:{
			title:'首页', //中间标题
			leftButton:{
				exist:'true', //true显示 false隐藏
				name:'',//左显示的文字
				func:'null',//绑定的方法
				class:'titlebar-left-btn'     //自定义的样式
			},
			rightButton:{
				exist:'true', //true显示 false隐藏
				name:'',//左显示的文字
				func:'null',//绑定的方法
				class:'titlebar-right-btn'     //自定义的样式
			}	
		},
		create : function() {
			MUI.log(TAG,"----create----");
		    $("<div class='title-bar-shim-layer'></div>").prependTo($('body')); 
			
			var tpl = tplstart + leftbutton + rightbutton + tplEnd;
			var jqEl = $(tpl);
			this.div = jqEl.prependTo($('body'));
			
			this.leftBtn = jqEl.find(".titlebar-left-btn").hide();
			this.rightBtn = jqEl.find(".titlebar-right-btn").hide();
			this.webtitle = jqEl.find(".web-title");
				
		},
		change : function(conf){
			MUI.log(TAG,"----change----");
			conf = $.extend(true,this.defaults,conf);
			var leftExist = (conf.leftButton.exist == 'true' ? true : false);
			var rightExist = (conf.rightButton.exist == 'true' ? true : false);
			var leftClass = conf.leftButton.class;
			var rightClass = conf.rightButton.class;
			var leftName = conf.leftButton.name;
			var rightName = conf.rightButton.name;
			var leftFn = conf.leftButton.func;
			var rightFn = conf.rightButton.func;
			
			var leftBtn = this.leftBtn;
			var rightBtn = this.rightBtn;
			var webtitle = this.webtitle;
			
			conf.title && webtitle.html(conf.title);

			leftExist && leftBtn.show();
			rightExist && rightBtn.show();
			
			leftClass.length == 0 ? leftBtn.attr('class','') : leftBtn.addClass(leftClass);
			rightClass.length == 0 ? rightBtn.attr('class','') : rightBtn.addClass(rightClass);
			
			leftName && leftBtn.attr('data-title',leftName);
			rightName && rightBtn.attr('data-title',rightName);
			
			leftFn && leftBtn.unbind('click').on("click", function(){eval(leftFn);});
			rightFn && rightBtn.unbind('click').on("click", function(){eval(rightFn);});
		}
	};
	//me.create();
	MUI.log(TAG,"----end----");
	
	return MUI;
});
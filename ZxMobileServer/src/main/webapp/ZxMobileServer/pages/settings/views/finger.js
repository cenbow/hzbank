define(function(require, exports, module){
	
	var fingerTpl = require("text!../template/finger.html");
	
	var fingerView = module.exports = ItemView.extend({
		
		template : fingerTpl,
		
		events : {
			"click #finger" : "openFinger"
		},
		
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    var pageTest = {
				  	title:'指纹',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  }
			Client.initPageTitle(pageTest);
		    
		    //指纹初始化 
			this.fopt = {
				 type:2,    	//1开关指纹，2获取手势状态
				 isopen:true,	//true打开指纹，false关闭指纹
				 callback:"curView.getFinger"	//回调函数
			};
			 
			Client.setFinger(this.fopt);
			 
		    Client.hideWaitPanel(100);
		},
		
		getFinger : function(isopen){
			 if(isopen=="0"){
				 document.getElementById("finger").checked=false;
				 $("#finger").removeClass("checked");
			 }else{
				 document.getElementById("finger").checked=true;
				 $("#finger").addClass("checked");
			 }
		 },
		 
		openFinger: function(){
			 var fingerChecked = document.getElementById("finger").checked;
			 this.fopt.isopen = fingerChecked;
			 this.fopt.type=1;
			 
			 Client.setFinger(this.fopt);
			 return false;
		 
		 },
		 
		goBack : function(){
			App.back();
		}
	
	});
});

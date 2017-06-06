define(function (require, exports, module) {
	
	var TransferHelpTemplate = require("text!../template/transferHelp.html");
	
	var TransferHelpView = module.exports = ItemView.extend({
		
        template : TransferHelpTemplate,
        
        events:{
        	
        },
        
        initialize : function(){
        	//初始化菜单方法
	       	 var pageStep1 = {
	       		  	title:'帮助',
	       			leftButton:{
	       				name : '返回',
	       				func: 'curView.goBack()'
	       			},
	       			rightButton:{
	       				name : '',
	       				func : ''
	       			}
	       	  };
        	Client.initPageTitle(pageStep1);
        	Client.hideWaitPanel(1);
        },

        goBack : function(){
        	App.back();
     	  },
	});
});
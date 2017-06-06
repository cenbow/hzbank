define(function (require, exports, module) {
	
	var myScoreTemplate = require("text!../template/myScore.html");
	
	var MyScoreView = module.exports = ItemView.extend({
		
		
		template : myScoreTemplate,
        
        events:{
        	"click #scoreDetail" : "scoreDetail",
        	"click #scoreActive" : "scoreActive",
        	"click #exchangeMall" : "exchangeMall"
        },
        
        initialize : function(options){
        	var pageTest = {
        		  	title:'我的积分',
        			leftButton:{
        				name : '返回',
        				func: 'curView.goBack()'
        			},
        			rightButton:{
        				name : ''
        			}
        		  };
        	Client.initPageTitle(pageTest);
        	
        },
        
        goBack:function(){
        	App.back();
    	},  
        
    	scoreDetail : function(){
    		App.navigate("account/mycountCtl/scoreDetail");
    	},
    	
    	scoreActive : function(){
			Utils.alertinfo("敬请期待");
    	},
    	
    	exchangeMall : function(){
			Utils.alertinfo("敬请期待");
    	}
     
	});
	
});
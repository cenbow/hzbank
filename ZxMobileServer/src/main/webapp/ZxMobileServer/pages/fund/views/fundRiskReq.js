define(function (require, exports, module) {
	
	var fundRiskReqTemplate = require("text!../template/fundRiskReq.html");
	
	var FundRiskReqView = module.exports = ItemView.extend({
		
        template : fundRiskReqTemplate,
        
        events:{
        	"click #submitBtn" : "submitBtn",
        	"click #riskAgain" : "riskAgain",
        	"click #fundSign" : "fundSign",
//        	"click #fundBuy" : "fundBuy",
        	"click #back" : "back",
        },
        
        initialize : function(){

        	var pageStep1 = {
        		title:"基金评测",
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        		
        	};

        	Client.initPageTitle(pageStep1);
        	this.init();
        },
        
        
        init : function(){
        	this.answerT="";
   	     	var $this = this;
        	$('.userTest label').on('tap',function(){
               $(this).addClass('chosen').siblings().removeClass('chosen');
               $this.checkButton();
        	});
//        	this.isFundSign = Utils.trim(App.storage.get("_parameters").iEFundBaseinfo.isFundSign);
//        	alert(this.isFundSign);
//        	if(this.isFundSign!='0'){
//        		App.navigate("fund/fundCtl/fundBuyIn");
//        	}      	
        	
			Client.hideWaitPanel(1);

        },

        submitBtn : function(){
        	var $this = this;
        	if(this.answerT.length != 41){
        		Utils.alertinfo("请把题目做完");
        		return false;
        	}
    		var param = {
    		   		 strs:"10|\n#"+this.answerT,
    	    		 cardNo:Utils.getEleCard().cardNo,
    	    		 pageFlag:'0'
    		};
    		Client.openWaitPanel("加载中");
    		Ajax({url:"/fund/fundRiskReq",data:param, success:function(data){
				if(Utils.isEmpty(data.errorCode)){
					$("#result_riskLevel").text($this.transType(data.riskLevel));
					Client.hideWaitPanel(1);
					$("#img").attr("class","ico-eval "+$this.transClass(data.riskLevel));
				   $("#riskLevelPage1").hide();
				   $("#riskLevelPage2").show();
				   var btnFlag = Utils.trim(App.storage.get("_parameters").iEFundBaseinfo.btnFlag);
				   if(btnFlag=="0"){
	        			$("#fundSign").val("继续买入");
	        		}else if(btnFlag=="1"){
	        			$("#fundSign").val("继续定投");
	        		}
				   App.storage.set("fundRiskReq",data);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
				Client.hideWaitPanel(1);   
    		},error:function(){
    			Client.hideWaitPanel(1);
    		}});
    	},
    	
    	transType : function(type){
			switch(type){
				case '1':
					return "保守型";
					break;
				case '2':
					return "稳健型";
					break;
				case '3':
					return "平衡型";
					break;
				case '4':
					return "成长型";
					break;
				case '5':
					return "进取型";
					break;
				default:
					return "未知";
					break;
			}
		},
		
		transClass : function(type){
			switch(type){
				case '1':
					return "d";
					break;
				case '2':
					return "f";
					break;
				case '3':
					return "e";
					break;
				case '4':
					return "c";
					break;
				default:
					return "b";
					break;
			}
		},
    	
        goBack : function(){
        	App.back();
    	},
    	
    	back : function(){
    		App.back(2);
		},
    	
    	checkButton : function(){
    	    var answer ="";
        	$('#riskLevelPage1 label.chosen').each(function(i,e){      		
        		answer +=$(this).attr('data-value');
        	});
        	if(answer.length == 41){
        		$("#submitBtn").removeClass('disabled').removeAttr('disabled');
        		this.answerT = answer;
        	}else{
        		$("#submitBtn").addClass('disabled').attr('disabled',true);
        	}
        	Client.hideWaitPanel(1);
      	},
      	fundSign : function(){

      		var isFundSign = Utils.trim(App.storage.get("_parameters").iEFundBaseinfo.isFundSign);
      		var btnFlag = Utils.trim(App.storage.get("_parameters").iEFundBaseinfo.btnFlag);
        	if(isFundSign!="0"){
        		if(btnFlag=="0"){
        			App.navigate("fund/fundCtl/fundBuyIn");
        		}else if(btnFlag=="1"){
        			App.navigate("fund/fundCtl/fundTimeInvest");
        		}
        	}else{
        		var kcoll =App.storage.get("_parameters").iEFundBaseinfo;
        		App.storage.set("iEFundBaseinfo",kcoll);
        		App.navigate("fund/fundCtl/fundSign",{iEFundBaseinfo:kcoll});
        	}  
      	},
      	
      	riskAgain : function(){
		   $("#riskLevelPage2").hide();
		   $("#riskLevelPage1").show();
           $("#riskLevelPage1 label").removeClass('chosen');
           this.checkButton();
      	}

	});
	
});
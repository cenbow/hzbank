define(function (require, exports, module) {
	
	var fundSignTemplate = require("text!../template/fundSign.html");
	
	var fundSignView = module.exports = ItemView.extend({
		
        template : fundSignTemplate,
        
        events:{
        	"click #nextBtn" : "nextBtn",
        	"click #submitBtn" : "submitBtn",
        	"click #pwd" : "showPassword",
        	"keyup #customerBirthdayText,#customerAddress,#customerZipcode" : "checkButton1",
        	"blur #customerBirthdayText,#customerAddress,#customerZipcode" : "checkButton1",
        	"click #successReturn" : "goFundList",
        	"click #errorReturn" : "showPage1",
        	"click #customerBirthdayText" : "showDate"
        },
        
        initialize : function(){

        	var pageStep1 = {
        		title:"基金签约",
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        		
        	};

        	Client.initPageTitle(pageStep1);
        	this.init();
        },
        
        
        init : function(){  	
        	this.password = "";
        	this.pwdkey = "";
        	var  fundRiskReq=App.storage.get("fundRiskReq");
        	$("#riskLevel").text(Utils.getParamDisplay("PB_FUND_CUST_RISK",fundRiskReq.riskLevel));
    		Client.hideWaitPanel(1);
    		
        },
        
        submitBtn : function(){
			if($("#submitBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			var $this = this;
			var  riskLevel=App.storage.get("fundRiskReq").riskLevel;
			var param ={
					cardNo:this.model.get("cardNo"),
					riskLevel:riskLevel,
					accountName:this.model.get("accountName"),
					certType:this.model.get("certType"),
					certNo:this.model.get("certNo"),
					pwdkey:this.pwdkey,
					password:this.password
				};
				Client.openWaitPanel("拼命加载中，请稍候");
				Ajax({url:"/fund/fundCustSignup", data:param, success:function(data){
						if(MUI.isEmpty(data.errorCode)){
							var userInfo = App.storage.get("UserInfo");
							var iCardInfo = userInfo.iCardInfo;
				    		for(var len=0;len<iCardInfo.length;len++){
				    			var cardNoColl = iCardInfo[len].cardNo;
				    			if(Utils.trim(cardNoColl) == $this.model.get("cardNo")){
				    				userInfo.iCardInfo[len].cardFlag1 = '0';
				    			}
				    		}
							App.storage.set("UserInfo",userInfo);//将参数放入session
							App.storage.set("fundIsSign","1");//基金已签约
//							$this.initPageSucc();	
							$this.goFundBuyIn();
						}else{
//							$("#errorMessage").text(data.errorMessage);
//							$this.initPageError();	
							Utils.alertinfo(data.errorMessage,"提醒");
						};
						Client.hideWaitPanel(1);
		    			$("#pwd").val("");
		    			$this.password=$this.pwdkey="";
		    			Client.loadPwdKey();
					},error:function(){
		    			$("#pwd").val("");
		    			$this.password=$this.pwdkey="";
		    			Client.loadPwdKey();
				}});  
        },
    	
    	showPassword : function(){
    		Utils.focusPosition($("#pwd").parent());
    		var opt = {
    			elem:"#pwd",//当前对像
    			type:'number',//text 字母与数字 number数字键盘
    			max:'6',
    			callback:'curView.savePassword'
    		};
    		Client.showPwdPicker(opt);
    	},
    	
    	savePassword : function(obj){
    		this.password = obj.pwd;
    		this.pwdkey = obj.pwdKey;
    		this.checkButton2();
    	},
    	checkButton1 : function(){
    		  (!Utils.isEmpty($('#customerBirthdayText').val())&&!Utils.isEmpty($('#customerAddress').val())&&!Utils.isEmpty($('#customerZipcode').val())) ?
    				    $("#nextBtn").removeClass('disabled').removeAttr('disabled') : $("#nextBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  

      	},
    	checkButton2 : function(){
    		  (!Utils.isEmpty(this.password)) ?
    				    $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  

      	},
        goBack : function(){
        	App.back();
    	},
    	
        goFundBuyIn : function(){
        	var  kcoll=App.storage.get("_parameters").iEFundBaseinfo;
        	App.storage.set("iEFundBaseinfo",kcoll);
        	if(kcoll.btnFlag=="0"){
    			App.navigate("fund/fundCtl/fundBuyIn",{iEFundBaseinfo:kcoll});
    		}else if(kcoll.btnFlag=="1"){
    			App.navigate("fund/fundCtl/fundTimeInvest",{iEFundBaseinfo:kcoll});
    		}
    	},
    	
	});
	
});
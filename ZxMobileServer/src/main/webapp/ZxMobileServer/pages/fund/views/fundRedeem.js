define(function (require, exports, module) {
	
	var fundRedeemTemplate = require("text!../template/fundRedeem.html");
	
	var fundRedeemView = module.exports = ItemView.extend({
		
        template : fundRedeemTemplate,
        
        events:{
        	"keyup #tranAmtText" : "checkButton1",
        	"blur #tranAmtText" : "checkButton1",
        	"click #redeemBtn" : "submitRedeem",
        	"click #pwd" : "showPassword",
        	"click #submitBtn" : "submitBuy",
        	"click #successReturn" : "goBack",
        	"click #errorReturn" : "goBack"
        },
        
        initialize : function(){

        	var pageStep1 = {
        		title:"基金赎回",
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        		
        	};

        	Client.initPageTitle(pageStep1);
        	this.init();
        },
        
        
        init : function(param){       	
        	this.password = "";
        	this.pwdkey = "";

    		Client.hideWaitPanel(1);
        },
        submitRedeem : function(){
			if($("#redeemBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
        	var $this = this;
    		var cardNo = this.model.get("cardNo");
    		var accountType = this.model.get("accountType");
    		var fundCode = this.model.get("fundCode");
    		var fundName = this.model.get("fundName");
    		var largRedFlag = $("#td_confirm_largRedFlag").val();
        	var tranAmt = $("#tranAmtText").val();
    		if(!Utils.checkAmount(tranAmt)){
    			return false;
    		}
    		if(!$this.password||!$this.pwdkey){
    			Utils.alertinfo("请输入交易密码！");
    			return false;
    		}
    			
    		var param = {
	    		cardNo:cardNo,
	    		accountType:accountType,
	    		fundCode:fundCode,
	    		fundName:fundName,
	    		actionFlag:"0",
	    		assoDate:"",
				largRedFlag:largRedFlag,
				fundVol:tranAmt.replace(/,/g,""),
    			password:this.password,
    			pwdkey:this.pwdkey
    		};
    		Client.openWaitPanel("加载中");
    		Ajax({url:"/fund/fundRedeem",data:param, success:function(data){ //基金赎回
				if(MUI.isEmpty(data.errorCode)){
    				$('#recAmt_suc').text(Utils.formatCurrency(tranAmt));
					 App.storage.remove("myFundList");
					 App.storage.remove("myFundInfo");
					 App.storage.remove("fundCancelList");
    				$this.initPageSucc();
   
    			}else{
    				$('#errorMessage').text(data.errorMessage);
    				$this.initPageError();
    			}
				Client.hideWaitPanel(1);
    			$("#pwd").val("");
    			$this.password=$this.pwdkey="";
    			$this.checkButton1();
    			Client.loadPwdKey();
    		},error:function(){
    			Client.loadPwdKey();
    		}});
    	},
        
    	//控制页面显示
    	showPage : function(num){
    		for(var i=1;i<=3;i++){
    			if(i==num){
    				$("#fundRedeemPage"+i).show();
    			}else{
    				$("#fundRedeemPage"+i).hide();
    			}
    		}
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
    		this.checkButton1();
    	},
    	
//    	checkAmount : function(amtShow){
//    		if(Utils.isEmpty(amtShow) ){
//    			Utils.alertinfo("请输入金额");
//    			return false;
//    		}else if(Utils.isMoney(amtShow)){
//    			return true;
//    		}else{
//    			Utils.alertinfo("金额格式错误");
//    			return false;
//    		}
//    	},

        goBack : function(){
        	App.back();
    	},
    	checkButton1 : function(){
  		  (!Utils.isEmpty($('#tranAmtText').val())&&!Utils.isEmpty(this.password)) ?
  				    $("#redeemBtn").removeClass('disabled').removeAttr('disabled') : $("#redeemBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
      	},
    	initPageSucc : function(){//成功结果页面
			this.showPage(2);
    	},
    	initPageError : function(){//失败结果页面
			this.showPage(3);
    	}
	});
	
});
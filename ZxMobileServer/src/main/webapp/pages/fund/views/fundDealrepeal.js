define(function (require, exports, module) {
	
	var fundDealrepealTemplate = require("text!../template/fundDealrepeal.html");
	
	var fundDealrepealView = module.exports = ItemView.extend({
		
        template : fundDealrepealTemplate,
        
        events:{
        	"click #cancelBtn" : "submitCancel",
        	"click #pwd" : "showPassword",
        	"click #submitBtn" : "submitBuy",
        	"click #successReturn" : "goBack",
        	"click #errorReturn" : "goBack"
        },
        
        initialize : function(){

        	var pageStep1 = {
        		title:"基金撤单",
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        		
        	};

        	Client.initPageTitle(pageStep1);
    		Client.hideWaitPanel(1); 

        	this.init();
        },
        
        
        init : function(param){ 	
        	this.password = "";
        	this.pwdkey = "";

        },
        submitCancel : function(){
			if($("#cancelBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
        	var $this = this;
    		var cardNo = this.model.get("cardNo");
    		var accountType = this.model.get("accountType");
    		var serialNo = this.model.get("serialNo");

    		if(!$this.password||!$this.pwdkey){
    			Utils.alertinfo("请输入交易密码！");
    			return false;
    		}
    			
    		var param = {
	    		cardNo:cardNo,
	    		accountType:accountType,
	    		serialNo:serialNo,
    			password:this.password,
    			pwdkey:this.pwdkey
    		};
    		Client.openWaitPanel("加载中");
    		Ajax({url:"/fund/fundTransCancel",data:param, success:function(data){ //基金撤单
				if(MUI.isEmpty(data.errorCode)){
					 App.storage.remove("myFundInfo");
					 App.storage.remove("myFundList");
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
    				$("#fundCancelPage"+i).show();
    			}else{
    				$("#fundCancelPage"+i).hide();
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

        goBack : function(){
        	App.back();
    	},
    	checkButton1 : function(){
  		  (!Utils.isEmpty(this.password)) ?
  				    $("#cancelBtn").removeClass('disabled').removeAttr('disabled') : $("#cancelBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
      	},
    	initPageSucc : function(){//成功结果页面
			this.showPage(2);
    	},
    	
    	initPageError : function(){//失败结果页面
			this.showPage(3);
    	}
	});
	
});
define(function (require, exports, module) {
	
	var depositCancelTemplate = require("text!../template/depositCancel.html");
	
	var depositCancelView = module.exports = ItemView.extend({
		
        template : depositCancelTemplate,
        
        events:{
         	 "click #pwd" : "showPassword",
         	 "click #doSubmit" : "doSubmit", 
        	 "click #succBackButton":"goBack",
        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep1 = {
        		title:'结构性存款撤单',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        	};
        	Client.initPageTitle(pageStep1);
        	
        	this.password = "";
        	this.pwdkey = "";

    		Client.hideWaitPanel(1);
        },
        doSubmit : function(){
			if($("#doSubmit").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			};
			var $this = this;

			var param = {
					"cardNo": Utils.getEleCard().cardNo,
					"accountType": Utils.getEleCard().accountType,
					"hostFlowNo" : this.model.get("serialNo"),
					"password" : this.password,
					"pwdkey" : this.pwdkey
			};
			
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/design/productRepeal",data:param, success:function(data){
				if(Utils.isEmpty(data.errorCode)){
					$('#recAccName_suc').text(Utils.cardNoFomart(Utils.getEleCard().cardNo));
					$('#recAmt_suc').text(Utils.formatCurrency($this.model.get("financeAmt")));
    				if(!MUI.isEmpty(App.storage.get("designCancelList"))){
    					App.storage.remove("designCancelList");	
    				} 
    				if(!MUI.isEmpty(App.storage.get("paramAccount"))){
    					App.storage.remove("paramAccount");	
    				}  
    				if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
    					App.storage.remove("balanceInfo");	
    				}
					$this.initPage2();
				}else{
					Utils.alertinfo(data.errorMessage);
				}
    			$("#pwd").val("");
    			$this.password=$this.pwdkey="";
    			$("#doSubmit").addClass('disabled').attr('disabled',true);
				Client.loadPwdKey();
				Client.hideWaitPanel(1);
			},error:function(){
    			$("#pwd").val("");
    			$this.password=$this.pwdkey="";
    			$("#doSubmit").addClass('disabled').attr('disabled',true);
				Client.loadPwdKey();
				Client.hideWaitPanel(1);
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
			this.checkButton();
    	},
        goBack : function(){
        	App.back();
    	},
    	initPage2 : function(){//成功结果页面
    		var pageStep = {
        		title:'结构性存款撤单',
    			leftButton:{
    				name: '返回',
    				func: 'curView.goBack()'
    			}
    		};
    		
			Client.initPageTitle(pageStep);
			this.showPage(2);
    	},
		//控制页面显示
		showPage : function(num){
			for(var i=1;i<=2;i++){
				if(i==num){
					$("#depositCancel"+i).show();
				}else{
					$("#depositCancel"+i).hide();
				}
			}
		},
    	checkButton : function(){
    		  //验证码开始进行匹配
    		  (!Utils.isEmpty(this.password)) ?
    				    $("#doSubmit").removeClass('disabled').removeAttr('disabled') : $("#doSubmit").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
      	}
	});
});
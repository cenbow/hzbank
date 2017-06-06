define(function(require, exports, module){
	var chageCardTpl = require("text!../template/changeCard.html");
    
	var chageCardView = module.exports = ItemView.extend({
		template : chageCardTpl,
		events:{
        	"click #password":"showPwd",      	
        	"click #submit":"toNextStep",
        	"click #btn_sendSMS":"sendMessage", 
        	"keyup #input_bindCardNo,#phonePassInput":"checkButton",
        	"blur #phonePassInput":"checkButton",
        	"blur #input_bindCardNo":"secondStep",
        	"click .i-card" : "ocrBankCard"
		},
		initialize : function(){
			//初始化菜单方法
			 var pageStep1 = {
				  	title:'更改绑定卡',
					leftButton:{
						name : '返回',
						func: 'curView.goBack()'
					},
					rightButton:{
						name : '帮助',
						func : 'curView.help()'
					}
			  };
			 Client.initPageTitle(pageStep1);
			 Client.hideWaitPanel(1);
			 
        	 this.pwd ="";
        	 this.pwdKey ="";
        	 this.vBasis="PB1107";
     		 this.validTime = 60;
     		 this.isUse = true;
			 if(this.model.get("balance")>0){
		    		$('.step1').topIfoTips({
				           text : '请将账户资金全部转入绑定账户后再变更',
					       align : 'left',
					       delay : '90000',
					       scrollText : false
					 });
		     		 this.isUse = false;
			 }
			 
//	      		var $this = this;
//	      		this.bankUrlClass ="";
//	      		$("#all_bankst li").on("click",function(){
//	      			
//	      			var bankVal = $(this).attr("data-value");
//	  				var bankInfo = bankVal.split('|');
//	  				
//	  				$("#input_bank").val(bankInfo[0]);  
//	  				$("#input_bank").attr("data-value",bankInfo[1]);
//	  				$this.bankUrlClass="ico-bnk "+bankInfo[2];
//	  				$("#input_bankUrl").removeClass().addClass($this.bankUrlClass);  
//	  				if(bankInfo[1]==Utils.getParamDisplay("ORG_CODE","hzbank")){
//	  					$this.cardType = "00";
//	  					$("#tr_safeInput").show();
//	  				}else{
//	  					$this.cardType = "04";
//	  					$("#tr_safeInput").hide();
//	  				}
//	  				
//	  				$this.goToBack2();
//	  				$this.checkButton();
//	      		});
			  
		},
        //第二步
		secondStep : function(){ //为提交按钮绑定提交事件
			var bindCardNo = $("#input_bindCardNo").val();
			if(bindCardNo.length<16){
				$("#input_bankUrl").removeClass();  
	  			$("#input_bank").val("");  
	  			$("#input_bank").attr("data-value","");
				return;
			}
			
			var params = {
					cardNo:bindCardNo,
					queryType:'1'
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			var $this = this;
			Ajax({ url: "/bank/checkCardBin", data:params, success: function(data){
				if(MUI.isEmpty(data.errorCode)){
					var icoll = data.iCardBinInfo;
		    		if(icoll!=null&&icoll.length>0){		
						var kColl = icoll[0];
						var cardType2 = kColl.cardType;
						if(cardType2=='0'){
							var orgCode = kColl.orgCode;
							var orgName = kColl.orgName;
	   						var bankIconUrl = kColl.bankIconUrl;
	   						var bankClass = 'ico-bnk bnk-'+bankIconUrl.split('_')[1]+' mr5';
	   		  				$("#input_bankUrl").removeClass().addClass(bankClass);  
	   		  				$("#input_bank").val(orgName);  
	   		  				$("#input_bank").attr("data-value",orgCode);
	   		  				if(orgCode==Utils.getParamDisplay("ORG_CODE","hzbank")){
	   		  					$this.cardType = "01";
	   		  					$("#tr_safeInput").show();
	   		  				}else{
	   		  					$this.cardType = "04";
	   		  					$("#tr_safeInput").hide();
	   		  				}  				
	   		  				$this.checkButton();
	  					    Client.hideWaitPanel(1);

//							var val='0';
//							if(bankType != orgCode){
//								Utils.alertinfo("所选银行与卡号不符");	
//								Client.hideWaitPanel(1);
//								return;	
//							}
//							$this.toNextStep();
						}else{
							$("#input_bankUrl").removeClass();  
				  			$("#input_bank").val("");  
				  			$("#input_bank").attr("data-value","");
				  			$this.cardType = "";
   		  					$("#tr_safeInput").hide();
							Utils.alertinfo("您输入的卡类型为非借记卡！");		
							Client.hideWaitPanel(1);
						}
				    }else{
						$("#input_bankUrl").removeClass();  
			  			$("#input_bank").val("");  
			  			$("#input_bank").attr("data-value","");
			  			$this.cardType = "";
		  				$("#tr_safeInput").hide();
						Utils.alertinfo("暂不支持该银行！");		
						Client.hideWaitPanel(1);
//				    	if(bankType==Utils.getParamDisplay("ORG_CODE","hzbank")){
//				    		$this.cardType='01';	
//				    	}
//				    	$this.toNextStep();
				    }
				}else{
					$("#input_bankUrl").removeClass();  
		  			$("#input_bank").val("");  
		  			$("#input_bank").attr("data-value","");
		  			$this.cardType = "";
	  				$("#tr_safeInput").hide();
					Utils.alertinfo(data.errorMessage);		
					Client.hideWaitPanel(1);
				}
			}});			 				 	    
		},
		toNextStep : function(){
			if($("#submit").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			var bankType = $('#input_bank').attr("data-value");
			var bindCardNo = $('#input_bindCardNo').val();
			
			if(!this.isUse){
		    	Utils.alertinfo("请将账户资金全部转入绑定账户后再变更","1");	
				return;
			}

			if(MUI.isEmpty(bankType)){
		    	Utils.alertinfo("请选择绑定卡银行");	
				return;
			}
			if(MUI.isEmpty(bindCardNo)){
		    	Utils.alertinfo("请输入绑定卡卡号");	
				return;
			}
			
			var bankName = $('#input_bank').val();
			var bankType = $('#input_bank').attr("data-value");
			var bindCardNo = $('#input_bindCardNo').val();
		    var vCode = $('#phonePassInput').val();
    		var param = {
    				cardNo:this.model.get("cardNo"),
    				userName:this.model.get("userName"),
					cardType:this.cardType,
    				bankName:bankName,
    				bankType:bankType,
    				bindCardNo:bindCardNo,
    				vBasis:this.vBasis,
    				vCode:vCode,
					payPwd:this.pwd,
					pwdkey:this.pwdKey   				
	    		};
			  var $this = this;
			  Client.openWaitPanel("拼命加载中，请稍候");
			  Ajax({url:"/myBankCard/modBindCard", data:param, 
				  success:function(data){
					  Client.hideWaitPanel(1);
					  if(MUI.isEmpty(data.errorCode)){
						  var userInfo = App.storage.get("UserInfo");
						  var activate = App.storage.get("activate");
						  if($this.cardType=='04'){
							  userInfo.iCardInfo[Utils.getEleCard().elecAccIndex].cardStatus = '00';
							  activate = true;
						  }else{
							  userInfo.iCardInfo[Utils.getEleCard().elecAccIndex].cardStatus = '01';
							  activate = false;
						  }
						  App.storage.set("activate",activate);
						  App.storage.set("UserInfo",userInfo);//将参数放入session	
						  
						  Utils.alertinfo("更换成功！");
						  App.storage.remove("bindCardInfo");
						  App.storage.remove("bindCardInfo2");
						  App.storage.remove("userCardList");
//						  App.navigate("myBankCard/myBankCardCtl/myBankCard");
						  App.back();
					  }else{
						  Utils.alertinfo(data.errorMessage);
					  }				
					  $this.clearPwd();
	    		},error:function(){
				    $this.clearPwd();
	    		}});
		},
	    clearPwd : function(){
    		$("#phonePassInput").val("");
    		$("#password").val("");
    		this.pwdkey = "";
    		this.pwd = "";
    		this.checkButton();
			Client.loadPwdKey();
    	},
  		showPwd : function(){
			Utils.focusPosition($("#password").parent());
			 var opt = {
					 elem:"#password",//当前对像
					 type:'number',//text 字母与数字 number数字键盘
					 max:'6',
					 callback:'curView.savePassword'
				 };
				 Client.showPwdPicker(opt);
		},

		savePassword : function(data){
			 this.pwd = data.pwd;
			 this.pwdKey = data.pwdKey;
			 this.checkButton();	
		},
		checkButton : function(){
			  if(this.cardType == "00"||this.cardType == "01"){
				  (!MUI.isEmpty($('#input_bindCardNo').val())&&!MUI.isEmpty($('#input_bank').attr("data-value"))&&!MUI.isEmpty($('#phonePassInput').val())&&!MUI.isEmpty(this.pwd)) ?
						  $("#submit").removeClass('disabled').removeAttr('disabled') : $("#submit").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		    
			  }else{				  
				  (!MUI.isEmpty($('#input_bindCardNo').val())&&!MUI.isEmpty($('#input_bank').attr("data-value"))&&!MUI.isEmpty($('#phonePassInput').val())) ?
						  $("#submit").removeClass('disabled').removeAttr('disabled') : $("#submit").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
			  }
		},
	    goBack : function(){
			App.back();
	    },
	    
	    help : function(){
			App.navigate("anymore/anymoreCtl/messageCenter");
		},
	  	sendMessage : function(){
			if($("#btn_sendSMS").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			$("#btn_sendSMS").addClass('disabled').attr('disabled',true);

			var param = {
					vBasis: this.vBasis
			};
			var $this = this;
			Ajax({url:"/mobile/sendByAppkey", data:param, success:function(data){
				if(data.ec == 0){
					var count = $this.validTime;//60秒不允许再次发送
					var timerID = setInterval(function(){
						$('#btn_sendSMS').val(count + '秒后重新获取');
						count--;
						if(count == 0||$("#btn_sendSMS").length==0){
							clearInterval(timerID);
							$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
							$('#btn_sendSMS').val('获取手机验证码');
						}
					},1000);
					$('#btn_sendSMS').val(count+ '秒后重新获取');
					count--;

				}else{
					$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
				}
			},error:function(){
				$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
			}});
	  },
	  	ocrBankCard : function(){
			Client.ocrBankCard("curView.cardRes");
		},
		
		cardRes : function(num){
			$("#input_bindCardNo").val(num);
			this.secondStep();
		}
	});
});





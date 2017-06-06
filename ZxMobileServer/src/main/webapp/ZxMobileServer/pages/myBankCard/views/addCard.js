define(function(require, exports, module){
	var addCardTpl = require("text!../template/addCard.html");
    
	var addCardView = module.exports = ItemView.extend({
		template : addCardTpl,
		events:{
        	"keyup #input_cardNo,#input_mobileNo":"checkButton",
        	"keyup #input_cardNo":"getFmtAcc",
        	"blur #input_cardNo,#input_mobileNo":"checkButton",
        	"blur #input_cardNo":"getBank",
        	"click .i-card":"ocrBankCard",
        	"click #submitBtn":"addCard",
        	"click #delMob":"delMob",
        	"click #password" : "password",
		},
		initialize : function(){
			//初始化菜单方法
			 var pageStep1 = {
				  	title:'添加银行卡',
					leftButton:{
						name : '返回',
						func: 'curView.goBack()'
//					},
//					rightButton:{
//						name : '帮助',
//						func : 'curView.help()'
					}
			  };
			 this.cardType ="";
	    	 this.pwd = "";
	    	 this.pwdKey = "";
			 Client.initPageTitle(pageStep1);
			 $("#userName").html(App.storage.get("UserInfo").customerNameCN);
			 Client.hideWaitPanel(1);

			  
		},
  	   password : function(){
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
		
		ocrBankCard : function(){
			Client.ocrBankCard("curView.cardRes");
		},
		
		cardRes : function(num){
			$("#input_cardNo").val(Utils.getFmtAcc(num));
			this.getBank();
		},
		getFmtAcc : function(){
			var cardNo = $("#input_cardNo").val();
			$("#input_cardNo").val(Utils.getFmtAcc(cardNo));
		},
		getBank : function(){
			var cardNo = $('#input_cardNo').val();
			cardNo = cardNo.replace(/\s/g,"");
			if(Utils.isEmpty(cardNo)){
				return;
			}
			var params = {
					cardNo:cardNo,
					queryType:'1'
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			var $this = this;
			Ajax({ url: "/bank/checkCardBin", data:params, success: function(data){
				if(Utils.isEmpty(data.errorCode)){
					var icoll = data.iCardBinInfo;
		    		if(icoll!=null&&icoll.length>0){
						var kColl = icoll[0];
						var cardType2 = kColl.cardType;
						if(cardType2=='0'){
							var orgCode = kColl.orgCode;
							if(orgCode==Utils.getParamDisplay("ORG_CODE","hzbank")){
					    		$this.cardType='01';	
//					    		$("#mobileDiv").hide();
					    		$("#passwordDiv").show();
					    	}else{
					    		$this.cardType = "04";
//					    		$("#mobileDiv").show();
					    		$("#passwordDiv").hide();
					    	}
							$("#input_bankUrl").removeClass().addClass("ico-bnk bnk-"+kColl.bankIconUrl.split("_")[1]);
							$("#input_bank").val(kColl.orgName).attr("data-value",kColl.orgCode);
							$this.checkButton();
						}else{
							Utils.alertinfo("您输入的卡类型为非借记卡");
						}
				    }else{
				    	Utils.alertinfo("暂不支持该银行");
				    }
				}else{
					Utils.alertinfo(data.errorMessage);		
				}
				Client.hideWaitPanel(1);
			},			
			error : function() {
				Client.hideWaitPanel();
				Utils.alertinfo("服务器异常！");
			}
		  });
		},
		
		addCard : function(){
			var cardNo = $('#input_cardNo').val();
			var bankName = $('#input_bank').val();
			var mobileNo ="";
			var orgCode = $('#input_bank').attr("data-value");
			
			cardNo = cardNo.replace(/\s/g,"");
			if(Utils.isEmpty(cardNo)){
				Utils.alertinfo("请输入有效卡号");
				return;
			}
//			if(this.cardType=="04"&&!Utils.checkMobile(mobileNo)){
//				Utils.alertinfo("请输入正确的预留手机号");
//				return;
//			}
			
			//查询有无绑定卡，无绑定卡则添加绑定卡，有绑定卡则添加非绑定卡，
			//添加绑定卡addBindCardFlag:"1"，添加非绑定卡addBindCardFlag:"0"
			var hasBandCard = "0";
			var bindCardNo = App.storage.get("UserInfo").bindCardNo;
			if(bindCardNo !=null && bindCardNo.length != 0){
				hasBandCard = "1";//登陆返回
			}
			var iCardList = App.storage.get("userCardList");
			if(iCardList !=null && iCardList.length != 0){
				for(var i=0;i<iCardList.length;i++){
		  			var kcoll=iCardList[i];
		  			if(kcoll.bandFlag=="1"){
		  				//有绑定卡
		  				hasBandCard = "1";//增加银行卡返回
		  				break;
		  			}
		  		}
			}			
			
			if(hasBandCard == "1"){
				addBindCardFlag = "0";
			}else{
				addBindCardFlag = "1";
			}
			var params = {
					elecNo:Utils.trim(Utils.getEleCard().cardNo),
		    		accountType:Utils.trim(Utils.getEleCard().accountType),
					cardNo:cardNo,
					bankName:bankName,
					orgCode:orgCode,
					cardType:this.cardType,
					mobileNo:mobileNo,
					bandFlag:"0",
			    	password:this.pwd,
			    	pwdkey:this.pwdKey,
			    	addBindCardFlag:addBindCardFlag
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			var $this = this;
			Ajax({ url: "/cardManage/addUserCard", data:params, success: function(data){
				$this.clearPwd();
				if(Utils.isEmpty(data.errorCode)){
	   				if(!MUI.isEmpty(App.storage.get("userCardList"))){
	 					App.storage.remove("userCardList");	
	 				}
	   				var paramValue={cardSelect:cardNo};
	   				App.browParam[1] = $.extend(App.browParam[1],paramValue);
					if(addBindCardFlag == "1"){//添加绑定卡
						$this.modfilyCardStatus();
					}
		  	    	var userInfo = App.storage.get("UserInfo");
		  	    	userInfo.bindCardNo = cardNo+"|"+data.cd.addBindCardFlag;
		  	    	App.storage.set("UserInfo",userInfo);//将参数放入session	
		  	    	App.browParam[1] = App.browParam[1]?$.extend(App.browParam[1],{cardNo:cardNo}):{cardNo:cardNo};
					$this.goBack();
				}else{
					if(data.errorCode=='66'){
    					Utils.alertinfo("您的身份证信息与银行预留信息不符，请到银行柜面修改");
    				}else{
    					Utils.alertinfo(data.errorMessage);
    				}
				}
				Client.hideWaitPanel(1);
			},
			error : function() {
				$this.clearPwd();
				Client.hideWaitPanel();
				Utils.alertinfo("服务器异常！");
			}
		  });
		},
   		
   		modfilyCardStatus : function(){
			  var userInfo = App.storage.get("UserInfo");		
			  if(this.cardType=='04'){
				  userInfo.iCardInfo[Utils.getEleCard().elecAccIndex].cardStatus = '00';
			  }else{
				  userInfo.iCardInfo[Utils.getEleCard().elecAccIndex].cardStatus = '01';
			  }
			  App.storage.set("UserInfo",userInfo);//将参数放入session	
		},
  	   clearPwd : function(){
		  	 $("#password").val("");
			 this.password = "";
	  		 this.pwdkey = "";
			 Client.loadPwdKey();
	   	},
		checkButton : function(){
			  if(this.cardType == "00"||this.cardType == "01"){
				  (!Utils.isEmpty($('#input_cardNo').val())&&!Utils.isEmpty($('#input_bank').attr("data-value"))&&!Utils.isEmpty(this.pwd)) ?
						  $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		    
			  }else{				  
				  (!Utils.isEmpty($('#input_cardNo').val())&&!Utils.isEmpty($('#input_bank').attr("data-value"))) ?
						  $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
			  }
		},
  	    goBack : function(){
			App.back();
  	    },
  	  delMob:function(){
  		$("#delMob").val("");
  	  },
	});
});





define(function (require, exports, module) {
	
	var depositBuyTemplate = require("text!../template/depositBuy.html");
	
	var depositBuyView = module.exports = ItemView.extend({
		
        template : depositBuyTemplate,
        
        events:{
        	 "keyup #fundAmt":"checkButton",
        	 "blur #fundAmt":"checkButton",
         	 "click #pwd" : "showPassword",
         	 "blur #mgrNo" : "mgrNoCheck",        	
         	 "click #doSubmit" : "doSubmit",        	
	       	 "click #checkbox1":"checkButton",      	
	    	 "click #checkbox2":"checkButton",
	    	 "click #showPage3" : "showPage3",
	    	 "click #showPage4" : "showPage4",
	    	 "click #showPage5" : "showPage5",
	     	 "click #agreeBtn1":"agreeBtn1",      	
	    	 "click #closeBtn1":"showPage1",     
	    	 "click #agreeBtn2":"agreeBtn2",      	
	    	 "click #closeBtn2":"showPage1",
        	 "click #succBackButton":"goBack",
        	 "click #drawLottery":"gotoDrawLottery"
        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep1 = {
        		title:'结构性存款认购',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        	};
        	Client.initPageTitle(pageStep1);
        	
        	this.password = "";
        	this.pwdkey = "";
        	
        	var cardNo = Utils.getEleCard().cardNo;
        	var accountType = Utils.getEleCard().accountType;
    		if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo,accountType);
    		}else{
    			Client.hideWaitPanel(1);
    		}
        },
        doSubmit : function(){
			if($("#doSubmit").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			};
			var $this = this;
			
    		var fundAmt	= $("#fundAmt").val();
    		if(!Utils.checkAmount(fundAmt)){
    			return false;
    		};
    		var balance = $("#showBalanceSpan").text();
    		balance = balance.replace(/,/g,"");
    		if(parseFloat(fundAmt)>parseFloat(balance)){
    			Utils.alertinfo("账户余额不足！");	
    			return false;
    		};
    		
       		if((parseFloat(fundAmt)-parseFloat(1000))%1000!=0){
				Utils.alertinfo("购买金额的追加金额是产品单位金额1000元的整数倍哦~");
    			return false;
    		};
       		var mgrNo = $("#mgrNo").val().trim();
       		if (!Utils.isEmpty(mgrNo)) {
       			if (mgrNo.length!=6||!Utils.isInteger(mgrNo)) {
       				Utils.alertinfo("请输入正6位数字推荐人编号");
       				return;
       			}
       		};
			var checkStt1 = document.getElementById("checkbox1").checked;
			var checkStt2 = document.getElementById("checkbox2").checked;
			if(!checkStt1){
				Client.alertinfo("请阅读个人结构性存款协议书");
				return;
			}
			if(!checkStt2){
				Client.alertinfo("请阅读产品说明书");
				return;
			};
			var param = {
					"cardNo": Utils.getEleCard().cardNo,
					"accountType": Utils.getEleCard().accountType,
					"fundAmt" : fundAmt,
					"financeNo" :  this.model.get("financeNo"),
					"mgrNo" : mgrNo,
					"password" : this.password,
					"pwdkey" : this.pwdkey
			};
			
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/design/productBuy",data:param, success:function(data){
				if(Utils.isEmpty(data.errorCode)){
					$('#recAccName_suc').text(Utils.cardNoFomart(Utils.getEleCard().cardNo));
					$('#recAmt_suc').text(Utils.formatCurrency(fundAmt));
//    				if(!MUI.isEmpty(App.storage.get("paramAccount"))){
//    					App.storage.remove("paramAccount");	
//    				}  
    				if(!MUI.isEmpty(App.storage.get("designCancelList"))){
    					App.storage.remove("designCancelList");	
    				}
    				if(!MUI.isEmpty(App.storage.get("paramAccount"))){
    					App.storage.remove("paramAccount");	
    				}  
    				if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
    					App.storage.remove("balanceInfo");	
    				}
    				if(data.addChanceFlag == "0"){//首购增加抽奖次数展示
						$("#drawLottery").show();  
					}else{
						$("#drawLottery").hide();   	
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
        
        mgrNoCheck : function(){
    		var mgrNo = $("#mgrNo").val();
    		if(Utils.isEmpty(mgrNo)){
				$("#mgrName").html('');
				$("#mgrNo").val('');
				$("#mgrName").hide();
    			return;
    		}
    		var param = {
    				"mgrNo" : mgrNo
    		};
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/design/getMgrName",data:param, success:function(data){
				if(Utils.isEmpty(data.errorCode)){
					var mgrName = data.mgrName;
					$("#mgrName").html(mgrName);
					$("#mgrName").show();
					Client.hideWaitPanel(1);
				}else{
					$("#mgrName").html('');
					$("#mgrNo").val('');
					$("#mgrName").hide();
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
			},error:function(){
				$("#mgrName").html('');
				$("#mgrNo").val('');
				$("#mgrName").hide();
				Client.hideWaitPanel(1);
			}});
        },
      //产品说明书
//        showPage5 : function() {
////        	var financeNo =  this.model.get("financeNo");
////    		var param = {
////    				"financeNo" : financeNo
////    		};
////			Client.openWaitPanel("拼命加载中，请稍候");
////			Ajax({url:"/design/getDescriptionUrl",data:param, success:function(data){
////				if(Utils.isEmpty(data.errorCode)){
////        			var url = data.url;	
////        			if(Utils.isEmpty(url)){
////    					Utils.alertinfo("该产品暂无说明");
////        			}else{
//		    		   var pageStep = {
//		            		title:'结构性存款购买',
//		        			leftButton:{
//		        				name: '返回',
//		        				func: 'history.back()'
//		        			}
//		        		};
//		        		
//		    			Client.initPageTitle(pageStep);
//		        		Client.menuOpt("0");
//
//		    			setTimeout(function(){
//		    		       	location.href = "http://158.58.14.214:8084/ZxMobileServer/share.html";
//	    				},300);
//        				//通过浏览器打开
////        			}
////				}else{
////					Utils.alertinfo(data.errorMessage);
////				}
////				Client.hideWaitPanel(1);
////			},error:function(){
////				Client.hideWaitPanel(1);
////			}});
//
//        },
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
        		title:'结构性存款认购',
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
			for(var i=1;i<=4;i++){
				if(i==num){
					$("#depositBuy"+i).show();
				}else{
					$("#depositBuy"+i).hide();
				}
			}
		},
		showPage1 : function(){
        	var pageStep1 = {
            		title:'结构性存款认购',
        			leftButton:{
        				name : '返回',
        				func: 'curView.goBack()'
        			}
        		};

        	Client.initPageTitle(pageStep1);
    		Client.menuOpt("5");
			this.showPage(1);
		},
		showPage3 : function(){
			//初始化结果页面头部菜单
			Client.menuOpt("0");
			var pageStep = {
	        		title:'结构性存款认购',
					leftButton:{
						name: '返回',
						func: 'curView.showPage1()'
					}
			};
			Client.initPageTitle(pageStep);
			var $this = this;
			setTimeout(function(){
				$this.showPage(3);
			},100);
		},
		showPage4 : function(){
			//初始化结果页面头部菜单
			Client.menuOpt("0");
			var pageStep = {
	        		title:'结构性存款认购',
				leftButton:{
					name: '返回',
					func: 'curView.showPage1()'
				}
			};
			Client.initPageTitle(pageStep);	
			var $this = this;
			setTimeout(function(){
				$this.showPage(4);
			},100);
		},
		agreeBtn1 : function(){
			var pageStep = {
	        		title:'结构性存款认购',
					leftButton:{
						name: '返回',
						func: 'curView.showPage1()'
					}
				};
				Client.initPageTitle(pageStep);	
    		Client.menuOpt("5");
    		$('#checkbox1').remove();
    		$('#checkReg1').prepend('<input type="checkbox" checked id="checkbox1" />');
    		this.checkButton();
			this.showPage(1);
		},
		agreeBtn2 : function(){
			var pageStep = {
	        		title:'结构性存款认购',
					leftButton:{
						name: '返回',
						func: 'curView.showPage1()'
					}
				};
			Client.initPageTitle(pageStep);	
    		Client.menuOpt("5");
    		$('#checkbox2').remove();
    		$('#checkReg2').prepend('<input type="checkbox" checked id="checkbox2" />');
    		this.checkButton();
			this.showPage(1);
		},
    	checkButton : function(){
    		  //验证码开始进行匹配
    		  (!Utils.isEmpty($('#fundAmt').val())&&!Utils.isEmpty(this.password)&&($('#checkbox1').attr("checked"))&&($('#checkbox2').attr("checked"))) ?
    				    $("#doSubmit").removeClass('disabled').removeAttr('disabled') : $("#doSubmit").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
      	},
      	gotoDrawLottery : function(){
      		if(Utils.checkSession()){
				if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						return;
					}
					App.navigate("draw/drawCtl/drawLottery");
				}
			}else{
				Client.toLogin("curView.drawLottery()");
			}
    	}
	});
});
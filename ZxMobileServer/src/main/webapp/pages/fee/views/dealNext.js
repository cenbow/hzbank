define(function(require, exports, module){
	
	var dealNextTpl = require("text!../template/dealNext.html");
	
	var dealNextView = module.exports = ItemView.extend({
		
		events : {
			"click #dealSubmit":"dealSubmit",
//			"click #cardNo":"changeCard",
			"click #addCard":"addCard",
			"click #back":"back"
		},
		
		template : dealNextTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var payNo =App.storage.get("_parameters").payNo;
        	var payName =App.storage.get("_parameters").payName;
        	var payAmt =App.storage.get("_parameters").payAmt;
        	var JFTFlowNo =App.storage.get("_parameters").JFTFlowNo;
        	
        	$("#billkey").text(payNo);
        	$("#payName").text(payName);
        	$("#payAmt").text(Utils.formatCurrency(payAmt,2));
        	$("#big").text(Utils.toChineseCurrency(payAmt));
        	
//        	var iCardList = App.storage.get("userCardList");
//        	if(MUI.isEmpty(iCardList)){
//    			Client.openWaitPanel("拼命加载中，请稍候");
//    			this.queryCardList(parameter.cardNo);
//    		}else{
//    			var cardNo = iCardList[0].cardNo;
//				$("#cardNo").text(Utils.protectAcc(cardNo)+"(绑定卡)");
//    			this.showSelected(iCardList,parameter.cardNo);
//    		}
//    		if(MUI.isEmpty(iCardList)){
//    			this.queryCardList();
//    		}else{
//    			var cardNo = iCardList[0].cardNo;
//				$("#cardNo").text(Utils.protectAcc(cardNo)+"(绑定卡)");
//    			Client.hideWaitPanel(1);
//    		}
        	
			Client.hideWaitPanel(1);
		},
		
		queryCardList : function(cardNo){
   			var params={
   					cardNo:Utils.getEleCard().cardNo
   			};
   			var $this = this;
   			
   			Ajax({url:"/cardManage/cardListQuery", data:params, 
   				success:function(data){
   					if(MUI.isEmpty(data.errorCode)){
   						var iCardList=data.iCardList;
   						$this.showSelected(iCardList,cardNo);
				  		App.storage.set("userCardList",iCardList);
   					}else{
   						Utils.alertinfo(data.errorMessage);
   					}
   				}
   			});
		},
		
		showSelected : function(iCardList,cardNo){
			var $this = this;
			$.each(iCardList,function(index,card){
				if(card.cardNo == cardNo){
					var html = '<i class="ico-bnk '+'bnk-'+card.bankIconUrl.split('_')[1]+'"></i>'+
					   '<h1>'+card.bankName+'（'+card.cardNo.substring(card.cardNo.length-4,card.cardNo)+'）</h1>'+
					   '<p class="ft10 fc-9">单笔限额'+$this.cashFormat(card.singleLimit)+'，日累计限额'+$this.cashFormat(card.dayLimit)+'</p>';
					$("#cardNo").html(html);
					$this.selectedCard = card;
					return;
				}
			});
		},
		
		changeCard : function(){
			var $this = this;
			Utils.epayPicker.init(function(res){
				var html = '';
				$this.selectedCard = res;
				
				if(res.index == 'balance'){
					html = '<i class="ico-bnk bnk-0110"></i>'+
							   '<h1>账户余额&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h1>'+
							   '<p class="ft10 fc-9">可用余额<span id="balance"></span>元</p>';
				}else{
					html = 
					   '<h1>'+Utils.protectAcc(res.cardNo)+'</h1>'
					   ;
				}
				$("#cardNo").html(html);
				var cardNo = Utils.getEleCard().cardNo;//获取电子账号
	  			var accountType = Utils.getEleCard().accountType;//获取电子账号类型
	    		if (Utils.isInteger(cardNo)) {
	    			Utils.queryCommBalance(cardNo,accountType,"balance");
	    		}
			});
		},
		
		toCardList:function(){
			var html ="";var tmp = "";
			$("#cardList").show();
			var iCardList = App.storage.get("userCardList");
			var cardNo = iCardList[0].cardNo;
    		$("#bankList").empty();
    		
    		$.each(iCardList,function(i,item){
				
    			var bankIconUrl = item.bankIconUrl;
        		var bankClass = 'bnk-'+bankIconUrl.split('_')[1];
        		var cardfour = item.cardNo.substring(item.cardNo.length-4,item.cardNo.length);
        		var dataValue = item.cardNo;
        		
        		var htmlClass ="list-item";
        		if(item.cardNo == cardNo){
        			htmlClass ="list-item selected";
        		}
        		
					tmp += '<div class="'+htmlClass+'" data-value="'+dataValue+'">'+
								'<div class="selectPay">'+
									'<i class="ico-bnk '+bankClass+'"></i>'+
									'<h1>'+item.bankName+"("+cardfour+")"+'</h1>'+
									'<p class="ft10 fc-9">单笔限额2千，日累计限额1万</p>'+
								'</div>'+
							'</div>';
			});
    		if(tmp!=""){
				html = tmp+'<div class="list-item arr" id="addCard">'+
								'<div class="selectPay">'+
									'<i class="ico-bnk addCard"></i>'+
									'<h1>使用新卡缴费</h1>'+
									'<p class="ft10 fc-9">请输入本人储蓄卡号</p>'+
								'</div>'+
							'</div>';
				}
    		
    		$("#bankList").html(html);
    		
    		
     	  	$('.dialog .list .list-item').off().on('click', function(){
     	  		$this=this;
     			$(this).addClass('selected').siblings().removeClass('selected');
     			var dataValue = $(this).attr("data-value");
//     			$("#cardNo").empty();
     			if(!MUI.isEmpty(dataValue) && dataValue == cardNo){
     				$("#cardNo").text(Utils.protectAcc(dataValue)+"(绑定卡)");
     			}else if(!MUI.isEmpty(dataValue)){
     				$("#cardNo").text(Utils.protectAcc(dataValue));
     			}
//     			$("#cardNo").text(Utils.protectAcc(dataValue)+"(绑定卡)");
  				$("#cardList").hide();
     	  	});
		},
		
    	addCard:function(){
    		App.navigate("myBankCard/myBankCardCtl/addCard");
    	},
    	
		back:function(){
			$("#cardList").hide();
		},
		
		dealSubmit:function(){
			var $this = this;
			var JFTFlowNo =App.storage.get("_parameters").JFTFlowNo;
			var seqNum = '1';
			var billkey = $("#billkey").text();
			var billkeyName=$("#payName").text();
			var billMonth ='';
			var feeCount = '0';
			var amount=Utils.removeComma($("#payAmt").text());
			var znAmount = '0';
			var contractNo = '';
			var dynamicData='';
			dynamicData = dynamicData+seqNum+"@#"+billkeyName+"@#"+billMonth+"@#"+feeCount+"@#"+amount+"@#"+znAmount+"@#"+contractNo+"@|";
			var param = {
					projectCode:'PC0014',
					billkey:billkey,
					billkeyName:billkeyName,
					tranAmt:amount,
					feeBusinessCode:'33011200001',
					dynamicData:dynamicData,
					mobileNo:App.storage.get("UserInfo").regMobile,
					JFTFlowNo:JFTFlowNo
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/fee/carGenerateIndent",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var JFTFlowNo = data.JFTFlowNo;
						var notifyUrl = "/fee/carDealPayResultNotify";
						var feeTypeCode  = "12";
						var resultUrl = "/fee/feeCtl/dealResult";
						var confirmUrl = "/fee/carDealOrderQuery";
						var param = {
								eleAccount :Utils.getEleCard().cardNo,
	    						amountTotal : data.amount,
	    						userName:data.itemName,
	    						notifyUrl:notifyUrl,
	    						feeTypeCode:feeTypeCode,
	    						resultUrl:resultUrl,
	    						confirmUrl:confirmUrl
	    				};
	    				param = $.extend(param,data);
	    				App.navigate("fee/feeCtl/tuitionPay",param);
	    			}else{
	    				Utils.alertinfo(data.errorMessage);
	    				Client.hideWaitPanel(1);
	    			}
			}});
		},
		
		dealSubmit1:function(){
			var $this = this;
			var seqNum = '1';
			var billkeyName='test';
			var billMonth ='';
			var feeCount = '0';
			var amount='1000';
			var znAmount = '0';
			var contractNo = '';
			var dynamicData='';
			dynamicData = dynamicData+seqNum+"@#"+billkeyName+"@#"+billMonth+"@#"+feeCount+"@#"+amount+"@#"+znAmount+"@#"+contractNo+"@|";
			var param = {
					turnPageBeginPos:'1',
					turnPageShowNum:'20',
					businesCode:'33011200001',
					feeTypeCode:'',
					tranState:'',
					timeBegin:'',
					timeEnd:''
			};
			Ajax({url:"/fee/queryFeeTransList",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
	    			}else{
	    				Utils.alertinfo(data.errorMessage);
	    			}
			}});
			App.navigate("fee/feeCtl/dealSubmit");
		},
		
		goBack : function(){
			App.back();
		}
	
	});
});

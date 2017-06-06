define(['./mui_util'],function(){

	var me = Utils.epayPicker = {

		callback:function(res){
			
		},
		
		elem : "body",
		
		scardNo : null,
		
		init : function(elem,scardNo,callback) {
			elem && (this.elem = elem);
			this.scardNo = scardNo;
			callback && (this.callback = callback);
			if($("#dialog").length>0){
				$("#dialog").show();
				return;
			}
			
			var iCardList = App.storage.get("userCardList");
    		if(MUI.isEmpty(iCardList)){
    			Client.openWaitPanel("拼命加载中，请稍候");
    			this.queryCardList();
    		}else{
    			this.showCardList(iCardList);
    		}
		},
		
		queryCardList : function(){
   			var params={
   					cardNo:Utils.getEleCard().cardNo
   			};
   			var $this = this;
   			Ajax({url:"/cardManage/cardListQuery", data:params, 
   				success:function(data){
   					if(MUI.isEmpty(data.errorCode)){
   						var iCardList=data.iCardList;
   						$this.showCardList(iCardList);
				  		App.storage.set("userCardList",iCardList);
   					}else{
   						Utils.alertinfo(data.errorMessage);
   					}
   					Client.hideWaitPanel(1);
   				}
   			});
		},
		
		showCardList : function(iCardList){
			var $this = this;
				bandIndex = 0,
				selFlag = false,
				html = '<div class="dialog" id="dialog"><div class="passwordBox"><div class="head row">'+
				'<i class="back"></i><div class="cell fc-blue">选择缴费方式</div></div>'+
				'<div class="list" id="cardList" style="height: 174px;overflow: auto;">';
				
			$.each(iCardList,function(index,card){
				if($this.scardNo == card.cardNo){
					selFlag = true;
				}
				html += '<div class="list-item '+(($this.scardNo == card.cardNo)?'selected':'')+'" data-value="'+index+'" ><div class="selectPay">'+
                    '<i class="ico-bnk '+'bnk-'+card.bankIconUrl.split('_')[1]+'"></i>'+
                    '<h1>'+card.bankName+'('+card.cardNo.substring(card.cardNo.length-4,card.cardNo)+')</h1>'+
                    '<p class="ft10 fc-9">单笔限额'+$this.cashFormat(card.singleLimit)+'，日累计限额'+$this.cashFormat(card.dayLimit)+'</p>'+
                    '</div></div>';
				if(card.bandFlag == '1'){
					bandIndex = index;
				}
			});
			html += '<div class="list-item arr" data-value="new">'+
                    '<div class="selectPay">'+
                        '<i class="ico-bnk addCard"></i>'+
                        '<h1>使用新卡缴费</h1>'+
                        '<p class="ft10 fc-9">请输入本人储蓄卡号</p>'+
                    '</div>'+
	                '</div>'+
	                '<div class="list-item '+(!selFlag?'selected':'')+'" data-value="balance">'+
	                    '<div class="selectPay">'+
	                        '<i class="ico-bnk bnk-0110"></i>'+
	                        '<h1>账户余额&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h1>'+
	                        '<p class="ft10 fc-9">可用余额<span id="showBalanceSpan"></span>元</p>'+
	                    '</div>'+
	                '</div>';
			html += '</div></div></div>';
			$(html).appendTo($(this.elem));
			
			var cardNo = Utils.getEleCard().cardNo;//获取电子账号
  			var accountType = Utils.getEleCard().accountType;//获取电子账号类型
    		if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo,accountType);
    		}
    		
			$("#cardList .list-item").on("click",function(){
				var index = $(this).attr("data-value");
				$(this).addClass("selected").siblings().removeClass("selected");
				if(index == 'balance'){
					$this.callback({cardNo : Utils.getEleCard().cardNo,	cardType : "03",index : "balance",bankIconUrl:'bnk_0110'});
				}else if(index == 'new'){
					App.navigate("myBankCard/myBankCardCtl/addCard");
					return;
				}else{
					$this.callback(iCardList[index]);
				}
				$this.close();
			});
			
			$(".dialog .back").on("click",function(){
				$this.close();
    		});
			
		},
		
		cashFormat : function(num){
			if(!num || num=="0"){
				return '无';
			}
			num = parseFloat(num);
			if(num>=10000){
				return num = num/10000+'万';
			}else if(num>=1000){
				return num = num/1000+'千';
			}else{
				return num = num+'元';
			}
		},
		
		close : function(){
			$("#dialog").hide();
		},
		
		remove : function(){
			$("#dialog").remove();
		}
	};
	
	return Utils;
});
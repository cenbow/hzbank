define(function (require, exports, module) {
	
	var AccountBalanceTemplate = require("text!../template/accountBalance.html");
	
	var AccountBalanceView = module.exports = ItemView.extend({
		
        template : AccountBalanceTemplate,
        
        events:{
        	"click #incomeTransfer":"toIcome",
        	"click #outTransfer" : "outTransfer"
        },
        
        initialize : function(){
        	
        	//初始化菜单方法
	       	 var pageStep1 = {
	       		  	title:'账户余额',
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
	       	 this.bindCardInfo = App.storage.get("bindCardInfo");
	       	if(!MUI.isEmpty(this.bindCardInfo)){
	       		this.cardType = this.bindCardInfo.cardType;
	       		if(MUI.isEmpty(this.bindCardInfo.orgCode)){
	       			this.checkCardBin(this.bindCardInfo.bindCardNo);
	       		}else{
	       			Client.hideWaitPanel(1);	       			
	       		}
		    }else{
		    	this.getBindCardInfo();
		    }
        },
        
        getBindCardInfo : function(){
		    
  			var elecCardNo = Utils.getEleCard().cardNo;//获取电子账号
			var queryParam = {
					cardNo:elecCardNo
			};
			var $this = this;
			Ajax({url:"/account/elecAccBindQuery", data:queryParam, success:function(data){
				
				if(data.errorCode == undefined){
					var bindCardNo = data.cd.bindCardNo;
					$this.cardType = data.cd.cardType;
					var bankName = data.cd.bankName;
					var bankType = data.cd.bankType;
					$this.checkCardBin(bindCardNo);
					$this.bindCardInfo={
							elecCardNo:elecCardNo,
							bindCardNo:bindCardNo,
							cardType:$this.cardType,
							bankName:bankName,
							bankType:bankType
					};
					App.storage.set("bindCardInfo",$this.bindCardInfo);//保存绑定卡信息
				 }else if(data.errorCode == '-77333'){
					bindCardNo = '';
					$this.cardType = '';
					Client.hideWaitPanel(1);
				}
		    }});
        },
   		//根据卡号查询银行
   		checkCardBin : function(cardNo){
   			var $this = this;
   			var params = {
   					cardNo:cardNo,
   					queryType:'1'
   			};
   		   	Ajax({url:"/bank/checkCardBin", data:params, success:function(data){
   				Client.hideWaitPanel(1);
   		   		if(data.errorCode == undefined){
   					var icoll = data.iCardBinInfo;
   		    		if(icoll!=null&&icoll.length>0){  		    			
   						var kColl = icoll[0];
   						var orgCode = kColl.orgCode;
   						var orgName = kColl.orgName;
   						var bankIconUrl = kColl.bankIconUrl;
   						var bankClass = 'ico-bnk bnk-'+bankIconUrl.split('_')[1]+' mr5';
						var val='0';
					    if(orgCode==Utils.getParamDisplay("ORG_CODE","hzbank")){//本行
							var bindCardNo = App.storage.get("bindCardInfo").bindCardNo;
							if(cardNo == bindCardNo){//本行绑定卡
								val='1';
							}else{
								val='2';
							}
						}else{
							val='3';
					    }
					    $this.bindCardInfo.val = val;
					    $this.bindCardInfo.orgCode = orgCode;
					    $this.bindCardInfo.orgName = orgName;
					    $this.bindCardInfo.bankClass = bankClass;
   				    }else{
					    $this.bindCardInfo.val = "0";
					    $this.bindCardInfo.orgCode =  "";
					    $this.bindCardInfo.orgName = "他行";
					    $this.bindCardInfo.bankClass = "";
   				    }
   					App.storage.set("bindCardInfo",$this.bindCardInfo);//保存绑定卡信息
   				}else{
   					$this.bindCardInfo.val = "0";
   					$this.bindCardInfo.orgCode = "";
   					$this.bindCardInfo.orgName = "他行";
   					$this.bindCardInfo.bankClass = "";
   					App.storage.set("bindCardInfo",$this.bindCardInfo);//保存绑定卡信息
   				}
   			}});
   		},       
        outTransfer : function(){
        	if(this.cardType=='04'){
				App.navigate("transfer/transferCtl/oneStopTransfer");
			}else{
				App.navigate("transfer/transferCtl/innerTransfer");
			};
        } ,
        
        toIcome : function(){//充值
        	App.navigate("transfer/transferCtl/recharge");
  	  	},
        
        goBack : function(){
        	App.back();
     	  },
     	  
		help : function(){
			  App.navigate("anymore/anymoreCtl/messageCenter");
		},
     	  
	});
	  
});
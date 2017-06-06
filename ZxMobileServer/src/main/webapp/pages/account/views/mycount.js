define(function (require, exports, module) {
	
	var MycountTemplate = require("text!../template/mycount.html");
	
	var MycountView = module.exports = ItemView.extend({
		
        template : MycountTemplate,
        
        events:{
        	"click #list-detail":"tradeDetail",
        	"click #totalScorediv":"toMyScore",
        	"click #ownPropertyDiv #totalProperty,#balance,.pt10":"toholdingAsset",
        	"click #account_balance":"accountBalance",
        	"click #incomeTransfer":"toIcome",
        	"click #outTransfer" : "outTransfer",
        	"click #toSetCenter" : "toSetCenter",
        	"click #property1":"toAdd",
        	"click #property2":"toSave",
        	"click #property3":"top2p",
        	"click #property4":"toSum",
        	"click #property5":"toGold",
        	"click #property6":"toFund",
        	
        	"click #cardManage":"cardManage",
        	"click #security":"security",
        	"click #saveAccount":"toSaveList",
        	/*"click #redPacket":"toMyRedPacket",*/
        	"click .infoText .close" : "closeDialog",
        	"click #lotteryCenter":"lotteryCenter"
        },
        
        initialize : function(){
        	
        	this.params = {};
	        this.paramOwn = {};//持有资产传参
	        this.paramAccount = {};//我的账户session传参;	        
	        this.myFundInfo = {};//我的基金;	 
	        this.showFlag1= false;
	        this.showFlag2= false;
	        this.showFlag3= false;
	        this.showFlag4= false;
	        this.showFlag5= false;
	        this.showFlag6= false;
	        this.boseFinanceVol = 0;
	        this.goldSum=0;
	        this.fundTotalMoney=0;//基金总额
	        this.errorflag="";
	        
        	var titleVal = "";
        	if(Utils.checkSession() && pubParam.clientVersion >= "3.0.0"){
        		 titleVal = App.storage.get("UserInfo").customerNameCN || Utils.getFmtMobile(App.storage.get("UserInfo").regMobile);
        		 titleVal = titleVal+"|/#settings/setCenterCtl/setCenter";
        	}else if(Utils.checkSession()){
        		var mobile = App.storage.get("UserInfo").regMobile;
        		titleVal = "我的账户|"+Utils.getFmtMobile(mobile)+"|/#settings/setCenterCtl/setCenter";
        	}
        	this.titleVal = titleVal;
        	var pageTest = {
        			  	title:titleVal,
        			  	leftButton:{
    	       				name : '',
    	       				func : 'curView.toIndex()'
    	       			},
    	       			rightButton:{
    	       				name : '',
    	       				func : ''
    	       			}
        			  };
        	Client.initPageTitle(pageTest);
        	
        	/*var redPacketUnNew = MUI.Cache.get("mRedUnNew");
        	alert(!redPacketUnNew || !redPacketUnNew.data);
			if(!redPacketUnNew || !redPacketUnNew.data){
				//$("#redPacket").removeClass("row arr");
//				$("#redPacket").addClass("friend midd-dot");
				document.getElementById("redPacket").setAttribute("class","friend midd-dot");
				alert(1111);
			}else{
				$("#redPacket").removeClass("friend midd-dot");
//				$("#redPacket").addClass("row arr");
//				$("#redPacket").addClass("row arr");
				alert(222);
				document.getElementById('redPacket').setAttribute("class","row arr");
			}*/
        	
   		    if(Utils.checkRealUser("1")){//实名用户   	
   		    	
   		    	var iBoseraIncome = App.storage.get("iBoseraIncome");
   		    	var $this = this;
   		    	
	        	this.paramAccount = App.storage.get("paramAccount");
	        	if(!this.paramAccount){
	        		this.paramAccount = {};
	        		this.myCountQuery();
	        	}else{
	        		 this.params.score = this.paramAccount.totalScore;
	        		 this.paramOwn ={
	        				 ownAmt : this.paramAccount.ownAmt,//持有资产
	                		 happyAddProAmt : this.paramAccount.financeAmt,//添利总金额
	                		 happySaveAmt : this.paramAccount.totalBalanceAvailable,//幸福乐存
	                		 designCount : this.paramAccount.designCount,//结构性存款个数
	                		 designSum : this.paramAccount.designSum,//结构性存款总额
	                		 p2pCount : this.paramAccount.p2pCount,//P2P产品个数
	                		 p2pSum : this.paramAccount.p2pSum,//P2P产品总额
	                		 totalP2P:this.paramAccount.totalP2P,//P2P产品 持有总额
	                		 goldSum:this.paramAccount.goldSum,//幸福如金总额
	                		 fundTotalMoney:this.paramAccount.fundTotalMoney//基金总额
	        		 };
					 App.storage.set("paramOwn",this.paramOwn);
					 this.model.set(this.paramAccount);
					 var $this = this;
					 setTimeout(function(){
						 $this.opt ? null :$this.opt = {
									callback:"curView.refresh()"
							};
						Client.dragRefresh($this.opt);
					 },300);
					 this.showFlag1= true;
					 this.qryHideWait();
					 this.bindshow();
	        	}
	        	
	        	var iCardList = App.storage.get("userCardList");
	    		if(MUI.isEmpty(iCardList)){
	    			this.queryCardList();
	    		}else{
	    			$("#cardNum").text(iCardList.length);
	    			this.showFlag2= true;
					this.qryHideWait();
	    		}
	        	
	    		if(iBoseraIncome){
   		    		$.each(iBoseraIncome,function(i,vol){
   						$this.boseFinanceVol += parseFloat(vol.totalVol); 
   					});
   		    		if(Utils.checkBoseFinance("1")){
   		    			$("#disc").text("基金解约");
   		    		}else{
   		    			$("#disc").text("");
   		    		}
   		    		this.showFlag3= true;
					this.qryHideWait();
   		    	}else{
   		    		this.queryBoseFinance();
   		    	}
	    		
	    		
			var iGoldIncome = App.storage.get("iGoldIncome");
	    		if(iGoldIncome){
	    			var fundlastnav =App.storage.get("boseGold").fundlastnav;
	    			this.goldSum = iGoldIncome.totalVol*fundlastnav;
   		    		this.showFlag4= true;
					this.qryHideWait();
   		    	}else{
   		    		this.queryGoldIcome();
   		    	}
			
	    		var iFundBalinfo = App.storage.get("iFundBalinfo");//基金
	    		if(iFundBalinfo){
	    			var icoll =App.storage.get("iFundBalinfo");
	    			var fundTotalMoney=0;
	    			for(var len=0;len<icoll.length;len++){
						var kcoll = icoll[len];
						fundTotalMoney+=parseFloat(kcoll.fundNav);
    				}
    				$this.fundTotalMoney=fundTotalMoney;
	    			
	    			this.showFlag5= true;
					this.qryHideWait();
   		    	}else{
   		    		this.fundBalQuery();
   		    	}
	    	var iSaveAccountList = App.storage.get("iSaveAccountList");
	    		if(MUI.isEmpty(iSaveAccountList)){
	    			$("#saveAccount").hide();
	    			$this.mySaveAccountQuery();
	    		}else{
	    			this.showFlag6= true;
	    			$("#saveAccount").show();
	    			$("#accountNum").text(iSaveAccountList.length);
	    			this.qryHideWait();
	    		}
   		
   		  }else{
  			Client.hideWaitPanel(1);
   		  }
        },
        
        myCountQuery : function(){
        	var $this = this;
        	
        	var param={
        		cardNo:this.getEleCard().cardNo,
        		accountType:this.getEleCard().accountType,
        	};
        	Ajax({url:"/myCount/queryCount",data:param,
				success:function(data){
					$this.showFlag1= true;
	    			if(MUI.isEmpty(data.errorCode)){
	    				$this.data = data;
	    				$this.showData(data);
	    			}else{
						Utils.alertinfo(data.errorMessage);
					}
	    			if(Utils.checkBoseFinance("1")){
		    			$("#disc").text("基金解约");
		    		}else{
		    			$("#disc").text("");
		    		}
					$this.qryHideWait();
	    			$this.opt ? null :$this.opt = {
						callback:"curView.refresh()"
					};
	    			Client.dragRefresh($this.opt);
				}});
        },
        
        showData : function(data){
        	if(!(this.showFlag1&&this.showFlag3&&this.showFlag4&&this.showFlag5&&this.showFlag6)){//
	   			return;
        	}
        	var $this = this;
			var financeAmt = $this.boseFinanceVol;//添利总金额
			var ownAmt;			//持有资产
			var totalProperty;	//总资产
			var totalScore;		//总积分
			
			var balance = data.cd.balanceAvailable;	//可用余额
			totalScore = Utils.formatData(Utils.nvl(data.cd.scoreTotal,"0.00"),2);						
			
			$this.params.score = totalScore;
			
			 var totalBalanceAvailable=0;//幸福乐存本金
			 var icollAdd=data.cd.iAccountDetail;
			 for(var len=0;len<icollAdd.length;len++){
					var kcoll = icollAdd[len];
					var depositType = kcoll.depositType;
					if("29" != depositType)continue;
					var balanceAvailable = kcoll.balanceAvailable;
					totalBalanceAvailable +=parseFloat(balanceAvailable);
				}							 

			 var totalDesignAvailable=0;//结构性存款
			 var designAbilityVolInfo=data.cd.designabilityVolInfo;
			 for(var len=0;len<designAbilityVolInfo.length;len++){
					var kcoll = designAbilityVolInfo[len];
					totalDesignAvailable +=parseFloat(kcoll.financeAmt);
			 }	 
			 App.storage.set("myDesignList",designAbilityVolInfo);
			 
			 var totalP2P=0;//p2p产品总额
			 var totalP2PNum=0;
			 var totalP2PShow=0;//p2p产品总额(显示)
			 var fundTotalMoney=0;//
			 var iP2PProList=data.cd.iP2PProList;
			 for(var len=0;len<iP2PProList.length;len++){
					var kcoll = iP2PProList[len];
					if(kcoll.state == '20'||kcoll.state == '10'||kcoll.state == '00'||kcoll.state == '80'){
						totalP2PShow +=parseFloat(kcoll.totalAmt);
						totalP2PNum++;
					}
					if(kcoll.state == '20'||kcoll.state == '80'){
						totalP2P +=parseFloat(kcoll.totalAmt);
					}
			 }	 
			 App.storage.set("iP2PProList",iP2PProList);
			 ownAmt=parseFloat(totalBalanceAvailable)+parseFloat(totalDesignAvailable)+parseFloat(financeAmt)+parseFloat(totalP2PShow)+parseFloat($this.goldSum)+parseFloat($this.fundTotalMoney);//持有资产//
			 $this.paramOwn ={
    				 ownAmt : ownAmt,//持有资产
            		 happyAddProAmt : financeAmt,//添利总金额
            		 happySaveAmt : totalBalanceAvailable,//幸福乐存
            		 designCount : designAbilityVolInfo.length,//结构性存款个数
            		 designSum : totalDesignAvailable,//结构性存款总额
            		 p2pCount : totalP2PNum,//P2P产品个数
            		 p2pSum : totalP2PShow,//P2P产品总额
            		 totalP2P:totalP2PShow,//P2P产品 持有总额
            		 goldSum:$this.goldSum,
            		 fundTotalMoney:$this.fundTotalMoney//基金总额//
    		 };
			 App.storage.set("paramOwn",$this.paramOwn);
			 totalProperty = Utils.formatCurrency(parseFloat(balance)+parseFloat(totalBalanceAvailable)+parseFloat(totalDesignAvailable)+parseFloat(financeAmt)+parseFloat(totalP2PShow)+parseFloat($this.goldSum)+parseFloat($this.fundTotalMoney),2);
			 ownAmt=Utils.formatCurrency(ownAmt,2);

			 $this.paramAccount.balance=Utils.formatCurrency(balance,2);//余额
			 $this.paramAccount.ownAmt=ownAmt;//持有资产
			 $this.paramAccount.totalScore=totalScore;//总积分
			 $this.paramAccount.totalProperty=totalProperty;//总资产
			 $this.paramAccount.financeAmt=financeAmt;//添利总金额
			 $this.paramAccount.totalBalanceAvailable=totalBalanceAvailable;//幸福乐存本金
			 $this.paramAccount.designCount=designAbilityVolInfo.length;//结构性存款个数
			 $this.paramAccount.designSum=totalDesignAvailable;//结构性存款总额
			 $this.paramAccount.p2pCount=totalP2PNum;//P2P产品个数
			 $this.paramAccount.p2pSum=totalP2PShow;//P2P产品总额
			 $this.paramAccount.totalP2P=totalP2PShow;//P2P产品 持有总额
			 $this.paramAccount.goldSum=$this.goldSum;//幸福如金 持有总额
			 $this.paramAccount.fundTotalMoney=$this.fundTotalMoney;//基金总额
			 
			 
			 App.storage.set("paramAccount",$this.paramAccount);//将我的账户参数放入session

			 $this.model.set($this.paramAccount);
			 var iCardList = App.storage.get("userCardList");
	    		if(MUI.isEmpty(iCardList)){
	    			$this.queryCardList();
	    		}else{
	    			$("#cardNum").text(iCardList.length);
	    		}
	    	  $this.bindshow();
	    	/*var iSaveAccountList = App.storage.get("iSaveAccountList");
		    	if(MUI.isEmpty(iSaveAccountList)){
	    			$("#saveAccount").hide();
	    			$this.mySaveAccountQuery();
	    		}else{
	    			$("#saveAccount").show();
	    			$("#accountNum").text(iSaveAccountList.length);
	    		}*/
        },
        
        getEleCard : function(){
			var cardCategory = "";
			var cardSeries = "";
			var cardNo = "";
			var accountType = "";
			var iCardInfo  = App.storage.get("UserInfo").iCardInfo;
			for(var len=0;len<iCardInfo.length;len++){
				cardCategory = iCardInfo[len].cardCategory;
				cardSeries = iCardInfo[len].cardSeries;
				if("03" == accountType )continue;
				val = cardCategory + cardSeries;
				if(val=="9901"||val=="9902"){
					cardNo = iCardInfo[len].cardNo;
					accountType = iCardInfo[len].accountType;
				}
			}
			return {cardNo:cardNo,accountType:accountType};
		},
		
		
		toMyScore:function(){
			if(Utils.checkRealUser()){
				if(!Utils.checkActivate()){
					return;
				}
	        	App.navigate("account/mycountCtl/myScore",this.params);
			}
        },
        
        
		tradeDetail : function(){
			var param ={code:""};
			if(Utils.checkRealUser()){
				if(!Utils.checkActivate()){
					return;
				}
	        	App.navigate("account/mycountCtl/tradeDetail",param);
			}
        },
        
        toholdingAsset : function(){
			if(Utils.checkRealUser()){
				if(!Utils.checkActivate()){
					return;
				}
	        	App.navigate("account/mycountCtl/holdingAsset",this.params);		   		 
			}
        },
        
        accountBalance : function(){
			if(Utils.checkRealUser()){
				if(!Utils.checkActivate()){
					return;
				}
   			 	App.navigate("account/mycountCtl/accountBalance",this.paramOwn);		   		 
			 }

        },
        
        getELeHeight : function(elems){ //该方法用于计算所有存在的其余高度的元素,兄弟们请根据需要确定是否成公用组件
    		var shimHeight = 0, e;
    		for(var i=0; i<elems.length; i++){
    		  e = elems[i];
    		  if(document.querySelector(e)){
    			  shimHeight += document.querySelector(e).offsetHeight;
    		  };
    		}
    		return (document.documentElement.clientHeight || window.innerHeight) - shimHeight;
    	},
    	
    	toIndex : function(){
    		Client.menuOpt("1");
			App.navigate("index/index/index");
    	},
    	
    	refresh:function(){
			this.opt.type = "1";
			Client.openLucencyPanel();
    		App.storage.remove("paramAccount");
    		App.storage.remove("paramOwn");
    		App.storage.remove("myFundInfo");
    		App.storage.remove("myFundInfo");
    		App.storage.remove("iBoseraIncome");
    		App.storage.remove("iGoldIncome");
    		App.storage.remove("iFundBalinfo");
    		App.storage.remove("iSaveAccountDetailParam");
    		this.initialize();
		},
		
    	qryHideWait : function(){
    		if(this.showFlag1&&this.showFlag2&&this.showFlag3&&this.showFlag4&&this.showFlag5&&this.showFlag6){//
    			 Client.hideWaitPanel(1);
    			 Client.hideLucencyPanel();
    		}
    	},
        getBindCardInfo : function(){
		    
  			var elecCardNo = Utils.getEleCard().cardNo;//获取电子账号
			var queryParam = {
					cardNo:elecCardNo
			};
			var $this = this;
    		Client.openWaitPanel("拼命加载中，请稍候");
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
    		Client.openWaitPanel("拼命加载中，请稍候");
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
   		   		if($this.actionFlag == 'toIcome'){
	       			App.navigate("transfer/transferCtl/recharge");
   		   		}else{
  	    	  		if($this.cardType=='04'){
	  	  				App.navigate("transfer/transferCtl/oneStopTransfer");
	  	  			}else{
	  	  				App.navigate("transfer/transferCtl/innerTransfer");
	  	  			};
   		   		}
   			}});
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
   						$("#cardNum").text(iCardList.length);
				  		App.storage.set("userCardList",iCardList);
   					}else{
   						Utils.alertinfo(data.errorMessage);
   					}
   					$this.showFlag2= true;
					$this.qryHideWait();
   				}
   			});
		},
		
		 mySaveAccountQuery : function(){
	        	var $this = this;
	        	var param={
	        		credentialNo:App.storage.get("UserInfo").certNo,//身份证号
	        	};
	        	Ajax({url:"/saveAccount/querySaveList",data:param,
					success:function(data){
						$this.showFlag6 = true;
						if(MUI.isEmpty(data.errorCode)){
							var iSaveAccountList = data.iSaveAccountList;
							if(iSaveAccountList.length > 0){
								$("#saveAccount").show();
								$("#accountNum").text(iSaveAccountList.length);
								App.storage.set("iSaveAccountList",iSaveAccountList);
							}else{
								$("#saveAccount").hide();
							};
							
	   					}
						$this.qryHideWait();
						$this.data&&$this.showData($this.data);
					},
					error:function(){
						$this.showFlag6 = true;
						$this.qryHideWait();
					}
	        	});
	        },
  	
		queryBoseFinance:function(){
			var param = {
					productId:Utils.getParamDisplay("PB_BOSERA",'1'),
					cardNo : Utils.trim(Utils.getEleCard().cardNo),
		    		accountType : Utils.trim(Utils.getEleCard().accountType)
			};
			var $this = this;
			Ajax({url:"/bosera/queryBoseraFinance",data:param,
				success:function(data){
					$this.showFlag3 = true;
					if(MUI.isEmpty(data.errorCode)){
						$this.boseFinanceVol = 0;
						$.each(data.iBoseraQuery,function(i,vol){
							$this.boseFinanceVol += parseFloat(vol.totalVol); 
						});
						App.storage.set("iBoseraIncome",data.iBoseraQuery);
	    			}
					$this.data&&$this.showData($this.data);
					$this.qryHideWait();
				},
				error:function(){
					$this.showFlag3 = true;
					$this.qryHideWait();
				}
			});
		},
		
		queryGoldIcome : function(){
			var $this = this;
			var param = {
					productId:Utils.getParamDisplay("PB_BOSERA",'3'),
					cardNo : Utils.trim(Utils.getEleCard().cardNo)
			};
			Ajax({url:"/bosera/boseraGoldShareQuery",data:param,
				success:function(data){
					$this.showFlag4 = true;
					if(MUI.isEmpty(data.errorCode)){
						var iShareList = data.iShareList;
						var iGoldIncome = "";
						$.each(iShareList,function(i,ishare){
							if(ishare.productId == Utils.getParamDisplay("PB_BOSERA",'3')){
								iGoldIncome = ishare;
							}
						});
						iGoldIncome = iGoldIncome || {totalVol:0.00,financeUseVol:0.00,yesterdayIncome:0.00,accumulateIncome:0.00};
						var fundlastnav =App.storage.get("boseGold").fundlastnav;
		    			$this.goldSum = iGoldIncome.totalVol*fundlastnav;
						App.storage.set("iGoldIncome",iGoldIncome);
	    			}
					$this.data&&$this.showData($this.data);
					$this.qryHideWait();
			},
			error:function(){
				$this.showFlag4 = true;
				$this.qryHideWait();
			}});
		},
		
    	toIcome : function(){//充值
			if(Utils.checkRealUser()){
				if(!Utils.checkActivate()){
					return;
				}
	 	       	App.navigate("transfer/transferCtl/recharge");
			 }
  	  	},
  	  	outTransfer : function(){
			if(Utils.checkRealUser()){				
				if(!Utils.checkActivate()){
					return;
				}

	    		var iCardList = App.storage.get("userCardList");
	    		for(var i=0;i<iCardList.length;i++){
	    			var kcoll=iCardList[i];
	    			if(kcoll.bandFlag=="1"){
	    				this.cardType = kcoll.cardType;
	    			}
	    		}
    	  		if(this.cardType=='04'){
  	  				App.navigate("transfer/transferCtl/oneStopTransfer");
  	  			}else{
  	  				App.navigate("transfer/transferCtl/innerTransfer");
  	  			};
		   		
			 }
  	  	},
  	  	toSetCenter: function(){
			App.navigate("settings/setCenterCtl/setCenter");
  	  	},
  	  	security: function(){
	  	  	if(Utils.checkRealUser()){
				App.navigate("settings/setCenterCtl/security");
	  	  	}
	  	},
		toAdd : function(){
			
			if(!App.storage.get("boseRate")){
				Utils.alertinfo("暂无产品信息，请稍候再试");
				return;
			};
			
			if(Utils.checkRealUser()){
				if(!Utils.checkActivate()){
					return;
				}
				
				if(Utils.checkBoseFinance("1"))
					App.navigate("bosera/boseraCtl/boseFinance");
				else
					App.navigate("bosera/boseraCtl/boseFundLogon");
			}
		},
	  	  	
		toSave : function(){
			if(Utils.checkRealUser()){
				if(!Utils.checkActivate()){
					return;
				}
				App.navigate("account/mycountCtl/mySave");		   		 
			}
		},

		toSum : function(){
			if(Utils.checkRealUser()){
				if(!Utils.checkActivate()){
					return;
				}
				var myDesignList = App.storage.get("myDesignList");
				if(!MUI.isEmpty(myDesignList)){
	   				App.navigate("account/mycountCtl/myCun");
					return;
	        	}
				Client.openWaitPanel("拼命加载中，请稍候");
	        	Ajax({url:"/design/productVolQuery",data:{},success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
						var icoll = data.designAbilityVolInfo;
						App.storage.set("myDesignList",icoll);
		   				App.navigate("account/mycountCtl/myCun");

	    			}else{
	    				Utils.alertinfo(data.errorMessage);
	    				Client.hideWaitPanel(1);
	    			}

	        	}});  		   		 
			}
		},
		
		top2p : function(){
			if(Utils.checkRealUser()){
				if(!Utils.checkActivate()){
					return;
				}
				Client.menuOpt("0");
				App.navigate("account/mycountCtl/p2pDetail");
			}
		},
		
		toGold : function(){
			if(!App.storage.get("boseGold")){
				Utils.alertinfo("暂无产品信息，请稍候再试");
				return;
			};
			
			if(!Utils.checkRealUser()){
				return;
			}
			
			if(!Utils.checkActivate()){
				return;
			}
			
			App.navigate("gold/goldCtl/goldLogon");
		},
		
		cardManage : function(){
			if(Utils.checkRealUser()){
				App.navigate("myBankCard/myBankCardCtl/myBankCard");
			}
		},
		
		fundBalQuery: function(){//查询我的基金
			Client.openWaitPanel("拼命加载中，请稍候");
				var cardNo = Utils.trim(Utils.getCardNoByFlag("0","cardFlag1"));
				var $this = this;
				$this.errorflag="";
				var fundTotalMoney=0;//总金额
				if (MUI.isEmpty(cardNo)) {
					$this.fundTotalMoney=fundTotalMoney;
					$this.showFlag5 = true;
					$this.data&&$this.showData($this.data);
					$this.qryHideWait();
					return;
				}
	    		var param1 = {
	    				cardNo:cardNo,
	    				turnPageBeginPos:"1",
	    				turnPageShowNum:"10",
	    				pageFlag:"0"//
	    		};
	    		Ajax({url:"/fund/fundBalQuery",data:param1, success:function(data){//查询
	    			$this.showFlag5 = true;
	    			if(MUI.isEmpty(data.errorCode)){
	    				var icoll = data.iFundBalinfo;
	    				$("#iFundBalinfo").empty();
//	    				var fundTotalMoney=0;//总金额
	    				if(icoll.length==0){
	    					$this.fundTotalMoney=0;
	    				}else{
	    					
	    					for(var len=0;len<icoll.length;len++){
	    						var kcoll = icoll[len];
	    						if(kcoll.fundNav==""){
	    							kcoll.fundNav=0;
	    						}
	    						fundTotalMoney+=parseFloat(kcoll.fundNav);
	    					}
	    					$this.fundTotalMoney=fundTotalMoney;
	    				}
	    				App.storage.set("iFundBalinfo",icoll);
	    			}else if (data.errorCode == '1114'){
	    				$this.errorflag="1114";
 	    			}else{
	    				Client.alertinfo(data.errorMessage,"提醒");
	    				Client.hideWaitPanel(1);
	    			}
	    			$this.data&&$this.showData($this.data);
					$this.qryHideWait();
	    		},
	    		error:function(){
					$this.showFlag5 = true;
					$this.qryHideWait();
				}
	    		
	    		});
		 
		},
		
		toFund : function(){
			var cardNo =Utils.trim(Utils.getCardNoByFlag("0","cardFlag1"));
			if(!Utils.checkRealUser()){
				return;
			}
			
			if(!Utils.checkActivate()){
				return;
			}
	    	if (MUI.isEmpty(cardNo) || (this.errorflag=="1114")) {
	    		Utils.alertinfo("您还未购买基金产品,快去选购吧!","提示");
    			return;
			}
	    	
			App.navigate("fund/fundCtl/myFund");
		},

//		toMyRedPacket : function(){
//			//MUI.Cache.save("redUnNew", true);
//			//App.navigate("hongbao/hongbaoCtl/redPacketInviteIndex");
//			var $this = this;
//        	var param={
//        			actionFlag:1
//        	};
//        	Client.openWaitPanel("拼命加载中，请稍候");
//        	Ajax({url:"/newRedPacket/queryMyRedPacket",data:param,
//				success:function(data){
//				var sysTime ="";
//    			if(MUI.isEmpty(data.errorCode)){
//    				var cd = data.cd;
//					if(!MUI.isEmpty(cd)){
//						var iUserRedPacketList = data.cd.iUserRedPacketList;
//						sysTime = data.cd.sysTime;
//						var iRedPacketList = [];
//	    				for(index in iUserRedPacketList){
//	    					iRedPacketList.push(iUserRedPacketList[index]);
//	    				}
//	    				$this.iRedPacketList = iRedPacketList;
//					}
//					Ajax({url:"/newRedPacket/getActivityTime",data:param,
//						success:function(data){
//						if(MUI.isEmpty(data.errorCode)){
//							var begainDate = data.cd.activityBeginDate;
//							var endDate = data.cd.activityEndDate;
//							$this.begainDate = begainDate.substring(0,4)+"年"+begainDate.substring(4,6)+"月"+begainDate.substring(6,8)+"日";
//							$this.endDate = endDate.substring(0,4)+"年"+endDate.substring(4,6)+"月"+endDate.substring(6,8)+"日";
//							App.storage.set("activityRulesDate",{begainDate:$this.begainDate,endDate:$this.endDate});	
//							MUI.Cache.save("myRedPacketUnNew", true);
//							App.navigate("hongbao/hongbaoCtl/myRedPacket",{iRedPacketList:$this.iRedPacketList,sysTime:sysTime});
//						}else{
//							Utils.alertinfo(data.errorMessage);
//						}
//						$this.qryHideWait();
//					},error:function(){
//						$this.qryHideWait();
//					}});
//    				//$this.show(sysTime);
//				}else{
//					Utils.alertinfo(data.errorMessage);
//				}
//    			Client.hideWaitPanel(1);
//			},error:function(){
//				Client.hideWaitPanel(1);
//			}});
//    	},

		lotteryCenter : function(){
			//MUI.Cache.save("redUnNew", true);
			if(!Utils.checkRealUser()){
				return;
			}
			
			if(!Utils.checkActivate()){
				return;
			}
			
			var $this = this;
		     var param={
						actionFlag:'1'
							
		    	};
	        	Client.openWaitPanel("拼命加载中，请稍候");
	        	Ajax({url:"/draw/queryUserDrawResult",data:param,
					success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				var cd = data.drawResultList;
						if(!MUI.isEmpty(cd)){
		    				$this.drawResultList = cd;
		    				//alert($this.drawResultList.length);
		    				App.navigate("draw/drawCtl/lotteryCenter",{drawResultList:$this.drawResultList});
					     }else{
					    	 App.navigate("draw/drawCtl/lotteryCenter",{drawResultList:[]});
					     }
	    			
					}else{
						Utils.alertinfo(data.errorMessage);
					}
	    			Client.hideWaitPanel(1);
				},error:function(){
					Client.hideWaitPanel(1);
				}});
	    },
		bindshow : function(){
			var $this = this;
			$("#readInfo").off().on("click",function(e){
				Client.openClientPanel();
	        	$('.dialog').show();
	            $('body').css({
	            	overflow: 'hidden',
	            	height: '100%'
	            });
	            if(	Device.os == 'android'){
	        		var opt = {
	        				type:"2"
	        		};
	        		Client.dragRefresh(opt);
	        	}
	            var pageTest = {
        			  	title:$this.titleVal,
        			  	leftButton:{
    	       				name : '',
    	       				func : 'curView.closeDialog()'
    	       			},
    	       			rightButton:{
    	       				name : '',
    	       				func : ''
    	       			}
        			  };
	            Client.initPageTitle(pageTest);
	            e.preventDefault();
			});
			document.getElementsByClassName('dialog')[0].addEventListener('touchmove', function (ev) {
   			  ev.preventDefault();
   		  	}, false);
        },
        
        closeDialog : function(){
        	var pageTest = {
    			  	title:this.titleVal,
    			  	leftButton:{
	       				name : '',
	       				func : 'curView.toIndex()'
	       			},
	       			rightButton:{
	       				name : '',
	       				func : ''
	       			}
    			  };
            Client.initPageTitle(pageTest);
            if(	Device.os == 'android'){
        		Client.dragRefresh({callback:"curView.refresh()"});
        	}
        	Client.hideClientPanel();
        	$('.dialog').hide();
        	$('body').css({
            	overflow: '',
            	height: ''
            });
        },
		     
		toSaveList : function(){
			if(Utils.checkRealUser()){
				App.navigate("saveAccount/saveAccountCtl/mySaveAccount");
			}
		},
		
	});
});
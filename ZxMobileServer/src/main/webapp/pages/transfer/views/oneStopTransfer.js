define(function (require, exports, module) {
	
	var oneStopTransferTemplate = require("text!../template/oneStopTransfer.html");
	var oneStopTransferView = module.exports = ItemView.extend({
		
        template : oneStopTransferTemplate,
        
        events:{
        	"click #inputSubButton":"doCheckTranferType",
        	"click #nextButton":"doNextSubmit",       	
        	"click #tranAmtAll":"tranAmtAll",
       	    "click #pwd" : "showPassword",
        	"click #submitButton":"doSubmit",
        	"click #errorSubmitButton":"showPage1",
        	"click #depositBankName2":"showPage3",
        	"click #cityName":"showPage4",
        	"click #depositBankName3":"showPage5",
        	"keyup #queryBankInput":"queryBankInput",
        	"blur #queryBankInput":"queryBankInput",
        	"click #successSubmitButton":"toCount"       	
        },
        
        initialize : function(){
        	// 初始化菜单方法
        	var pageStep = {
            		title : '提现',
            		leftButton : {
            			name : '返回',
            			func : 'curView.account_balance()'
            		}
            	};
			Client.initPageTitle(pageStep);
			
			this.channelFlag = '8';//默认走超级网银
			var session = App.storage.get("UserInfo");
			this.customerNameCN = session.customerNameCN;//客户姓名
			this.payAccountNo = Utils.trim(Utils.getEleCard().cardNo);//电子账户
			this.accountType = Utils.trim(Utils.getEleCard().accountType);
			this.openNode = Utils.trim(Utils.getEleCard().cardOpenNode);

			this.balance = App.storage.get("paramAccount").balance;
			$("#showBalanceSpan").text(this.balance);

    		var iCardList = App.storage.get("userCardList");
    		for(var i=0;i<iCardList.length;i++){
    			var kcoll=iCardList[i];
    			if(kcoll.bandFlag=="1"){
    				this.bindCardNo = kcoll.cardNo;
					this.bankIconUrl = kcoll.bankIconUrl;
					this.bankIconUrl = 'ico-bnk bnk-'+this.bankIconUrl.split('_')[1]+' mr5';
					
					this.orgName = kcoll.bankName;
					
					$('#recNameText').text("("+this.customerNameCN+")");
			  		$('#recAccountText').text(Utils.formatAcc(this.bindCardNo));
			  		$('#recBankText').text(this.orgName);
					$('#bankNameSpan').removeClass().addClass(this.bankIconUrl);
    			}
    		}

	       	this.getPretreatTransfer();
			this.queryCollInAmtTotal();
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
    	},
   		// 获取转账预处理信息
   		getPretreatTransfer : function() {
   			var $this = this;
   			var queryParam = {
   					recAccount:this.bindCardNo,
   					recAccountName:this.customerNameCN,
   					queryType:'1'
   			};
   			Ajax({
   				url : "/transfer/pretreatTransfer",
   				data : queryParam,
   				success : function(data) {
       				Client.hideWaitPanel(1);
   					if (data.errorCode) {
   						Utils.alertinfo(data.errorMessage);
   					}else{
   						var recBankType = data.recBankType;
   						$this.transferType = data.transferType;
   						$this.unionBankNo = data.unionBankNo;
   						$this.bankName = data.bankName;	
   					}
   				}
   			});
   		},
		// 统计他行代收总金额
		queryCollInAmtTotal : function() {
			var $this=this;
			Ajax({
				url : "/transfer/life_ePayTransAmtQuery",
				data:{},
				success : function(data) {
					if (data.errorCode) {
						$this.totalCollInSum = 0;
					} else {
						$this.totalCollInSum = Utils.nvl2(data.cd.totalSum, '0');
					}
					;
				},
				error : function() {
					$this.totalCollInSum = 0;
				}
			});
		},
		
		doCheckTranferType : function(){
			var $this = this;
			var tranAmt = $('#tranAmtText').val();				
			tranAmt=Utils.formatCurrency(tranAmt,2);
			tranAmt=Utils.removeComma(tranAmt);
			
			// 判断金额为空的情况
//			this.noticeLimt = Utils.nvl2(this.noticeLimt, '50000');
//			this.liqLimt = Utils.nvl2(this.liqLimt, '50000');
			this.noticeLimt = '50000';
			this.liqLimt = '50000';

			if (!this.checkAmount(tranAmt)) {
				return;
			}
			if (parseFloat(tranAmt) > parseFloat(this.noticeLimt)) {
				this.inputBnakInfo();
				return;
			}else{
				this.doNextSubmit();
			}
		},
		
		// 一站式提现预跑
		doNextSubmit : function() {
			var $this = this;
			var tranAmt = $('#tranAmtText').val();
			tranAmt=Utils.formatCurrency(tranAmt,2);
			tranAmt=Utils.removeComma(tranAmt);
			
			var recBank, unionBankNo, recBankType, bankIcon;
			var transferType = '1';
			if (parseFloat(tranAmt) > parseFloat(this.noticeLimt)) {
				this.channelFlag = '3';
				transferType = '0';
			}else{
				this.channelFlag = '8';
				transferType = '1';
			}

			var openBankName = "";
			var openBankCode = "";
			var cityName = "";
			var cityCode = "";

			if (this.channelFlag == '8') {
				unionBankNo = this.unionBankNo;
				recBank = this.bankName;
				bankIcon = "bs_"+this.bankIconUrl.replace("ico-bnk ","").replace(" mr5","").split("-")[1];
				recBankType = '3';
			} else {
				unionBankNo = $('#depositBankNo3').val();
				recBank = $('#depositBankName3').val();
				recBankType = '1';

				openBankName = $('#depositBankName2').val();
				openBankCode = $("#depositBankNo2").val().split("#")[0];
				bankIcon = "bs_"+$('#depositBankUrl2').val().replace("ico-bnk ","").split("-")[1];
				cityName = $('#cityName').val().split(" ")[1];
				cityCode = $('#cityCode').val();

			}
			var payRem = "";
			var mobileNo = "";
			var sendMessageFlag = "0"; // 默认不发短信
			
			if(Utils.isEmpty(unionBankNo)||Utils.isEmpty(recBank)){
				Utils.alertinfo("请选择开户银行");
				return;
			}

			this.param = {
				payAccount : this.payAccountNo,
				accountType : this.accountType,
				accountType2 : this.accountType,
				payAccountOpenNode : this.openNode,
				payAmount : tranAmt,
				openNode : this.openNode,
				cardType : this.accountType,
				customerAddress : this.openNode,
				transferType : transferType,
				recAccount : this.bindCardNo,
				recAccountName : this.customerNameCN,
				recAccountOpenBank : recBank,
				unionBankNo : unionBankNo,
				recBankType : recBankType,
				areaCode : '',
				channelFlag : this.channelFlag,
				addPayBook : '',
				businessType : 'C200',
				businessSpecies : '02001',
				unionBankNo1 : unionBankNo,
				bankIcon : bankIcon,
				payRem : payRem,
				sendMessageFlag : sendMessageFlag,
				recMsgMobileNumer : mobileNo,
				openBankName : openBankName,
				openBankCode : openBankCode,
				cityName : cityName,
				cityCode : cityCode,
			};

			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({
				url : "/transfer/life_inputOneStopTransfer",
				data : this.param,
				success : function(data) {
					Client.hideWaitPanel(100);
					if (data.errorCode) {
						Utils.alertinfo(data.errorMessage);
					} else {
						var totalNum = data.cd.totalNum;
						var isWorkDay = data.cd.isWorkDay;
						var channelFlag = data.cd.channelFlag;
						var sysTime = data.cd.submitTimestamp;
						
						$('#sp_recAccount').text(Utils.formatAcc($this.bindCardNo));
			      	  	$('#sp_recNameText').text("("+$this.customerNameCN+")");
				  		$('#sp_recBankText').text($this.orgName);
						$('#sp_bankNameSpan').removeClass().addClass($this.bankIconUrl);
						$('#sp_showBalanceSpan').text($this.balance);
						$('#sp_transferSum').text(tranAmt);
						$('#sp_tranAmtChineseSpan').text(Utils.toChineseCurrency(tranAmt));
						
						$this.showPage2();
					}
				},
				error : function() {
					Client.hideWaitPanel(100);
				}
			});
		},
		
		inputBnakInfo:function(){
			$('#recAccountText2').text(Utils.formatAcc(this.bindCardNo));
      	  	$('#recNameText2').text("("+this.customerNameCN+")");
	  		$('#recBankText2').text(this.orgName);
			$('#bankNameSpan2').removeClass().addClass(this.bankIconUrl);
			$('#showBalanceSpan2').text(this.balance);
			this.showPage10();
		},
		
		// 一站式提现确认提现
		doSubmit : function() {
			var $this = this;
			if(MUI.isEmpty(this.password)||MUI.isEmpty(this.pwdkey)){
				Utils.alertinfo("交易密码不能为空");
				return;
			}

			var subParam = {
				chargeFee : "0.00",
				password : this.password,
				pwdkey : this.pwdkey
			};
			$.extend(this.param, subParam);
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({
				url : "/transfer/life_submitOneStopTransfer",
				data : this.param,
				success : function(data) {
					$this.clearPwd();
					Client.hideWaitPanel(100);
					if (data.errorCode) {
						Utils.alertinfo(data.errorMessage);
//						$("#errorText").text(data.errorCode);
//						$("#errorMessageText").text(data.errorMessage);
//						$this.showPage9();
					} else {
		   				 if(!MUI.isEmpty(App.storage.get("paramAccount"))){
		    					App.storage.remove("paramAccount");	
	    				 }  
	    				 if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
	    					App.storage.remove("balanceInfo");	
	    				 } 
				  		$('#r_recAccount').text(Utils.formatAcc($this.bindCardNo));		  		  
			      	  	$('#r_recNameText').text("("+$this.customerNameCN+")");
				  		$('#r_recBankText').text($this.orgName);
						$('#r_bankNameSpan').removeClass().addClass($this.bankIconUrl);
						$('#r_transferSum').text("￥ "+Utils.formatCurrency($this.param.payAmount, 2)+" 元");
						$this.showPage7();
					}
				},
				error : function() {
					$this.clearPwd();//重载随机数
					Client.hideWaitPanel(100);
				}
			});
		},
		// 查询银行列表
		bankListQuery : function(actionFlag, queryBankName) {
			var lowerQueryBankName = queryBankName.toLowerCase();
			var $this=this;
			var params = {
				beginStr : "",
				endStr : "",
				hotFlag : "",
				bankName : lowerQueryBankName,
				actionFlag : actionFlag
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({
				url : "/bank/bankListQuery",
				data : params,
				success : function(data) {
					if (data.errorCode) {
						Utils.alertinfo(data.errorMessage);
					} else {
						$("#bankSelect").empty();
						var icoll = data.cd.iBankListInfo;
						var bankIconUrl = "";
						var selectBankValue = "";
						for ( var len = 0; len < icoll.length; len++) {
							var kcoll = icoll[len];
							if (!Utils.isEmpty(kcoll.bankIconUrl)) {
								bankIconUrl = "ico-bnk bnk-"+ kcoll.bankIconUrl.split("_")[1];
							} else {
								bankIconUrl = "";
							}
							
							selectBankValue = kcoll.unionBankNo
									+ "|" + kcoll.bankName + "|"
									+ kcoll.initial + "|"
									+ bankIconUrl + "|"
									+ kcoll.unionBankNo1 + "|"
									+ kcoll.unionBankNo2 + "|"
									+ kcoll.hotFlag;
							var iDiv = "";
							if (kcoll.hotFlag == '1') {
								iDiv = '<i class="' + bankIconUrl + '"></i>';
							}
							$('#bankSelect').append('<li value="' + selectBankValue
											+ '">' + iDiv
											+ kcoll.bankName
											+ '</li>');
						}
						
						// 银行点选效果
						$('#bankSelect li').on('tap',function() {
											var selectedBankValue = $(this).attr('value');
											var selectBankValueStr = selectedBankValue.split("|");
//											if ($this.channelFlag == '8') {
//												$('#depositBankName1').val(selectBankValueStr[1]);
//												$('#depositBankNo1').val(selectBankValueStr[0]);
//												$('#depositBankUrl1').val(selectBankValueStr[3]);
//											} else {
												$('#depositBankName2').val(selectBankValueStr[1]);
												$('#depositBankNo2').val(selectBankValueStr[0]
																		+ "#"
																		+ selectBankValueStr[4]
																		+ "#"
																		+ selectBankValueStr[5]);
												$('#depositBankUrl2').val(selectBankValueStr[3]);
//											}
											$this.showPage10();
										});

					}
					Client.hideWaitPanel();
				}
			});
		},
		
		// 查询省
		queryProvice : function() {
			var $this =this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({
				url : "/pubServer/queryProvice",
				data : {},
				success : function(data) {
					if (data.errorCode) {
						Utils.alertinfo(data.errorMessage);
					} else {
						$('#proviceList').empty();
						var icoll = data.cd.iProvinceInfo2;
						var selectCityValue = "";
						for ( var i = 0; i < icoll.length; i++) {
							var kcoll = icoll[i];
							selectCityValue = kcoll.provinceCode + "|" + kcoll.provinceName;
							$('#proviceList').append('<li value="'+ selectCityValue
										+ '"><i class="ico-bnk bnk-zs"></i>' 
										+ kcoll.provinceName + '</li>');

						}

						// 查询省点选效果
						$('#proviceList li').on('click',function() {
							var selectCityValue = $(this).attr('value');
							var selectCityValueStr = selectCityValue.split("|");
							$this.queryCity(selectCityValueStr[0],selectCityValueStr[1]);
						});
					}
					Client.hideWaitPanel();
				}
			});
		},

		// 查询城市
		queryCity : function(model,porName) {
			var $this = this;
			var params = {
				provinceCode : model
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({
				url : "/pubServer/cityQueryAjax",
				data : params,
				success : function(data) {
					if (data.errorCode) {
						Utils.alertinfo(data.errorMessage);
					} else {
						$('#cityList').empty();
						var iCityInfo = data.cd.iCityInfo;
						var selectCityValue = "";
						for ( var i = 0; i < iCityInfo.length; i++) {
							var kcoll = iCityInfo[i];
							selectCityValue = kcoll.cityCode + "|"
									+ kcoll.cityName;
							$('#cityList').append('<li value="'
													+ selectCityValue
													+ '"><i class="ico-bnk bnk-zs"></i>'
													+ kcoll.cityName
													+ '</li>');

						}

						$this.showPage6();
						// 查询省点选效果
						$('#cityList li').on('click',function() {
							var selectCityValue = $(this).attr('value');
							var selectCityValueStr = selectCityValue.split("|");
							$('#cityName').val(porName+" "+selectCityValueStr[1]);
							var cityCode = selectCityValueStr[0];
							$('#cityCode').val(cityCode);
							$this.showPage10();
						});
					}
					Client.hideWaitPanel();
				}
			});

		},

		// 查询分行
		bankListQueryAjax : function() {
			var $this=this;
			var bankNolist = $("#depositBankNo2").val().split("#");
			var bankTypeQuery = bankNolist[0];
			var BankNo = "";
			if (Utils.isEmpty(bankTypeQuery)) {
				Utils.alertinfo("请先选择开户行");
				return;
			} else {
				if (bankTypeQuery == '313') {
					BankNo = bankNolist[1] + "," + bankNolist[2];
				}
			}
			var cityCode = $('#cityCode').val();
			if(!cityCode){
				Utils.alertinfo("请选择开户地");
				return;
			}
			var params = {
				bankType : bankTypeQuery,
				unionBankNo1 : BankNo,
				cityCode : cityCode,
				bankName : ""
			};

			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({
				url : "/bank/bankListQueryAjax",
				data : params,
				success : function(data) {
					if (data.errorCode) {
						Utils.alertinfo(data.errorMessage);
					} else {
						$('#bankSelect2').empty();
						var iBankInfo = data.cd.iBankInfo;
						var selectCityValue = "";
						for ( var i = 0; i < iBankInfo.length; i++) {
							var kcoll = iBankInfo[i];
							selectCityValue = kcoll.unionBankNo + "|" + kcoll.bankName;
							$('#bankSelect2').append('<li value="'
													+ selectCityValue
													+ '"><i class="ico-bnk bnk-zs"></i>'
													+ kcoll.bankName
													+ '</li>');
						}
						if($("#bankSelect2 li").length<=0){
							$("#noData").show();
						}else{
							$("#noData").hide();
						}
						// 查询省点选效果
						$('#bankSelect2 li').on('tap',function() {
											var selectCityValue = $(this).attr('value');
											var selectCityValueStr = selectCityValue.split("|");

											$('#depositBankName3').val(selectCityValueStr[1]);
											$('#depositBankNo3').val(selectCityValueStr[0]);
											$this.showPage10();
										});
					}
					Client.hideWaitPanel();
				}
			});
		},
		
		// 检查金额
		checkAmount : function(amtShow) {
			var balance = Utils.removeComma(this.balance);
			if(Utils.isEmpty(amtShow)){
				Utils.alertinfo("请输入提现金额");
				return false;
			}else if(amtShow.length>12){
				Utils.alertinfo("您输入的金额过大");
				return false;
			}else if(!Utils.isMoney(amtShow)){
				Utils.alertinfo("请输入正确的金额");
				return false;
			}else if(amtShow == '0.00'){
				Utils.alertinfo("提现金额不能为零");
				return false;
			}else if(parseFloat(amtShow) > parseFloat(balance)){
				Utils.alertinfo("提现金额不能超出账户余额");
				return false;
			}else if((parseFloat(balance) - parseFloat(amtShow)) < parseFloat(this.totalCollInSum)){
				Utils.alertinfo("剩余金额不能小于他行转入金额,今日他行转入金额为："+Utils.formatCurrency(this.totalCollInSum, 2)+"元。");
				return false;
			}			
			return true;
			
		},
		
		clearPwd : function(){
			$("#pwd").val("");
			this.password = "";
			this.pwdkey = "";
			Client.loadPwdKey();
    	},
		
		tranAmtAll : function(){
			$("#tranAmtText").val(Utils.removeComma($("#showBalanceSpan").text()));
		},

		account_balance : function(url) {
	      	App.back();
//			App.navigate("account/mycountCtl/accountBalance");
		},
		//控制页面显示
		showPage : function(num){
			for(var i=1;i<=10;i++){
				if(i==num){
					$("#outerTransferPage"+i).show();
				}else{
					$("#outerTransferPage"+i).hide();
				}
			}
		},
		showPage1 : function(){
        	var pageStep = {
            		title : '提现',
            		leftButton : {
            			name : '返回',
            			func : 'curView.account_balance()'
//            		},
//            		rightButton : {
//            			name : '帮助',
//            			func : 'curView.help()'
            		}
            	};

        	Client.initPageTitle(pageStep);
    		Client.menuOpt("5");
			this.showPage(1);
		},
		showPage2 : function(){
        	var pageStep = {
        			title : '提现',
        			leftButton : {
        				name : '返回',
        				func : 'curView.showPage1()'
//        			},
//        			rightButton : {
//        				name : '帮助',
//        				func : 'curView.help()'
        			}
        		};

        	Client.initPageTitle(pageStep);
    		Client.menuOpt("5");
			this.showPage(2);
		},
		showPage3 : function(){
        	var pageStep = {
        			title : '选择银行',
        			leftButton : {
        				name : '返回',
        				func : 'curView.showPage10()'
//        			},
//        			rightButton : {
//        				name : '帮助',
//        				func : 'curView.help()'
        			}
        		};

        	Client.initPageTitle(pageStep);
    		Client.menuOpt("5");
			this.showPage(3);
			this.bankListQuery("2", "");
		},
		showPage4 : function(){
        	var pageStep = {
        			title : '选择省份',
        			leftButton : {
        				name : '返回',
        				func : 'curView.showPage10()'
//        			},
//        			rightButton : {
//        				name : '帮助',
//        				func : 'curView.help()'
        			}
        		};

        	Client.initPageTitle(pageStep);
    		Client.menuOpt("5");
			this.showPage(4);
			this.queryProvice();
		},
		showPage5 : function(){
        	var pageStep = {
        			title : '选择分行',
        			leftButton : {
        				name : '返回',
        				func : 'curView.showPage10()'
//        			},
//        			rightButton : {
//        				name : '帮助',
//        				func : 'curView.help()'
        			}
        		};

        	Client.initPageTitle(pageStep);
    		Client.menuOpt("5");
			this.showPage(5);
			this.bankListQueryAjax();
		},
		showPage6 : function(){
        	var pageStep = {
        			title : '选择城市',
        			leftButton : {
        				name : '返回',
        				func : 'curView.showPage4()'
//        			},
//        			rightButton : {
//        				name : '帮助',
//        				func : 'curView.help()'
        			}
        		};

        	Client.initPageTitle(pageStep);
    		Client.menuOpt("5");
			this.showPage(6);
		},
		showPage7 : function(){
        	var pageStep = {
        			title : '提现结果',
        			leftButton : {
        				name : '返回',
        				func : 'curView.toCount()'
        			}
        		};

        	Client.initPageTitle(pageStep);
    		Client.menuOpt("5");
			this.showPage(7);
		},
		toCount:function(){			
			App.navigate("account/mycountCtl/mycount");
		},
		showPage9 : function(){
        	var pageStep = {
        			title : '提现结果',
        			leftButton : {
        				name : '返回',
        				func : 'curView.showPage1()'
        			}
        		};

        	Client.initPageTitle(pageStep);
    		Client.menuOpt("5");
			this.showPage(9);
		},
		showPage10:function(){
        	var pageStep = {
        			title : '提现',
        			leftButton : {
        				name : '返回',
        				func : 'curView.showPage1()'
//        			},
//            		rightButton : {
//            			name : '帮助',
//            			func : 'curView.help()'
        			}
        		};

        	Client.initPageTitle(pageStep);
    		Client.menuOpt("5");
			this.showPage(10);
			
		},
		queryBankInput:function() {
			var $this = $("#queryBankInput");
			if($this.val() != "请输入关键字" && !Utils.isEmpty($this.val())){
				this.bankListQuery("1", $this.val());
			}else{
				this.bankListQuery("1", "");
			}
		},
	});
});
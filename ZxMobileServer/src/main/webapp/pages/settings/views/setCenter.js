define(function(require, exports, module){
	require("../../../scripts/components/allPicker");
	var setCenterTpl = require("text!../template/setCenter.html");
	var profession_g = "";
	var jobInfo_g = "";
	var setCenterView = module.exports = ItemView.extend({
		
	template : setCenterTpl,
	events:{
		"click #hand":"openHand",
		"click #chageHand":"changeHand",
		"click #bindCardManage":"manageCard",
		"click #changePwd":"pwdMod",
		"click #changeLoginPwd":"pwdLoginMod",
		"click #fingerreal" : "openFinger",
		"click .i-avatar" : "changePhoto",
//		"click #identityUpload" : "identityUpload"
		
	},
	initialize : function(){
//		this.jobPicker = new $.PopPicker({layer: 2});
		//初始化菜单方法
		 var pageStep1 = {
			  	title:'账户中心',
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
		 
		 this.init();
//		 this.showJobPicker();
	},
	getHandPwd:function(isopen,iset){
		this.iset = iset;
		 if(isopen==0){//未开启
			 document.getElementById("hand").checked=true;
			 $("#hand").addClass("checked");
			 $("#chageHand").hide();
		 }else{
			 document.getElementById("hand").checked=false;
			 $("#hand").removeClass("checked");
			 $("#chageHand").show();
		 }
	 },
	 
	goBack : function(){
		$(".ui-poppicker").remove();
		$(".ui-backdrop").remove();
		App.back();
	},
	help : function(){
		App.navigate("anymore/anymoreCtl/messageCenter",true);
	},
	 //开关手势
	openHand:function(){
		
		 var handChecked = !document.getElementById("hand").checked;
		 var state =handChecked?"1":"0";
		 
		 	var $this = this;
			var param = {
					state:state
			};
			Client.openWaitPanel("");
			Ajax({url:"/pubServer/pwdSwitchUpdate",data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var actionFlag = data.actionFlag;	//状态（0：未设置	1 ：已设置）					
					$this.opt.isopen = handChecked;
					 
					 if(actionFlag=="1"){
						$this.opt.type=1;
						 if(handChecked == true){
							 $("#hand").removeClass("checked");
							 $("#chageHand").show();
						 }else{
							 $("#hand").addClass("checked");
							 $("#chageHand").hide();
						 }						 
					 }else{
						$this.opt.type=2;
					 }
					 
					Client.handPwd($this.opt);
					Client.hideWaitPanel(1); 
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
			}});
	 
	 },
	//修改手势
	 changeHand:function(){
		 this.opt.type=2;
		 Client.handPwd(this.opt);
	 },
	 
	 openFinger: function(){
		 App.navigate("settings/setCenterCtl/finger");
	 },
	 
	 init:function(){
//		var UserInfo = App.storage.get("UserInfo");
//		if(UserInfo.batchNo !=null && UserInfo.batchNo.length > 0){
//			$('#identityUpload').removeClass('zen-fold-arr');
//			$("#hasImg").show();
//		}else{
//			$("#hasImg").hide();
//		}
		 var mobile = App.storage.get("UserInfo").regMobile;
		 $("#mobileNo").text(Utils.getFmtMobile(mobile));
			if(Utils.checkRealUser("1")){
				 $("#chageHandSwitch").show();
				 $("#fingerSwitch").show();
//				 document.getElementById("hand").checked=true;
//				 $("#hand").addClass("checked");

				//手势初始化 
				 this.opt = {
						 type:3,    	//1开关手势，2设置手势，3获取手势状态
						 isopen:true,	//true打开手势，false关闭手势
						 callback:"curView.getHandPwd"	//回调函数
					 };
				 
				 Client.handPwd(this.opt);
				
				var eleCard = Utils.getEleCard().cardNo;
				$("#eleCard").text(eleCard);
				
				var cardStatus = Utils.getEleCard().cardStatus;
				if(cardStatus=="00"){
					$("#activate").show();
					$("#eleActivate").on('tap',this.elecAccActivate);
				}else{
					$("#activate").hide();
				}
				var  balanceIsSign = App.storage.get("balanceIsSign");
				if(!MUI.isEmpty(balanceIsSign)){
					if(balanceIsSign.isSign == "1"){
						$("#balanceUnSignUl").show();
						var param = {financeNo:balanceIsSign.financeNo};
						
						//幸福添利解约
						$("#balanceUnSign").on('tap',function(){App.navigate("finance/financeCtl/financeBalanceUnSign",param);});
						Client.hideWaitPanel(1);
						
					}else{
						$("#balanceUnSignUl").hide();
						Client.hideWaitPanel(1);						
					}
				}else{
					this.queryUserMobBalInfo();
				}
			}else{
				Client.hideWaitPanel(1);
			}
	 },
	//卡管理
	 manageCard:function(){
		if(Utils.checkRealUser()){
			/*if(!Utils.checkActivate()){
				return;
			}*/
			 App.navigate("myBankCard/myBankCardCtl/myBankCard",true);
		}
	 },
	 //交易密码修改
	 pwdMod:function(){
		if(Utils.checkRealUser()){
			if(!Utils.checkActivate()){
				return;
			}
			App.navigate("settings/setCenterCtl/elecAccPwdMod",true);
		}
	 },
	 
	 //登陆密码修改
	 pwdLoginMod:function(){
		App.navigate("settings/setCenterCtl/loginPwdMod");
	 },
	 
		//查询幸福添利是否签约
	 queryUserMobBalInfo:function(){
			var cardNo = Utils.getCardNoByFlag("0","cardFlag1");
    		if(MUI.isEmpty(cardNo)){
				$("#balanceUnSignUl").hide();
				Client.hideWaitPanel(1);
				return;
    		}
    		Client.openWaitPanel("加载中");
			var param = {
					cardNo:cardNo
			};
			Ajax({url:"/finance/queryUserMobBalanceSign",data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var state = data.state;	//状态（2：签约	3 未签约）					
					
					if(state == 2){
						
						 var financeNo = data.financeNo;
						
						 var balanceIsSign = {
								isSign : "1",
								financeNo :  financeNo
						 };
						 MUI.Cache.save("balanceIsSign",balanceIsSign);//幸福添利签约
						 
						 //幸福添利解约
						 var param = {financeNo:financeNo};
						 $("#balanceUnSign").on('tap',function(){App.navigate("finance/financeCtl/financeBalanceUnSign",param);});
						 $("#balanceUnSignUl").show();
					}else{
						$("#balanceUnSignUl").hide();
					}
					Client.hideWaitPanel(1); 
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
			}});
	 },
	 //激活
	 elecAccActivate:function(){
		if(Utils.checkRealUser()){
			if(!Utils.checkActivate()){
				return;
			}	
		}
//		 Client.menuOpt("0");
//		 App.navigate("settings/setCenterCtl/activate");
	 },

/*	 createRecommedNUM:function(){
		 
			var param = {
			};
			Ajax({url:"/userSetting/createRandomNUm",data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var recommendNum = data.cd.RecommendNum;
					$('#RecommendNum').text(recommendNum);
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				Client.hideWaitPanel(1);
			}});
	},*/
	
	getCheck : function(data){
		Client.openWaitPanel("加载中");
		var param = {
				mobileNo:App.storage.get("UserInfo").regMobile,
				vBasis:"",
				vCode:"",
				userName:data.name,
				certNo:data.id
		};
		Ajax({url:"/regServer/mobRegisterStep1",data:param, success:function(data){
			if(MUI.isEmpty(data.errorCode)){
				var random = data.random;
				var customerAlias = data.customerAlias;
				var paramValue = {
						mobileNo:param.mobileNo,
						customerAlias:customerAlias,
						userName:param.userName,
						certNo:param.certNo,
						random:random,
						vCode:""
					};
				App.storage.set("customerName",param.userName);
				App.navigate("userReg/userRegCtl/userRegisterStep2",paramValue);
			}else{
				Utils.alertinfo(data.errorMessage);
				Client.hideWaitPanel(1);
			}
		}});
	},
	
	changePhoto : function(){
		Client.uploadPhoto("curView.getPhoto");
	},
	
	getPhoto : function(data){
		$(".setAvatar img").attr("src","data:image/png;base64,"+data.Photo);
		var info = App.storage.get("UserInfo");
		info.photo = data.Photo;
		App.storage.set("UserInfo",info);
	},
	
//	identityUpload : function(){
//		var UserInfo = App.storage.get("UserInfo");
//		if(!UserInfo.batchNo){
//			App.navigate("anymore/anymoreCtl/identityUpload");
//		}
//	},
	
	showJobPicker : function(){
		
		var job_b = [
		             {value:"1",text:"负责人"},
		             {value:"2",text:"专业技术人员"},
		             {value:"3",text:"财务人员"},
		             {value:"4",text:"办事人员"},
		             {value:"5",text:"生产操作人员"},
		             {value:"9",text:"其他"}];
		var job_a = [
		             {value:"A",text:"国家机关、党群组织、事业单位",children:job_b},
		             {value:"B",text:"工业生产、运输设备",children:job_b},
		             {value:"C",text:"商业、服务业、贸易",children:job_b},
		             {value:"D",text:"科研、文化、卫生、教育、法律",children:job_b},
		             {value:"E",text:"金融、电力 、电信、邮政",children:job_b},
		             {value:"F",text:"农、林、牧、渔、水利业",children:job_b},
		             {value:"G",text:"学生",children:job_b},
		             {value:"H",text:"离退休",children:job_b},
		             {value:"I",text:"军人",children:job_b},
		             {value:"J",text:"个体/自由职业者",children:job_b},
		             {value:"Z",text:"其他",children:job_b}];
		
		var UserInfo = App.storage.get("UserInfo");
		if(UserInfo.profession_g){
			//
			this.showJobData(UserInfo.profession_g,job_a,job_b);
		}else{
			//没有职业信息，查询一把
			Client.openWaitPanel("加载中");
			var param = {
			};
			var $this = this;
			Ajax({url:"/pubServer/customerInfoQuery",data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					Client.hideWaitPanel(1);
					if(data.cd.profession){
						UserInfo.profession_g = data.cd.profession;
						App.storage.set("UserInfo",UserInfo);
						$this.showJobData(data.cd.profession,job_a,job_b);
					}else{
						$this.setJobData(job_a);
					}
					
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
			}});

		}
	
	},
	showJobData : function(data,job_a,job_b){
		  var item1 = data.substring(0,1);
		  var item2 = data.substring(1,2);
		  var job_a_len = job_a.length;
		  var job_b_len = job_b.length; 
		  var text_a = "";
		  var text_b = "";
		  for(var i = 0 ;i<job_a_len; i++){
			  if(job_a[i].value == item1){
				  text_a = job_a[i].text;
			  }
		  }
		  for(var i = 0 ;i<job_b_len; i++){
			  if(job_b[i].value == item2){
				  text_b = job_b[i].text;
			  }
		  }
		  
		  if(text_a.length > 6){
			  jobInfo_g = text_a.substring(0,6) + "... " + text_b;
		  }else{
			  jobInfo_g = text_a + " " + text_b;
		  }
		  
		  var jobInfo = $('#jobInfo');
		  jobInfo.html(jobInfo_g);
		  $('.i-occupatuion').removeClass('zen-fold-arr');
	},
	setJobData : function(job_a){
		  this.jobPicker.setData(job_a);
		  var showJobPickerDiv = $('#showJobPicker');
		  var jobInfo = $('#jobInfo');
		  var $this = this;
		  showJobPickerDiv.on('tap', function(event) {
			  //已经设置
		      var UserInfo = App.storage.get("UserInfo");
			  if(UserInfo.profession_g){
				  return;
			  }

			  $this.jobPicker.show(function(items) {
				  profession_g = items[0].value+items[1].value;
				  
				  //请求后台设置职业信息
					Client.openWaitPanel("加载中");
					var param = {
						certNo:Utils.trim(App.storage.get("UserInfo").certNo),
						userName:App.storage.get("UserInfo").customerNameCN,
						profession:profession_g,
						actionFlag:"01"
						
					};
					var $this = this;
					Ajax({url:"/batchacc/userInfoInput",data:param, success:function(data){
						if(MUI.isEmpty(data.errorCode)){
							  if(items[0].text.length > 6){
								  jobInfo_g = items[0].text.substring(0,6) + "... " + items[1].text;
							  }else{
								  jobInfo_g = items[0].text + " " + items[1].text;
							  }
							  jobInfo.html(jobInfo_g);
							  $('.i-occupatuion').removeClass('zen-fold-arr');
							  var UserInfo = App.storage.get("UserInfo");
							  UserInfo.profession_g = profession_g;
							  UserInfo.jobInfo_g = jobInfo_g;
							  App.storage.set("UserInfo",UserInfo);
							  Client.hideWaitPanel(1);

						}else{
							Utils.alertinfo(data.errorMessage);
							Client.hideWaitPanel(1);
						}
					}});
  

			  });
		  });
	}
	
	});
});




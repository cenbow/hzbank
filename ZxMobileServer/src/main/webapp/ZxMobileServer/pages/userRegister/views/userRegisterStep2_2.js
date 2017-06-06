define(function (require, exports, module) {
	
	require("../../../scripts/components/allPicker");
	var userRegisterStep2_2Template = require("text!../template/userRegisterStep2_2.html");
	var profession_g = "";
	var jobInfo_g = "";
	var currentView = module.exports = ItemView.extend({
		
        template : userRegisterStep2_2Template,
        
        events:{
        	"keyup #input_userName,#input_certNo,#input_bindCardNo":"checkButton",
        	"blur #input_userName,#input_certNo,#input_bindCardNo":"checkButton",
        	"blur #input_bindCardNo":"getBank",
        	"keyup #input_bindCardNo":"getFmtAcc",
        	"click #password":"showPwd",      	
        	"click #nextButton2":"toNextStep",
        	"click .i-card":"ocrBankCard",
        	"click #bank_more":"bank_more",
        	"click .i-name":"itCheck" 
        },
        
        initialize : function(params){
        	this.jobPicker = new $.PopPicker({layer: 2});
        	var pageTest = {
    			  	title:'注册',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
        	this.pwd ="";
        	this.pwdKey ="";
    		Client.initPageTitle(pageTest);
    		
        	Client.hideWaitPanel(1);
        	//职业初始化
        	var param = App.storage.get("_parameters");
        	if(Utils.isEmpty(param.jobInfo_g)){
            	$('#jobInfo').val("商业、服务业、贸易 办事人员");
            	jobInfo_g="商业、服务业、贸易 办事人员";
            	profession_g="C4";
        	}else{
        		$('#jobInfo').val(param.jobInfo_g);
            	jobInfo_g=param.jobInfo_g;
            	profession_g=param.profession_g;
        	}

        	//职业初始化结束
        	this.setjob();
        	this.getBank();
        	this.cardType = this.model.get("cardType");

    		if(this.cardType =='01'){
					$("#tr_safeInput").show();
    		}else{
					$("#tr_safeInput").hide();
    		}
			this.checkButton();
        },
        
        setjob : function(){
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
			
			  this.jobPicker.setData(job_a);
			  var showJobPickerDiv = $('#showJobPicker');
			  var jobInfo = $('#jobInfo');
			  var $this = this;
			  showJobPickerDiv.on('tap', function(event) {
				  $this.jobPicker.show(function(items) {
					  if(items[0].text.length > 6){
						  jobInfo_g = items[0].text.substring(0,6) + "... " + items[1].text;
					  }else{
						  jobInfo_g = items[0].text + " " + items[1].text;
					  }
					  jobInfo.val(jobInfo_g);
					  profession_g = items[0].value+items[1].value;
					  $this.checkButton();
				  });
			  });
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
		
		toNextStep : function(){
			///////////字段合法性校验开始//////////////
			if($("#nextButton2").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			var userName = $('#input_userName').val();
			var certNo = $('#input_certNo').val();
			var bankType = $('#input_bank').attr("data-value");
			var bindCardNo = $('#input_bindCardNo').val();

			if(Utils.isEmpty(userName)){
		    	Utils.alertinfo("请输入您的姓名");	
				return;
			}
			if(!Utils.checkCertNo18(certNo)){
				return;
			}
			if(Utils.isEmpty(bankType)){
		    	Utils.alertinfo("请选择绑定卡银行");	
				return;
			}
			if(Utils.isEmpty(bindCardNo)){
		    	Utils.alertinfo("请输入绑定卡卡号");	
				return;
			}
    		if(!profession_g){
    			profession_g = Utils.nvl(App.storage.get("_parameters").profession_g,"");
    			if(!profession_g){
    				Utils.alertinfo("请输入职业信息");	
    				return;
    			}
    		}
    		
			///////////字段合法性校验结束//////////////
    		certNo = $('#input_certNo').val();
			var $this = this;
			var paramValue = App.storage.get("_parameters");
    		var mobileNo = paramValue.mobileNo;
    		var random = paramValue.random;
    		bindCardNo = bindCardNo.replace(/\s/g,"");
    		var bankName = $('#input_bank').val();

    		var param = {
    				mobileNo:mobileNo,
					cardType:this.cardType,
    				userName:userName,
    				certNo:certNo,
    				bankName:bankName,
    				bankType:bankType,
    				bindCardNo:bindCardNo,
					payPwd:this.pwd,
					pwdkey:this.pwdKey,
					random:random,
					photoBackBase64:paramValue.photoBackBase64,
					photoBase64:paramValue.photoBase64,
					customerSex:paramValue.gender=='男'?'M':'F',
					customerBirthday:paramValue.birth,
					customerAddress:paramValue.address,
					customerRace:paramValue.people,
					orcFlag:paramValue.orcFlag,
					organ:paramValue.authority,
    				validity:Utils.isEmpty(paramValue.validDate)?"":paramValue.validDate.split('-')[1],
    				profession:profession_g
    		};
    		
    		Client.openWaitPanel("拼命加载中，请稍候");
    		Ajax({url:"/regServer/registerStep2",data:param, success:function(data){
    			$this.clearPwd();
    			if(Utils.isEmpty(data.errorCode)){
					var paramValue = {
							mobileNo:mobileNo,
							userName:userName,
							certNo:certNo,
		    				bankName:bankName,
		    				bankType:bankType,
		    				bindCardNo:bindCardNo,
							cardType:$this.cardType,
							bankUrlClass:$this.bankUrlClass,
							customerAlias:data.customerAlias,
							random:data.random
							};
					App.browParam[0] = paramValue;
					App.navigate("userRegister/userRegisterCtl/userRegisterStep3",paramValue);
    			}else{
    				if(data.errorCode=='66'){
    					Utils.alertinfo("您的身份证信息与银行预留信息不符，请到银行柜面修改");
    				}else{
    					Utils.alertinfo(data.errorMessage);
    				}
    				Client.hideWaitPanel(1);
    			}
    		},error:function(){
    			$this.clearPwd();
    		}});
    		
		},
		
   	   	clearPwd : function(){
		  	 $("#password").val("");
			 this.pwd = "";
	  		 this.pwdKey = "";
			 Client.loadPwdKey();
			 this.checkButton();
	   	},
	   	
  	    goBack : function(){
  			$(".ui-poppicker").remove();
  			$(".ui-backdrop").remove();
  			App.back();
  	    },
		checkButton : function(){
			  if(this.cardType == "00"||this.cardType == "01"){
				  (!Utils.isEmpty($('#input_userName').val())&&!Utils.isEmpty($('#input_certNo').val())&&!Utils.isEmpty($('#input_bindCardNo').val())&&!Utils.isEmpty($('#input_bank').attr("data-value"))&&!Utils.isEmpty(this.pwd)&&!Utils.isEmpty(profession_g)) ?
						  $("#nextButton2").removeClass('disabled').removeAttr('disabled') : $("#nextButton2").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		    
			  }else{				  
				  (!Utils.isEmpty($('#input_userName').val())&&!Utils.isEmpty($('#input_certNo').val())&&!Utils.isEmpty($('#input_bindCardNo').val())&&!Utils.isEmpty($('#input_bank').attr("data-value"))&&!Utils.isEmpty(profession_g)) ?
						  $("#nextButton2").removeClass('disabled').removeAttr('disabled') : $("#nextButton2").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
			  }
		},
		
		getBank : function(){
			var bindCardNo = $('#input_bindCardNo').val();
			bindCardNo = bindCardNo.replace(/\s/g,"");
			if(Utils.isEmpty(bindCardNo)){
				return;
			}
			var params = {
					cardNo:bindCardNo,
					queryType:'1',
					mobileNo:App.storage.get("_parameters").mobileNo
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
					    		$this.cardType='01';//本行借记卡	
					    		$("#tr_safeInput").show();
					    	}else{
					    		$this.cardType = "04";//他行借记卡
					    		$("#tr_safeInput").hide();
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
			}});
			
		},
		ocrBankCard : function(){
		    Client.openWaitPanel("ocr启动中，请稍候");
        	Client.ocrBankCard("curView.cardRes");
        	Client.hideWaitPanel(1);	
		},
		cardRes : function(num){
			$("#input_bindCardNo").val(Utils.getFmtAcc(num));
			this.getBank();
		},
		getFmtAcc : function(){
			var bindCardNo = $("#input_bindCardNo").val();
			$("#input_bindCardNo").val(Utils.getFmtAcc(bindCardNo));
		},
		itCheck : function(){
			Client.openWaitPanel("ocr启动中，请稍候");
        	Client.ocrCheck("curView.getPhotoResFront");
        	Client.hideWaitPanel(1);
		},
		getPhotoResFront : function(obj){
			if(obj.certNo == null || obj.certNo.length == 0){
				Utils.alertinfo("请扫描身份证正面");
				return;
			}
			$("#input_userName").val(obj.userName);
			$("#input_certNo").val(obj.certNo);
			Client.hideWaitPanel(1);
		},
		bank_more : function(){
			///保存相关信息开始//
			var param = App.storage.get("_parameters");
        	param.userName = $('#input_userName').val();
        	param.certNo = $('#input_certNo').val();
        	param.bankName = $('#input_bank').val();
        	param.bankType = $('#input_bank').attr("data-value");
        	param.bindCardNo = $('#input_bindCardNo').val();
        	param.profession_g = profession_g;
        	param.jobInfo_g = jobInfo_g;
			App.storage.set("_parameters",param);
			///保存相关信息结束////
			var iBankInfoMore = App.storage.get("iBankInfoMore");
			if(iBankInfoMore){
				App.navigate("userRegister/userRegisterCtl/moreBankList",iBankInfoMore);
			}else {
				var params = {
	        			actionFlag:"00"
	        	};
				Client.openWaitPanel("拼命加载中，请稍候");
	    		Ajax({ url: "/bank/queryBankInfo", data:params, success: function(data){
						if(Utils.isEmpty(data.errorCode)){
							iBankInfoMore = data.iBankInfo;
							var len = iBankInfoMore.length;
							for(var i=0;i<len;i++){
								iBankInfoMore[i].bankIconUrl = iBankInfoMore[i].bankIconUrl.split("_")[1];
							}
							App.storage.set("iBankInfoMore",iBankInfoMore);
							param.iBankInfoMore = iBankInfoMore;
							App.navigate("userRegister/userRegisterCtl/moreBankList",iBankInfoMore);
						}else{
							param.iBankInfoMore = [];
							Utils.alertinfo("没有更多银行！");
						}
						Client.hideWaitPanel(1);
					},
					error:function(){
						param.iBankInfoMore = [];
						Utils.alertinfo("没有更多银行！");
						Client.hideWaitPanel(1);
					}
	        	});	
			}
    		
		}
        
	});
});
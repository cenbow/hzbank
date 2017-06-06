define(function(require, exports, module){
	require("../../../scripts/components/allPicker");
	var realNameTpl = require("text!../template/realName.html");
	var profession_g = "";
	var jobInfo_g = "";
	var realNameView = module.exports = ItemView.extend({
		
		template : realNameTpl,
		
		events : {
			"click #img_a" : "ocrFront",
			"click #img_b" : "ocrBack",
			"click #upload" : "upload",
			"click #back" : "goBack",
			"click .mt20" : "goToBack"
		},
		
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    var pageTest = {
				  	title:'实名认证',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  };
			Client.initPageTitle(pageTest);
			this.param = {};
			this.jobPicker = new $.PopPicker({layer: 2});
			this.showJobPicker();
			this.certNo = App.storage.get("UserInfo").certNo;
		    Client.hideWaitPanel(100);
		},
		
		ocrFront : function(){
        	Client.openWaitPanel("ocr启动中，请稍候");
        	Client.ocrCheck("curView.getPhotoResFront");
        	Client.hideWaitPanel(1);
		},
		
		getPhotoResFront : function(obj) {
			if(obj.certNo == null || obj.certNo.length == 0){
				Utils.alertinfo("请扫描身份证正面");
				return;
			}
			Client.hideWaitPanel(1);
			if(obj.certNo == this.certNo){
				obj.birth = '' + obj.year + obj.month + obj.day;
				_.extend(this.param, obj);
			}else{
				Utils.alertinfo("识别信息与本人身份信息不匹配，请重新操作！");
				return;
			}
			var html = '<img src="data:image/png;base64,'+obj.photoBase64+'" >';
			$("#img_a").html(html);

		},
		
		ocrBack:function(){
			Client.openWaitPanel("ocr启动中，请稍候");
			Client.ocrCheck("curView.getPhotoResBehind");
			Client.hideWaitPanel(1);
		},
		
		getPhotoResBehind : function(obj) {
			if(obj.validDate == null || obj.validDate.length == 0){
				Utils.alertinfo("请扫描身份证反面");
				return;
			}
			var html = '<img src="data:image/png;base64,'+obj.photoBase64+'" >';
			$("#img_b").html(html);
			Client.hideWaitPanel(1);
			this.param.photoBackBase64 = obj.photoBase64;
			this.param.authority = obj.authority;
			this.param.validDate = obj.validDate;
		},
		
		upload : function(){
			if(!$("#jobInfo").text().trim()){
				Utils.alertinfo("请选择您的职业");
				return;	
			}
			if(!this.param.photoBase64){
				Utils.alertinfo("请扫描身份证正面");
				return;
			}
			if(!this.param.photoBackBase64){
				Utils.alertinfo("请扫描身份证反面");
				return;
			}
			
			var iCardInfo = App.storage.get("UserInfo").iCardInfo;
			
			Client.openWaitPanel("加载中");
    		var $this=this;
    		var param = {
    				userName:this.param.userName,
    				certNo:this.param.certNo,
    				photoBackBase64:this.param.photoBackBase64,
					photoBase64:this.param.photoBase64,
					customerSex:this.param.gender=='男'?'M':'F',
					customerBirthday:this.param.birth,
					customerAddress:this.param.address,
					customerRace:this.param.people,
					organ:this.param.authority,
    				validity:this.param.validDate.split('-')[1],
    				profession:App.storage.get("UserInfo").profession_g,
    				actionFlag:"02",
    				cardNo:iCardInfo[0].cardNo,
    				accountType : iCardInfo[0].accountType
    		};
    		Ajax({url:"/batchacc/userInfoInput",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				$("#success").show();
					$("#new2016").hide();
					$("#fail").hide();
					var UserInfo = App.storage.get("UserInfo");
					if(UserInfo.isFace =="01"){
    					UserInfo.userType = "02";
    				}
    				UserInfo.batchNo = data.batchNo;
    				App.storage.set("UserInfo",UserInfo);
    			}else{
    				$("#success").hide();
					$("#new2016").hide();
					$("#fail").show();
    			}
    			Client.hideWaitPanel(1);
    		}});
		
		},
		
		showJobPicker : function(){
			var job_b = NS.PB_JOB_B;
			var job_a = NS.PB_JOB_A;
			
			var UserInfo = App.storage.get("UserInfo");
			if(UserInfo.profession_g){
				this.showJobData(UserInfo.profession_g,job_a,job_b);
			}else{
				//没有职业信息，查询一把
				var param = {
				};
				var $this = this;
				Client.openWaitPanel("加载中");
				Ajax({url:"/pubServer/customerInfoQuery",data:param, success:function(data){
					if(MUI.isEmpty(data.errorCode)){
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
			Client.hideWaitPanel(100);
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
			  $('#showJobPicker').removeClass('arr');
			  var jobInfo = $('#jobInfo');
			  jobInfo.html(jobInfo_g);
			  this.setJobData(job_a);
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
								  $('#showJobPicker').removeClass('arr');
								  var UserInfo = App.storage.get("UserInfo");
								  UserInfo.profession_g = profession_g;
								  UserInfo.jobInfo_g = jobInfo_g;
								  App.storage.set("UserInfo",UserInfo);

							}else{
								Utils.alertinfo(data.errorMessage);
							}
							Client.hideWaitPanel(1);
						}});
	  

				  });
			  });
		},
		
		goToBack : function(){
			App.back();
		},
  	    
		goBack : function() {
			$(".ui-poppicker").remove();
			$(".ui-backdrop").remove();
			App.back();
		},

	
	});
});

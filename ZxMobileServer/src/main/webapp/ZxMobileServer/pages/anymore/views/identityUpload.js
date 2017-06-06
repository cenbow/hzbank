define(function(require, exports, module) {

	var identityUploadTpl = require("text!../template/identityUpload.html");

	var identityUploadView = module.exports = ItemView.extend({

		template : identityUploadTpl,

		events : {
        	"click #img_a" : "ocrFront",
			"click #img_b" : "ocrBack",
			"click #upload" : "upload",
			"click #back" : "goBack"
		},

		// 定义日志TAG便于错误信息查找
		initialize : function() {
			var pageTest = {
				title : '身份证上传',
				leftButton : {
					name : '返回',
					func : 'curView.goBack()'
				},
				rightButton : {
					name : ''
				}
			}
			Client.initPageTitle(pageTest);
			Client.hideWaitPanel(100);
			
			this.param = {};
			var UserInfo = App.storage.get("UserInfo");
			this.customerNameCN = UserInfo.customerNameCN;
			this.certNo = UserInfo.certNo;
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
			
			if(obj.userName == this.customerNameCN && obj.certNo == this.certNo){
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
			if(!this.param.photoBase64){
				Utils.alertinfo("请扫描身份证正面");
				return;
			}
			if(!this.param.photoBackBase64){
				Utils.alertinfo("请扫描身份证反面");
				return;
			}
			
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
    				validity:this.param.validDate.split('-')[1]
    		};
    		Ajax({url:"/batchacc/userInfoInput",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					$(".idc-result").show();
					$(".deEloan").hide();
					var UserInfo = App.storage.get("UserInfo");
    				UserInfo.batchNo = data.batchNo;
    				App.storage.set("UserInfo",UserInfo);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    			Client.hideWaitPanel(1);
    		}});
		
		},
  	    
		goBack : function() {
			App.back();
		}

	});
});

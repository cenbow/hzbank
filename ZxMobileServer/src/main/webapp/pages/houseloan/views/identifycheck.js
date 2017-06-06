define(function(require, exports, module){
	
	var identifycheckTpl = require("text!../template/identifycheck.html");
	
	var IdentifycheckView = module.exports = ItemView.extend({
		
		template : identifycheckTpl,
		
		events : {
			"click #cancel":"itCheck",
			"click #sure":"submit"
		},
			//定义日志TAG便于错误信息查找
		initialize : function(){
			
			  var pageTest = {
	    			  	title:'贷款申请',
	    				leftButton:{
	    					name : '返回',
	    					func :'curView.goToBack()'
	    				},
	    				rightButton:{
	    					name : '取消',
	    					func : 'curView.cancel()',
	    				}
	    		  }
	    		Client.initPageTitle(pageTest);
	    	    Client.hideWaitPanel(10);
		
		    this.param = App.storage.get("_parameters");
		},
		

		cancel : function(){
			var index = App.browseList.indexOf("houseloan/houseloanCtl/loanCenter");
    	  	App.browseList.splice(1,index-1);
			App.back();
			
		},

    	goToBack : function(){
    		App.back();
    	},
		
		submit : function(){
			Client.openWaitPanel("");
			$.extend(this.param,{transType:"01"});
			var $this = this;
			Ajax({url:"/faceCheck/idCardInputCheckFacePlus", data:this.param, success:function(data){
				Client.hideWaitPanel(1);
				if(MUI.isEmpty(data.errorCode)){
					$this.excep(data);
				}else{
					Utils.alertinfo(data.errorMessage);
				}
			}});
		},
		
		itCheck : function(){
			Client.ocrCheck("curView.getPhotoResFront");
		},
		
		getPhotoResFront : function(obj){
			Client.hideWaitPanel(1);
			obj.birth = obj.year+'-'+obj.month+'-'+obj.day;
			_.extend(this.param,obj);
			this.model.set(this.param);
		},
		
		excep : function(obj){
			var res = "fail";
			var msg = "";
			var param = App.storage.get("_parameters");
			if (obj.orderResult == "00"){
				var type = param.action,
					certNo = Utils.checkSession()?App.storage.get("UserInfo").certNo:"";
				if((type=="签约管理"||type=="账户升级")&&certNo!=this.param.certNo){
					msg = "与登录用户证件信息不符！";
					this.resCode = "";
				}else{
					res = "success";
					msg = "身份验证成功！";
				}
			}else{
				msg = "身份识别失败，点击重试";
			}
			if(res=="fail"){
				param.res = res;
				param.msg = msg;
				App.navigate("houseloan/houseloanCtl/result?from=ocr",param);
			}else{
				App.navigate("houseloan/houseloanCtl/facecheck",param);
			}
			
		}
	
	});
});

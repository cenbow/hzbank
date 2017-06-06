define(function(require, exports, module){
	
	var ocrResultTpl = require("text!../template/ocrResult.html");
	
	var ocrResultView = module.exports = ItemView.extend({
		
		template : ocrResultTpl,
		
		events : {
			"click #cancel":"itCheck",
			"click #sure":"submit"
		},
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
		    Client.hideWaitPanel(1);
		    
		    this.param = App.storage.get("_parameters");
		},

		cancel : function(){
			Client.menuOpt("5");
			var index = App.browseList.indexOf("special/specialCtl/special");
    	  	App.browseList.splice(1,index-1);
			App.back();
		},
		
		submit : function(){
			Client.openWaitPanel("");
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
			if (obj.succeed == "0") {
				var resCode = this.resCode = obj.resultCode;
				switch(resCode){
					case "0" :
					case "2" :
						var type = param.action,
							certNo = Utils.checkSession()?App.storage.get("UserInfo").certNo:"";
						if((type=="签约管理"||type=="账户升级")&&certNo!=this.param.certNo){
							msg = "与登录用户证件信息不符！";
							this.resCode = "";
						}else{
							res = "success";
							msg = "身份验证成功！";
						}
						 break;
					case "-1" : 
						msg = "人行二代证照片未取到";
						break;
					case "-2" : 
						msg = "该用户未加入白名单";
						break;
					case "-3" : 
						msg = "身份核查未通过";
						break;
					case "-4" : 
						msg = "身份联网核查时段为7:30-19:00，请稍后再试";
						break;
					case "1" : 
						msg = "身份证翻拍照和人行二代证照片未通过";
						break;
					case "-100" : 
						msg = "身份证翻拍照或人行二代证照未取到，点击重试";
						break;
					case "-1001" : 
						msg = "姓名为空，点击重试";
						break;
					case "-1002" : 
						msg = "姓名为空，点击重试";
						break;
					case "-1003" : 
						msg = "身份证翻拍照为空，点击重试";
						break;
					case "-1009" : 
						msg = "身份证翻拍照不能解码，点击重试";
						break;
					case "-1011" : 
						msg = "人行二代证照片为空，点击重试";
						break;
					case "-1050" : 
						msg = "无效的消息类型，点击重试";
						break;
					case "-1051" : 
						msg = "无效的设备类型，点击重试";
						break;
					case "-1052" : 
						msg = "数据包为空，点击重试";
						break;
					case "-1053" : 
						msg = "数据包不能解码，点击重试";
						break;
					case "-1054" : 
						msg = "数据包中没有合格的照片，点击重试";
						break;
					case "-1055" : 
						msg = "证件芯片照不能解码，点击重试";
						break;
					case "-1205" :
						msg = "身份证翻拍照检测不到人脸，点击重试";
						break;
					case "-1206" :
						msg = "身份证翻拍照检测到多张人脸，点击重试";
						break;
					case "-1208" :
						msg = "人行二代证照片不能解码，点击重试";
						break;
					case "-1210" :
						msg = "人行二代证照片检测不到人脸，点击重试";
						break;
					case "-1211" :
						msg = "人行二代证照片检测到多张人脸，点击重试";
						break;
					case "-1250" :
						msg = "证件芯片照检测不到人脸，点击重试";
						break;
					case "-1251" :
						msg = "证件芯片照检测到多张人脸，点击重试";
						break;
					case "-1300" :
						msg = "服务器内部错误，点击重试";
						break;
					default :
						msg = "未知错误，点击重试";
				};
			} else {
				msg = "身份识别失败，点击重试";
			}
			if(res=="fail"){
				param.res = res;
				param.msg = msg;
				App.navigate("special/specialCtl/result?from=ocr",param);
			}else{
				App.navigate("special/specialCtl/faceTips",param);
			}
			
		}
	
	});
});

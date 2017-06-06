define(function(require, exports, module) {

	var securityTpl = require("text!../template/security.html");

	var securityView = module.exports = ItemView.extend({

		template : securityTpl,
		
		events : {
			"click #fingerSwitch" : "openFinger",
			"click #loginPwdChange":"loginPwdChange",
			"click #tranPwdChange":"tranPwdChange",
			"click #HandPwdSet":"HandPwdSet",
			"click #safeGrade":"safeGrade",
			"click #tranPwdFind":"tranPwdFind",
			"click #realName":"realName",
			"click #faceDetect":"faceDetect"
		},
		
		initialize : function() {
//			if (Utils.checkRealUser("1")) {
//				$("#fingerSwitch").show();
//			}
			
			var userType = App.storage.get("UserInfo").userType;
			var isFace = App.storage.get("UserInfo").isFace;
			var batchNo = App.storage.get("UserInfo").batchNo;
			
			if(isFace=="01"){
				$("#certify3").show();
				$("#certify4").hide();
				document.getElementById("faceDetect").setAttribute("class","list-item row");
			}else{
				$("#certify3").hide();
				$("#certify4").show();
				document.getElementById("faceDetect").setAttribute("class","list-item row arr");
			}
			
			if(batchNo=="" || batchNo==null){
				$("#certify1").hide();
				$("#certify2").show();
				document.getElementById("realName").setAttribute("class","list-item row arr");
			}else{
				$("#certify1").show();
				$("#certify2").hide();
				document.getElementById("realName").setAttribute("class","list-item row");
			}
			
			if(userType=="02"){
				$("#grade").text("高");
				document.getElementById("grade").setAttribute("class","fc-green");
			}else{
				$("#grade").text("中");
				document.getElementById("grade").setAttribute("class","fc-red");
			}
			
			Client.hideWaitPanel(1);
		},
		
		getHandPwd : function(isopen, iset) {
			this.iset = iset;
			if (isopen == 0) {// 未开启
				document.getElementById("hand").checked = true;
				$("#hand").removeClass("checked");
				$("#chageHand").hide();
			} else {
				document.getElementById("hand").checked = false;
				$("#hand").addClass("checked");
				$("#chageHand").show();
			}
		},

		

		openFinger : function() {
			//指纹初始化 
			this.fopt = {
				 type:2,    	//1开关指纹，2获取手势状态
				 isopen:true,	//true打开指纹，false关闭指纹
				 callback:"curView.getFinger"	//回调函数
			};
			Client.setFinger(this.fopt);
		},

		getFinger : function(isopen){
			 if(isopen=="0" || isopen=="1"){
				 App.navigate("settings/setCenterCtl/finger");
			 }
		 },
		
		
		goBack : function() {
			App.navigate("account/mycountCtl/mycount", true);
		},
		
		help : function() {
			App.navigate("anymore/anymoreCtl/messageCenter", true);
		},
		loginPwdChange:function(){
			App.navigate("settings/setCenterCtl/loginPwdMod");
		},

		
		tranPwdChange:function(){
			App.navigate("settings/setCenterCtl/elecAccPwdMod",true);
		},
		
		HandPwdSet:function(){
			App.navigate("settings/setCenterCtl/hand",true);
		},
		
		safeGrade:function(){
			App.navigate("settings/setCenterCtl/safeGrade");
		},
		
		tranPwdFind:function(){
			App.navigate("settings/setCenterCtl/elecAccPwdFind",true);
		},
		
		realName:function(){//实名认证
			var userType = App.storage.get("UserInfo").userType;
			var batchNo = App.storage.get("UserInfo").batchNo;
			if(userType=="01" && (batchNo=="" || batchNo==null)){
				App.navigate("settings/setCenterCtl/realName");
			}
		},
		
		faceDetect:function(){//人脸识别
			var isFace = App.storage.get("UserInfo").isFace;
			if(isFace=="01"){
				return;
			}else{
				App.navigate("settings/setCenterCtl/faceRecognition");
			}
		},


	});
});

define(function(require, exports, module){
	
	var tuitionQueryTpl = require("text!../template/tuitionQuery.html");
	
	var tuitionQueryView = module.exports = ItemView.extend({
		
		events : {
			"click #submit":"submit"
		},
		
		template : tuitionQueryTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			
			var schoolName = App.storage.get("pramm").schoolName;
			var semester = App.storage.get("pram").semester.toString();
			if(schoolName.indexOf("嘉华") >= 0){
				semester = semester.substring(0,4) + "学年";
			}else{
				semester = semester.substring(5,6)>"6"?(semester.substring(0,4)+'年第一学期')
						:(parseInt(semester.substring(0,4))-1+'年第二学期');
			}
			
			var userName=App.storage.get("UserFee").userName;
			var studentId=App.storage.get("UserFee").studentId;
			var classNumber=App.storage.get("UserFee").classNumber;
			var amountTotal=App.storage.get("UserFee").amountTotal;
			var inFee=App.storage.get("UserFee").inFee;
			var tuitionFee=App.storage.get("UserFee").tuitionFee;
			var accommodationFee=App.storage.get("UserFee").accommodationFee;
			var otherFee=App.storage.get("UserFee").otherFee;
			var materialsFee=App.storage.get("UserFee").materialsFee;
			var careFee=App.storage.get("UserFee").careFee;
			var foodFee=App.storage.get("UserFee").foodFee;
			
			$("#term").text(semester);
			$("#schoolName").text(schoolName);
			$("#userName").text(userName);
			$("#studentId").text(studentId);
			$("#classNumber").text(classNumber);
			$("#amountTotal").text(amountTotal);
			$("#inFee").text(inFee);
			$("#tuitionFee").text(tuitionFee);
			$("#accommodationFee").text(accommodationFee);
			$("#otherFee").text(otherFee);
			$("#materialsFee").text(materialsFee);
			$("#careFee").text(careFee);
			$("#foodFee").text(foodFee);
	        
		    Client.hideWaitPanel(1);
		},
		
		
		submit : function(){
			var semester = App.storage.get("pram").semester;	
			var studentId=App.storage.get("UserFee").studentId;
			var studentsGrade=App.storage.get("UserFee").studentsGrade;
			var classNumber=App.storage.get("UserFee").classNumber;
			var userSex=App.storage.get("UserFee").userSex;
			var professionalNo=App.storage.get("UserFee").professionalNo;
			var academy=App.storage.get("UserFee").academy;
			var inFee=App.storage.get("UserFee").inFee;
			var tuitionFee=App.storage.get("UserFee").tuitionFee;
			var accommodationFee=App.storage.get("UserFee").accommodationFee;
			var otherFee=App.storage.get("UserFee").otherFee;
			var materialsFee=App.storage.get("UserFee").materialsFee;
			var careFee=App.storage.get("UserFee").careFee;
			var foodFee=App.storage.get("UserFee").foodFee;
				
			var sessionToken = App.storage.get("UserInfo").appKey;
			var projectCode = App.storage.get("model2").projectCode;
			var feeTypeCode = App.storage.get("model2").feeTypeCode;
			var billkeyName = App.storage.get("UserFee").userName;
			var billkey = App.storage.get("UserFee").billkey;
			var tranAmt = App.storage.get("UserFee").amountTotal;
			var payAccount = "";
			var payAccountName = "";
			var remark = "";
			var dynamicData = "@#"+billkeyName+"@#"+semester+"@#"+"0"+"@#"+tranAmt+"@#"
								+"0"+"@#"+studentId+"@#"+$.trim(studentsGrade)
								+"@#"+classNumber+"@#"+$.trim(userSex)+"@#"+$.trim(professionalNo)
								+"@#"+$.trim(academy)+"@#"+inFee+"@#"+tuitionFee+"@#"+accommodationFee
								+"@#"+otherFee+"@#"+materialsFee+"@#"+careFee+"@#"+foodFee+"@|";
			var notifyFlag = "1";
			var alias = "";
			var pageURI = "";
			var jumpSeconds = "5";
			var param = {
        			"sessionToken":sessionToken,
        			"projectCode":projectCode,
        			"billkeyName":billkeyName,
        			"billkey":billkey,
        			"tranAmt":tranAmt,
        			"payAccount":payAccount,
        			"payAccountName":payAccountName,
        			"remark":remark,
        			"feeTypeCode":feeTypeCode,
        			"dynamicData":dynamicData,
        			"notifyFlag":notifyFlag,
        			"alias":alias,
        			"pageURI":pageURI,
        			"jumpSeconds":jumpSeconds
    		};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/fee/submitStudyPayFee",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				
    				var param = $.extend(data,App.storage.get("UserFee"));
    				param.eleAccount=Utils.getEleCard().cardNo;
    				param.feeTypeCode="08";
    				param.notifyUrl="/fee/studyPayResult";
    				param.confirmUrl="/fee/hzpayxfOrderQuery";
    				App.navigate("fee/feeCtl/tuitionPay",param);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
    		}});
		},
		
		goBack : function(){
			App.back();
		}
	
	});
});

define(function(require, exports, module){
	
	var tuitionTpl = require("text!../template/tuition.html");
	
	var tuitionView = module.exports = ItemView.extend({
		
		events : {
			"click #city":"city",
			"click #school":"school",
			"click #query":"query",
			"click #term":"showDate"
		},
		
		template : tuitionTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			
			this.status = true;
			
			if(location.href.indexOf("cawa")>=0){
				$("#city,#school").hide();
				var param = {
						actionFlag:"2",
						queryType:"1"
				};
				var $this = this;
				Ajax({url:"/fee/queryCityInstitutionList",data:param, success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				var iChannelFeeList = data.iChannelFeeList;
	    				if(iChannelFeeList.length>0){
	    					iChannelFeeList[0].schoolName = iChannelFeeList[0].feeBusinessName;
		    				App.storage.set("model2",iChannelFeeList[0]);
		    				App.storage.set("model1",iChannelFeeList[0]);
		    				$this.status = false;
	    				}
	    				
	    				$this.init();
	    			}else{
	    				Utils.alertinfo(data.errorMessage);
	    			}
	    			Client.hideWaitPanel(1);
	    		}});
			}else{
				this.init();
			}
		},
		
		init : function(){
			var cityName =App.storage.get("model1")?App.storage.get("model1").cityName:"选择城市";
			var schoolName =App.storage.get("model2")?App.storage.get("model2").schoolName:"选择学校";
			var pramm ={
					"cityName":cityName,
				    "schoolName":schoolName
			};
			App.storage.set("pramm",pramm);
			
			$("#cityName").text(cityName);
			$("#schoolName").text(schoolName);
		    
			if(App.storage.get("model2")){
				var semList = [];
				for(var i=0;i<3;i++){
					var year = new Date().getFullYear()-i;
					if(App.storage.get("model2").feeBusinessCode == "110008051001"){
						semList.push(year+"学年|"+year+"09");
						if(i==0){
							$('#terms').find('input').val(year+"学年");
							App.storage.set("pram",{"semester":year+"09"});
						}
					}else{
						semList.push(year+"年第二学期|"+(year+1)+"02");
						semList.push(year+"年第一学期|"+year+"09");
						if(i==0){
							var mon = new Date().getMonth()+1;
							if(mon>2 && mon<=9){
								$('#terms').find('input').val(year+"年第一学期");
								App.storage.set("pram",{"semester":year+"09"});
							}else{
								$('#terms').find('input').val(year+(mon>9?0:-1)+"年第二学期");
								App.storage.set("pram",{"semester":year+(mon>9?0:-1)+1+"02"});
							}
						}
					}
				}
				
				$('#terms').selectDialog({
					list : semList,
					callback : function(value, label) {
						$('#terms').find('input').val(label);
						var semester = value;
						var pram ={
							    "semester":semester
						};
						App.storage.set("pram",pram);
					}
				});
				
			}
			
			$('#terms').on("click",function(){
				if(!App.storage.get("model2")){
					Utils.alertinfo("请选择学校");
				}
			});
			
		    Client.hideWaitPanel(1);
		},
		
		city : function(){
			App.storage.remove("model2");
			if(location.href.indexOf("cawa")<0){
				App.navigate("fee/feeCtl/cityList");
			}
		},
		
		school : function(){

			if(!App.storage.get("model1")){
				Utils.alertinfo("请选择城市!");	
    			return false;
			}
			if(location.href.indexOf("cawa")>=0){
				return false;
			}
			App.navigate("fee/feeCtl/schoolList");

		},
		
		query : function(){
			
			if(location.href.indexOf("cawa") >= 0 && this.status){
				Utils.alertinfo("学校信息未配置");	
    			return false;
			}
			
			if(!App.storage.get("model1")){
				Utils.alertinfo("请选择城市!");	
    			return false;
			}
			if(!App.storage.get("model2")){
				Utils.alertinfo("请选择学校!");	
    			return false;
			}
			var feeTypeCode=App.storage.get("model2").feeTypeCode;
			var projectCode=App.storage.get("model2").projectCode;
			var billkey=$("#billkey").val();
			if(MUI.isEmpty(billkey)){
				Utils.alertinfo("请输入学生学号！");	
    			return false;
			}
			var semester=App.storage.get("pram")?App.storage.get("pram").semester:"";
			if(MUI.isEmpty(semester) ){
				Utils.alertinfo("请选择学期！");	
    			return false;
			}
			
			var param = {
        			"feeTypeCode":feeTypeCode,
        			"projectCode":projectCode,
        			"semester":semester,
        			"billkey":billkey
    		};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/fee/queryTuitionFeeList",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					$.each(data.tuitionFeeLackList,function(i,product){
						var userName=product.userName;
						var studentId=product.studentId;
						var studentsGrade=product.studentsGrade;
						var classNumber=product.classNumber;
						var userSex=product.userSex;
						var professionalNo=product.professionalNo;
						var academy=product.academy;
						var amountTotal=product.amountTotal;
						var inFee=product.inFee;
						var tuitionFee=product.tuitionFee;
						var accommodationFee=product.accommodationFee;
						var otherFee=product.otherFee;
						var materialsFee=product.materialsFee;
						var careFee=product.careFee;
						var foodFee=product.foodFee;
						
						var UserFee={
							"userName":userName,
							"studentsGrade":studentsGrade,
							"userSex":userSex,
							"professionalNo":professionalNo,
							"academy":academy,
							"studentId":studentId,
							"classNumber":classNumber,
							"amountTotal":amountTotal,
							"inFee":inFee,
							"tuitionFee":tuitionFee,
							"accommodationFee":accommodationFee,
							"otherFee":otherFee,
							"materialsFee":materialsFee,
							"careFee":careFee,
							"foodFee":foodFee,
							"billkey":$("#billkey").val()
						};
						App.storage.set("UserFee",UserFee);
						App.navigate("fee/feeCtl/tuitionQuery");
					});
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    			Client.hideWaitPanel(1);
    		}});
		},
		
		goBack : function(){
			$(".selectBox").remove();
			App.back();
		},
		

		order:function(){
			App.navigate("fee/feeCtl/orderList");
		}
	});
});

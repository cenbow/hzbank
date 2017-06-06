define(function(require, exports, module){
	
	var myLoanTpl = require("text!../template/myLoan.html");
	
	var MyLoanView = module.exports = ItemView.extend({
		
		events : {
			
		},
		
		template : myLoanTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    this.init();
		},
		
		init : function(){
			var param = {	
					
				};
			var $this = this;
			var index = 0;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/applicationQuery", data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var html="";
					var flag = data.flag;
					var iPledgeList = data.iPledgeList;
					var iPledgeQueryList = data.iPledgeQueryList;
					for ( var i = 0; i < iPledgeList.length; i++) {
						index++;
						var iPledgeListInfo = iPledgeList[i];
						var applyStatus = iPledgeListInfo.applyStatus;
						var houseAddress = iPledgeListInfo.houseAddress;
						var applyDate = iPledgeListInfo.applyDate;
						var applyStatusName="";
						var noticeClass = "";
						if (applyStatus == "00") {
							noticeClass = "c"; 
							applyStatusName = "已受理";
						} else if (applyStatus == "01" && flag == "0") {
							noticeClass = "d";
							applyStatusName = "审批通过";
							
						} else if (applyStatus == "02") {
							noticeClass = "e";
							applyStatusName = "审批失败";
						} else if ((applyStatus == "11") || (applyStatus == "01" && flag == "1")) {
							noticeClass = "d"; 
							applyStatusName = "受理成功";
						} else if (applyStatus == "03") {
							noticeClass = "g"; 
							applyStatusName = "申请关闭";
						} else if (applyStatus == "04" || applyStatus == "12") {
							noticeClass = "f";
							applyStatusName = "已完成";
						}
						
						var authAmount = iPledgeListInfo.authAmount;//授信金额
						var applyAmount1 = iPledgeListInfo.applyAmount;//申请金额
						var applyDeadline = iPledgeListInfo.applyDeadline;//贷款期限
						var creditRepayType1 = iPledgeListInfo.creditRepayType;//还款方式
						var loanRate = iPledgeListInfo.loanRate;//贷款利率
						var applicationNo = iPledgeListInfo.applicationNo;//申请编号
						
						
						html += '<div class="list-item arr" att1="'+applyDeadline+'" att2="'+loanRate+'" att4="'+authAmount+'" '+
						'att3="'+applicationNo+'"  att5="'+applyAmount1+'"  att6="'+creditRepayType1+'" att7="'+applyStatus+'">'+
					            	'<i class="'+noticeClass+'" >'+applyStatusName+'</i>'+
					            	'<h1>'+houseAddress+'</h1>'+
					                '<p>'+applyDate+'</p>'+
					            '</div>';
					}
					for(var i = 0; i < iPledgeQueryList.length; i++){
						
						var iPledgeQueryListInfo = iPledgeQueryList[i];
						var preStt = iPledgeQueryListInfo.preStt;
						var houseAddress = iPledgeQueryListInfo.houseAddress;
						var applyDate = iPledgeQueryListInfo.applyTime;
						applyDate = applyDate.substring(0,4)+"-"+applyDate.substring(4,6)+"-"+applyDate.substring(6,8);
						var applyStatusName="";
						var noticeClass = "";
						if(preStt=="0"){
							applyStatusName = "未提交";
							noticeClass = "a";
						}
						
						var orderFlowNo = iPledgeQueryListInfo.orderFlowNo;
						var certNo = iPledgeQueryListInfo.certNo;
						var housePropertyNo = iPledgeQueryListInfo.housePropertyNo;
						var domicilePlace = iPledgeQueryListInfo.domicilePlace;
						var houseOwner = iPledgeQueryListInfo.houseOwner;
						var marriage = iPledgeQueryListInfo.marriage;
						var houseQuality = iPledgeQueryListInfo.houseQuality;
						var houseArea = iPledgeQueryListInfo.houseArea;
						var houseTotalPrice = iPledgeQueryListInfo.houseTotalPrice;
						var storey = iPledgeQueryListInfo.storey;
						var landStatus = iPledgeQueryListInfo.landStatus;
						var buildYear = iPledgeQueryListInfo.buildYear;
						var contractTime = iPledgeQueryListInfo.contractTime;
						if(contractTime == "--"){
							contractTime = "";
						}
						contractTime = contractTime.substring(0,4)+""+contractTime.substring(5,7);
						var applyAmount = iPledgeQueryListInfo.applyAmount;
						var applyUse = iPledgeQueryListInfo.applyUse;
						var creditDeadline = iPledgeQueryListInfo.creditDeadline;
						var creditRepayType = iPledgeQueryListInfo.creditRepayType;
						var workAddr = iPledgeQueryListInfo.workAddr;
						var customerDuty = iPledgeQueryListInfo.customerDuty;
						var homeIncome = iPledgeQueryListInfo.homeIncome;
						var yearPay = iPledgeQueryListInfo.yearPay;
						var mgrStt = iPledgeQueryListInfo.mgrStt;
						var mgrNo = iPledgeQueryListInfo.mgrNo;
						var chanFlag = iPledgeQueryListInfo.chanFlag;
						var totalFloor = iPledgeQueryListInfo.totalFloor;
						var houseUnitPrice = iPledgeQueryListInfo.houseUnitPrice;
						var estimable = iPledgeQueryListInfo.estimable;
						var projectId = iPledgeQueryListInfo.projectId;//楼盘ID
						
						if(preStt=="0"){
							index++;
							applyStatusName = "未提交";
							noticeClass = "a";
							html += '<div class="list-item arr" cur1="'+certNo+'" cur2="'+housePropertyNo+'"  cur3="'+domicilePlace+'" '+
										'cur4="'+houseOwner+'" cur5="'+marriage+'" cur6="'+houseQuality+'" '+
										'cur7="'+houseArea+'" cur8="'+houseTotalPrice+'" cur9="'+storey+'" '+
										'cur10="'+landStatus+'" cur11="'+buildYear+'" cur12="'+contractTime+'" '+
										'cur13="'+applyAmount+'" cur14="'+applyUse+'" cur15="'+creditDeadline+'" '+
										'cur16="'+creditRepayType+'" cur17="'+workAddr+'" cur18="'+customerDuty+'" '+
										'cur19="'+homeIncome+'" cur20="'+yearPay+'" cur21="'+mgrStt+'" '+
										'cur22="'+mgrNo+'" cur23="'+totalFloor+'" cur24="'+houseUnitPrice+'" cur25="'+chanFlag+'" '+
										'cur26="'+orderFlowNo+'" cur27="'+estimable+'" '+
										'cur28="'+projectId+'">'+
						            	'<i class="'+noticeClass+'">'+applyStatusName+'</i>'+
						            	'<h1>'+houseAddress+'</h1>'+
						                '<p>'+applyDate+'</p>'+
						            '</div>';
						}
						
						
					}
					if(index=="1"){
						$("#myLoan").html(html);
						$("#noResult").hide();
						$("#queryLoan").show();
						
					}
					else if(index>="2"){
						$("#myLoan").append(html);
						$("#noResult").hide();
						$("#queryLoan").show();
						
					}else{
						$("#noResult").show();
						$("#queryLoan").hide();
					}
					$(".list-item").off().on("click",function(){
						var applyStatusName = $(this).find("i").text();
						var houseAddress = $(this).find("h1").text();
						var applyDate = $(this).find("p").text();
						
						var applyDeadline = $(this).attr("att1");
						var loanRate = $(this).attr("att2");
						var applicationNo = $(this).attr("att3");
						var authAmount = $(this).attr("att4");
						var applyAmount1 = $(this).attr("att5");
						var creditRepayType1 = $(this).attr("att6");
						var applyStatus = $(this).attr("att7");
						
						var certNo = $(this).attr("cur1");
						var housePropertyNo = $(this).attr("cur2");
						var domicilePlace = $(this).attr("cur3");
						var houseOwner = $(this).attr("cur4");
						var marriage = $(this).attr("cur5");
						var houseQuality = $(this).attr("cur6");
						var houseArea = $(this).attr("cur7");
						var houseTotalPrice = $(this).attr("cur8");
						var storey = $(this).attr("cur9");
						var landStatus = $(this).attr("cur10");
						var buildYear = $(this).attr("cur11");
						var contractTime = $(this).attr("cur12");
						var applyAmount =$(this).attr("cur13");
						var applyUse = $(this).attr("cur14");
						var creditDeadline = $(this).attr("cur15");
						var creditRepayType = $(this).attr("cur16");
						var workAddr = $(this).attr("cur17");
						var customerDuty = $(this).attr("cur18");
						var homeIncome = $(this).attr("cur19");
						var yearPay = $(this).attr("cur20");
						var mgrStt = $(this).attr("cur21");
						var mgrNo = $(this).attr("cur22");
						var totalFloor = $(this).attr("cur23");
						var houseUnitPrice = $(this).attr("cur24");
						var chanFlag = $(this).attr("cur25");
						var orderFlowNo = $(this).attr("cur26");
						var estimable = $(this).attr("cur27");
						var projectId = $(this).attr("cur28");
						var applyDataInfo = {
								applyStatusName:applyStatusName,
								houseAddress:houseAddress,
								applyDate:applyDate,
								applyDeadline:applyDeadline,
								loanRate:loanRate,
								applicationNo:applicationNo,
								authAmount:authAmount,
								applyAmount1:applyAmount1,
								creditRepayType1:creditRepayType1,
								applyStatus:applyStatus,
								orderFlowNo:orderFlowNo,
								certNo:certNo,
								housePropertyNo:housePropertyNo,
								domicilePlace:domicilePlace,
								houseOwner:houseOwner,
								marriage:marriage,
								houseQuality:houseQuality,
								houseArea:houseArea,
								houseTotalPrice:houseTotalPrice,
								storey:storey,
								landStatus:landStatus,
								buildYear:buildYear,
								contractTime:contractTime,
								applyAmount:applyAmount,
								applyUse:applyUse,
								creditDeadline:creditDeadline,
								creditRepayType:creditRepayType,
								workAddr:workAddr,
								customerDuty:customerDuty,
								homeIncome:homeIncome,
								mgrStt:mgrStt,
								yearPay:yearPay,
								mgrNo:mgrNo,
								totalFloor:totalFloor,
								houseUnitPrice:houseUnitPrice,
								chanFlag:chanFlag,
								projectId:projectId,
								estimable:estimable
						};
						App.storage.set("applyDataInfo",applyDataInfo);
						App.navigate("mortgage/mortgageCtl/mortResult");
					});
					}else{
						Utils.alertinfo(data.errorMessage);
					}Client.hideWaitPanel(100);
					}
				});
		},
		
		
		goBack : function(){
			App.back();
		}
	
	});
});

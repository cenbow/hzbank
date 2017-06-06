define(function(require, exports, module){
	
	var orderDetailTpl = require("text!../template/orderDetail.html");
	
	var orderDetailView = module.exports = ItemView.extend({
		
		events : {
			"click #submit":"submit"
		},
		
		template : orderDetailTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
			var orderNum = Utils.search().orderNum;
			var param = {
					orderNum : orderNum,
					actionFlag : "2"
			};
			var $this = this;
			Ajax({url:"/fee/queryFeeShow", data:param, success:function(data){
				if(data.errorCode){
    				Utils.alertinfo(data.errorMessage);
    			}else{
    				$this.data = data;
    				var term = "空";
    				if(data.semester){
    					if(data.feeBusinessName.indexOf("嘉华")>=0){
        					term = data.semester.substring(4,6)>"06"?(data.semester.substring(0,4)+'学年')
        							:(parseInt(data.semester.substring(0,4))-1+'学年');
        				}else{
        					term = data.semester.substring(4,6)>"06"?(data.semester.substring(0,4)+'年第一学期')
        							:(parseInt(data.semester.substring(0,4))-1+'年第二学期');
        				}
    				}
    				
    				$("#tranAmt").text("￥"+Utils.formatCurrency(data.tranAmt||0,2));
    				$("#tranState").text(Utils.tranState(data.hostState,data.tranState));
    				$("#flowNo").text(data.flowNo||"空");
    				$("#subTime").text(Utils.formatDate(data.subTime.substring(0,8),'yyyyMMdd','yyyy-MM-dd'));
    				$("#schoolName").text(data.schoolName||"空");
    				$("#semester").text(term||"空");
    				$("#classNumber").text(data.classNumber||"空");
    				$("#studentId").text(data.studentId||"空");
    				$("#userName").text(data.userName||"空");
    				$("#inFee").text("￥"+Utils.formatCurrency(data.inFee||0,2));
    				$("#tuitionFee").text("￥"+Utils.formatCurrency(data.tuitionFee||0,2));
    				$("#accommodationFee").text("￥"+Utils.formatCurrency(data.accommodationFee||0,2));
    				$("#foodFee").text("￥"+Utils.formatCurrency(data.foodFee||0,2));
    				$("#materialsFee").text("￥"+Utils.formatCurrency(data.materialsFee||0,2));
    				$("#careFee").text("￥"+Utils.formatCurrency(data.careFee||0,2));
    				$("#otherFee").text("￥"+Utils.formatCurrency(data.otherFee||0,2));
    			}
				Client.hideWaitPanel(1);
			}});
			
		},
		
		submit : function(){
			var term = "空";
			if(this.data.semester){
				if(this.data.feeBusinessName.indexOf("嘉华")>=0){
					term = this.data.semester.substring(4,6)>"06"?(this.data.semester.substring(0,4)+'学年')
							:(parseInt(this.data.semester.substring(0,4))-1+'学年');
				}else{
					term = this.data.semester.substring(4,6)>"06"?(this.data.semester.substring(0,4)+'年第一学期')
							:(parseInt(this.data.semester.substring(0,4))-1+'年第二学期');
				}
			}
			var data = {
					tranAmt:"￥"+Utils.formatCurrency(this.data.tranAmt||0,2),
					tranState:Utils.tranState(this.data.hostState,this.data.tranState),
					flowNo:this.data.flowNo||"空",
					subTime:Utils.formatDate(this.data.subTime.substring(0,8),'yyyyMMdd','yyyy-MM-dd'),
					schoolName:this.data.schoolName||"空",
					semester:term,
					classNumber:this.data.classNumber||"空",
					studentId:this.data.studentId||"空",
					userName:this.data.userName||"空",
					inFee:"￥"+Utils.formatCurrency(this.data.inFee||0,2),
					tuitionFee:"￥"+Utils.formatCurrency(this.data.tuitionFee||0,2),
					accommodationFee:"￥"+Utils.formatCurrency(this.data.accommodationFee||0,2),
					foodFee:"￥"+Utils.formatCurrency(this.data.foodFee||0,2),
					materialsFee:"￥"+Utils.formatCurrency(this.data.materialsFee||0,2),
					careFee:"￥"+Utils.formatCurrency(this.data.careFee||0,2),
					otherFee:"￥"+Utils.formatCurrency(this.data.otherFee||0,2)
			};
			var opt={
					url: location.href.split("ZxMobileServer")[0]+"ZxMobileServer/shares/feeDetail.html?feeDetail="+encodeURI(JSON.stringify(data)),
					content:"快来看看我在“杭银直销APP”缴的学费账单吧~",
					type:"1"
				};
			Client.share(opt);
		},
		
		goBack : function(){
			App.back();
		}
	
	});
});

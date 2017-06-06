define(function(require, exports, module){
	
	var carOrderDetailTpl = require("text!../template/carOrderDetail.html");
	
	var carOrderDetailView = module.exports = ItemView.extend({
		
		events : {
			"click #submit":"submit"
		},
		
		template : carOrderDetailTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
			var orderNum = App.storage.get("_parameters").orderNum;
			var payacCount = App.storage.get("_parameters").payacCount;
			var payacCountName = App.storage.get("_parameters").payacCountName;
			var billkeyName = App.storage.get("_parameters").billkeyName;
			var param = {
					orderNum : orderNum,
					actionFlag : "4"
			};
			var $this = this;
			Ajax({url:"/fee/queryFeeShow", data:param, success:function(data){
				if(data.errorCode){
    				Utils.alertinfo(data.errorMessage);
    			}else{
    				
    				if(data.feeTypeName =="小客车竞价成交款"){
    					$("#name").text('付款人全称');
    					$("#billName").text('缴费书编号');
    				}else{
    					$("#name").text('付款户名');
    					$("#billName").text('缴费编号');
    				}
    				$this.data = data;
    				
    				$("#tranAmt").text("￥"+Utils.formatCurrency(data.tranAmt||0,2));
    				$("#tranState").text(Utils.tranState(data.hostState,data.tranState));
    				$("#flowNo").text(data.flowNo||"空");
    				$("#subTime").text(Utils.formatDate(data.subTime.substring(0,8),'yyyyMMdd','yyyy-MM-dd'));
    				$("#payName").text(billkeyName||"空");
//    				$("#payAccount").text(payacCount||"空");
    				$("#billKey").text(data.billKey||"空");
    				$("#orderAmt").text("￥"+Utils.formatCurrency(data.tranAmt||0,2));
    			}
				Client.hideWaitPanel(1);
			}});
			
		},
		
		submit : function(){
			var term = "空";
			var data = {
					feeTypeName:this.data.feeTypeName||"空",
					tranAmt:"￥"+Utils.formatCurrency(this.data.tranAmt||0,2),
					tranState:Utils.tranState(this.data.hostState,this.data.tranState),
					flowNo:this.data.flowNo||"空",
					subTime:Utils.formatDate(this.data.subTime.substring(0,8),'yyyyMMdd','yyyy-MM-dd'),
					billKey:this.data.billKey||"空",
					billKeyName:this.data.billKeyName||"空",
			};
			var opt={
					url: location.href.split("ZxMobileServer")[0]+"ZxMobileServer/shares/carDetail.html?carDetail="+encodeURI(JSON.stringify(data)),
					content:"快来看看我在“杭银直销APP”缴的小客车账单吧~",
					type:"2"
				};
			Client.share(opt);
		},
		
		goBack : function(){
			App.back();
		}
	
	});
});

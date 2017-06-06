define(function(require, exports, module){
	
	var financeRiskReqTpl = require("text!../template/financeRiskReq.html");
	
	var financeRiskReqView = module.exports = ItemView.extend({
		
		events : {
			"click #submit":"submit",
			"click #back" : "back",
			"click #next" : "next"
		},
		
		template : financeRiskReqTpl,
		
		initialize : function(){
		    
		    Client.hideWaitPanel(1);
		    
		    $(".userTest label").on("click",function(){
		    	$(this).siblings("label").removeClass("chosen");
		    	$(this).addClass("chosen");
		    });
		},
		
		submit : function(){
			
			var answer="10|#";
			var res = $(".chosen");
			if(res.length<10){
				Utils.alertinfo("您还有题目未完成，请确认完成后提交");
				return;
			}
			for(var i=1;i<=res.length;i++){
				answer+=i+"|"+res.eq(i-1).attr("data-value")+'#';
			}
			
			var sendStr = {
					"strs": answer  //答案格式   "10|\\n#"+"1|C#2|C#3|C#4|C#5|C#6|C#7|C#8|C#9|C#10|C#"
				};
			var $this = this;
			Client.openWaitPanel("请稍候");
			Ajax({url:"/specialFinance/financeRiskReq",data:sendStr,
				success:function(data){
					if(data.errorCode){
						Utils.alertinfo(data.errorMessage);
					}else{
						$this.param = {
							riskLevel:data.riskLevel,
							queryNumber:data.queryNumber,
							deadline:data.deadline
						};
						$(".type").text(Utils.getParamDisplay("PB_FUND_CUST_RISK",data.riskLevel));
						$(".testResult").show().siblings("div").hide();
					}
					Client.hideWaitPanel(1);
				}
			});
		},
		
		next : function(){
			var param = App.storage.get("_parameters");
			_.extend(param,this.param);
			App.navigate("special/specialCtl/financeSign",param);
		},
		
		back : function(){
			App.container.show(this);
			this.initialize();
		},

		cancel : function(){
			Client.menuOpt("5");
			var index = App.browseList.indexOf("special/specialCtl/special");
    	  	App.browseList.splice(1,index-1);
			App.back();
		},
		
		goBack : function(){
			App.back();
		}
	
	});
});

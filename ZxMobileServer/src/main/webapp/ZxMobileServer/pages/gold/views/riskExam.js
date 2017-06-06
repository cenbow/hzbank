define(function(require, exports, module){
	
	var riskExamTpl = require("text!../template/riskExam.html");
	
	var riskExamView = module.exports = ItemView.extend({
		
		events : {
			"click #back" : "goBack"
		},
		
		template : riskExamTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			
			this.questions = [
			     {
			    	 title:"1.您的年龄是：",
			    	 A:"A: 18岁-30 岁",
			    	 B:"B: 31岁-50 岁",
			    	 C:"C:  51岁-60岁",
			    	 D:"D: 高于60岁",
			    	 answer:""
			     },{
			    	 title:"2.您的家庭年收入为（折合人民币）:",
			    	 A:"A:  5万元以下",
			    	 B:"B:  5-20万元",
			    	 C:"C: 20-50万元",
			    	 D:"D: 50-100万元",
			    	 E:"E: 100万元以上",
			    	 answer:""
			     },{
			    	 title:"3.在您每年的家庭收入中，可用于金融投资（储蓄存款除外）的比例为:",
			    	 A:"A: 小于10%",
			    	 B:"B: 10%—25%",
			    	 C:"C: 25%—50%",
			    	 D:"D: 大于50%",
			    	 answer:""
			     },{
			    	 title:"4.以下哪项最能说明您的投资经验:",
			    	 A:"A: 除存款、国债外，我几乎不投资其他金融产品",
			    	 B:"B: 大部分投资与存款、国债等，较少投资于股票、基金等风险产品产品",
			    	 C:"C: 资产均衡地分布于存款、国债、银行理财产品、信托产品、 股票、基金等",
			    	 D:"D: 大部分投资于股票、基金、外汇等高风险产品，较少投资于存款、国债",
			    	 answer:""
			     },{
			    	 title:"5.您有多少年投资股票、基金、外汇、金融衍生产品等风险投资品经验:",
			    	 A:"A: 无经验",
			    	 B:"B: 少于两年",
			    	 C:"C: 2年-5年",
			    	 D:"D: 5年-8年",
			    	 E:"E: 8年以上",
			    	 answer:""
			     },{
			    	 title:"6.以下哪种描述最符合您的投资态度:",
			    	 A:"A: 风险厌恶，不希望本金损失，希望获得稳定回报",
			    	 B:"B: 保守投资，不希望本金损失，愿意承担一定幅度的收益波动",
			    	 C:"C: 寻求资金的较高收益和成长性，愿意为此承担有限本金损失",
			    	 D:"D: 希望赚取高回报，愿意为此承担较大本金损失",
			    	 answer:""
			     },{
			    	 title:"7.以下情况，您会选择哪一种:",
			    	 A:"A: 有100％的机会赢取1000元现金",
			    	 B:"B: 有50％的机会赢取5万元现金",
			    	 C:"C: 有25％的机会赢取50万元现金",
			    	 D:"D: 有10％的机会赢取100万元现金",
			    	 answer:""
			     },{
			    	 title:"8.您计划投资期限是多久:",
			    	 A:"A: 1年以下",
			    	 B:"B: 1-3年",
			    	 C:"C: 3-5年",
			    	 D:"D: 5年以上",
			    	 answer:""
			     },{
			    	 title:"9.您投资目的是:",
			    	 A:"A: 资产保值",
			    	 B:"B: 资产稳健增长",
			    	 C:"C: 资产迅速增长",
			    	 answer:""
			     },{
			    	 title:"10.您的投资出现何种程度的波动时，您会呈现明显的焦虑:",
			    	 A:"A: 本金无损失，但收益未达预期",
			    	 B:"B: 出现轻微本金损失",
			    	 C:"C: 本金10％以内的损失",
			    	 D:"D: 本金20％-50％以内的损失",
			    	 E:"E: 本金50％以上的损失",
			    	 answer:""
			     }
			];
			var $this = this;
			$(".prev").on("click",function(){
				var index = - 1 +parseInt($(".list").attr("data-value"));
				if(index<0) return;
				$this.showQue($this.questions[index]);
				$(".list").attr("data-value",index);
				if(index <0){
					$(".prev").addClass("hidden");
				}
			});
			
			this.showQue(this.questions[0]);
			Client.hideWaitPanel(1);
		},
		
		showQue : function(question){
			var html = "",style="";
			$.each(question,function(key,value){
				if(key != "title" && key != "answer"){
					if(question.answer == key) {
						style = "active";
					}else{
						style = "";
					}
					html += '<div class="list-item '+style+'" data-value="'+key+'">'+value+'</div>';
				}else if(key == "title"){
					$("#title").text(value);
				}
			});
			$(".list").html(html);
			var $this = this;
			$(".list-item").on("click",function(){
				$(this).addClass("active").siblings().removeClass("active");
				var list = $(".list");
				var index = 1+parseInt(list.attr("data-value"));
				$this.questions[index-1].answer = $(this).attr("data-value");
				if(index>9) {
					$this.submit();
					return;
				}
				$this.showQue($this.questions[index]);
				list.attr("data-value",index);
				if(index > 0){
					$(".prev").removeClass("hidden");
				}
			});
		},
		
		submit : function(){
			var answer = "";
			$.each(this.questions,function(index,question){
				answer += (index+1) + "|" +question.answer + "#";
			});
			var param = {
					productId:Utils.getParamDisplay("PB_BOSERA",'3'),
					cardNo:Utils.getEleCard().cardNo,
					answer:answer
			};
			Client.openWaitPanel();
			Ajax({url:"/bosera/riskRankMete", data:param, 
				success:function(data){
					if(Utils.isEmpty(data.errorCode)){
						App.storage.remove("goldState");
						var goldSign = App.storage.get("goldSign");
						goldSign.riskLevel = data.riskLevel;
						App.storage.set("goldSign",goldSign);
						App.navigate("gold/goldCtl/riskRes",data);
					}else{
						Client.hideWaitPanel(1);
						Utils.alertinfo(data.errorMessage);
					}
				}
			});
		},
		
		goBack : function(){
    		App.back();
		}
	});
});

define(function (require, exports, module) {
	
	var schoolListTemplate = require("text!../template/schoolList.html");
	
	var SchoolListView = module.exports = ItemView.extend({
		
        template : schoolListTemplate,
        
        events:{
        	"click #submit" : "submit"
        },
        
        initialize : function(){
        	var date = "";
        	var $this=this;
        	
        	$('.zen-tab li').on('click', function(){
				var cur = $(this);
				if(cur.hasClass('active')){
					$this.submit();
				}else{
					cur.addClass('active').siblings().removeClass('active');
					$this.submit();
				}
			});
        	
        	$("#textName").off().on("keyup",function(){
        		var schoolName = $(this).val();
        		if(!schoolName){
        			return;
        		}
        		date = new Date();
        		setTimeout(function(){
        			if(new Date()-date <2000) return;
        			$this.submit();
        		},2000);
        	});
        	
        	this.init();
        	this.submit();
        },
        
        
        init : function(){
        	$('.searchBar .trigger').on('click', function(){
    			var ico = $(this);
    			var ipt = ico.prev();	
    			var sub = ico.next();
    			ico.hide();
    			sub.show();
    			ipt.blur(function(){
    				ipt.val() == "" ? ico.show() && sub.hide() : ico.hide() && sub.show();
    			});
    		});
        },
        
        submit : function(){
        	$("#SchoolList .list-item").remove();
        	var actionFlag="2";
        	var cityCode=App.storage.get("model1").cityCode;
        	var feeTypeName=$('.active').text();
        	var textName = $('#textName').val();
        	var feeTyp="";
        	if(feeTypeName=="幼儿园"){
        		feeTyp="0801";
        	}if(feeTypeName=="小学"){
        		feeTyp="0802";
        	}if(feeTypeName=="中学"){
        		feeTyp="0803";
        	}if(feeTypeName=="职业学校"){
        		feeTyp="0804";
        	}if(feeTypeName=="大学"){
        		feeTyp="0805";
        	}
        	
        	var param = {
        			"actionFlag":actionFlag,
        			"feeType":feeTyp,
        			"cityCode":cityCode,
        			"feeBusinessName":textName
    		};
    		var $this = this;
    		Client.openWaitPanel("拼命加载中，请稍候");
    		Ajax({url:"/fee/queryCityInstitutionList",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var html = "";
    				var pos = "0";
					$.each(data.iChannelFeeList,function(i,product){
						var feeBusinessName=product.feeBusinessName;
						var projectCode=product.projectCode;
						var feeTypeCode=product.feeTypeCode;
						html += '<div class="list-item" code="'+product.feeBusinessCode+'" value="'+projectCode+'" index="'+feeTypeCode+'"><i class="holder"></i><span>'+feeBusinessName+'</span></div>';
						pos++;
					});
					
					
					if(pos=="1"){
						$("#SchoolList").html(html);
						$("#noData").hide();
						$("#SchoolList").show();
					}else if(pos=="0"){
						$("#noData").show();
						$("#SchoolList").hide();
					}else{
						$("#SchoolList").append(html);
						$("#noData").hide();
						$("#SchoolList").show();
					}
					
					$(".list-item").off().on("click",function(){
						var model2={
								"feeTypeCode":$(this).attr("index"),
								"schoolName":$(this).find("span").text(),
								"projectCode":$(this).attr("value"),
								"feeBusinessCode":$(this).attr("code"),
						};
						App.storage.set("model2",model2);
						App.back();
					});
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    			Client.hideWaitPanel(1);
    		}});
    	},
    	
    	
        goBack : function(){
        	App.back();
    	},

	});
	
});
define(function (require, exports, module) {
	
	var fundNewsDetailTemplate = require("text!../template/fundNewsDetail.html");
	var FundNewsDetailView = module.exports = ItemView.extend({
		 
		template : fundNewsDetailTemplate,
	        
        events:{
//        	"click #thumbUpCount" : "thumbUpCount",
        },
        initialize : function(){
        	this.count=0;
        	this.thumbUp=0;
        	var pageStep1 = {
        		title:'相关资讯',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        
        	};
        	Client.initPageTitle(pageStep1);
        	Client.hideWaitPanel(1);
        	var param=App.storage.get("fundNews");
        	this.init(param);
        	this.fundNewsCount();
        	
        },
        
        init:function(param){
        	$("#mainHead").html(param.mainHead);
        	$("#content").html(param.content);
        	var date=Utils.formatDate(param.createTime.substring(0,8),'yyyyMMdd','yyyy-MM-dd');
        	var time=param.createTime.substring(8,10)+":"+param.createTime.substring(10,12);
        	$("#times").text(date+" "+time);
        	this.count=parseInt(param.count==""?0:param.count)+1;
//        	this.thumbUp=parseInt(param.thumbUp==""?0:param.thumbUp)+1;
        	$("#count").html('<i class="view"></i>'+this.count);
//        	$("#thumbUp").html('<i class="like"></i>'+param.thumbUp);
        },
        
//        thumbUpCount :function(){//点赞数
//        	if($(".dolikeIcon").hasClass('active')){
//        		$(".dolikeIcon").removeClass('active');
//        		this.thumbUp=parseInt(param.thumbUp==""?0:param.thumbUp)-1;
//        		$("#thumbUp").html('<i class="like"></i>'+this.thumbUp);
//        		this.fundNewsCount();
//        	}else{
//        		$(".dolikeIcon").addClass('active');
//        		this.thumbUp=parseInt(param.thumbUp==""?0:param.thumbUp)+1;
//        		$("#thumbUp").html('<i class="like"></i>'+this.thumbUp);
//        		this.fundNewsCount();
//        	}
//        },
        
        fundNewsCount :function(){
        	var order=App.storage.get("fundNews").order;
        	var param = {
        			order:order,
        			count:this.count,
        			thumbUp:this.thumbUp
    		};
			
    		Ajax({url:"/fund/fundNewsCount",data:param,success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				
	    			}else{
	    				Client.alertinfo(data.errorMessage,"提醒");
	    				Client.hideWaitPanel(1);
	    			}
    		},error:function(){
    			Client.hideWaitPanel(1);
    		}});
        },
        
        goBack : function(){
        	App.back();
    	}
	});
});
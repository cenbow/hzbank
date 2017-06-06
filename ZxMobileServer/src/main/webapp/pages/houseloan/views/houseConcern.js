define(function (require, exports, module) {
	
	var HouseConcernTemplate = require("text!../template/houseConcern.html");
	
	var HouseConcernView = module.exports = ItemView.extend({
		
        template : HouseConcernTemplate,
        
        events : {
        	"click #houseAddress li" : "tohouseAddress"
		},

        
        initialize : function(){
         var flag = Utils.search().flag;
      	    
      	    if(flag=="query"){
      	    	
      	    	var pageTest = {
          			  	title:'贷款进度查询',
          				leftButton:{
          					name : '返回',
          					func :'curView.goToBack()'
          				},
          				rightButton : {
          					name : '取消',
          					func : 'curView.cancel()'
          				}
          		  }
          		Client.initPageTitle(pageTest);
          	    Client.hideWaitPanel(10);
          	    $("#query").show();
      	    	
      	    }else{
      	      var pageTest = {
      			  	title:'贷款申请',
      				leftButton:{
      					name : '返回',
      					func :'curView.goToBack()'
      				},
      				rightButton : {
      					name : '取消',
      					func : 'curView.cancel()'
      				}
      		  }
      		Client.initPageTitle(pageTest);
      	    Client.hideWaitPanel(10);
      	    	$("#apply").show();
      	    	
      	    }
    	 
    	    
    	  
    	    
    	   //合同信息，从loanCenter存 
    	  var housecontract =  App.storage.get("housecontract");
    	    
    	    for(var i = 0;i<housecontract.length;i++){
	    	    $("#houseappend").append(
	    	    "<ul id='houseAddress'>"+
	    	        	'<li class="row arr housecontract"  data-value="'+ housecontract[i].contractnum +'">'+
	    	            	'<span class="pr10">房屋地址</span>'+
	    	                '<div class="cell">'+housecontract[i].houseAddr+'</div>'+
	    	            '</li>'+
	    	            '<li class="row">'+
	    	            	'<div class="cell">购房合同号</div>'                         
	    	                +'<div>'+housecontract[i].contractnum+'</div>'+
	    	            '</li>'+
	    	      ' </ul>'
	    	    );
    	    };
    
    	    $("#houseappend ul").on('click', function() {
        		var CetrNo = App.storage.get("CetrNo");
        		var contractnum = $(this).find(".housecontract").attr("data-value");
        		var param2 = {
        				certNo:	CetrNo,
        				contractnum:contractnum
        				
        				
        		};
        	
    			Client.openWaitPanel("拼命加载中，请稍候");
    			Ajax({
    				url : "/houseloan/housestatusAjax",
    				data : param2,
    				success : function(data) {
    					if (MUI.isEmpty(data.errorCode)) {
    						
    						App.storage.set("firstinfo", data);
    						
    						 if(flag=="query"){
    				    	    	
    							 App.navigate("houseloan/houseloanCtl/loanqueryresult");
    				    	    
    				    	    	
    				    	    }else{
    				    	    	
    				    	    	App.navigate("houseloan/houseloanCtl/houseinfo");
    				    	    }
    						
    						
    					} else {
    						Client.alertinfo(data.errorMessage, "提醒");
    					}
    					Client.hideWaitPanel(1);

    				}
    			});
        		
        	
    		}); 
    	    
    	},

    	    
    	    
    	    
    	
    	cancel : function(){
			
    		var index = App.browseList.indexOf("houseloan/houseloanCtl/loanCenter");
    	  	App.browseList.splice(1,index-1);
			App.back();
			
		},
      
	
	    
    	goToBack : function(){
    		App.back();
    	},
    	
    
    	
	});
	  
});
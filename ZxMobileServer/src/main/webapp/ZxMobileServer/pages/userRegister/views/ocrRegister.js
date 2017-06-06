define(function (require, exports, module) {

	var ocrRegisterTemplate = require("text!../template/ocrRegister.html");
	 
	var ocrRegisterView = module.exports = ItemView.extend({
		
        template : ocrRegisterTemplate,
        
        events:{
        	"click #a" : "ocrFront",
			"click #b" : "ocrBack",
        	"click #img_a" : "ocrFront",
			"click #img_b" : "ocrBack",
			"click #next" : "next",
        	"click #a_del" : "a_del_tips",
			"click #a_zoom" : "a_zoom",
        	"click #b_del" : "b_del_tips",
			"click #b_zoom" : "b_zoom"
        },
        
        initialize : function(params){
        	var param = App.storage.get("_parameters");
			this.param = $.extend({},param);
			this.initView();
        	Client.hideWaitPanel(1);
        },
        
        initView : function(){
            var fullView = $('.fullView');
            var viewMask = fullView.find('.mask');
            var viewImgr = fullView.find('.imgr');
            viewImgr.html("");
            viewMask.on('click', function(){
            	Client.hideClientPanel();
            	fullView.removeClass('show');
            });
        },
        
        ocrFront : function(){
        	Client.openWaitPanel("ocr启动中，请稍候");
        	Client.ocrCheck("curView.getPhotoResFront");
        	Client.hideWaitPanel(1);
		},
		
		getPhotoResFront : function(obj) {
			if(obj.certNo == null || obj.certNo.length == 0){
				Utils.alertinfo("请扫描身份证正面");
				return;
			}
			var html = '<img src="data:image/png;base64,'+obj.photoBase64+'" width="550" height="173">';
			$("#img_a").html(html);
			$("#a_controller").show();
			$("#a").hide();
			Client.hideWaitPanel(1);
			obj.birth = '' + obj.year + obj.month + obj.day;
			_.extend(this.param, obj);
		},
		
		ocrBack:function(){
			Client.openWaitPanel("ocr启动中，请稍候");
			Client.ocrCheck("curView.getPhotoResBehind");
			Client.hideWaitPanel(1);
		},
		
		getPhotoResBehind : function(obj) {
			if(obj.validDate == null || obj.validDate.length == 0){
				Utils.alertinfo("请扫描身份证反面");
				return;
			}
			var date = obj.validDate.split("-")[1];
			if(!Utils.isDate(date) && date !="长期"){
				Utils.alertinfo("身份证反面扫描信息有误，请重新扫描");
				return;
			}
			var html = '<img src="data:image/png;base64,'+obj.photoBase64+'" width="550" height="173">';
			$("#img_b").html(html);
			$("#b_controller").show();
			$("#b").hide();
			Client.hideWaitPanel(1);
			this.param.photoBackBase64 = obj.photoBase64;
			this.param.authority = obj.authority;
			this.param.validDate = obj.validDate;
		},
		
		next : function(){
			if(!this.param.photoBase64){
				Utils.alertinfo("请扫描身份证正面");
				return;
			}
			if(!this.param.photoBackBase64){
				Utils.alertinfo("请扫描身份证反面");
				return;
			}
			App.navigate("userRegister/userRegisterCtl/userRegisterStep2_1",this.param);
  	    },
		
  	    goBack : function(){
			App.back();
  	    },
  	    
  	    a_del_tips : function(){
  	    	Client.alertinfo("确认删除图片?","提示","curView.a_del()",true,"curView.Cancel()");
  	    },
  	    
  	    a_del : function(){
  	    	this.param.photoBase64 = "";
  	    	$("#img_a").html("");
			$("#a_controller").hide();
			$("#a").show();
  	    },
  	    
  	    a_zoom : function(){
  	      var fullView = $('.fullView');	
  	      var viewImgr = fullView.find('.imgr');
  	      var html = '<img src="data:image/png;base64,'+this.param.photoBase64+'" >';
  	      viewImgr.html(html);
  	      var CW = document.documentElement.clientHeight;
  	      var CH = document.documentElement.clientWidth;
  	      viewImgr.css({
  	    	  top: (CH - ((CW - 20)/3.18)) / 2 + 'px' ,
  	    	  zIndex: 999999999999
  	      });
  	      fullView.addClass('show');
  	      Client.openClientPanel();
  	    },
  	    
  	    b_del_tips : function(){
  	    	Client.alertinfo("确认删除图片?","提示","curView.b_del()",true,"curView.Cancel()");
  	    },
  	    
  	    b_del : function(){
  	    	this.param.photoBackBase64 = "";
  	    	$("#img_b").html("");
			$("#b_controller").hide();
			$("#b").show();
  	    },
  	    
  	    b_zoom : function(){
  	      var fullView = $('.fullView');	
  	      var viewImgr = fullView.find('.imgr');
  	      var html = '<img src="data:image/png;base64,'+this.param.photoBackBase64+'" >';
  	      viewImgr.html(html);
  	      var CW = document.documentElement.clientHeight;
  	      var CH = document.documentElement.clientWidth;
  	      viewImgr.css({
  	    	  top: (CH - ((CW - 20)/3.18)) / 2 + 'px' ,
  	    	  zIndex: 999999999999
  	      });
  	      fullView.addClass('show');
  	      Client.openClientPanel();
  	    }
  	    
	});
});
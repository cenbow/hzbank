define(function(require, exports, module){
	
	var activitiesMoreTpl = require("text!../template/activities_more.html");
	var newsFlag = false;
	var activitiesMoreView = module.exports = ItemView.extend({
		
	template : activitiesMoreTpl,
	
	events:{
		"click [data-target='#page-tab1']":"news",
		"click [data-target='#page-tab2']":"activities"
	},
	initialize : function(){
	    var pageTest = {
			  	title:'消息中心',
				leftButton:{
					name : '返回',
					func :'curView.goBack()'//返回客户端首页
				},
				rightButton:{
					name : ''
				}
		  };
	    Client.initPageTitle(pageTest);

	  //计算无数据div的高度
	
		var shimHeight = 0;
		if(document.querySelector('.title-bar-shim-layer')){
			shimHeight = document.querySelector('.title-bar-shim-layer').offsetHeight;
		};
		var setHeight = (document.documentElement.clientHeight || window.innerHeight) - shimHeight -170; //需要占满屏幕高度所需高度
		document.querySelector('#activitiy').style.height = setHeight+ 'px';
		/*固定tab定位*/
		if(document.querySelector(".title-bar-shim-layer")){
			document.querySelector(".zen-tab").style.top = document.querySelector(".title-bar-shim-layer").offsetHeight+"px";	 
		 };
		document.querySelector(".zen-switch-pages").style.marginTop = '51px';  
		var iBankNotice = App.storage.get("iBankNotice");
		if(iBankNotice){
			if(iBankNotice.length>0){
				for(var i=0;i<iBankNotice.length;i++){
					var mesTime=Utils.formatDate(iBankNotice[i].messageTime, "yyyyMMddhhmmss", "yyyy-MM-dd hh:mm:ss");
					var txt = '<li><i class='+'"dot"></i><p class='+
					'"news-tit" data-time='+'"' + mesTime + '"'+
					'>【'+iBankNotice[i].messageTitle+'】</p><p class="news-detail">'+
					iBankNotice[i].messageContent+'</p></li>';
					$('#news').prepend(txt);
				} 
				newsFlag =true;
			}else{
				$('#page-tab1').hide();
				$('#activitiy').html("暂无消息");
				$('#activitiy').show();
				newsFlag =false;
			}
			Client.hideWaitPanel(1);
		}else{
			 this.noticeQuery();
		}
	},
	goToBack:function(){
		App.back();
	},
	 news : function(){
		 $('[data-target="#page-tab1"]').addClass('js-active');
		 $('[data-target="#page-tab2"]').removeClass('js-active');
		 if(newsFlag){
				$('#page-tab1').show();
				$('#activitiy').hide();	 
		 }else{
				$('#page-tab1').hide();
				$('#activitiy').html("暂无消息");
				$('#activitiy').show(); 
		 }

	},
	 activities : function(){
		 $('[data-target="#page-tab2"]').addClass('js-active');
		 $('[data-target="#page-tab1"]').removeClass('js-active');
		$('#page-tab1').hide();
		$('#activitiy').html("暂无活动，敬请期待");
		$('#activitiy').show();
	},
	  
	 noticeQuery : function(){	  
		 var param = {}; 
		 Ajax({url:"/anyMore/queryNotice", data:param, success:function(data){
			if(MUI.isEmpty(data.errorCode)){
				var icol=data.cd.iBankNotice;
				if(!MUI.isEmpty(icol)&&icol.length>0){
					for(var i=0;i<icol.length;i++){
						var mesTime=Utils.formatDate(icol[i].messageTime, "yyyyMMddhhmmss", "yyyy-MM-dd hh:mm:ss");
						var txt = '<li><i class='+'"dot"></i><p class='+
						'"news-tit" data-time='+'"' + mesTime + '"'+
						'>【'+icol[i].messageTitle+'】</p><p class="news-detail">'+
						icol[i].messageContent+'</p></li>';
						$('#news').prepend(txt);
					} 
					newsFlag =true;
				}else{
					$('#page-tab1').hide();
					$('#activitiy').html("暂无消息");
					$('#activitiy').show();
					newsFlag =false;
				}
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

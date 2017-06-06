require(['require','mui','mui_util','mui_touch','mui_ajax','iscroll','mui_bridge'],function(){
	  
	//定义日志TAG便于错误信息查找
	 var TAG  = "APP.bank_list";
	 window.App = {};
	 
	//初始化菜单方法
	 var pageStep1 = {
			  	title:'充值',
				leftButton:{
					name : '返回',
					func: 'App.goBack()'
				},
				rightButton:{
					name : '帮助',
					func : 'App.help()'
				}
		  };
	
	  App.goBack = function(url){
		  MUI.Client.gotoHomePage("income_transfer.html");
	  };
	 
	  
	  App.help = function(){
		  MUI.redirect("../anymore/message_center.html");
	  };
	  
      MUI.log(TAG,MUI.logLevel.DEBUG,"----init---");
	  //MUI.Client.initPageTitle(pageStep1);
	  
      
      $('#queryBankInput').on('keyup',function(){
    	  if($(this).val() != "请输入关键字" && !Utils.isEmpty($(this).val())){
    		  bankListQuery($(this).val());
  		 }
  	});
	  
	 var shimHeight = 0;
	 if(document.querySelector('.title-bar-shim-layer')){
		shimHeight = document.querySelector('.title-bar-shim-layer').offsetHeight;
	 };
	 var setHeight = (document.documentElement.clientHeight || window.innerHeight) - shimHeight -55; //需要占满屏幕高度所需高度
	 document.querySelector('#zen-iscroll-wrapper').style.height = setHeight+ 'px';
	  
	 //查询实时汇款银行列表
	 function bankListQuery(queryBankName){
	 	var params = {
	 			beginStr:"",
	 			endStr:"",
	 			hotFlag:"1",
	 			bankName:queryBankName,
	 			actionFlag:'3'
	 	};
	 	
	 	MUI.ajax({url:"/bank/bankListQuery", data:params, success:function(data){
			 MUI.log(TAG,data);
			// MUI.Template.render("bankSelect",list.htmlTem,data);
			 
			 $("#bankSelect").empty();
     		 var icoll = data.cd.iBankListInfo;
     		 var bankIconUrl = "";
             var selectBankValue = "";
 			 for(var len=0;len<icoll.length;len++){
 				  var kcoll = icoll[len];
 				  if(!Utils.isEmpty(kcoll.bankIconUrl)){
 					  bankIconUrl="bs_"+kcoll.bankIconUrl.split("_")[1];
 				  }else{
 					  bankIconUrl ="";
 				  }
 				  
 				  selectBankValue = kcoll.unionBankNo+"|"+kcoll.bankName+"|"+kcoll.initial+"|"+bankIconUrl;
 				  
			  	  /*$('#bankSelect').append(
			  			  '<li value="'+selectBankValue+'">'+
			  			  	'<i class="ico-bnk bnk-zs"></i>'+
			  			  	'<a href="javascript:;" class="bankLogo '+kcoll.bankIconUrl+'" data-bankname="'+kcoll.bankName+'" data-bankvalue="'+bankCodeStr+'" data-bankurl="'+bankIconUrl+'">'+
			  			  	kcoll.bankName+
			  			  	'</a>'+
			  			  '</li>'
			  			  );*/

 				  
 			  	 $('#bankSelect').append('<li value="'+selectBankValue+'"><i class="ico-bnk bnk-zs"></i>'+kcoll.bankName+'</li>');
 			  } 
 			 
 			  //银行点选效果
			  $('#bankSelect li').on('click',function(){
				  var selectBankValue = $(this).attr('value');
			      
			      var param = {
			    		  selectBankValue:selectBankValue
					};
			      MUI.redirect("income_transfer.html",param);
			  });
 			  
 			  var myPullUpDownScroll = new IScroll('#zen-iscroll-wrapper');
 			  document.addEventListener('touchmove', function(e){e.preventDefault();}, false);  
 			  //do something
 			  myPullUpDownScroll.refresh(); //内容发生变化后应该及时刷新重置高度 
 			 
		}});
	 }
	 
	 bankListQuery("");
});
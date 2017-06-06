define(function(require, exports, module){
	
	var imageUploadTpl = require("text!../template/imageUpload.html");
	var loanImg=[];
	
	var ImageUploadView = module.exports = ItemView.extend({
		
		events : {
			"click #submit":"submit",
			
		},
		
		template : imageUploadTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		   this.getfromServerImage();
		},
		
		//查询影像信息
		getfromServerImage : function(){
			var applicationNo = App.storage.get("applyDataInfo").applicationNo;
//			var creditRepayType = App.storage.get("applyDataInfo").creditRepayType1;//还款方式
			var param = {
					applicationNo:applicationNo,
			};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/imageQuery", data:param, success:function(data){
				 if(MUI.isEmpty(data.errorCode)){
					 var iFileList = data.iFileList;
					 loanImg = iFileList;
					 var imgUpHtml = "";
					 var len = loanImg.length;
					 for(var i=0;i<loanImg.length;i++){
						 var iFile= loanImg[i];
						 if(iFile.fileBasePhoto!=undefined && iFile.fileBasePhoto!=null && iFile.operType!='00'){
							 imgUpHtml += '<div class="list-item">'+
										    '<div class="uploadBox">'+
									    		'<div data-index="' + i + '" id="img' + i + '" class="imgr done" onclick="mtg_imgbtn('+ i+ ')"><img src="data:image/jpg;base64,' + iFile.fileBasePhoto + '"></div>'+
									    		'<p class="tip">请点击查看相关证件<img src="images/de_hand.png" height="20"></p>'+
									    	'</div>'+
									      ' </div>';
						 }
					 }
					 imgUpHtml += '<div class="list-item">'+
								    '<div class="uploadBox">'+
							    		'<div data-index="' + len + '"  id="img' + len + '"  class="imgr" onclick="mtg_imgbtn2('+ len+ ')"></div>'+
							    		'<p class="tip">请点击上传相关证件<img src="images/de_hand.png" height="20"></p>'+
							    	'</div>'+
							      ' </div>';
					 $("#list").append(imgUpHtml);
					 
					 $(".list-item .imgr").die();
					 $(".list-item .imgr").live('click', function(){
						 var cur = $(this);
						 var index = cur.attr("data-index");
						 if($("#img"+index).html() && $("#img"+index).hasClass("done")){
							 //点击图片可以看大图
						 }else{
							 var isFalse = $("#img"+index).html()=="";
							 var indexInfo = {
									 index:index,
									 isFalse:isFalse
									 };
							 App.storage.set("indexInfo",indexInfo);
							 $this.saveImage();
						 }
					 });
					 
				 }else{
			    	Utils.alertinfo(data.errorMessage);	
				 }
				 Client.hideWaitPanel();
			},error:function(){
				Utils.alertinfo(data.errorMessage);	
			}}); 
		},
		
		
		//打开客户端获取图片
		saveImage : function() {
		 	Client.imageUpdate("curView.getPhotoResFront");
		},
		
		getPhotoResFront : function(obj) {
			var html = '<img src="data:image/png;base64,'+obj.fileData+'" width="100%" height="100%">';
			var index =  App.storage.get("indexInfo").index;
			var imageinfo ={};
			var imageData = obj.fileData;
			if(index==0 && imageData!=null) {
				imageinfo.operType='00';
				imageinfo.fileType='xfyd10';
				imageinfo.fileBasePhoto=imageData;
				loanImg[index]=imageinfo;
			}else if(index!=0){
				imageinfo.operType='00';
				imageinfo.fileType='xfyd10';
				if(imageData!=undefined&&imageData!=null){
					imageinfo.fileBasePhoto=imageData;
				}
				loanImg[index]=imageinfo;
			}
			if(imageData!=undefined&&imageData!=null){
				$("#img"+ index).html(html);
				$("#img"+ index).attr("done",false);
				if(App.storage.get("indexInfo").isFalse){
					this.AddImageDiv();//添加图片按钮
				 }
			}
			Client.hideWaitPanel(1);
		},
		
		AddImageDiv : function(){
			var index =  parseInt(App.storage.get("indexInfo").index);
			index=index+1;
			var html = '<div class="list-item">'+
						  '<div class="uploadBox">'+
				    		'<div data-index="' + index + '"  id="img' + index + '"  class="imgr" onclick="mtg_imgbtn2('+ index+ ')"></div>'+
				    		'<p class="tip">请点击上传相关证件<img src="images/de_hand.png" height="20"></p>'+
				    	'</div>'+
				      ' </div>';
			$("#list").append(html);
		},
		
		
		
		 //提交
		submit:function(){ 
			var subIfile = [];
			var j=0;
			var count=0;
			for(var i=0; i<loanImg.length;i++){
				var loanImgUp = loanImg[i];
				if (!(loanImgUp == undefined && loanImgUp == null) && loanImgUp.operType == '00') {
					count++;
					subIfile[j] = loanImgUp;
					j++;
				}
			}
			
			var submitdata = {};
			submitdata.totalNum = count;
			submitdata.applicationNo = App.storage.get("applyDataInfo").applicationNo;
			submitdata.iFileList = subIfile;
			if (subIfile.length <= 0) {
				Client.alertinfo("您没有要上传的图片");
				return;
			}
			var creditRepayType = App.storage.get("applyDataInfo").creditRepayType1;//还款方式
//			alert(creditRepayType);
			var param = {
					applicationNo:submitdata.applicationNo,
					totalNum:submitdata.totalNum,
					iFileList:submitdata.iFileList,
					creditRepayType:creditRepayType
			};
	
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/imageSend", data:param, success:function(data){
				 if(MUI.isEmpty(data.errorCode)){
				     Client.alertinfo("影像信息提交成功","提醒","curView.gotoSetCenter()");
				 }else{
			    	Utils.alertinfo(data.errorMessage);	
				 }
			},error:function(){
				Utils.alertinfo(data.errorMessage);	
			}}); 
		},
		
		
	    gotoSetCenter : function(){
	    	App.storage.remove("applyDataInfo");
	    	App.back(2);
	    },
		
		
		
		goBack : function(){
			App.back();
		}
	
	});
});

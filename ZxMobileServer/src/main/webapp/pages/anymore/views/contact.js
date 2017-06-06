define(function(require, exports, module){
	require("scripts/components/base64.js");
	
	var contactTpl = require("text!../template/contact.html");
	var contactDataTpl = require("text!../template/contactData.html");
	
	var contactView = module.exports = ItemView.extend({
	
	events : {
		"input #search" : "search",
		"propertychange #search" : "search"
	},
	
	template : contactTpl,
		//定义日志TAG便于错误信息查找
	initialize : function(){
	    var pageTest = {
			  	title:'联系人',
				leftButton:{
					name : '返回',
					func :'curView.goBack()'
				},
				rightButton:{
					name : ''
				}
		  }
	    this.name = App.storage.get("UserInfo").customerNameCN;
		Client.initPageTitle(pageTest);
	    Client.readContacts("curView.getData");
	    
	},
    
    getData : function(data){
    	if(data.length<=0){
    		Client.hideWaitPanel();
    		return false;
    	}
    	var param = {contacts : data};
    	var $this = this;
    	Ajax({url:"/anyMore/queryContacts", data:param, success:function(data){
			if(MUI.isEmpty(data.errorCode)){
				$this.data = data;
				var arr = $this.arr = [];
				for(var i=0;i<data.length;i++){
					var obj = {key:"",list:[]};
					var flag = true;
					for(var j=0;j<arr.length;j++){
						if(arr[j].key == data[i].key){
							arr[j].list.push(data[i]);
							flag = false;
							break;
						}
					}
					
					if(flag){
						obj.key = data[i].key;
						obj.list.push(data[i]);
						if(arr.length==0)
							arr.push(obj);
						else
							//首字母排序#-Z
							for(var j=0;j<arr.length;j++){
								if(obj.key < arr[0].key){
									arr.unshift(obj);
									break;
								}else if((!arr[j+1] || arr[j+1].key > obj.key) && obj.key> arr[j].key){
									arr.splice(j+1, 0, obj);
									break;
								}
							}
					}
					
				}
				//$this.model.set({arr:arr});
				var html = _.template(contactDataTpl,{arr:arr});
				$(".searchContent").html(html);
				Client.hideWaitPanel();
				$(".share").off().on("click",function(){
		    		var param = App.storage.get("param");
		    		var urlTemp = "";
		    		var contentTemp = "";
		    		var imageUrl = "";
		    		if(param.isFlag == "1"){
		    			urlTemp = "/shares/song.html?";
		    			imageUrl = "images/hongbao/redshare.png";
		    			contentTemp = "杭州银行直销银行支持多家银行卡，通过互联网即可完成账户注册，享受高收益产品服务，注册赢惊喜，快来注册吧！";
		    		}else{
		    			urlTemp = "/invaite.html?";
		    			contentTemp = "杭州直销银行突破传统实体网点的经营模式，只需通过互联网即可即可完成账户注册，享受多元化的金融服务，快来体验吧。";
		    		}
		    		var mobileNo = $(this).attr("data");
		    		var dataStr = "code="+(App.storage.get("recommendNum")||"")+"&name="+($this.name||"");
		    		dataStr = Base64.encode(dataStr);
					var opt={
							type:"1",
							mobile:mobileNo,
							imageUrl:imageUrl,
							title:"",
							url: basePath + urlTemp+dataStr,
							content : contentTemp
					};
					Client.sharePYQ(opt);
				});
			}else{
				Utils.alertinfo(data.errorMessage);
			}   
		}});
    },
    
    search : function(){
    	var keywords = $("#search").val();
    	if(!this.arr){
    		Utils.alertinfo("联系人为空！");
    		return false;
    	}
    	if(keywords.length==1 && !Utils.checkChinese(keywords)){
    		var html = _.template(contactDataTpl,{arr:this.arr});
			$(".searchContent").html(html);
    		$(".searchContent").children().hide();
    		if(Utils.isNum(keywords)){
    			$(".1").show();
    		}else{
    			$("."+keywords.toUpperCase()).show();
    		}
    	}else if(keywords.length==0){
    		var html = _.template(contactDataTpl,{arr:this.arr});
			$(".searchContent").html(html);
    	}else{
    		//-----模糊查询-------
    		var data = this.data,
    			arr = [];
			
			for(var i=0;i<data.length;i++){
				var obj = {key:"",list:[]};
				var flag = true;
				var name = Utils.checkChinese(data[i].name)?data[i].name:data[i].name.toLowerCase();
				var num = data[i].phone;
				for(var j=0;j<arr.length;j++){
					if(arr[j].key == data[i].key && (name.indexOf(keywords)>=0 
								||(Utils.isNum(keywords)&&num.indexOf(keywords)>=0))){
						arr[j].list.push(data[i]);
						flag = false;
						break;
					}
				}
				
				if(flag && (name.indexOf(keywords)>=0 
						||(Utils.isNum(keywords)&&num.indexOf(keywords)>=0))){
					obj.key = data[i].key;
					obj.list.push(data[i]);
					if(arr.length==0)
						arr.push(obj);
					else
						//首字母排序#-Z
						for(var j=0;j<arr.length;j++){
							if(obj.key < arr[0].key){
								arr.unshift(obj);
								break;
							}else if((!arr[j+1] || arr[j+1].key > obj.key) && obj.key> arr[j].key){
								arr.splice(j+1, 0, obj);
								break;
							}
						}
				}
				
			}
			var html = _.template(contactDataTpl,{arr:arr});
			$(".searchContent").html(html);
			Client.hideWaitPanel();
    		
    	}
    	var $this = this;
    	$(".share").off().on("click",function(){
/*    		var opt={
					url: basePath + "/startapp.html?code="+(App.storage.get("recommendNum")||""),
					content:"杭州直销银行突破传统实体网点的经营模式，只需通过互联网即可即可完成账户注册，享受多元化的金融服务，快来体验吧。"
				};
			Client.share(opt);*/
    		var param = App.storage.get("param");
    		var urlTemp = "";
    		var contentTemp = "";
    		var imageUrl = "";
    		if(param.isFlag == "1"){
    			urlTemp = "/shares/song.html?";
    			imageUrl = "images/hongbao/redshare.png";
    			contentTemp = "杭州银行直销银行支持多家银行卡，通过互联网即可完成账户注册，享受高收益产品服务，注册赢惊喜，快来注册吧！";
    		}else{
    			urlTemp = "/invaite.html?";
    			contentTemp = "杭州直销银行突破传统实体网点的经营模式，只需通过互联网即可即可完成账户注册，享受多元化的金融服务，快来体验吧。";
    		}
    		var mobileNo = $(this).attr("data");
    		var dataStr = "code="+(App.storage.get("recommendNum")||"")+"&name="+($this.name||"");
    		dataStr = Base64.encode(dataStr);
			var opt={
					type:"1",
					mobile:mobileNo,
					imageUrl:imageUrl,
					title:"",
					url: basePath + urlTemp+dataStr,
					content : contentTemp
			};
			Client.sharePYQ(opt);
		});
    },
    
	goBack : function(){
		App.back();
	}
	
	
	});
});

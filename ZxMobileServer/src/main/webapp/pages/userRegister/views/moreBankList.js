define(function(require, exports, module){
	
	var bankListTpl = require("text!../template/moreBankList.html");
	var bankListDataTpl = require("text!../template/moreBankListData.html");
	
	var bankListView = module.exports = ItemView.extend({
	
	events : {
	},
	
	template : bankListTpl,
	
	initialize : function(){
	    var pageTest = {
			  	title:'支持银行',
				leftButton:{
					name : '返回',
					func :'curView.goBack()'
				}
		  };
		Client.initPageTitle(pageTest);
	    this.initData();
	    
	},
    
    initData : function(){
    	var data = App.storage.get("_parameters");
    	var arr = [];
    	for(var i=0;i<data.length;i++){
			var obj = {key:"",list:[]};
			var flag = true;
			data[i].key = data[i].initial.substring(0,1);
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
			var html = _.template(bankListDataTpl,{arr:arr});
			$(".bankListContent").html(html);
			Client.hideWaitPanel();
		}
    },
    
	goBack : function(){
		App.back();
	}
	
	});
});

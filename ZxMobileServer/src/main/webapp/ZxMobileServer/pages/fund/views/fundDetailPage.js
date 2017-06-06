define(function(require, exports, module) {

	var fundDetailPageTemplate = require("text!../template/fundDetailPage.html");

	var FundDetailPageInfoView = module.exports = ItemView.extend({
		
		template : fundDetailPageTemplate,
		
		events : {
			},

		initialize : function() {
				var pageStep1 = {
					title : "基金详情",
					leftButton : {
						name : '返回',
						func : 'curView.goBack()'
					}

				};

				Client.initPageTitle(pageStep1);
				Client.menuOpt("0");
				var param =  App.storage.get("_parameters").iEFundBaseinfo;
				this.model.set(param);
				
				$('#base').addClass('spr');
				$('#cnt').css('height','auto');
				
				var allList = $('.director .list');
		        var allListItem = allList.find('.list-item');
		        var allListCnt = allList.find('.cnt');

		    	allListItem.on('click', function(){

					var me = $(this), 
					    cnt = me.next(), 
						setH = cnt.find('.para').get(0).offsetHeight;

					if (me.hasClass('spr')) {
		                me.removeClass('spr');
		                cnt.css('height',0);
		            } else {
		                allListItem.removeClass('spr');
		                allListCnt.css('height', 0);
		                me.addClass('spr');
		                cnt.css('height',setH);
		            }

				});
	        		
		    	this.fundFeeQuery();
				
		},
		
		fundFeeQuery:function(){
			Client.openWaitPanel("加载中...");
			var fundCode= App.storage.get("_parameters").iEFundBaseinfo.fundCode;
			var tacode= App.storage.get("_parameters").iEFundBaseinfo.TACode;
			var $this = this;
    		var param1 = {
    				fundCode :fundCode,
    				turnPageBeginPos:"1",
    				turnPageShowNum:"100",
    				tacode:tacode
    		};
    		Ajax({url:"/fund/fundFeeQuery",data:param1, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var icoll = data.iFundFeeinfo;
    				if(data.turnPageTotalNum==0){
    					$("#feePara").hide();
    					$("#feePro").show();
    				}
    				$("#fundFeeList").empty();
    				for(var len=0;len<icoll.length;len++){
						var kcoll = icoll[len];
						$this.addRow("fundFeeList",kcoll);
						
					}
    				Client.hideWaitPanel(1);
    			}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    				Client.hideWaitPanel(1);
    			}
    		},error:function(){
    			Client.hideWaitPanel(1);
    		}});
		},
		
		addRow : function(id,kcoll){
			var MinAmt =Utils.trim(kcoll.MinAmt);	
			var MaxAmt =Utils.trim(kcoll.MaxAmt);	
			var maxFee =Utils.trim(kcoll.maxFee);	
			var subUnit =Utils.trim(kcoll.subUnit);	
			var fundRate =kcoll.fundRate;
			if(subUnit=='2'){
				MinAmt=	Utils.formatCurrency(MinAmt,2);
				MaxAmt=	Utils.formatCurrency(MaxAmt,2);
			}else{
			    MinAmt=	parseInt(MinAmt);
			    MaxAmt=	parseInt(MaxAmt);
			}
			if(subUnit=='0')
				subUnit='年';
			else if(subUnit=='1')
			 	subUnit='月';
			else if(subUnit=='2')
			 	subUnit='元';
			 else
			    subUnit='日';
			var compositeD=MinAmt+'-'+MaxAmt+'('+subUnit+')';
			
			
			if(fundRate==""){
				fundRate='--';
			}else{
				fundRate=Utils.toRetentionDigit(fundRate*100,2)+'%';
			}
			
			if(maxFee==""){
				maxFee='--';
			}else{
				maxFee=Utils.formatCurrency(maxFee,2)+'(元)';
			}
			
			  var html ='<tr>'+
			            '<td>'+kcoll.transName+'</td>'+
			            '<td>'+compositeD+'</td>'+
			            '<td>'+fundRate+'</td>'+
			            '<td>'+maxFee+'</td>'+
			          '</tr>';
    		
    		$("#"+id).append(html);
    		
    		
    	},
    	
		goBack : function(){
        	App.back();
    	},
			
	});
});

define(function(require, exports, module){
	require("../../../../scripts/libs/awardRotate.min.js");
	var drawLotteryTpl = require("text!../template/drawLottery.html");
	var pageContainer,noChange,wonPrize,wonPrizeBox,wonPrizeBoxT1,wonPrizeBoxT2,changeNum,$wheelcanvas;
	var config = {
		      prizes: [],              // 大转盘奖品名称
		      prizeIndexs: [],         // 大转盘奖品编号
		      prizeTypes: [],          // 大转盘奖品类型
		      prizeIcons: [],          // 大转盘奖品图片
		      colors: [],              // 大转盘奖品区块对应背景颜色
		      outsideRadius: 168,      // 大转盘外圆的半径
		      textRadius: 138,         // 大转盘奖品位置距离圆心的距离
		      insideRadius: 30,        // 大转盘内圆的半径
		      startAngle: 0,           // 开始角度
		      bRotate: true           // false: 停止; ture: 旋转
		    };
	var drawLotteryView = module.exports = ItemView.extend({
		
		events : {
			"click #myPrize" : "lotteryCenter",
			"click #noChange .closeBtn" : "closeNoChange",
			"click #noChange .getBtn" : "getChange",
			"click #wonPrize .closeRztBtn" : "closeWonPrize",
			"click .pointer" : "draw"
			
		},
		
		template : drawLotteryTpl,
		
		initialize : function(){
			//初始化菜单方法
			var pageTest = {
				  	title:'幸运转转赚',
					leftButton:{
						name : '返回',
						func : 'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
				  };
			Client.initPageTitle(pageTest);
			this.init();
		},
		
		init : function(){
			var $this = this;
			$wheelcanvas = $('#wheelcanvas');
			pageContainer = $('#awardRotate');
			noChange = $('#noChange');
			wonPrize = $('#wonPrize');
			wonPrizeBox = wonPrize.find('.wonPrize');
			wonPrizeBoxT1 = wonPrizeBox.find('.txt1');
			wonPrizeBoxT2 = wonPrizeBox.find('.txt2');
			changeNum = $('#changeNum');
			// 页面初始化
			var initPage = function () {
			    var clientHeight = document.documentElement.clientHeight;
			    pageContainer.css({
			      height: clientHeight + 'px'
			    });
			  };
			$(window).on('resize', initPage);
			initPage();
			
			// 获取客户抽奖次数
			$this.queryUserDrawNum();
			
			// 初始化大转盘奖品
    		var prizeConfig = App.storage.get("prizeConfig");
			if (!prizeConfig)
				$this.initPrize();
			else {
				config.prizes=prizeConfig.prizes;
				config.prizeIndexs=prizeConfig.prizeIndexs;
				config.prizeTypes=prizeConfig.prizeTypes;
				config.prizeIcons=prizeConfig.prizeIcons;
				config.prizeRealIcons=prizeConfig.prizeRealIcons;
				config.colors=prizeConfig.colors;
				$this.displayPrize();
			}
			
			// 初始化顶部中奖记录
			$this.initDrawResult();
			
			// 获取未中奖文案
			var noPrizeTextList=App.storage.get("noPrizeTextList");
			if(!noPrizeTextList){
				$this.queryNoPrizeTextList();
			}
		},
		initPrize : function(){
    		var $this = this;
    		// 获取中奖奖品
    		var param={
    				actId:'A000002',
    				sactId:'B000000'
    		};
    		Ajax({url:"/draw/queryPrize",data:param,
    			success:function(data){
    				if(MUI.isEmpty(data.errorCode)){
    					config.prizes=[];
    					config.prizeIndexs=[];
    					config.prizeTypes=[];
    					config.prizeIcons=[];
    					config.prizeRealIcons=[];
    					config.colors=[];
    					var orderedPrizeList=data.prizeList.sort(function(a,b) {
							if(a.prizeId<b.prizeId) return -1;
							if(a.prizeId>b.prizeId) return 1;
							return 0;
						});
    					$.each(data.prizeList,function(i,prize){
    						config.prizes.push(prize.prizeName);
    						config.prizeIndexs.push(prize.prizeId);
    						config.prizeTypes.push(prize.prizeType);
    						if(MUI.isEmpty(prize.prizeIconUrl)){
        						config.prizeIcons.push("");
    						}else{
    							config.prizeIcons.push(prize.prizeIconUrl);
    							if($.inArray(prize.prizeIconUrl,config.prizeRealIcons)==-1){
    								config.prizeRealIcons.push(prize.prizeIconUrl);
    							}
    						}
    						var color=i%2==0?'#EF8768':'#FDE396';
    						config.colors.push(color);
    					});
    					App.storage.set("prizeConfig",config);
    					$this.displayPrize();
    				}else{
    					Utils.alertinfo(data.errorMessage);
    				}
    			},error:function(){
    		}});
    	},
    	displayPrize : function(){
    		var $this = this;
    		var imgNum=0,lenth=config.prizeRealIcons.length;
			$("#prizeIcons").empty();
			for(index in config.prizeRealIcons){
				var prizeIconUrl=config.prizeRealIcons[index];
				var $img=$('<img src="" />').attr("id",prizeIconUrl)
							.attr("src","images/rotate/"+prizeIconUrl+".png")
							.load(function(){
								imgNum++;
								imgNum === lenth ? $this.initWheel() : null;
							});
				$("#prizeIcons").append($img);
			}
    	},
		initWheel : function(){
			var $this = this;
   		    var canvas = document.getElementById('wheelcanvas');    
   		    if (canvas.getContext) {
   		    	// 根据奖品个数计算圆周角度
   		    	var arc = Math.PI / (config.prizes.length / 2);
   		    	var ctx = canvas.getContext('2d');

   		    	// 在给定矩形内清空一个矩形
   		    	ctx.clearRect(0, 0, 422, 422);

   		    	// strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
   		    	ctx.strokeStyle = '#FFBE04';

   		    	// font 属性设置或返回画布上文本内容的当前字体属性
   		    	ctx.font = '16px Helvetica Neue';  

   		    	for(var i = 0; i < config.prizes.length; i++) {       
   		    		var angle = config.startAngle + i * arc;
   			        ctx.fillStyle = config.colors[i];
   			        ctx.beginPath();
   	
   			        // arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
   			        ctx.arc(211, 211, config.outsideRadius, angle, angle + arc, false);    
   			        ctx.arc(211, 211, config.insideRadius, angle + arc, angle, true);
   			        ctx.stroke();  
   			        ctx.fill();
   	
   			        // 锁画布(为了保存之前的画布状态)
   			        ctx.save();   
   			        
   			        // 开始绘制奖品
   			        ctx.fillStyle = i%2==0?'#FFFFFF':'#E5302F';;
   			        var text = config.prizes[i];
   			        var iconUrl = config.prizeIcons[i];
   			        var lineHeight = 18;
   	
   			        // translate 方法重新映射画布上的 (0, 0) 位置
   			        ctx.translate(211 + Math.cos(angle + arc / 2) * config.textRadius, 211 + Math.sin(angle + arc / 2) * config.textRadius);
   			        
   			        // rotate 方法旋转当前的绘图
   			        ctx.rotate(angle + arc / 2 + Math.PI / 2);
   		        
   			        // 下面代码根据奖品类型、奖品名称长度渲染不同效果
   			        if (text.indexOf('元') > 0) {
   			        	// 红包
   			        	var texts = text.split('元');
   			        	for (var j = 0; j < texts.length; j++) {
   				            ctx.font = j == 0 ? 'bold 20px Helvetica Neue' : '16px Helvetica Neue';
   				            if (j == 0) {
   				            	ctx.fillText(texts[j] + '元', - ctx.measureText(texts[j] + '元').width / 2, j * lineHeight);
   				            } else {
   				            	ctx.fillText(texts[j], - ctx.measureText(texts[j]).width / 2, j * lineHeight);
   				            }
   			        	}
   			        } else if (text.indexOf('元') == -1 && text.length > 4) {
   			        	// 奖品名称长度超过一定范围
   			        	var index=text.indexOf('VIP');
   			        	index=index!=-1?index:4;
   			        	text = text.substring(0, index) + '||' + text.substring(index);
   			        	var texts = text.split('||');
   			        	for (var j = 0; j<texts.length; j++) {
   			        		ctx.fillText(texts[j], - ctx.measureText(texts[j]).width / 2, j * lineHeight);
   			        	}
   			        } else {
   			        	// 在画布上绘制填色的文本。文本的默认颜色是黑色
   			        	// measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
   			        	ctx.fillText(text, - ctx.measureText(text).width / 2, 0);
   			        }
   		        
   			        //添加对应图标
   			        if(!MUI.isEmpty(iconUrl)){
   			        	var img = document.getElementById(iconUrl);
   			        	img.onload = function () {  
   			        		ctx.drawImage(img, -15, 28);     
   			        	};
   			        	ctx.drawImage(img,-15, 28); 
   			        }
   			        //把当前画布返回（调整）到上一个save()状态之前 
   			        ctx.restore();
   		    	}  
   		    	config.bRotate = false;
   		    }
   		    $this.qryHideWait();
    	},
    	queryUserDrawNum : function(){
    		var $this = this;
		    var param={
	    		actId:'A000002',
				sactId:'B000000'
        	};
        	Ajax({url:"/draw/queryUserDrawNum",data:param,
				success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var drawNum=MUI.isEmpty(data.totalNum)?"0":data.totalNum;
					$("#changeNum").html(drawNum);
				}else{
					Utils.alertinfo(data.errorMessage);
					$("#changeNum").html("0");
				}
			},error:function(){
				$("#changeNum").html("0");
			}});
    		
    	},
    	initDrawResult : function(){
    		var $this = this;
    		var param={
    				actId:'A000002',
    				sactId:'B000000',
    				turnPageBeginPos:1,
    				turnPageShowNum:20,
    				actionFlag: '2'
    		};
    		Ajax({url:"/draw/queryUserDrawResult",data:param,
    			success:function(data){
    				if(MUI.isEmpty(data.errorCode)){
    					var drawResultList=data.drawResultList;
    					if(!MUI.isEmpty(drawResultList)){
    						$("#drawResult").empty();
    						$.each(drawResultList,function(i,drawResult){
    							var unit=drawResult.prizeType=='01'?'只'
    									:drawResult.prizeType=='02'?'张'
    									:drawResult.prizeType=='03'?'个':"份";
    							var $result=$("<span>恭喜 "+drawResult.mobile+"获得"+drawResult.prizeName+"一"+unit+"</span>");
    							$("#drawResult").append($result);
    						});
    					}
    				}else{
    					Utils.alertinfo(data.errorMessage);
    				}
    			},error:function(){
    			}});
    		
    	},
    	draw : function(){
    		var $this = this;
    		if(config.bRotate) {
    			return;
		    }
    		if(parseInt(changeNum.html())<1){
    			$this.showNoChange();
    			return;
    		}
		    config.bRotate = !config.bRotate;
		    // 抽奖
		    var param={
	    		actId:'A000002',
				sactId:'B000000'
        	};
		    //先让转盘转起来
		    $wheelcanvas.stopRotate();
		    $wheelcanvas.rotate({
		    	angle: 0,
		        animateTo: 15*1800,
		        duration: 30000
		    });
        	Ajax({url:"/draw/drawLottery",data:param,timeout:10000,
				success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var prizeId = data.prizeId;	
					var item= $.inArray(prizeId,config.prizeIndexs);
					item=item==-1?$.inarray('P0000',config.prizeIndexs)+1:item+1;
					$this.rotateFn(item, config.prizes[item - 1],config.prizeTypes[item - 1]);
					console.log(item);
				}else{
//					Utils.alertinfo(data.errorMessage);
					$wheelcanvas.stopRotate();
					$wheelcanvas.rotate({
				    	angle: 0,
				        animateTo: 1800,
				        duration: 1000,
				        callback: function () {
				        	Utils.alertinfo(data.errorMessage);
			    			config.bRotate = !config.bRotate;
				        }
					});
				}
				$this.queryUserDrawNum();
				$this.qryHideWait();
			},error:function(){
				$this.queryUserDrawNum();
				$this.qryHideWait();
			},complete:function(XMLHttpRequest,status){
				if(status == 'timeout'){
					$wheelcanvas.stopRotate();
					$wheelcanvas.rotate({
				    	angle: 0,
				        animateTo: 1800,
				        duration: 1000,
				        callback: function () {
				        	Utils.alertinfo("对不起，系统繁忙。请去我的奖品查看抽奖结果！");
			    			config.bRotate = !config.bRotate;
				        }
					});
					$this.queryUserDrawNum();
				}
			}});
    	},
    	rotateFn : function (item, txt, type) {
    		var $this = this;
    		var prizeSize = config.prizes.length;
    		var angles = item * (360 / prizeSize) - (360 / (prizeSize * 2));

    		if (angles < 270) {
    			angles = 270 - angles; 
    		} else {
    			angles = 360 - angles + 270;
    		}

    		$wheelcanvas.stopRotate();
    		$wheelcanvas.rotate({
    			angle: 0,
    			animateTo: angles + 1800,
    			duration: 5000,
    			callback: function () {
	    			// 设置弹框
	    			if (item == 'P0000'||txt.indexOf("未中奖")!=-1||type== '00') {
	    				$this.showNoPrize();
	    			} else {
	    				$this.showWonPrize(item,txt,type);
	    			}
	    			config.bRotate = !config.bRotate;
    			}});
		 },
    	showNoChange : function(){
    		noChange.removeClass('hide');
    	},
    	closeNoChange : function(){
    		noChange.addClass('hide');
    	},
    	setChangeNum : function(num){
    		changeNum.text(num);
    	},
    	showPrize : function(won, title1, title2){
    		won ? wonPrizeBox.removeClass('fail') : wonPrizeBox.addClass('fail');
    	    wonPrizeBoxT1.html(title1);
    	    wonPrizeBoxT2.html(title2);
    	    wonPrize.removeClass('hide');
    	},
    	showWonPrize : function(item,txt,type){
    		var $this = this;
    		if(type=="01"){//红包
    			$this.showPrize(true, '厉害了我的哥！',"抽中1.88元现金红包一只！");
    		}else if(type=="02"){//券
    			if(txt.indexOf('京东') >= 0){
    				$this.showPrize(true, '恭喜你！<br/>使出了洪荒之力', "抽中500元京东E卡一张！");
    			}else if(txt.indexOf('爱奇艺') >= 0){
    				$this.showPrize(true, 'Duang!duang!duang!恭喜！', "抽中爱奇艺VIP/月卡一张！");
    			}
    		}else if(type=="03"){//实物
    		}
    	},
    	showNoPrize : function(){
    		var $this = this;
    		$this.noPrizeTextList=App.storage.get("noPrizeTextList");
    		if(!$this.noPrizeTextList){
    			$this.showPrize(false, "别灰心！换个姿势", "很遗憾！未中奖！");
			}else{
				var item = Math.floor(Math.random() * $this.noPrizeTextList.length);
			    var noPrizeText=$this.noPrizeTextList[item].aprShowMsg;
			    var noPrizeTextArr=noPrizeText.split("$");
			    $this.showPrize(false, noPrizeTextArr[0], noPrizeTextArr[1]);
			}
    	},
    	queryNoPrizeTextList : function(){
    		var $this = this;
        	var param={
        	};
        	Ajax({url:"/draw/queryNoPrizeText",data:param,
				success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var noPrizeTextList=data.noPrizeTextList;
					if(!MUI.isEmpty(noPrizeTextList)){
						App.storage.set("noPrizeTextList",noPrizeTextList);
					}else{
						//TODO 
					}
				}else{
//					Utils.alertinfo(data.errorMessage);
				}
				$this.qryHideWait();
			},error:function(){
				$this.qryHideWait();
			}});
    	},
    	closeWonPrize : function(){
    		wonPrize.addClass('hide');
    	},
    	lotteryCenter : function(){
			if(Utils.checkSession()){
				if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						return;
					}
					var $this = this;
				    var param={
					    		actId:'A000002',
								sactId:'B000000',
								actionFlag:'1'

				        	};
		        	Client.openWaitPanel("拼命加载中，请稍候");
		        	Ajax({url:"/draw/queryUserDrawResult",data:param,
						success:function(data){
		    			if(MUI.isEmpty(data.errorCode)){
		    				var cd = data.drawResultList;
							if(!MUI.isEmpty(cd)){
			    				$this.drawResultList = cd;
			    				App.navigate("draw/drawCtl/lotteryCenter",{drawResultList:$this.drawResultList});
						     }else{
						    	 App.navigate("draw/drawCtl/lotteryCenter",{drawResultList:[]});
						     }
		    			
						}else{
							Utils.alertinfo(data.errorMessage);
						}
		    			Client.hideWaitPanel(1);
					},error:function(){
						Client.hideWaitPanel(1);
					}});
				}
			}else{
				Client.toLogin("curView.lotteryCenter()");
			}
		},
    	toIndex : function(){
    		Client.menuOpt("1");
			App.navigate("index/index/index");
    	},		
    	getChange : function(){
    		App.navigate("draw/drawCtl/drawIndex");
    	},		
    	qryHideWait: function(){
				
			Client.hideWaitPanel(100);
			Client.hideLucencyPanel();
			
			this.opt ? null : this.opt = {
					callback:"curView.refresh()"
			};
//			Client.dragRefresh(this.opt);
			
		},
		refresh : function(){
			this.iRedPacketListData = {};
			this.iRedPacketList = [];
			this.noRedPacketList = [];
			Client.openLucencyPanel();
    	},
		goBack : function(){
			App.back();
  	    }
	});
});

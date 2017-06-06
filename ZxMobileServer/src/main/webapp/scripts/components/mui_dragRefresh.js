define(['iscroll'], function(iScroll){	

	function buildScroll(elem, options){
		 options = _.extend({}, buildScroll.DEFAULTS, options);
		 
		 this.status = {
		   refreshRun : false,	 
		   loadRun : false,
		   refreshState : null,
		   loadState : null	 
		 };
		 
		 iScroll.call(this, elem, options);
		 this.initialize();
		  
		  //滑动时边界检测
		  var isIos8 = (/iphone|ipad/gi).test(navigator.appVersion) && parseInt(navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)[1]) > 7;
		  this.threshold = isIos8 && options.threshold !== false;
		  var clientRect = this.wrapper.getBoundingClientRect();
		  this.thresholdY = options.thresholdY ? options.thresholdY : [clientRect.top, clientRect.bottom];
		 
	  };
	  
	  function tempClass(){};
	  tempClass.prototype = iScroll.prototype;
	  
	  buildScroll.prototype = _.extend(new tempClass, {
		  
	     initialize : function(){
			 this.refreshText = this.options.setValue.refreshText.split('|');
			 this.loadText = this.options.setValue.loadText.split('|'); 
			 
			 var labelTpl = '<div class="state"><i></i><span></span></div>';
			 this.refreshEl = document.createElement('div');
			 this.refreshEl.className = 'pullDown';
			 this.options.dragRefresh && (this.refreshEl.innerHTML = labelTpl);
			 this.scroller.insertBefore(this.refreshEl, this.scroller.childNodes[0]);
			 
			 if(this.options.dragRefresh){     
			   this.refreshLbl = this.refreshEl.querySelector('span');
			   this.refreshDefaultState();
			 }
			 
			 if(this.options.dragLoad){
			   this.loadEl = document.createElement('div');
			   this.loadEl.className = 'pullUp';
			   this.loadEl.innerHTML = labelTpl;
			   this.scroller.appendChild(this.loadEl);
			   this.LoadLbl = this.loadEl.querySelector('span'); 
			   this.loadDefaultState();
			 }	
			 this.scrollTo(0, -this.options.topOffset, 0);
			 this.refresh();
	
		 },
		 
		  refreshDefaultState : function(){
		     this.refreshEl.className = 'pullDown'; 
			 this.status.refreshState = 1;
			 this.refreshLbl.innerHTML = this.refreshText[0];
		  },
		  loadDefaultState : function(){
		     this.loadEl.className = 'pullUp';
			 this.status.loadState = 1;
			 this.LoadLbl.innerHTML = this.loadText[0];
		  },
		  refreshRelState : function(){
		     this.refreshEl.className = 'pullDown flip'; 
			 this.status.refreshState = 2;
			 this.refreshLbl.innerHTML = this.refreshText[1];
		  },
		  loadRelState : function(){
		     this.loadEl.className = 'pullUp flip';
			 this.status.loadState = 2;
			 this.LoadLbl.innerHTML = this.loadText[1];
		  },
		  refreshRunState : function(){
		     this.refreshEl.className = 'pullDown loading'; 
			 this.status.refreshState = 3;
			 this.refreshLbl.innerHTML = this.refreshText[2];
			 this.status.refreshRun = true;
		  },
		  loadRunState : function(){
		     this.loadEl.className = 'pullUp loading';
			 this.status.loadState = 3;
			 this.LoadLbl.innerHTML = this.loadText[2];
			 this.status.loadRun = true;
		  },
		  onDestroy : function(){	 
			 this.destroy();
			 this.scroller.removeChild(this.refreshEl);	
			 this.scroller.removeChild(this.loadEl); 	 
		  }
		  
	  })
	  
	  buildScroll.DEFAULTS = {
		 setValue : {
		   refreshBarHeight : 40,
		   loadBarHeight : 40,
		   refreshText : '下拉刷新...|释放立即刷新...|正在刷新...',
		   loadText : '上拉加载更多...|释放立即加载...|正在加载...'	   
		 },
		 dragRefresh : true,
		 dragLoad : true,
		 useTransition : true,
		 vScrollbar : false, 
		 topOffset : 40, 
		 refreshCallback : function(){},
		 loadCallback : function(){},
	     onRefresh : function(){
			if(this.status.refreshState == 3) {
			  this.refreshDefaultState();
			  this.status.refreshRun = false;
			}else if(this.status.loadState == 3){
			  this.loadDefaultState();
			  this.status.loadRun = false;
			}
		 },
		 onScrollMove : function(){
	       var refreshBarHeight = this.options.setValue.refreshBarHeight;
		   var loadBarHeight = this.options.setValue.loadBarHeight;
		   var refreshRun = this.status.refreshRun;
		   var loadRun = this.status.loadRun;
		   var refreshState = this.status.refreshState;
		   var loadState = this.status.loadState;
		   
		   if(this.threshold){
			  if((this.pointY < this.thresholdY[0] && this.y < this.maxScrollY) || (this.pointY > this.thresholdY[1] && (this.y >= this.minScrollY || this.maxScrollY > 0))){ 
			  if(refreshState == 2){
				  this.refreshRunState();
				  if(!refreshRun){
				    refreshRun = true;
					this.options.refreshCallback();
				  }
				}
				this._resetPos(400);
			  }
		   }
		   if(refreshRun || loadRun) return false;
		   
		   if(this.y > 10  && refreshState && refreshState != 2){ 	     
	         this.refreshRelState();
			 this.minScrollY = 0;
		   }else if(this.y < 10 && refreshState && refreshState == 2){
			 this.refreshDefaultState();  
		     this.minScrollY = -refreshBarHeight;	 
		   }else if(this.y < (this.maxScrollY - 5) && loadState && loadState != 2){
			 this.loadRelState();
			 this.maxScrollY = this.maxScrollY; 
		   }else if(this.y > (this.maxScrollY + 5) && loadState && loadState == 2){
			 this.loadDefaultState();
		     this.maxScrollY = loadBarHeight;
		   }
		      
		 },
		 onScrollEnd : function(){
		    var refreshRun = this.status.refreshRun;
		    var loadRun = this.status.loadRun;
		    var refreshState = this.status.refreshState;
		    var loadState = this.status.loadState;
			
			if(refreshRun || loadRun) return false;
			
			if(refreshState == 2){
			  this.refreshRunState();
			  if(!refreshRun){
			    refreshRun = true;
				this.options.refreshCallback();
			  }
			}else if(loadState == 2){
			  this.loadRunState();	
			  if(!loadRun){
			    loadRun = true;
				this.options.loadCallback();
			  }
			}
		 }
	  }
	
	  MUI.loadRefresh = function(el, opt){
		return new buildScroll(el, opt);
	  };
	  return MUI;
});	
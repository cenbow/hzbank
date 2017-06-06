(function(win){
	var Utils = win.Utils = {};
	//改变样式
	Utils.changeClass = function (_, $) {
		document.getElementById(_).className = $;
	};	

	Utils.isEmpty = function ($) {
		if( $==null ||  Utils.trim($).length == 0 )
			return true;
		else
			return false;
	};
	
	Utils.isShorter = function (_, $) {
		if (_.length < $)
			return true;
		else
			return false;
	};
	
	Utils.isInteger = function (_) {
		var $ = RegExp(/^[0-9]+$/);
		return ($.test(_));
	};
	
	Utils.isFloat = function (_) {
		var $ = RegExp(/^([0-9]+(\.+))[0-9]+$/);
		return ($.test(_));
	};
	Utils.isSpecFloat = function (_) {
		var $ = RegExp(/^([1-9]{1}(\.+))[0-9]{1,2}$/);
		return ($.test(_));
	};
	
	Utils.isDecimal = function (_) {
		var $ = RegExp(/^([0-9]+(\.?))?[0-9]{1,2}$/);
		return ($.test(_));
	};
	
	Utils.isIntChar = function (_) {
		var $ = RegExp(/^[a-zA-Z0-9]+$/);
		return ($.test(_));
	};
	
	Utils.isNum = function (_) {
		var $ = RegExp(/^[0-9]+$/);
		return ($.test(_));
	};
	
	Utils.isOneNum = function (_) {
		var $ = RegExp(/^[1-9]{1,2}$/);
		return ($.test(_));
	};
	
	Utils.isIntCharSpecial = function (_) {
		var $ = RegExp(/^[a-zA-Z0-9(\|)(\_)(\-)(\*)(\&)(\%)(\$)(\#)(\@)(\!)(\~)(\^)(\()(\))]+$/);
		return ($.test(_));
	};
	
	Utils.containIntChar = function (_) {
		var $ = RegExp(/[a-zA-Z0-9]+/);
		return ($.test(_));
	};
	
	Utils.containSpecial = function (_) {
		var $ = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
		return ($.test(_));
	};
	
	Utils.containSpecial2 = function (_) {
		var $ = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
		return ($.test(_));
	};
	
	Utils.isEmail = function (_) {
		var $ = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
		return ($.test(_));
	};
	//判断是否为姓名
	Utils.isName = function (_) {
		var $ = RegExp(/^([a-zA-Z]{1,20}|[\u4e00-\u9fff]{2,10})$/);
		return ($.test(_));
	};
	
	//判断电话号码
	Utils.isMobile = function (_) {
		var $ = RegExp(/^\d{4}-\d{8}$/);
		return ($.test(_));
	};
	//判断是否为年份
	Utils.isYear = function (_) {
		var $ = RegExp(/^[19]\d{2}$/);
		return ($.test(_));
	};
	
/*############### 系统方法 开始##################	*/
	
	//获取元素位置
	Utils.position = function(el) {
		 var pos = [el.offsetLeft, el.offsetTop];
		 var parent = el.offsetParent;
		 if (parent != el) {
		     while (parent) {
		         pos[0] += parent.offsetLeft;
		         pos[1] += parent.offsetTop;
		         parent = parent.offsetParent;
		     }
		 }
		 return {
		     x : pos[0],
		     y : pos[1]
		 };
		 
	};
	
	/**
	 * @memberof Nuui.utils
	 * @desc 检查字符串是否为空
	 * @func isEmpty
	 * @static
	 * @param {string} s - 字符串
	 * @returns {boolean}  是否为空
	 * @example var s = '';
	 * Nuui.utils.isEmpty(s); //true;
	 * var s = ' ';
	 * Nuui.utils.isEmpty(s); //false;
	 */
	Utils.isEmpty = function(s){
		return (s == null || s.length == 0);
	};
	
	Utils.isMobile = function(_) {
		var $ = RegExp(/^1[3|4|5|8][0-9]\d{4,8}$/);
		return ($.test(_));
    };
	
	/**
	 * 对手机号进行中间4位的隐藏
	 * @param mobileNo
	 * @return
	 */
	Utils.getFmtMobile = function(mobileNo){
		if(null==mobileNo||""==mobileNo||mobileNo.length!=11){
			return mobileNo;
		}			
		mobileNo = mobileNo.substring(0,3)+' **** '+mobileNo.substring(7);
		return mobileNo;
	};
	
	
	Utils.timeFormat = function(input){
		if(input){
			return input.substr(0,4)+'-'+input.substr(4,2)+'-'+input.substr(6,2)+'  '+input.substr(8,2)+':'+input.substr(10,2)+':'+input.substr(12,2);
		}
	};
	
	Utils.openWaitlayer = function(){
		$("#waitlayer").remove();
		$("body").append('<div class="waitlayer" id="waitlayer"></div>');
	};
	
	Utils.closeWaitlayer = function(){
		$("#waitlayer").remove();
	};
	
/*############### 系统方法 结束##################	*/
	

/*############### 业务方法 开始##################	*/
	
	/**
	 * 返回url上传递的参数
	 */
	Utils.search = function() {
		var params = {};
		var b = decodeURI(window.location.search).split("?")[1];
		if(!b)return "";
		var p = b.split('&');
		for(var i=0;i<p.length;i++){
			var a = p[i].split('=');
			var str = "";
			if(a.length>2){
				var i=0
				while(i<a.length-2){
					str += "=" + a[i+2];
					i++;
				}
			}
			params[a[0]] = a[1] + str;
		}
		
		return params;
	};
	
    	/**
    	 * 当密码框获取焦点时，密码输入框随着密码键盘往上移
    	 */
		var clientHeight = document.documentElement.clientHeight || window.innerHeight;
     	Utils.focusPosition = function(element,distance){
     		 var $view = $('.ui-view');
     		if(	$view.attr('data-position')!=0){
     			setTimeout(function(){
     				Utils.focusPosition(element,distance);
     			},500);
     			return false;
     		}
     		if(!clientHeight){
     			clientHeight = document.documentElement.clientHeight || window.innerHeight;
     		}
     		if(!distance){
     			distance = 40;
     		}
     		var keyBoardHeight = 0;
     		if(!config.pwdHeight){
        	    keyBoardHeight = 255;
     		}else{
        	    keyBoardHeight = config.pwdHeight;
     		}
     		
     		 var curPoz = $view.attr('data-position')*1;

       		 var eleOffsetTop = element.offset().top + curPoz;
      	     var setOffsetTop = clientHeight - keyBoardHeight - distance - element.height();    
      	     if(eleOffsetTop > setOffsetTop){
      	    	 var moveDistance = eleOffsetTop - setOffsetTop; 
      	  	     $view.attr('style','transition:transform ease 600ms; -webkit-transition:-webkit-transform ease 600ms; -webkit-transform:translate3d(0, -'+moveDistance+'px, 0); transform:translate3d(0, -'+moveDistance+'px, 0);');
      	  	     $view.attr('data-position',moveDistance);
      	     };
       	};
       	
    	/**
    	 * 当密码框失去焦点时，密码输入框随着密码键盘往下移
    	 */	
       	Utils.blurPosition = function(){
       		var $view = $('.ui-view');
       		$view.attr('style','transition:transform ease 300ms; -webkit-transition:-webkit-transform ease 300ms; -webkit-transform:translate3d(0, 0, 0); transform:translate3d(0, 0, 0);');
       		setTimeout(function(){
       			$view.attr('data-position',0);
       		},300);
       		
       		setTimeout(function(){ //清除移动样式 防止其他页面fixed失效
       			$view.removeAttr('style');
       		},500);
       	};
       	
    	/**
    	 * 提示框显示
    	 */	       	
       	Utils.alertinfo = function(msg,type,time){
       		if(Utils.isEmpty(msg))return;
       		
       		if(msg.length > 34){
       			type = "paragraph";
       		}else{
       			type = "";
       		}
       		var obj = {
   				text : msg,
   				delay : time || 2000,
   				type : type || 'words'  //paragraph
       		};
       		Utils.tips.create(obj);
       	};
       	
       	Utils.tips = {
   		    defaults : {
   			  text : "无法获取信息",
   			  delay : 2000,
   			  type : 'words'
   			},	
   			
   			//创建tips DOM节点插入body
   			create : function(opts){
   			  $('.ui-dialog-tips').remove(); 
   		      var def = this.defaults;
   			  $.extend(true,def,opts);
   			  var boxType = 'ui-dialog-tips';
   			  def.type == 'words' ? null : boxType = 'ui-dialog-tips paragraph';
   			  $('<div class="'+boxType+'" style="-webkit-animation-duration:'+def.delay+'ms; animation-duration:'+def.delay+'ms;">'+
   		         '<span class="tips-label">'+def.text+'</span>'+
   		      '</div>').appendTo('body');
   			}	
   		 }
       	
       	
    	/**
    	 * 手机验证码重置
    	 */	    	
    	Utils.countDown = function(count,elem){
    		var t = $(elem);
			t.attr('data-text','已发送('+count+')');
			if(count==0||t.length==0||$(elem+":visible").length==0){
				t.removeClass('disabled');
				t.attr('data-text','获取验证码');
			}else{
				count--;
				setTimeout(function(){
					Utils.countDown(count,elem);
				},1000);
			}
		};
		
		Utils.currencyFormat = function(amt,num){
			amt = ""+amt;
			if(amt.indexOf(".")==0){
				amt = "0"+amt;
			}
			num = num < 0?0:num;
			return parseFloat(amt).toFixed(num);
		};
		
		
		/**
		 * 对账号进行第4位的隔开
		 * @param accountNo
		 * @return
		 */
		Utils.getFmtAcc = function (accountNo){
			if(null==accountNo||""==accountNo)return accountNo;
			accountNo = accountNo.replace(/\s/g,"");
			var sign = " ";
			var spacing = 4;
			var num = accountNo.length;
			var arr = accountNo.split("");
			var temp = arr[0];
			for(var i=1;i<num;i++){
				if(0==i%spacing){
					temp += sign;
				}
				temp +=arr[i] ;
			}
			return temp;
		};
		
		Utils.checkMobile = function(mobile){
		  	if (Utils.isEmpty(mobile) || !Utils.isNum(mobile)||mobile.length!=11 ){
		  		return false;
		  	}else{
		  		if(mobile.indexOf('13')==0||mobile.indexOf('14')==0||mobile.indexOf('15')==0||mobile.indexOf('17')==0||mobile.indexOf('18')==0){
		  			return true;
		  		}else{
		  			return false;
		  		}
		  	}
	  	};		
		
		
		/**
		 * 身份证校验
		 * @param code
		 * @return
		 */		
		Utils.IdentityCodeValid = function (code) { 
		     var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
		     var tip = "";
		     var pass= true;
		     
		     if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
		         tip = "身份证号格式错误";
		         pass = false;
		     }
		     
		    else if(!city[code.substr(0,2)]){
		         tip = "地址编码错误";
		         pass = false;
		     }
		     else{
		    	 if (code.substring(17, 18) == 'x') {
		    		 code = code.substring(0, 17) + 'X';
					 $('#input_certNo').val(code);
				 }
		         //18位身份证需要验证最后一位校验位
		         if(code.length == 18){
		             code = code.split('');
		             //∑(ai×Wi)(mod 11)
		             //加权因子
		             var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
		             //校验位
		             var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
		             var sum = 0;
		             var ai = 0;
		             var wi = 0;
		             for (var i = 0; i < 17; i++)
		             {
		                 ai = code[i];
		                 wi = factor[i];
		                 sum += ai * wi;
		             }
		             var last = parity[sum % 11];
		             if(parity[sum % 11] != code[17]){
		                 tip = "校验位错误";
		                 pass =false;
		             }
		         }
		     }
		     //if(!pass) alert(tip);
		     return pass;
		 };
		 
		 
			/**
			 * 返回url上传递的参数
			 */
	  Utils.search = function() {
		  var params = {};
		  var b = window.location.search.split("?")[1];
		  if(!b)return "";
		  var p = b.split('&');
		  for(var i=0;i<p.length;i++){
		  var a = p[i].split('=');
			params[a[0]] = a[1];
		   }	
		   return params;
	  };
/*############### 业务方法 结束##################	*/

		return Utils;
	

})(window);

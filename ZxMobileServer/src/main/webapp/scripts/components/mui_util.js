define(['zepto','./mui_format'], function(){
	var TAG = "MUI.Util";
	MUI.log(TAG,MUI.logLevel.DEBUG,"----start----");

	Utils = MUI.Utils = window.Utils = {};
	
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
	
	
	
	Utils.isMoney = function (_) {
//		var $ = RegExp(/^[0-9]*\.?[0-9]{0,2}$/);
		var $ = RegExp(/^([1-9][\d]{0,8}|0)(\.[\d]{1,2})?$/);
		return ($.test(_));
	};
	
	/**
	 * 当前一个参数为空时，数据替换
	 */	
	
	Utils.nvl = function (s,replaceString)
	{
		if ( Utils.isEmpty(s) )
			return replaceString;
		else
			return Utils.trim(s);
	};
	
	/**
	 * 当前一个参数为空时，数据替换
	 */	
	
	Utils.nvl2 = function (_, $) {
		if ((_ == null)||(_.length==0))
			return $;
		else
			return _;
	};
	
	/**
	 * 当前一个参数为空时，数据替换
	 */	
	
	Utils.nvl3 = function (_, $) {
		if ((_ == null)||(trim(_).length==0))
			return $;
		else
			return Utils.trim(_);
	};	
	
	Utils.isDate = function (param) {
		var pattern = /^\d+$/;
		if (param.length != 8)
			return false;
		if (!pattern.test(param))
			return false;
		sYear = param.substring(0, 4);
		sMonth = param.substring(4, 6);
		sDay = param.substring(6, 8);
		if ((eval(sMonth) < 1) || (eval(sMonth) > 12))
			return false;
		var leapYear = (((sYear % 4 == 0) && (sYear % 100 != 0)) || (sYear % 400 == 0)) ? true
				: false, monthDay = new Array(12);
		monthDay[0] = 31;
		monthDay[1] = leapYear ? 29 : 28;
		monthDay[2] = 31;
		monthDay[3] = 30;
		monthDay[4] = 31;
		monthDay[5] = 30;
		monthDay[6] = 31;
		monthDay[7] = 31;
		monthDay[8] = 30;
		monthDay[9] = 31;
		monthDay[10] = 30;
		monthDay[11] = 31;
		if ((eval(sDay) < 1) || (eval(sDay) > monthDay[eval(sMonth) - 1]))
			return false;
		return true;
	};
	
	Utils.encode = function (B) {
		if (B == null)
			return B;
		if (B.length == 0)
			return B;
		var A = "";
		for (var i = 0; i < B.length; i++) {
			var _ = B.substr(i, 1), $ = escape(_);
			if ($.substring(0, 2) == "%u")
				A = A + $.replace("%u", "@@");
			else
				A = A + _;
		}
		return A;
	};	
	
	Utils.getWeek = function(day){
		var weekName = "";
		switch(day){
		case 0:
			weekName = "周日";
			break;
		case 1:
			weekName = "周一";
			break;
		case 2:
			weekName = "周二";
			break;
		case 3:
			weekName = "周三";
			break;
		case 4:
			weekName = "周四";
			break;
		case 5:
			weekName = "周五";
			break;
		case 6:
			weekName = "周六";
			break;
		}
		return weekName;

	};
	
	/*将毫秒转化为指定时间格式
	 * @param value{String} 转换前的毫秒数
	 * @param toFormat{String}转换后的格式
	 * @exp Utils.formatDate(14234,'d天h小时m分s秒');
	 */
	Utils.parseSeconds = function(t,format){
		if(!t){
			return "";
		}
		t = Math.abs(t);
		var d=Math.floor(t/1000/60/60/24);
		var h=Math.floor(t/1000/60/60);
		var m=Math.floor(t/1000/60%60);
		var s=Math.floor(t/1000%60);
		if(h!=0&&m!=0&&s!=0){
			 h>9 ? h = ""+h : h = "0"+h;
			 m>9 ? m = ""+m : m = "0"+m; 
			 s>9 ? s = ""+s : s = "0"+s;
		}
		format = format || "d天h小时m分s秒";
		format = format.replace('d',d);
		format = format.replace('h',h);
		format = format.replace('m',m);
		format = format.replace('s',s);
		
		return format;
	};
	/**
	* 去掉字符串前后的空格
	* @param {String} 字符串
	* @return {String} 去除空格后的字符串
	*/
	Utils.trim = function (input) {
		if(input!=null){
			return input.replace(/(^\s*)|(\s*$)/g, "");
		}else{
			return "";
		}
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
	
	/**
	 * 对手机号进行中间6位的隐藏
	 * @param mobileNo
	 * @return
	 */
	Utils.getFmtMobile1 = function(mobileNo){
		if(null==mobileNo||""==mobileNo||mobileNo.length!=11){
			return mobileNo;
		}			
		mobileNo = mobileNo.substring(0,3)+' **** ** '+mobileNo.substring(9);
		return mobileNo;
	};
	
	/*将金额转化为指定精度的输出格式
	 * @param value 输入的金额
	 * @param ccyType 金额小数点后要保留的位数
	 */ 
	Utils.formatCurrency = function(value, ccyType) {
		return Format.toDecimalString(value, true, ccyType);
	};
	/*将金额去除逗号
	 * @param value 输入的金额
	 */ 
	Utils.removeComma = function(value) {
		return value.replace(new RegExp('\,',["g"]),'');
	};
	//把金额转换为大写
	Utils.toChineseCurrency = function(value) {
		return Format.toChineseCurrency(value);
	};
	/*将日期由当前格式转换为指定格式
	 * @param value{String} 转换前的日期
	 * @param fromFormat{String} 转换前的格式
	 * @param toFormat{String}转换后的格式
	 * @exp Utils.formatDate('2012-01-02','yyyy-MM-dd','yyyy/MM/dd');
	 */
	Utils.formatDate = function(value, fromFormat, toFormat) {
		
		return Format.toDateString(Format.parseDate(value, fromFormat), toFormat);
	};
	/* 将日期字符转换成日期
	 * @param value{String} 当前字符串
	 * @param fromFormat{String} 当前日期字符串的格式
	 */
	Utils.parseDate = function(value, fromFormat) {
		
		return Format.parseDate(value, fromFormat);
	};
	/*将日期转换成指定格式字符串
	 * @param date{Date} 要转换的日期
	 * @param toFormat{String} 转换的规则
	 */
	Utils.toDateString = function(date, toFormat) {

		return Format.toDateString(date, toFormat);
	};
	/*
	 * 四舍五入保留位数
	 * @param {float} amtValue 要转换的数字
	 * @param {int} widthl 保留位数
	 * @returns {string} 
	 */
	Utils.toRetentionDigit = function ( amtValue, widthl ) {
		return Format.toRetentionDigit( amtValue, widthl );
	};	
	
	//判断是否汉字
	Utils.checkChinese = function(text){
		
		var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
		return reg.test(text); 
	};
	
	
	//弹出对话框
	Utils.confirm = function(message, options, callback){
		if(_.isFunction(options)){
			callback = options;
		}
		var _options = {
			title:"确认",
			confirmButContent:"确定",
			cancelButContent:"取消"
		}
		if(options){
			_.extend(_options, options);
		}
		var dialogHtml = [
			"<div class='nu-dialog table z1500'>",
				"<div class='table-row'>",
					"<div class='table-cell-center'>",
						"<div class='nu-dialog-container'>",
							"<div class='nu-dialog-title'>" + _options.title + "</div>",
							"<div class='nu-dialog-content'><span>" + message + "</span></div>",
							"<div class='nu-dialog-button-area'>",
								"<button id='_dialogConfirm'>" + _options.confirmButContent + "</button>",
								"<button id='_dialogCancel'>" + _options.cancelButContent + "</button>",
							"</div>",
						"</div>",
					"</div>",
				"</div>",
			"</div>"
		].join("");

		var dialog = $(dialogHtml)
			.css({
				transition: "all 0.1s ease-in-out",
				opacity:0
			})
			.appendTo(document.body);

		setTimeout(function(){
			dialog.css('opacity', 1);
		},5);

		dialog.find("#_dialogConfirm").on("tap", function(){
			dialog.remove();
			if(callback){
				callback(true);
			}
			return false;
		});
		dialog.find("#_dialogCancel").on("tap", function(){
			dialog.remove();
			if(callback){
				callback(false);
			}
			return false;
		});
	};
	
/*############### 系统方法 结束##################	*/
	

/*############### 业务方法 开始##################	*/
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
	
	/**
	 * 根据参数保护账号
	 * @param accountNo 需要保护的账号
	 * @param isProtected 是否进行保护  在页面内用<%=utb.isProtected()%>作为参数
	 * @return 处理后的账号
	 */
	Utils.protectAcc = function (accountNo,isProtected){
		return isProtected ? this.protectAccTrue(accountNo):accountNo;
	};
	
	/**
	 * 直接保护账号，相当于protectAcc(accountNo,true);
	 * @param accountNo 需要保护的账号
	 * @return 处理后的账号
	 */
	Utils.protectAccTrue = function (accountNo){
		if(null==accountNo||""==accountNo)
			return accountNo;
		var sb = "";
		var length = accountNo.length;
		
		if(10<length){
			sb += accountNo.substr(0, 6);
			sb += this.getShieldString(length-10, "*");
			sb += accountNo.substr(length-4);
			return sb;
		}
		if(4<length&&length<=10){
			sb += this.getShieldString(length-4, "*");
			sb +=accountNo.substr(length-4);
			return sb;
		}
		return accountNo;
	};
	
	/**
	 * 根据sign得到屏蔽账号的sum个sign的字符串
	 * @param sum 字符串长度
	 * @param sign 单个字符
	 * @return 指定长度的字符串
	 */
	Utils.getShieldString = function (sum,sign){
		var sb ="";
		for(var i=0;i<sum;i++){
			sb+=sign;
		}
		return sb;
	};
	
	/**
	 * 对账号进行每4位隔开，且中间8位隐藏
	 * @param cardNo
	 * @return
	 */	
	Utils.formatAcc = function (cardNo){
		var cardNo6 = "";
		if(cardNo.length > 16){
			var cardNo1 = cardNo.substring(0,4);
			var cardNo4 = cardNo.substring(12,16);	
			var cardNo5 = cardNo.substring(16,cardNo.length);	
			cardNo6 = cardNo1+" **** **** "+cardNo4+" "+cardNo5;		
		}else{
			cardNo6 = cardNo;
		}
		return cardNo6;
	};	
	
	/**
	 *	保留前四位、后四位，且中间8位隐藏
	 * @param cardNo
	 * @return
	 */	
	Utils.protectAcc = function (cardNo){
		var cardNo6 = "";
		if(cardNo.length >= 16){
			var cardNo1 = cardNo.substring(0,4);
			var cardNo5 = cardNo.substring(cardNo.length-4,cardNo.length);	
			cardNo6 = cardNo1+" **** **** "+cardNo5;		
		}else{
			cardNo6 = cardNo;
		}
		return cardNo6;
	};	
	
	/**
	 * 对账号进行每4位隔开
	 * @param cardNo
	 * @return
	 */		
    Utils.cardNoFomart = function (cardNo){
		if(Utils.isEmpty(cardNo)){
			return;
		}
		var num = 0;
		for(var i=0;i< cardNo.length ;i++){
			num++;
			if(num == 5){
				cardNo = cardNo.substring(0,i)+" "+cardNo.substring(i,cardNo.length);
				num =0;
			}
		}
		return cardNo;	
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
	 
	 
	 //车牌号校验
	 Utils.isVehicleNumber = function (vehicleNumber) {
		 var result = false;
		 if(vehicleNumber.length == 7){
			 var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
			 result = express.test(vehicleNumber);
		 }
		 return result;
	 };
	 
	 
	//获取参数显示信息
	//增加一个选中默认值形参，参数表中找不到则显示这个值,此形参不传则返回原值
	Utils.getParamDisplay = function(id, value, lang, defval) {
		var param = Utils.getParamArray(id);
		if ($.isArray(param)) {
			var record;
			for (var i = 0 ;i<param.length;i++){
				if(param[i].key==value){
					record= param[i];
					break;
				}
			}
			if (record) {
				if (lang && record.i18n && record.i18n[lang])
					return record.i18n[lang];
				return record.text;
			} else {
				if(defval)
					return defval;
				else
					return value;
			}
		} else {
			if(defval)
				return defval;
			else
				return value;
		}
	}; 
	
	//将带有~~字符串解析成json数组
	Utils.getMapArrary = function(str){
		if(str.charAt(str.length-1)=="~"){
			str=str.substring(0,str.length-2);
		}
		
		var stringArr=str.split("~~");
		return stringArr;
	};
	
	//获取参数数组
	Utils.getParamArray = function(id) {
		var param = window.NS[id];
		if (!$.isArray(param)) {
			param = paramList ? paramList[id] : [];
		}
		return param;
	};
	
	//检查是否已登录
	Utils.checkSession = function(){
		var sessionInfo = App.storage.get("UserInfo");
		if(!MUI.isEmpty(sessionInfo)&&!MUI.isEmpty(sessionInfo.regMobile)&&sessionInfo.regMobile.length==11){
			return true;
		}else{
			return false;
		}
	};
	
	//检查是否已实名
	Utils.checkRealUser = function(isFlag){
		var sessionInfo = App.storage.get("UserInfo");
		if(!MUI.isEmpty(sessionInfo)&&!MUI.isEmpty(sessionInfo.userType)&&(sessionInfo.userType=='01'||sessionInfo.userType=='02')){
			return true;
		}else{
			if(!isFlag){
//				var param = {
//						action : "填写实名信息"
//				};
//				App.navigate("special/specialCtl/facecheck",param);			
				var paramValue = {
						mobileNo:sessionInfo.regMobile
				};
				App.navigate("userRegister/userRegisterCtl/userRegisterStep2",paramValue);
			}
			return false;
		}
	};
	
	//检查账户是否实名已激活
	Utils.checkActivate = function(){		
		//查询有无绑定卡，无绑定卡则添加绑定卡，有绑定卡则添加非绑定卡，
		var hasBandCard = "0";
		var bindCardNo = App.storage.get("UserInfo").bindCardNo;
		if(bindCardNo !=null && bindCardNo.length != 0){
			hasBandCard = "1";//登陆返回
		}
		var iCardList = App.storage.get("userCardList");
		if(iCardList !=null && iCardList.length != 0){
			for(var i=0;i<iCardList.length;i++){
	  			var kcoll=iCardList[i];
	  			if(kcoll.bandFlag=="1"){
	  				//有绑定卡
	  				hasBandCard = "1";//增加银行卡返回
	  				break;
	  			}
	  		}
		}
		
		if(hasBandCard == "0"){
			Client.alertinfo("您的账户还未绑卡，赶快去绑定银行卡吧","提示","Utils.bandCard()",true);
			 return false;
		}
		
   		 var cardStatus = Utils.getEleCard().cardStatus;
		 if(cardStatus=="00"){			 
			 Client.alertinfo("您的账户还未激活，赶快去充值激活吧","提示","Utils.recharge()",true);
			 return false;
   		 }else{
 			return true;
   		 }
	};
	
	Utils.bandCard = function(){
		App.navigate("myBankCard/myBankCardCtl/addCard");
	};
	
	Utils.recharge = function(){
		var userInfo = App.storage.get("UserInfo");
//		var param = {
//				cardNo:Utils.getEleCard().cardNo,
//				hasResetPwd:userInfo.hasResetPwd,
//		};
//		Client.openWaitPanel("正在提交中，请稍候");
//		Ajax({url:"/pubServer/elecAccActivate",data:param, success:function(data){
//			if(MUI.isEmpty(data.errorCode)){
//				userInfo.iCardInfo[Utils.getEleCard().elecAccIndex].cardStatus = '01';
//				App.storage.set("UserInfo",userInfo);//将参数放入session
//				App.storage.set("activate",false);
//				Utils.alertinfo("恭喜您，激活成功！");			    		
//			}else{
//				if(data.errorCode=='ZXEB9003'){
			//11 批开户且已经设置交易密码  21 是微信注册且已设置交易密码
			if((userInfo.hasResetPwd == "11")){
				//批量开户用户
				App.storage.set("activate",true);
				App.navigate("transfer/transferCtl/recharge");
//				App.navigate("userRegister/userRegisterCtl/recharge");
			}else if(userInfo.hasResetPwd == "21"){
				App.storage.set("activate",true);			//微信开户且已经设置了密码用户
				App.navigate("transfer/transferCtl/recharge");
			}else if(userInfo.hasResetPwd == "10"){
				var batchAccParam = {
						mobileNo:userInfo.regMobile,
						userName : userInfo.customerNameCN,
				};
				App.navigate("userRegister/userRegisterCtl/batchPassWordSetting",batchAccParam);
			}else if(userInfo.hasResetPwd == "20"){ //20是微信注册且设置交易密码
				App.navigate("userRegister/userRegisterCtl/wxAddLoginPassword");
			}else{
				App.storage.set("activate",true);
				App.navigate("transfer/transferCtl/recharge");
			}
//				}else{
//					Utils.alertinfo(data.errorMessage);
//				}
//			}
//			Client.hideWaitPanel(1);
//		}});
		
//		if(!MUI.isEmpty(App.storage.get("bindCardInfo"))){
////			App.navigate("settings/setCenterCtl/activate");
//			return;
//		}
//		
//		var elecCardNo = Utils.getEleCard().cardNo;//获取电子账号
//		var queryParam = {
//				cardNo:elecCardNo
//		};
//		Client.openWaitPanel("拼命加载中，请稍候");
//		Ajax({url:"/account/elecAccBindQuery", data:queryParam, success:function(data){
//			
//			if(Utils.isEmpty(data.errorCode)){
//				var bindCardNo = data.cd.bindCardNo;
//				var cardType = data.cd.cardType;
//				var bankName = data.cd.bankName;
//				var bankType = data.cd.bankType;
//				
//	   			var params = {
//	   					cardNo:bindCardNo,
//	   					queryType:'1'
//	   			};
//	   		   	Ajax({url:"/bank/checkCardBin", data:params, success:function(data){
//	   				if(Utils.isEmpty(data.errorCode)){
//	   					var icoll = data.iCardBinInfo;
//	   		    		if(icoll!=null&&icoll.length>0){ 		    			
//	   						var kColl = icoll[0];
//	   						var orgCode = kColl.orgCode;
//	   						var orgName = kColl.orgName;
//	   						var bankIconUrl = kColl.bankIconUrl;
//	   						var bankClass = 'ico-bnk bnk-'+bankIconUrl.split('_')[1]+' mr5';
//							var val='0';
//						    if(orgCode==Utils.getParamDisplay("ORG_CODE","hzbank")){//本行
//				 				Utils.alertinfo("激活异常（-2）");
//							}else{
//								val='3';
//						    }
//						    var bindCardInfo={
//									elecCardNo:elecCardNo,
//									bindCardNo:bindCardNo,
//									cardType:cardType,
//									bankName:bankName,
//									bankType:bankType,
//									val:val,
//									orgCode:orgCode,
//									orgName:orgName,
//									bankClass:bankClass,
//							};
//						    App.storage.set("bindCardInfo",bindCardInfo);//保存绑定卡信息
//			       			App.navigate("transfer/transferCtl/recharge");
//	   				    }else{
//			 				Utils.alertinfo("激活异常（-3）");
//	   				    }
//	   				}else{
//		 				Utils.alertinfo("激活异常（-4）");
//	   				}
//	   			}});
//			 }else if(data.errorCode == '-77333'){
//	 			Utils.alertinfo("激活异常（-1）");
//				Client.hideWaitPanel(1);
//			}
//	    }});
	};
	
	/***
	 * 根据属性直接获取卡号
	 */
	Utils.getCardNoByFlag = function(value,option,related){
		var cardNo = "";
		var iCardInfo  = App.storage.get("UserInfo").iCardInfo;
		if(undefined == related)related=true;
		for(var len=0;len<iCardInfo.length;len++){
			var accountOption = iCardInfo[len][option];
			if(value == accountOption){
				var cardType = iCardInfo[len].cardType;
				if(!related){
					if("02" == cardType )continue;
				}
				cardNo = iCardInfo[len].cardNo;
			}
		}
		return cardNo;
	};
	
	/***
	 * 根据属性直接获取账号类型
	 */
	Utils.getCardTypeByFlag = function(value,option,related){
		var cardType = "";
		var iCardInfo  = App.storage.get("UserInfo").iCardInfo;
		if(undefined == related)related=true;
		for(var len=0;len<iCardInfo.length;len++){
			var accountOption = iCardInfo[len][option];
			if(value == accountOption){
				var cardType = iCardInfo[len].cardType;
				if(!related){
					if("02" == cardType )continue;
				}
				cardType = iCardInfo[len].accountType;
			}
		}
		return cardType;
	};
	
	/***
	 * 获取电子账户
	 */
	Utils.getEleCard = function(){
		var param = {};
		if(!MUI.isEmpty(App.storage.get("UserInfo"))){
			var cardCategory = "";
			var cardSeries = "";
			var cardNo = "";
			var accountType = "";
			var cardOpenNode = "";
			var cardStatus = "";
			var val = "";
			var elecAccIndex = "";
			
			var iCardInfo  = App.storage.get("UserInfo").iCardInfo;
			if(iCardInfo){
				for(var len=0;len<iCardInfo.length;len++){
					cardCategory = iCardInfo[len].cardCategory;
					cardSeries = iCardInfo[len].cardSeries;
					if("03" == accountType )continue;
					val = cardCategory + cardSeries;
					cardOpenNode = iCardInfo[len].cardOpenNode;
					if(val=="9901"||val=="9902"){
						cardNo = iCardInfo[len].cardNo;
						accountType = iCardInfo[len].accountType;
						cardStatus = iCardInfo[len].cardStatus;
						elecAccIndex = len;
					}
				}
				param = {cardNo:cardNo,accountType:accountType,cardOpenNode:cardOpenNode,cardStatus:cardStatus,elecAccIndex:elecAccIndex};
			}
		}
		return param;
	};
	
	/**
	 * 取得若干天前/后的系统日期
	 * 
	 * @param limit
	 *            与现在相隔的日数，正数为当前日期之后，负数为当前日期之前
	 * @param inputFormat
	 *            格式化
	 */
	Utils.getDifferentDate = function(limit,inputFormat){
		var defaultFormat = "yyyy-MM-dd";
		var sysDate = App.storage.get("UserInfo").sysDate;
		var year = sysDate.substr(0,4);
		var month = sysDate.substr(4,2)-1;
		var da = sysDate.substr(6,2);
		var date = new Date();
		date.setFullYear(year,month,da);
		date.setDate(date.getDate()+limit);
		var today = Utils.toDateString(date,'yyyyMMddhhmmss');
		if(inputFormat == null){
			return Utils.formatDate(today,'yyyyMMddhhmmss',defaultFormat);
		}else{
			return Utils.formatDate(today,'yyyyMMddhhmmss',inputFormat);
		}
	};
	
	/***
	 * 获取当前时间
	 * @param inputFormat 获取时间的格式 时间：yyyyMMddHHmmss；日期：yyyyMMdd
	 */
	Utils.getServerDate = function(inputFormat){
		var defaultFormat = "yyyy-MM-dd";
		var sysDate = App.storage.get("UserInfo").sysDate;
		var year = sysDate.substr(0,4);
		var month = sysDate.substr(4,2)-1;
		var da = sysDate.substr(6,2);
		var date = new Date();
		date.setFullYear(year,month,da);
		var today = Utils.toDateString(date,'yyyyMMddhhmmss');
		if(inputFormat == null){
			return Utils.formatDate(today,'yyyyMMddhhmmss',defaultFormat);
		}else{
			return Utils.formatDate(today,'yyyyMMddhhmmss',inputFormat);
		}
	};
	
	/***
	 * 获取当前时间的偏移时间
	 * @param limit 获取时间的格式 时间偏移量
	 * @param inputFormat 获取时间的格式 时间：yyyyMMddHHmmss；日期：yyyyMMdd
	 */

	Utils.getDifferentMonth = function( limit,inputFormat){
		var defaultFormat = "yyyy-MM-dd";
		var date = new Date();
		if(date.getMonth()==0 && limit < 0){
			date.setYear(date.getFullYear()-1);
		}
		date.setMonth(date.getMonth()==0?11:date.getMonth()+limit);
		var today = Utils.toDateString(date,'yyyyMMddhhmmss');
		if(inputFormat == null){
			return Utils.formatDate(today,'yyyyMMddhhmmss',defaultFormat);
		}else{
			return Utils.formatDate(today,'yyyyMMddhhmmss',inputFormat);
		}
	};
	
	/***
	 * 获取账户余额
	 * @param cardNo 卡号
	 * @param accountType 卡类型
	 * @param showBalanceSpan 显示区域
	 */
	
	Utils.queryCommBalance = function(cardNo,accountType,showBalanceSpan,isHide){
		var argumentsLength = arguments.length;
		var showBalanceSpanId = "showBalanceSpan";
		if(argumentsLength >= 3) {
			showBalanceSpanId = showBalanceSpan;
		}
		var balanceInfo = App.storage.get("balanceInfo");
		if(balanceInfo){
			showBalanceSpan = document.getElementById(showBalanceSpanId);
			if(showBalanceSpan)
				showBalanceSpan.innerHTML = Utils.formatCurrency(balanceInfo.balanceAvailable);
			if(!isHide)	Client.hideWaitPanel(1);
			return;
		}
		
		var sendStr={
				"accountNo":cardNo,
				"accountType":accountType
		};		 
		Ajax({url:"/account/life_accountBalanceQueryAjax", data:sendStr, success:function(data){			 
			 var showBalanceSpan = document.getElementById(showBalanceSpanId);
			 if(data.errorCode == undefined){
		    		var balance = data.cd.balance;
		    		var balanceAvailable = data.cd.balanceAvailable;
		    		var balanceFreeze = data.cd.balanceFreeze;
		    		var balanceReserve = data.cd.balanceReserve;
		    		var balanceInfo = {};
		    		balanceInfo.balance = balance;
		    		balanceInfo.balanceAvailable = balanceAvailable;
		    		balanceInfo.balanceFreeze = balanceFreeze;
		    		balanceInfo.balanceReserve = balanceReserve;
		    		if(showBalanceSpan)
		    			showBalanceSpan.innerHTML = Utils.formatCurrency(balanceInfo.balanceAvailable);
		    		
		    		App.storage.set("balanceInfo",balanceInfo);
	    	 }else{
				showBalanceSpan.innerHTML = "";
	    	 }
			 if(!isHide) Client.hideWaitPanel(1);
		},error:function(){
			var showBalanceSpan = document.getElementById(showBalanceSpanId);
			showBalanceSpan.innerHTML = "";
			if(!isHide)	Client.hideWaitPanel(1);
		}});
	};
	
	/**
	 * 返回url上传递的参数
	 */
	Utils.search = function() {
		var params = {};
		var b = App.history.fragment.split("?")[1];
		if(!b)return "";
		var p = b.split('&');
		for(var i=0;i<p.length;i++){
			var a = p[i].split('=');
			params[a[0]] = a[1];
		}
		
		return params;
	};
	
	/**
	 * 清空输入框
	 */	
	Utils.clearInput= function(className){
     	  var elems = document.querySelectorAll(className);
     	  
     	  for(var i=0; i<elems.length; i++){
     		var iEle = document.createElement('i');
	     	elems[i].appendChild(iEle);
	     	
     		elems[i].addEventListener('keyup',function(e){
     		  var Input = this.querySelector('input'); 
     		  var tarValLength = Input.value.length;
     		  var clear = this.querySelector('i');
     		  tarValLength>0 ? (clear.style.display="block") : (clear.style.display="none");
     		  clear.addEventListener('click',function(e){
     			Input.value = "";
     			clear.style.display="none";
     		  },false);
     		},false);
     		
     		$(elems[i]).trigger("keyup");
     	  }
     	};
     	
    	/**
    	 * 当密码框获取焦点时，密码输入框随着密码键盘往上移
    	 */	    	
     	Utils.focusPosition = function(element,distance){
     		 var $view = $('.ui-view');
     		if(	$view.attr('data-position')!=0){
     			setTimeout(function(){
     				Utils.focusPosition(element,distance);
     			},500);
     			return false;
     		}
     		var clientHeight =0;
     		if(pubParam.clientHeight*1 >0 ){
     			clientHeight = pubParam.clientHeight*1;
     		}else{
     			clientHeight = document.documentElement.clientHeight || window.innerHeight;
     		}
     		
     		if(clientHeight*1 <300){
     			return;
     		}
     		
     		if(MUI.isEmpty(distance)){
     			distance = 40;
     		}
     		var keyBoardHeight = 0;
     		if(MUI.isEmpty(pubParam.pwdHeight)){
        	    keyBoardHeight = 255;
     		}else{
        	    keyBoardHeight = pubParam.pwdHeight;
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
       		$("#codeInput").hide();//删除绑定卡，页面交易码，密码控件隐藏调用节点方法
       		Client.hideClientPanel();//删除绑定卡，页面交易码，密码控件隐藏调用节点方法
       		
       		var $view = $('.ui-view');
       		var pos = $view.attr('data-position');
       		if(!pos ||	pos=="0"){
       			return;
       		}
       		
       		$view.attr('style','transition:transform ease 300ms; -webkit-transition:-webkit-transform ease 300ms; -webkit-transform:translate3d(0, 0, 0); transform:translate3d(0, 0, 0);');
       		setTimeout(function(){
       			$view.attr('data-position',0);
       		},300);
       		
       		$("#pwd").parent().removeClass("focusState");  //登录页失焦
       		
       		setTimeout(function(){ //清除移动样式 防止其他页面fixed失效
       			$view.removeAttr('style');
       		},500);
       	};
       	
    	/**
    	 * 提示框显示
    	 */	       	
       	Utils.alertinfo = function(msg,type,time){
       		if(Utils.isEmpty(msg))return;
       		
       		if(Utils.getLength(msg)> 34){
       			type = "paragraph";
       		}else{
       			type = "";
       		}
       		var obj = {
   				text : msg,
   				delay : time || 3000,
   				type : type || 'words'  //paragraph
       		};
       		MUI.tips.create(obj);
       	};
       	
    	/**
    	 * 对数据特殊处理
    	 */	         	
       	Utils.formatData = function(value,ccyType){
    		return Format.toDecimalString2(value, true, ccyType);
       	};
       	
    	/**
    	 * 获取字符串长度
    	 */	            	
    	Utils.getLength = function(o){
    		var len = 0;
    		var s = o;
    		for(var i=0;i<s.length;i++){
    			var c = s.substr(i,1);
    			var ts = escape(c);
    			if(ts.substring(0,2) == "%u") {
    				len+=2;
    			} else {
    				len+=1;
    			}
    		}
    		return len;
    	};
    	
    	/**
    	 * 金额check提示
    	 */	    	
		Utils.checkAmount = function(amtShow){
    		if(Utils.isEmpty(amtShow) ){
    			Utils.alertinfo("请输入金额");
    			return false;
    		}else if(Utils.isMoney(amtShow)){
    			if(Utils.formatCurrency(amtShow,2)=='0.00'){
        			Utils.alertinfo("请输入大于零的金额");
        			return false;	
    			}else{
        			return true;
    			}
    		}else{
    			Utils.alertinfo("亲，金额格式错误或者金额过大哦~","1");
    			return false;
    		}
    	};
    	
    	/**
    	 * 金额check提示
    	 */	    	
		Utils.checkAmount1 = function(amtShow){
    		if(Utils.isEmpty(amtShow) ){
    			Utils.alertinfo("请输入投资金额");
    			return false;
    		}else if(Utils.isMoney(amtShow)){
    			return true;
    		}else{
    			Utils.alertinfo("亲，金额格式错误或者金额过大哦~","1");
    			return false;
    		}
    	};
    	
    	/**
    	 * 金额check提示
    	 */	    	
		Utils.checkAmount2 = function(amtShow){
    		if(Utils.isEmpty(amtShow) ){
    			Utils.alertinfo("请输入借款金额");
    			return false;
    		}else if(Utils.isMoney(amtShow)){
    			return true;
    		}else{
    			Utils.alertinfo("亲，金额格式错误或者金额过大哦~","1");
    			return false;
    		}
    	};
    	
    	/**
    	 * 金额check提示
    	 */	    	
		Utils.checkAmount3 = function(amtShow){
    		if(Utils.isEmpty(amtShow) ){
    			Utils.alertinfo("请输入家庭年收入");
    			return false;
    		}else if(Utils.isMoney(amtShow)){
    			return true;
    		}else{
    			Utils.alertinfo("亲，金额格式错误或者金额过大哦~","1");
    			return false;
    		}
    	};

    	
    	/**
    	 * 手机验证码重置
    	 */	    	
    	Utils.countDown = function(count,elem){
    		var t = $(elem);
			t.attr('data-value','重新发送('+count+')');
			if(count==0||t.length==0){
				t.removeClass('disabled');
				t.attr('data-value','获取验证码');
			}else{
				count--;
				setTimeout(function(){
					Utils.countDown(count,elem);
				},1000);
			}
		};
		
		/**
		 * 选择键盘插件
		 * */
		$.fn.selectDialog = function(opt){
			var element = $(this);
			element.unbind('click').on('click', function(){
				var selbox = $('<div class="selectBox"></div>');
				var box = $('<div class="box"></div>').appendTo(selbox);
				function bulid(list, callback){
					var ul = $('<ul></ul>');
					for(var i = 0; i < list.length; i++){
						var data = list[i].split('|');
						var valstr = '';
						if(data[1]){
							valstr = 'data-value="'+ data[1] +'"';
						}
						var li = $('<li class="itm" '+ valstr +'>'+ data[0] +'</li>').on('click', function(){
							if(callback) callback($(this).data('value'), $(this).text());
							selbox.remove();
						});
						li.appendTo(ul);
					}
					return ul;
				}
				var newul = bulid(opt.list, opt.callback);
				newul.appendTo(box);
				var closeBtn = $('<button class="slcbtn">取消</button>').on('click', function(){
					selbox.remove();
				})
				closeBtn.appendTo(box);
				$('body').append(selbox);
			})
		};
		
		/**
		 * 选择键盘插件
		 * */
		$.createDialog = function(opt){
			var selbox = $('<div class="selectBox"></div>');
			var box = $('<div class="box"></div>').appendTo(selbox);
			function bulid(list, callback){
				var ul = $('<ul></ul>');
				for(var i = 0; i < list.length; i++){
					var data = list[i].split('|');
					var valstr = '';
					if(data[1]){
						valstr = 'data-value="'+ data[1] +'"';
					}
					var li = $('<li class="itm" '+ valstr +'>'+ data[0] +'</li>').on('click', function(){
						if(callback) callback($(this).data('value'), $(this).text());
						selbox.remove();
					});
					li.appendTo(ul);
				}
				return ul;
			}
			var newul = bulid(opt.list, opt.callback);
			newul.appendTo(box);
			var closeBtn = $('<button class="slcbtn">取消</button>').on('click', function(){
				selbox.remove();
			})
			closeBtn.appendTo(box);
			$('body').append(selbox);
		};
		
		// 身份证检测
		Utils.checkCertNo18 = function(certNo) {
			if (Utils.isEmpty(certNo) || Utils.containSpecial(certNo) || certNo.length != 18) {
				Utils.alertinfo("您输入的身份证号有误，请重新输入");
				return false;
			} else {
				if (certNo.substring(17, 18) == 'x') {
					certNo = certNo.substring(0, 17) + 'X';
					$('#input_certNo').val(certNo);
					return true;
				}
				if (Utils.IdentityCodeValid(certNo)) {
					return true;
				} else {
					Utils.alertinfo("您输入的身份证号有误，请重新输入");
					return false;
				}
			}
		};
		
		Utils.tranState = function(state,tranState){
			var res = "";
			state = "" + state + tranState;
			switch(state){
				case "0000":
				case "1000":
				case "2000":
				case "3000":
				case "5000":
					res = "待支付";
					break;
				case "0020":
				case "1020":
					res = "处理中";
					break;
				case "2020":
					res = "交易成功";
					break;
				case "0030":
				case "1030":
				case "2030":
				case "3030":
				case "5030":
				case "3020":
					res = "交易失败";
					break;
				case "0050":
				case "1050":
				case "2050":
				case "3050":
				case "5050":
				case "5020":
					res = "交易关闭";
					break;
				default:
					res = "支付可疑";
			}
			return res;
		};
		
		/**
		 * 检测是否签约添利/博时
		 * 0博时 1添利 2黄金
		 */
		Utils.checkBoseFinance = function(type){
			var iBoseraIncome = App.storage.get("iBoseraIncome");
			var state = false;
			if(iBoseraIncome){
				$.each(iBoseraIncome,function(i,income){
					if(income.productId == Utils.getParamDisplay("PB_BOSERA",'1') && (type=="0"||type=="2")){ 
						state = true;
					}else if(income.productId == Utils.getParamDisplay("PB_FINANCE_BALANCE","1") && type=="1"){
						state = true;
					}
				});
			}
			
			var goldSign = App.storage.get("goldSign");
			if(type=='2'&&goldSign){
				if(goldSign.signState=='1'||goldSign.signState=='2'){
					state = true;
				}
			}
			
			if(type=='0'&&goldSign&&goldSign.signState=='1'){
				state = true;
			}
			
			return state;
		};
		/*############### 业务方法 结束##################	*/
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
		
		return Utils;
	

});

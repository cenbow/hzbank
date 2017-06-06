define(['zepto'], function(){
	var TAG = "MUI.Format";
	MUI.log(TAG,MUI.logLevel.DEBUG,"----start----");

	Format = MUI.Format = window.Format = {};

Format.REGEXP_DECIMAL = /^[+-]?((\d{1,3}(\,\d{3})*)|\d*)?(\.\d*)?$/;
//Format.REGEXP_DECIMAL = /^[+-]?(\d*)?(\.\d*)?$/;
//Format.REGEXP_DECIMAL = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/;
	
Format.toDecimalString = function(value, addComma, digits, roundType) {
	var str = ''+value;
//	if (str.length == 0) str = '0';
	if (str.length == 0) str = "";
	str = str.replace(/\,/g,'');
	
	if (Format.REGEXP_DECIMAL.test(str)) {
		if($.trim(str)=='')
			return '';
		//解析符号、整数部分和小数部分
		var sign = str.charAt(0);
		if (sign == '+' || sign == '-') {
			str = str.substring(1);
		} else {
			sign = null;
		}
		var pointPos = str.indexOf('.');
		var integer = str;
		var decimal = '';
		if (pointPos >= 0) {
			integer = str.substring(0, pointPos);
			decimal = str.substring(pointPos+1);
		}
		while (integer.charAt(0) == '0') {
			integer = integer.substring(1);
		}
		if ((!typeof digits =='number'&& digits >= 0)&& (pointPos < 0 || pointPos+1 == str.length)) {
			digits = 0;
		}
		if (integer.length == 0) integer = '0';
		if (decimal.length == 0) decimal = '0';
		if(!digits)
			var digits = 2;
		//小数和四舍五入
		if (digits&&typeof digits =='number' && digits >= 0) {
			while (decimal.length < digits) {
				decimal += '0';
			}
			var nextNumber = decimal.charAt(digits);
			decimal = decimal.substr(0, digits);
			if (parseInt(nextNumber) >= 5) {
				var tmp = Math.pow(10, digits);
				var newValue = (sign ? sign : '') + (parseInt(integer,10) * tmp + parseInt(decimal,10) + 1) / tmp;
				return this.toDecimalString(newValue, addComma, digits, roundType);
			}
		}
		//加逗号
		if (addComma) {
			var sb = '';
			for (var i=0, len=integer.length; i<len; i++) {
				sb += integer.charAt(i);
				if ((i+1) % 3 == len % 3 && (i+1) != len) {
					sb += ',';
				}
			}
			integer = sb;
		}
		//拼合
		var res = '';
		if (sign) res += sign;
		res += integer;
		if (decimal) res += '.' + decimal;
		return res;
	} else {
		return null;
	}
};
Format.toDecimalString2 = function(value, addComma, digits, roundType) {
	var str = ''+value;
//	if (str.length == 0) str = '0';
	if (str.length == 0) str = "";
	str = str.replace(/\,/g,'');
	
	if (Format.REGEXP_DECIMAL.test(str)) {
		if($.trim(str)=='')
			return '';
		//解析符号、整数部分和小数部分
		var sign = str.charAt(0);
		if (sign == '+' || sign == '-') {
			str = str.substring(1);
		} else {
			sign = null;
		}
		var pointPos = str.indexOf('.');
		var integer = str;
		var decimal = '';
		if (pointPos >= 0) {
			integer = str.substring(0, pointPos);
			decimal = str.substring(pointPos+1);
		}
		while (integer.charAt(0) == '0') {
			integer = integer.substring(1);
		}
		if ((!typeof digits =='number'&& digits >= 0)&& (pointPos < 0 || pointPos+1 == str.length)) {
			digits = 0;
		}
		if (integer.length == 0) integer = '0';
		if (decimal.length == 0) decimal = '0';
		if(!digits)
			var digits = 2;
		//小数和四舍五入
		if (digits&&typeof digits =='number' && digits >= 0) {
			while (decimal.length < digits) {
				decimal += '0';
			}
			var nextNumber = decimal.charAt(digits);
			decimal = decimal.substr(0, digits);
			if (parseInt(nextNumber) >= 5) {
				var tmp = Math.pow(10, digits);
				var newValue = (sign ? sign : '') + (parseInt(integer,10) * tmp + parseInt(decimal,10) + 1) / tmp;
				return this.toDecimalString(newValue, addComma, digits, roundType);
			}
		}
//		//加逗号
//		if (addComma) {
//			var sb = '';
//			for (var i=0, len=integer.length; i<len; i++) {
//				sb += integer.charAt(i);
//				if ((i+1) % 3 == len % 3 && (i+1) != len) {
//					sb += ',';
//				}
//			}
//			integer = sb;
//		}
		//拼合
		var res = '';
		if (sign) res += sign;
		res += integer;
		if (decimal) res += '.' + decimal;
		return res;
	} else {
		return null;
	}
};


Format.MONEY_NUMS = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); 
Format.MONEY_DIGITS = new Array("", "拾", "佰", "仟"); 
Format.MONEY_BIGUNITS = new Array("", "万", "亿", "万亿","仟兆");
Format.MONEY_SHOWNAME = new Array("分", "角", "元");
Format.MONEY_POSTFIX = "整";

Format.toChineseCurrency = function(value) {
	if (Format.REGEXP_DECIMAL.test(value)) {
		if (value == null || value == '') {
			return '';
		}
		var noCommaCash = this.toDecimalString(value);
		
		var dotIndex = noCommaCash.indexOf('.');
		var integer, decimal;
		if (dotIndex == -1) {
			integer = noCommaCash;
			decimal = '00';
		} else {
			integer = noCommaCash.substring( 0, dotIndex );
			decimal = noCommaCash.substring( dotIndex + 1 );
		}
		var result = "";
		if(integer == '0'){
			if(decimal=='00'){
				result = Format.MONEY_NUMS[0]+Format.MONEY_SHOWNAME[2]+Format.MONEY_POSTFIX;
			}else{
				result = Format._convertDecimalToChineseCash(decimal);
			}
			return result;
		}
		else{
			result += Format._convertIntegerToChineseCash(integer);
			result += Format._convertDecimalToChineseCash(decimal);
			return result;
		}
	}else{
		return '';
	}
};

/**
* 整数部分转换为中文金额表示
* @param {string} cash 要转换的金额字符串
* @returns {string} 转换后的金额字符串
*/
Format._convertIntegerToChineseCash = function(cash){
	if ( cash == "0" ) return "";
//		return Format.MONEY_NUMS[0]+Format.MONEY_SHOWNAME[2];
	var S = ""; //返回值 
	var p = 0; //字符位置指针 
	var m = cash.length % 4; //取模 
	
	// 四位一组得到组数 
	var k = (m > 0 ? Math.floor(cash.length / 4) + 1 : Math.floor(cash.length / 4)); 
	// 外层循环在所有组中循环 
	// 从左到右 高位到低位 四位一组 逐组处理 
	// 每组最后加上一个单位: "[万亿]","[亿]","[万]" 
	for (var i = k; i > 0; i--) 
	{
	    var L = 4; 
	    if (i == k && m != 0)
	    {
	        L = m;
	    }
	    // 得到一组四位数 最高位组有可能不足四位 
	    var s = cash.substring(p, p + L);
	    var l = s.length;
	
	    // 内层循环在该组中的每一位数上循环 从左到右 高位到低位 
	    for (var j = 0;j < l;j++)
	    {
	        var n = parseInt(s.substring(j, j+1));
	        if (n == 0)
	        {
	            if ((j < l - 1) && (parseInt(s.substring(j + 1, j + 1+ 1)) > 0) //后一位(右低) 
	                && S.substring(S.length-1,S.length) != Format.MONEY_NUMS[n])
	            {
	                S += Format.MONEY_NUMS[n];
	            }
	        }
	        else 
	        {
	            //处理 1013 一千零"十三", 1113 一千一百"一十三" 
	            if (!(n == 1 && (S.substring(S.length-1,S.length) == Format.MONEY_NUMS[0] | S.length == 0) && j == l - 2)) 
	            {
	                S += Format.MONEY_NUMS[n];
	            }
	            S +=  Format.MONEY_DIGITS[l - j - 1];
	        }
	    }
	    p += L;
	    // 每组最后加上一个单位: [万],[亿] 等 
		if (i < k) {
			//不是最高位的一组 
			if (parseInt(s)!= 0){
	            //如果所有 4 位不全是 0 则加上单位 [万],[亿] 等 
	            S += Format.MONEY_BIGUNITS[i - 1];
	        }
	    }else{
	        //处理最高位的一组,最后必须加上单位 
	        S += Format.MONEY_BIGUNITS[i - 1];
	    }
	}
	return S+Format.MONEY_SHOWNAME[2];
};

/**
* 小数部分转换为中文金额表示
* @param {string} cash 要转换的金额字符串
* @returns {string} 转换后的金额字符串
*/
Format._convertDecimalToChineseCash = function( cash ){
	var returnCash = "";
//	var returnCash = Format.MONEY_NUMS[0]
	if ( cash == "00" ){
		returnCash = Format.MONEY_POSTFIX;
	}else {
		for( var i = 0;i < cash.length; i++ ){
			if( i >= 2 ){break;}
			var intValue = parseInt(cash.charAt(i));
			switch( i ) {
				case 0:{
					if ( intValue != 0 ){
						returnCash += Format.MONEY_NUMS[intValue]+Format.MONEY_SHOWNAME[1];
					}
					break;
				}
				case 1:{
					if(intValue!=0){
						returnCash += Format.MONEY_NUMS[intValue]+Format.MONEY_SHOWNAME[0];
					}
					break;
				}
				default:
					break;
			}
		}
	}
	return returnCash;	
};



Format.REGEXP_DATE = new RegExp(/(yyyy|MM|dd|hh|mm|ss|S)/g);

Format.DATE_FORMAT_PARSER = {
		
	'yyyy' : { 
		formatter : function(date) {
			return date.getFullYear(); 
		},
		parser : function(date, src, pos) {
			var y = Format._getNextNumber(src, pos, 4);
	//		console.log('yyyy:'+y);
			date.setFullYear(parseInt(y, 10));
			return y.length - 4;
		}
	}, 'MM' : { 
		formatter : function(date) {
			return (date.getMonth() + 1).toString().leftPadZero(2);
		},
		parser : function(date, src, pos) {
			var m = Format._getNextNumber(src, pos, 2);
	//		console.log('MM:'+m);
			date.setMonth(parseInt(m, 10)-1);
			return m.length - 2;
		}
	}, 'dd' : { 
		formatter : function(date) {
			return date.getDate().toString().leftPadZero(2);
		},
		parser : function(date, src, pos) {
			var d = Format._getNextNumber(src, pos, 2);
	//		console.log('dd:'+d);
			date.setDate(parseInt(d, 10));
			return d.length - 2;
		}
	}, 'hh' : { 
		formatter : function(date) {
			return date.getHours().toString().leftPadZero(2);
		},
		parser : function(date, src, pos) {
			var h = Format._getNextNumber(src, pos, 2);
	//		console.log('hh:'+h);
			date.setHours(parseInt(h, 10));
			return h.length - 2;
		}
	}, 'mm' : { 
		formatter : function(date) {
			return date.getMinutes().toString().leftPadZero(2);
		},
		parser : function(date, src, pos) {
			var m = Format._getNextNumber(src, pos, 2);
	//		console.log('mm:'+m);
			date.setMinutes(parseInt(m, 10));
			return m.length - 2;
		}
	}, 'ss' : { 
		formatter : function(date) {
			return date.getSeconds().toString().leftPadZero(2);
		},
		parser : function(date, src, pos) {
			var s = Format._getNextNumber(src, pos, 2);
			date.setSeconds(parseInt(s, 10));
	//		console.log('ss:'+s);
			return s.length - 2;
		}
	}, 'S' : { 
		formatter : function(date) {
			return date.getMilliseconds().toString().leftPadZero(3);
		},
		parser : function(date, src, pos) {
			var s = Format._getNextNumber(src, pos, 3);
			date.setMilliseconds(parseInt(s, 10));
			return s.length - 3;
		}
	}
};
	

Format._getNextNumber = function(src, pos, maxLength) {
	
	var tmp = src.substr(pos, maxLength);
	for (var i=0, len=tmp.length; i<len; i++) {
		if ('0123456789'.indexOf(tmp.charAt(i))== -1) {
			return tmp.substr(0, i);
		}
	}
	return tmp;
};

Format.toDateString = function(date, format) {
	try {
		return format.replace(Format.REGEXP_DATE, function(pattern){
			if (Format.DATE_FORMAT_PARSER[pattern])
				return Format.DATE_FORMAT_PARSER[pattern].formatter(date);
			else
				return pattern;
		});
	} catch (e) {return 'Invalid Date leaded to \n'+ e; }
	return null;
};

Format.parseDate = function(value, format) {
	
	try {
		var date = new Date(1970, 0, 1, 0, 0, 0, 0);
	
		var regexp = new RegExp('yyyy|MM|dd|hh|mm|ss', 'g');
		var shift = 0;
		var result;
		while((result = regexp.exec(format)) != null) {
			var pattern = result[0];
			var position = result.index + shift;
			if (Format.DATE_FORMAT_PARSER[pattern])
				shift += Format.DATE_FORMAT_PARSER[pattern].parser(date, value, position);
		}
			
		// 加上result为空的判断,为了解决传入的字符串格式不正确的问题
		// IE下用isNaN来判断，其它浏览器通过Invalid Date来判断
		// Updated by zhuding@yuchengtech on 2011-2-28
		if (date == "Invalid Date" || isNaN(date))
			return null;
		
		return date;
	} catch (e) {}
	return null;
};



/**
 * 字符串左补0到指定位数
 * @param {int} width
 * @returns {string} 
 */
String.prototype.leftPadZero = function(width) {
	var pad = width - this.length;
	if (pad > 0) {
		return ("0".times(pad) + this); 
	} else {
		return this;
	}
};
String.prototype.times = function(count){
    return count < 1 ? '' : new Array(count + 1).join(this);
}

/**
 * 四舍五入保留位数
 * @param {float} amtValue 要转换的数字
 * @param {int} widthl 保留位数
 * @returns {string} 
 */
Format.toRetentionDigit = function(amtValue, widthl){
	//四舍五入计算出转换后的数字
	var amt_value = amtValue;
	var l = 1;
	for (var i = 0; i < widthl; i++) {
		amt_value *= 10;
		l *= 10;
	}
	amt_value = Math.round(amt_value) / l;
	var amt_sValue = amt_value.toString();
	//位数不够填充0
	var amt_sValue = amt_value.toString()
	var dotPosition = amt_sValue.indexOf('.');
	if(dotPosition<0 && widthl>0){
		dotPosition = amt_sValue.length;
		amt_sValue +='.';
	}
	while(amt_sValue.length<=dotPosition+widthl){
		amt_sValue +='0';
	}
	return amt_sValue;
};

return Format;
});
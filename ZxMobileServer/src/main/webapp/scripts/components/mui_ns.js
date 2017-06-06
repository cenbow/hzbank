//公共变量
/**
 * Created by wangjm
 */
define(function(){	
	var NS = window.NS = {};// 事件
	NS.MSG = {
		MsgMustInput : "请输入{0}！",
		MsgSelect : "请选择{0}！",
		MsgMinLength : "{0}长度不能小于{1}位！",
		MsgMaxLength : "{0}长度不能超过{1}位！",
		MsgMustInputAll : "{0}必须输入{1}位！",
		MsgMinValue : "{0}不能小于{1}！",
		MsgMaxValue : "{0}不能大于{1}！",
		MsgMoney : "{0}必须大于0！",
		MsgInteger : "{0}必须是数字！",
		MsgUserName : "{0}必须是6-20位！",
		MsgPassword : "{0}必须是6-16位！",
		MsgNumber : "{0}必须是整数！",
		MsgPhone : "{0}必须输入正确的11位手机号码！",
	    MsgZipCode : "{0}必须输入6位数字！", //邮政编码验证
		MsgStr : "{0}不能包含特殊字符！",
		MsgIntegerOrStr : "{0}必须是字母或数字！",
		MsgIntegerAndStr : "{0}必须是字母和数字！",
		MsgEnglish : "{0}必須是字母！",
		MsgChina : "{0}必須是汉字！",
		MsgDecimal : "{0}最多可输入4位小数！",
		MsgAjaxError:"系统繁忙，资金类交易请及时核对账户信息",
	};
	NS.EVT_NAME = {
		QUERY : "查询",
		OK : "确定",
		BACK : "返回",
		CANCLE : "取消"
	};
	NS.EVT = {
			TOUCH_START : "touchstart",
			TOUCH_MOVE : "touchmove",
			TOUCH_END : "touchend"
	};
	                       
	//杭州银行联行号
	NS.HZBANK_UNION_BANKNO = [
	                         {key:'1', text:"313331000014"}
	                       ];

	//基金理财风险等级
	NS.PB_FUND_CUST_RISK = [
                            	   {key:'0', text:"未评定"},
	                               {key:'1', text:"保守型"},
	                               {key:'2', text:"稳健型"},
	                               {key:'3', text:"平衡型"},
	                               {key:'4', text:"成长型"},
	                               {key:'5', text:"进取型"}
	                               ];

	//来钱宝
	NS.PB_FINANCE_BALANCE = [
	                                {key:'1', text:"HZ000009"},
	                                {key:'2', text:"幸福添利 • 易方达"},//幸福添利 • 易方达
	                                {key:'3', text:"HZ001386"},
	                                {key:'4', text:"幸福添利 • 天弘"}
	                                  ];
	//博时基金
	NS.PB_BOSERA = [
                             {key:'1', text:"000730"},
                             {key:'2', text:"幸福添利"},//幸福添利 • 博时
                             {key:'3', text:"000929"},
                             {key:'4', text:"幸福如金"}
                               ];
	
	//短信验证码有效时间
	NS.VERIFYSMS_VALID_TIME = [
	                                  {key:'1', text:"60"}
	                                  ];

	NS.PB_FEEDBACK_MANAGERINFO = [
	                         {key:'1', text:"1|001|胡振海|技术经理|zhoulian@hzbank.com.cn"},
	                         {key:'2', text:"2|002|张晓科|产品经理|zhangxiaoke@hzbank.com.cn"}
	                       ];
	
	//幸福乐存 首页利率展示data : [1'一日',7'七日',3'三个月',6'六个月','一年  12',,'两年  24''三年36','五年  60'   100 银行活期利率]
	NS.PB_DEPOSIT_RATE = [
		                      {key:'1', text:"0.960"},
		                      {key:'7', text:"1.620"},
		                      {key:'3', text:"2.520"},
		                      {key:'6', text:"2.760"},
	                          {key:'12', text:"3.000"},
	                          {key:'24', text:"3.720"},
	                          {key:'36', text:"4.500"},
	                          {key:'60', text:"4.900"},
	                          {key:'100', text:"0.350"},
	                       ];
	//幸福乐存存款额度    
	NS.PB_DEPOSIT_LMT = [
	                      {key:'1', text:"1000"},
	                      ];
	
	//机构代码    
	NS.ORG_CODE = [
	                      {key:'hzbank', text:"313331000014"},
	                      ];
	//相关职业
	NS.PB_JOB_B = [
	             {value:"1",text:"负责人"},
	             {value:"2",text:"专业技术人员"},
	             {value:"3",text:"财务人员"},
	             {value:"4",text:"办事人员"},
	             {value:"5",text:"生产操作人员"},
	             {value:"9",text:"其他"},
	             ];
	
	//相关职业类型
	NS.PB_JOB_A = [
	             {value:"A",text:"国家机关、党群组织、事业单位",children:NS.PB_JOB_B},
	             {value:"B",text:"工业生产、运输设备",children:NS.PB_JOB_B},
	             {value:"C",text:"商业、服务业、贸易",children:NS.PB_JOB_B},
	             {value:"D",text:"科研、文化、卫生、教育、法律",children:NS.PB_JOB_B},
	             {value:"E",text:"金融、电力 、电信、邮政",children:NS.PB_JOB_B},
	             {value:"F",text:"农、林、牧、渔、水利业",children:NS.PB_JOB_B},
	             {value:"G",text:"学生",children:NS.PB_JOB_B},
	             {value:"H",text:"离退休",children:NS.PB_JOB_B},
	             {value:"I",text:"军人",children:NS.PB_JOB_B},
	             {value:"J",text:"个体/自由职业者",children:NS.PB_JOB_B},
	             {value:"Z",text:"其他",children:NS.PB_JOB_B},
	             ];
	
	//城市列表  
	NS.PB_CITYLIST = [
	                     	{cityName:"北京", cityId:"1", cityZipCode:"110000", cityCode:"131"},
	                     	{cityName:"上海", cityId:"2", cityZipCode:"310000", cityCode:"289"},
	                     	{cityName:"深圳", cityId:"6", cityZipCode:"440300", cityCode:"340"},
	                     	{cityName:"南京", cityId:"84", cityZipCode:"320100", cityCode:"315"},
	                     	{cityName:"合肥", cityId:"98", cityZipCode:"340100", cityCode:"127"},
	                     	{cityName:"杭州", cityId:"74", cityZipCode:"330100", cityCode:"179"},
	                     	{cityName:"宁波", cityId:"75", cityZipCode:"330200", cityCode:"180"},
	                     	{cityName:"绍兴", cityId:"187", cityZipCode:"330600", cityCode:"293"},
	                     	{cityName:"舟山", cityId:"267", cityZipCode:"330900", cityCode:"245"},
	                     	{cityName:"金华", cityId:"77", cityZipCode:"330700", cityCode:"333"},
	                     	{cityName:"衢州", cityId:"188", cityZipCode:"330800", cityCode:"243"},
	                     	{cityName:"嘉兴", cityId:"189", cityZipCode:"330400", cityCode:"334"},
	                     	{cityName:"丽水", cityId:"130", cityZipCode:"331100", cityCode:"292"},
	                     	{cityName:"温州", cityId:"76", cityZipCode:"330300", cityCode:"178"},
	                      ];
	
	//银行列表
	NS.PB_BANKLIST = [
	                     {bankName:"中国工商银行", orgCode2:"01020000", ico:"bnk-0001"},
	                     {bankName:"中国农业银行", orgCode2:"01030000", ico:"bnk-0002"},
	                     {bankName:"中国银行", orgCode2:"01040000", ico:"bnk-0009"},
	                     {bankName:"中国建设银行", orgCode2:"01050000", ico:"bnk-0004"},
	                     {bankName:"杭州银行", orgCode2:"04233310", ico:"bnk-0110"},
	                    /* {bankName:"中国邮政储蓄银行", orgCode2:"01000000", ico:"bnk-0006"},*/
	                     {bankName:"中信银行", orgCode2:"03020000", ico:"bnk-0005"},
	                     {bankName:"中国光大银行", orgCode2:"03030000", ico:"bnk-0008"},
	                     {bankName:"交通银行", orgCode2:"03010000", ico:"bnk-0014"},
	                     {bankName:"浦发银行", orgCode2:"03100000", ico:"bnk-0011"},
	                   /*  {bankName:"北京银行", orgCode2:"04031000", ico:"bnk-0015"},*/
	                     {bankName:"上海银行", orgCode2:"04010000", ico:"bnk-0024"}
	                     /*{bankName:"平安银行", orgCode2:"03070010", ico:"bnk-0077"}*/
	                 ];
	
    return NS;});

package com.ycnet.mirage.zx.config;

/**
 * 错误码与错误信息对照表
 * @author lingal
 *
 */
public interface MobileApplicationErrorCode {
	
	/**
	 * 交易异常，与服务器通讯异常
	 */
	public static String CONNECT_SERVER_ERROR = "100003";
	
	/**
	 * 交易失败，用户session登录超时
	 */
	public static String SESSION_TIME_OUT = "100004";
	
	/**
	 * 交易失败,{0}
	 */
	public static String TRAN_FAIL_ERROR = "200003";
	
	/**
	 * 交易失败，用户已在其他位置登录
	 */
	public static String USER_OTHER_LOGIN = "100005";
	
	/**
	 * 无法获取验证码，请检查网络
	 */
	public static String GEN_IMAGECODE_ERROR = "100007";
	
	/**
	 * 验证超时，请重新获取验证码
	 */
	public static String IMAGE_CODE_TIME_OUT = "100008";
	
	/**
	 * 验证失败，输入的验证码有误
	 */
	public static String IMAGE_CODE_ERROR = "100009";
	
	/**
	 * 交易失败，伪造交易数据
	 */
	public static String TRAN_DATA_ERROR = "010001";
	
	/**
	 * 交易失败，交易只支持{0}方式请求
	 */
	public static String REQUEST_METHOD_NOT_SUPPORT = "200001";
	
	/**
	 * 交易失败，交易只支持{0}格式数据
	 */
	public static String REQUEST_DATA_NOT_SUPPORT = "200002";
	
	/**
	 * 获取本地照片失败
	 */
	public static String PHOTOT_NOT_FOUND = "200004";
	
	/**
	 * 不是杭州银行二维码
	 */
	public static String NOT_HZBANK_BARCODE = "300001";
	
	/**
	 * 上传影像服务器失败
	 */
	public static String UPLOAD_IMG_FAILED = "300002";
	
	/**
	 * 身份证照片为空
	 */
	public static String UPLOAD_IMG_EMPTY = "300003";
	
	/**
	 * 身份证照已备份
	 */
	public static String IDENTITY_EXIST = "300004";
}

package com.ycnet.mirage.zx.detail;

import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 用户登录参数接收类
 * @author lingal
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserSignInDetail extends ClientInfoDetail{
	
	private static Format format = new SimpleDateFormat("yyyyMMddHHmmssSSS");
	
	//客户号
	private String customerId;
	
	//密码随机数key
	private String pwdkey;
	
	//密码
	private String password;
	
	private String appKey;
	
	//验证码
	private String checkCode;
	
	//语种
	private String logonLanguage = "ZH_CN";
	
	//用户类型
	private String userType = "10";
	
	private String netType = "0";
	
	//登录方式
	private String logonType = "0";
	
	//验证码key
	private String imageCodeKey;
	
	//验证码
	private String imageCode;
	
	//时间戳
	private String submitTimeStamp = format.format(new Date());
	
	public String getPwdkey() {
		return pwdkey;
	}

	public void setPwdkey(String pwdkey) {
		this.pwdkey = pwdkey;
	}

	public String getCheckCode() {
		return checkCode;
	}

	public void setCheckCode(String checkCode) {
		this.checkCode = checkCode;
	}

	public String getLogonLanguage() {
		return logonLanguage;
	}

	public void setLogonLanguage(String logonLanguage) {
		this.logonLanguage = logonLanguage;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getNetType() {
		return netType;
	}

	public void setNetType(String netType) {
		this.netType = netType;
	}

	public String getLogonType() {
		return logonType;
	}

	public void setLogonType(String logonType) {
		this.logonType = logonType;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getSubmitTimeStamp() {
		return submitTimeStamp;
	}

	public void setSubmitTimeStamp(String submitTimeStamp) {
		this.submitTimeStamp = submitTimeStamp;
	}

	public String getAppKey() {
		return appKey;
	}

	public void setAppKey(String appKey) {
		this.appKey = appKey;
	}

	public String getImageCodeKey() {
		return imageCodeKey;
	}

	public void setImageCodeKey(String imageCodeKey) {
		this.imageCodeKey = imageCodeKey;
	}

	public String getImageCode() {
		return imageCode;
	}

	public void setImageCode(String imageCode) {
		this.imageCode = imageCode;
	}
	
}

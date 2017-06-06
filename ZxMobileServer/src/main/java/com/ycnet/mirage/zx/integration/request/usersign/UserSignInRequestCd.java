package com.ycnet.mirage.zx.integration.request.usersign;
import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.integration.request.ClientInfoRequestCommon;

public class UserSignInRequestCd extends ClientInfoRequestCommon{
	
	//密码随机数key
	private String pwdkey;
	
	//验证码
	private String checkCode;
	
	//语种
	private String logonLanguage;
	
	//密码
	private String password;
	
	//用户类型
	private String userType;
	
	private String netType;
	
	//登录方式
	private String logonType;
	
	//客户号
	private String customerId;
	
	//时间戳
	private String submitTimeStamp;
	
	private String appKey;
	
	public UserSignInRequestCd(){
		
	}
	
	public UserSignInRequestCd(ClientInfoDetail detail){
		super(detail);
	}

	public UserSignInRequestCd(SessionTokenDetail detail){
		super(detail);
	}
	
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
	
}

package com.ycnet.mirage.zx.integration.request.register;

import javax.xml.bind.annotation.XmlElement;

import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.integration.request.ClientInfoRequestCommon;

public class MobRegisterStep3RequestCd extends ClientInfoRequestCommon{
	
	private String certNo;
	
	private String userName;
	
	private String payPwd;
	
	private String customerEmail;
	
	private String mobileNo;
	
	private String customerAlias;
	
	private String random;
	
	private String pwdkey;

	private String cardType;
	
	private String isFaceCheck;
	
	private String pwdLogin;
	
	private String password;
	
	private String grayFlag;
	
	public MobRegisterStep3RequestCd(){
		
	}
	
	public MobRegisterStep3RequestCd(ClientInfoDetail detail){
		super(detail);
	}

	public MobRegisterStep3RequestCd(SessionTokenDetail detail){
		super(detail);
	}
	
	public String getCertNo() {
		return certNo;
	}

	public void setCertNo(String certNo) {
		this.certNo = certNo;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPayPwd() {
		return payPwd;
	}

	public void setPayPwd(String payPwd) {
		this.payPwd = payPwd;
	}
	
	public String getCustomerEmail() {
		return customerEmail;
	}

	public void setCustomerEmail(String customerEmail) {
		this.customerEmail = customerEmail;
	}

	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public String getCustomerAlias() {
		return customerAlias;
	}

	public void setCustomerAlias(String customerAlias) {
		this.customerAlias = customerAlias;
	}

	public String getRandom() {
		return random;
	}

	public void setRandom(String random) {
		this.random = random;
	}

	public String getPwdkey() {
		return pwdkey;
	}

	public void setPwdkey(String pwdkey) {
		this.pwdkey = pwdkey;
	}

	public String getCardType() {
		return cardType;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
	}

	/**
	 * @return the isFaceCheck
	 */
	public String getIsFaceCheck() {
		return isFaceCheck;
	}

	/**
	 * @param isFaceCheck the isFaceCheck to set
	 */
	public void setIsFaceCheck(String isFaceCheck) {
		this.isFaceCheck = isFaceCheck;
	}

	public String getPwdLogin() {
		return pwdLogin;
	}

	public void setPwdLogin(String pwdLogin) {
		this.pwdLogin = pwdLogin;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getGrayFlag() {
		return grayFlag;
	}

	public void setGrayFlag(String grayFlag) {
		this.grayFlag = grayFlag;
	}
	
	
	
}

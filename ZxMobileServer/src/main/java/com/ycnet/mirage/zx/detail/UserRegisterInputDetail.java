package com.ycnet.mirage.zx.detail;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 用户注册参数接收类
 * @author lingal
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserRegisterInputDetail extends ClientInfoDetail{
	
	private String customerAlias;
	
	private String password;
	
	private String mobileNo;
	
	private String vCode;
	
	private String vBasis;
	
	private String pwdkey;
	
	private String userName;
	
	private String certNo;
	
	private String cardNo;
	
	private String cardType;
	
	private String bindCardNo;
	
	private String bankName;
	
	private String bankType;
	
	private String payPwd;
	
	private String random;
	
	private String reqNo;
	
	private String custNo;
	
	private String RecommendNum;
	
	private String customerEmail;
	
	private String customerSex;
	
	private String customerBirthday;
	
	private String customerAddress;
	
	private String customerRace;
	
	private String batchNo;
	
	private String pwdLogin;
	
	private String photoBase64;
	
	private String photoBackBase64;
	
	private String orcFlag;
	
	private String organ;
	
	private String validity;
	
	private String profession; //职业信息
	
	@JsonProperty("RecommendNum")
	public String getRecommendNum() {
		return RecommendNum;
	}

	public void setRecommendNum(String recommendNum) {
		RecommendNum = recommendNum;
	}

	public String getCustNo() {
		return custNo;
	}

	public void setCustNo(String custNo) {
		this.custNo = custNo;
	}

	public String getReqNo() {
		return reqNo;
	}

	public void setReqNo(String reqNo) {
		this.reqNo = reqNo;
	}

	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getCardType() {
		return cardType;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
	}

	public String getBindCardNo() {
		return bindCardNo;
	}

	public void setBindCardNo(String bindCardNo) {
		this.bindCardNo = bindCardNo;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getBankType() {
		return bankType;
	}

	public void setBankType(String bankType) {
		this.bankType = bankType;
	}

	public String getPayPwd() {
		return payPwd;
	}

	public void setPayPwd(String payPwd) {
		this.payPwd = payPwd;
	}

	public String getRandom() {
		return random;
	}

	public void setRandom(String random) {
		this.random = random;
	}

	public String getCustomerAlias() {
		return customerAlias;
	}

	public void setCustomerAlias(String customerAlias) {
		this.customerAlias = customerAlias;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public String getvCode() {
		return vCode;
	}

	public void setvCode(String vCode) {
		this.vCode = vCode;
	}

	public String getvBasis() {
		return vBasis;
	}

	public void setvBasis(String vBasis) {
		this.vBasis = vBasis;
	}

	public String getPwdkey() {
		return pwdkey;
	}

	public void setPwdkey(String pwdkey) {
		this.pwdkey = pwdkey;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getCertNo() {
		return certNo;
	}

	public void setCertNo(String certNo) {
		this.certNo = certNo;
	}

	public String getCustomerEmail() {
		return customerEmail;
	}

	public void setCustomerEmail(String customerEmail) {
		this.customerEmail = customerEmail;
	}

	public String getCustomerSex() {
		return customerSex;
	}

	public void setCustomerSex(String customerSex) {
		this.customerSex = customerSex;
	}

	public String getCustomerBirthday() {
		return customerBirthday;
	}

	public void setCustomerBirthday(String customerBirthday) {
		this.customerBirthday = customerBirthday;
	}

	public String getCustomerAddress() {
		return customerAddress;
	}

	public void setCustomerAddress(String customerAddress) {
		this.customerAddress = customerAddress;
	}

	public String getCustomerRace() {
		return customerRace;
	}

	public void setCustomerRace(String customerRace) {
		this.customerRace = customerRace;
	}

	public String getBatchNo() {
		return batchNo;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}

	public String getPwdLogin() {
		return pwdLogin;
	}

	public void setPwdLogin(String pwdLogin) {
		this.pwdLogin = pwdLogin;
	}

	public String getPhotoBackBase64() {
		return photoBackBase64;
	}

	public void setPhotoBackBase64(String photoBackBase64) {
		this.photoBackBase64 = photoBackBase64;
	}

	public String getPhotoBase64() {
		return photoBase64;
	}

	public void setPhotoBase64(String photoBase64) {
		this.photoBase64 = photoBase64;
	}

	public String getOrcFlag() {
		return orcFlag;
	}

	public void setOrcFlag(String orcFlag) {
		this.orcFlag = orcFlag;
	}

	public String getValidity() {
		return validity;
	}

	public void setValidity(String validity) {
		this.validity = validity;
	}

	public String getOrgan() {
		return organ;
	}

	public void setOrgan(String organ) {
		this.organ = organ;
	}

	public String getProfession() {
		return profession;
	}

	public void setProfession(String profession) {
		this.profession = profession;
	}
	
	
	
}

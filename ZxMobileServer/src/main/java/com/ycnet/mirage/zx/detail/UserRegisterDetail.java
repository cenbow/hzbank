package com.ycnet.mirage.zx.detail;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 用户注册参数接收类
 * @author lingal
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserRegisterDetail extends SessionTokenDetail{
	
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
	
	private String isFaceCheck;
	
	private String people;
	
	private String gender;
	
	private String birth;
	
	private String address;
	
	private String photoBase64;
	
	private String batchNo;
	
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

	public String getPeople() {
		return people;
	}

	public void setPeople(String people) {
		this.people = people;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getBirth() {
		return birth;
	}

	public void setBirth(String birth) {
		this.birth = birth;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPhotoBase64() {
		return photoBase64;
	}

	public void setPhotoBase64(String photoBase64) {
		this.photoBase64 = photoBase64;
	}

	/**
	 * @return the batchNo
	 */
	public String getBatchNo() {
		return batchNo;
	}

	/**
	 * @param batchNo the batchNo to set
	 */
	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}
	
}

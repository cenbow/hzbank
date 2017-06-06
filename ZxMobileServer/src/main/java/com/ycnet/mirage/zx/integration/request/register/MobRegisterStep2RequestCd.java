package com.ycnet.mirage.zx.integration.request.register;
import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.integration.request.ClientInfoRequestCommon;

public class MobRegisterStep2RequestCd extends ClientInfoRequestCommon{
	
	private String certNo;
	
	private String userName;
	
	private String mobileNo;
	
	private String cardType;
	
	private String bindCardNo;
	
	private String bankName;
	
	private String bankType;
	
	private String payPwd;
	
	private String pwdkey;

	private String customerSex;
	
	private String customerBirthday;
	
	private String customerAddress;

	private String customerRace;

	private String batchNo;

	private String cardNo;
	
	private String random;
	
	private String organ;
	
	private String validity;
	
	private String profession; //职业
	
	public String getOrgan() {
		return organ;
	}

	public void setOrgan(String organ) {
		this.organ = organ;
	}

	public String getValidity() {
		return validity;
	}

	public void setValidity(String validity) {
		this.validity = validity;
	}

	public MobRegisterStep2RequestCd(){
		
	}
	
	public MobRegisterStep2RequestCd(ClientInfoDetail detail){
		super(detail);
	}

	public MobRegisterStep2RequestCd(SessionTokenDetail detail){
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

	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
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

	public String getPwdkey() {
		return pwdkey;
	}

	public void setPwdkey(String pwdkey) {
		this.pwdkey = pwdkey;
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

	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getRandom() {
		return random;
	}

	public void setRandom(String random) {
		this.random = random;
	}

	public String getProfession() {
		return profession;
	}

	public void setProfession(String profession) {
		this.profession = profession;
	}

	
}

package com.ycnet.mirage.zx.integration.response.usersign;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserSignInResponseCd {
	
	private String customerId;
	
	private String customerLastLogon;
	
	private String customerLogonCount;
	
	private String pwdModify;
	
	private String pwdMessage;
	
	private String customerNameCN;
	
	private String customerMessage;
	
	private String customerSex;
	
	private String customerAlias;
	
	private String logonFlag;
	
	private String userFlag1;
	
	private String userFlag2;
	
	private String userFlag3;
	
	private String userFlag4;
	
	private String userFlag5;
	
	private String userFlag6;
	
	private String tokenNo;
	
	private String regMobile;
	
	private String appKey;
	
	private String certNo;
	
	private String financeCustomerId;
	
	private String userType;
	
	private String mgrNo;
	
	private String handPwdSwitch;
	
	private List<AccountInfo> iAccountInfo;
	
	private List<CardInfo> iCardInfo; 
	
	private String hasResetPwd;
	//白名单列表
	private List<WhiteList> iWhiteList; 
	
	private String bindCardNo;
	
	private String batchNo;
	
	private String isFace;
	
	public List<AccountInfo> getiAccountInfo() {
		return iAccountInfo;
	}

	public void setiAccountInfo(List<AccountInfo> iAccountInfo) {
		this.iAccountInfo = iAccountInfo;
	}

	public List<CardInfo> getiCardInfo() {
		return iCardInfo;
	}

	public void setiCardInfo(List<CardInfo> iCardInfo) {
		this.iCardInfo = iCardInfo;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getCustomerLastLogon() {
		return customerLastLogon;
	}

	public void setCustomerLastLogon(String customerLastLogon) {
		this.customerLastLogon = customerLastLogon;
	}

	public String getCustomerLogonCount() {
		return customerLogonCount;
	}

	public void setCustomerLogonCount(String customerLogonCount) {
		this.customerLogonCount = customerLogonCount;
	}

	public String getPwdModify() {
		return pwdModify;
	}

	public void setPwdModify(String pwdModify) {
		this.pwdModify = pwdModify;
	}

	public String getPwdMessage() {
		return pwdMessage;
	}

	public void setPwdMessage(String pwdMessage) {
		this.pwdMessage = pwdMessage;
	}

	public String getCustomerNameCN() {
		return customerNameCN;
	}

	public void setCustomerNameCN(String customerNameCN) {
		this.customerNameCN = customerNameCN;
	}

	public String getCustomerMessage() {
		return customerMessage;
	}

	public void setCustomerMessage(String customerMessage) {
		this.customerMessage = customerMessage;
	}

	public String getCustomerSex() {
		return customerSex;
	}

	public void setCustomerSex(String customerSex) {
		this.customerSex = customerSex;
	}

	public String getCustomerAlias() {
		return customerAlias;
	}

	public void setCustomerAlias(String customerAlias) {
		this.customerAlias = customerAlias;
	}

	public String getLogonFlag() {
		return logonFlag;
	}

	public void setLogonFlag(String logonFlag) {
		this.logonFlag = logonFlag;
	}

	public String getUserFlag1() {
		return userFlag1;
	}

	public void setUserFlag1(String userFlag1) {
		this.userFlag1 = userFlag1;
	}

	public String getUserFlag2() {
		return userFlag2;
	}

	public void setUserFlag2(String userFlag2) {
		this.userFlag2 = userFlag2;
	}

	public String getUserFlag3() {
		return userFlag3;
	}

	public void setUserFlag3(String userFlag3) {
		this.userFlag3 = userFlag3;
	}

	public String getUserFlag4() {
		return userFlag4;
	}

	public void setUserFlag4(String userFlag4) {
		this.userFlag4 = userFlag4;
	}

	public String getUserFlag5() {
		return userFlag5;
	}

	public void setUserFlag5(String userFlag5) {
		this.userFlag5 = userFlag5;
	}

	public String getUserFlag6() {
		return userFlag6;
	}

	public void setUserFlag6(String userFlag6) {
		this.userFlag6 = userFlag6;
	}

	public String getTokenNo() {
		return tokenNo;
	}

	public void setTokenNo(String tokenNo) {
		this.tokenNo = tokenNo;
	}

	public String getRegMobile() {
		return regMobile;
	}

	public void setRegMobile(String regMobile) {
		this.regMobile = regMobile;
	}

	public String getAppKey() {
		return appKey;
	}

	public void setAppKey(String appKey) {
		this.appKey = appKey;
	}

	public String getCertNo() {
		return certNo;
	}

	public void setCertNo(String certNo) {
		this.certNo = certNo;
	}

	public String getFinanceCustomerId() {
		return financeCustomerId;
	}

	public void setFinanceCustomerId(String financeCustomerId) {
		this.financeCustomerId = financeCustomerId;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getMgrNo() {
		return mgrNo;
	}

	public void setMgrNo(String mgrNo) {
		this.mgrNo = mgrNo;
	}

	public String getHandPwdSwitch() {
		return handPwdSwitch;
	}

	public void setHandPwdSwitch(String handPwdSwitch) {
		this.handPwdSwitch = handPwdSwitch;
	}

	public String getHasResetPwd() {
		return hasResetPwd;
	}

	public void setHasResetPwd(String hasResetPwd) {
		this.hasResetPwd = hasResetPwd;
	}

	public List<WhiteList> getiWhiteList() {
		return iWhiteList;
	}

	public void setiWhiteList(List<WhiteList> iWhiteList) {
		this.iWhiteList = iWhiteList;
	}

	public String getBindCardNo() {
		return bindCardNo;
	}

	public void setBindCardNo(String bindCardNo) {
		this.bindCardNo = bindCardNo;
	}

	public String getBatchNo() {
		return batchNo;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}

	public String getIsFace() {
		return isFace;
	}

	public void setIsFace(String isFace) {
		this.isFace = isFace;
	}

	
}

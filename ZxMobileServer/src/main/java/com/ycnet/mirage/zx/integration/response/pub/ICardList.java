package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 卡列表信息卡
 * 2015年4月14日17:35:26
 *
 */

@JsonIgnoreProperties(ignoreUnknown = true)
public class ICardList {
	private String certNo;
	
	private String cardNo;
	
	private String bankName;
	
	private String orgCode;
	
	private String cardType;
	
	private String subTime;
	
	private String bandFlag;
	
	private String bankIconUrl;

	private String mobileNo;

	private String singleLimit;

	private String dayLimit;
	
	public String getCertNo() {
		return certNo;
	}

	public void setCertNo(String certNo) {
		this.certNo = certNo;
	}

	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getOrgCode() {
		return orgCode;
	}

	public void setOrgCode(String orgCode) {
		this.orgCode = orgCode;
	}

	public String getCardType() {
		return cardType;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
	}

	public String getSubTime() {
		return subTime;
	}

	public void setSubTime(String subTime) {
		this.subTime = subTime;
	}

	public String getBandFlag() {
		return bandFlag;
	}

	public void setBandFlag(String bandFlag) {
		this.bandFlag = bandFlag;
	}

	public String getBankIconUrl() {
		return bankIconUrl;
	}

	public void setBankIconUrl(String bankIconUrl) {
		this.bankIconUrl = bankIconUrl;
	}

	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public String getSingleLimit() {
		return singleLimit;
	}

	public void setSingleLimit(String singleLimit) {
		this.singleLimit = singleLimit;
	}

	public String getDayLimit() {
		return dayLimit;
	}

	public void setDayLimit(String dayLimit) {
		this.dayLimit = dayLimit;
	}
	
	
}

package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 卡BIN信息
 * @author lisp
 *
 */

@JsonIgnoreProperties(ignoreUnknown = true)
public class ICardBinListInfo {
	private String cardBin; //卡BIN
	private String orgName;	//机构简称
	private String orgCode;	//机构代码
	private String cardType;//卡类型
	private String unionBankNo;//联行号
	private String bankIconUrl;//银行图标样式
	
	public String getCardBin() {
		return cardBin;
	}
	public void setCardBin(String cardBin) {
		this.cardBin = cardBin;
	}
	public String getOrgName() {
		return orgName;
	}
	public void setOrgName(String orgName) {
		this.orgName = orgName;
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
	public String getUnionBankNo() {
		return unionBankNo;
	}
	public void setUnionBankNo(String unionBankNo) {
		this.unionBankNo = unionBankNo;
	}
	public String getBankIconUrl() {
		return bankIconUrl;
	}
	public void setBankIconUrl(String bankIconUrl) {
		this.bankIconUrl = bankIconUrl;
	}
	
	
}

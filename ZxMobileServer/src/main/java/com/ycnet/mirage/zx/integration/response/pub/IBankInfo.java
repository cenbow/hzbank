package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class IBankInfo {

	private String unionBankNo; // 联行号

	private String bankName; // 银行名称
	
	private String initial; // 首字母
	
	private String bankIconUrl; // 银行图标样式

	public String getUnionBankNo() {
		return unionBankNo;
	}

	public void setUnionBankNo(String unionBankNo) {
		this.unionBankNo = unionBankNo;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getInitial() {
		return initial;
	}

	public void setInitial(String initial) {
		this.initial = initial;
	}

	public String getBankIconUrl() {
		return bankIconUrl;
	}

	public void setBankIconUrl(String bankIconUrl) {
		this.bankIconUrl = bankIconUrl;
	}

}

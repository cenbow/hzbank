package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class IBankListInfo {

	private String unionBankNo; // 联行号

	private String bankName; // 银行名称

	private String initial; // 首字母

	private String bankIconUrl; // 银行图标样式

	private String unionBankNo1;

	private String unionBankNo2;
	
	private String hotFlag;

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

	public String getUnionBankNo1() {
		return unionBankNo1;
	}

	public void setUnionBankNo1(String unionBankNo1) {
		this.unionBankNo1 = unionBankNo1;
	}

	public String getUnionBankNo2() {
		return unionBankNo2;
	}

	public void setUnionBankNo2(String unionBankNo2) {
		this.unionBankNo2 = unionBankNo2;
	}

	public String getHotFlag() {
		return hotFlag;
	}

	public void setHotFlag(String hotFlag) {
		this.hotFlag = hotFlag;
	}
	
}

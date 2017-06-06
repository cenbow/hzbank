package com.ycnet.mirage.zx.integration.response.pub;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CheckCardBin_UnionBankNo_ResponseCd {
	private String showNum;
	
	private List<ICardBinListInfo> iCardBinListInfo;

	public String getShowNum() {
		return showNum;
	}

	public void setShowNum(String showNum) {
		this.showNum = showNum;
	}

	public List<ICardBinListInfo> getiCardBinListInfo() {
		return iCardBinListInfo;
	}

	public void setiCardBinListInfo(List<ICardBinListInfo> iCardBinListInfo) {
		this.iCardBinListInfo = iCardBinListInfo;
	}
	
}

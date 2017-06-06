package com.ycnet.mirage.zx.integration.response.pub;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CardBinCheckResponseCd {
	
	private String showNum;
	
	private List<ICardBinListInfo> iCardBinInfo;

	public String getShowNum() {
		return showNum;
	}

	public void setShowNum(String showNum) {
		this.showNum = showNum;
	}

	public List<ICardBinListInfo> getiCardBinInfo() {
		return iCardBinInfo;
	}

	public void setiCardBinInfo(List<ICardBinListInfo> iCardBinInfo) {
		this.iCardBinInfo = iCardBinInfo;
	}
	
}

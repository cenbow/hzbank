package com.ycnet.mirage.zx.integration.response.pub;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BankList_Query_ResponseCd {
	
	private List<IBankListInfo> iBankListInfo;

	public List<IBankListInfo> getiBankListInfo() {
		return iBankListInfo;
	}

	public void setiBankListInfo(List<IBankListInfo> iBankListInfo) {
		this.iBankListInfo = iBankListInfo;
	}

}

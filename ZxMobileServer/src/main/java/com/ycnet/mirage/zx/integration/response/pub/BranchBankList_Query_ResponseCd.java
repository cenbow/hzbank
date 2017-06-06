package com.ycnet.mirage.zx.integration.response.pub;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BranchBankList_Query_ResponseCd {

	private List<IBankInfo> iBankInfo;

	public List<IBankInfo> getiBankInfo() {
		return iBankInfo;
	}

	public void setiBankInfo(List<IBankInfo> iBankInfo) {
		this.iBankInfo = iBankInfo;
	}

}

package com.ycnet.mirage.zx.integration.response.pub;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class QueryPubApppar_ResponseCd {
	private List<IApparList> iApparList;

	public List<IApparList> getiApparList() {
		return iApparList;
	}

	public void setiApparList(List<IApparList> iApparList) {
		this.iApparList = iApparList;
	} 
	
	
}

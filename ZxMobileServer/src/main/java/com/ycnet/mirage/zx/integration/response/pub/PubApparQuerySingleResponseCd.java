package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PubApparQuerySingleResponseCd {
	
	private String aprShowMsg;

	public String getAprShowMsg() {
		return aprShowMsg;
	}

	public void setAprShowMsg(String aprShowMsg) {
		this.aprShowMsg = aprShowMsg;
	}
	
}

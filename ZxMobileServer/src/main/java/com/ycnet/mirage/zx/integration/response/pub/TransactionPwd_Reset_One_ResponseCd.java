package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionPwd_Reset_One_ResponseCd{
	private String random;

	public String getRandom() {
		return random;
	}

	public void setRandom(String random) {
		this.random = random;
	}
	
	

	

}

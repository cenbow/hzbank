package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionPwd_Reset_Two_ResponseCd{
	private String random3;

	public String getRandom3() {
		return random3;
	}

	public void setRandom(String random3) {
		this.random3 = random3;
	}

}

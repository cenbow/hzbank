package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TransPwd_Find_ResponseCd{
	private String random2;

	public String getRandom2() {
		return random2;
	}

	public void setRandom2(String random2) {
		this.random2 = random2;
	}


}

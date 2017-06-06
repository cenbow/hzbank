package com.ycnet.mirage.zx.integration.response.register;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MobRegisterStep2ResponseCd {
		
	private String random;

	private String data;

	private String customerAlias;

	public String getRandom() {
		return random;
	}

	public void setRandom(String random) {
		this.random = random;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getCustomerAlias() {
		return customerAlias;
	}

	public void setCustomerAlias(String customerAlias) {
		this.customerAlias = customerAlias;
	}
	
}

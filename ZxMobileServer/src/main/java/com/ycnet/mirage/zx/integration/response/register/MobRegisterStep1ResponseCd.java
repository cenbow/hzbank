package com.ycnet.mirage.zx.integration.response.register;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MobRegisterStep1ResponseCd {
	
	private String totalNum;

	private String random;
	
	private String orcFlag;

	public String getTotalNum() {
		return totalNum;
	}

	public void setTotalNum(String totalNum) {
		this.totalNum = totalNum;
	}

	public String getRandom() {
		return random;
	}

	public void setRandom(String random) {
		this.random = random;
	}

	public String getOrcFlag() {
		return orcFlag;
	}

	public void setOrcFlag(String orcFlag) {
		this.orcFlag = orcFlag;
	}


}

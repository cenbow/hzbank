package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RegisterStep1ResponseCd {
	
	private String userId;
	
	private String random;
	
	private String vCode;
	
	private String RecommendNum;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getRandom() {
		return random;
	}

	public void setRandom(String random) {
		this.random = random;
	}

	public String getvCode() {
		return vCode;
	}

	public void setvCode(String vCode) {
		this.vCode = vCode;
	}
	
	@JsonProperty("RecommendNum")
	public String getRecommendNum() {
		return RecommendNum;
	}

	public void setRecommendNum(String recommendNum) {
		RecommendNum = recommendNum;
	}
	
}

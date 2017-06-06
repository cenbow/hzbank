package com.ycnet.mirage.zx.integration.response.usersetting;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateRandomNUmResponseCd {
	
	private String RecommendNum;

	@JsonProperty("RecommendNum")
	public String getRecommendNum() {
		return RecommendNum;
	}

	public void setRecommendNum(String recommendNum) {
		RecommendNum = recommendNum;
	}
	
}

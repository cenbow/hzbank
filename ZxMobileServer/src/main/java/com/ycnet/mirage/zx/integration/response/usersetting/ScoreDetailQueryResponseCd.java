package com.ycnet.mirage.zx.integration.response.usersetting;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScoreDetailQueryResponseCd {
	
	private String turnPageTotalNum;
	
	private List<ScoreIndexBak> ScoreIndexBak;

	public String getTurnPageTotalNum() {
		return turnPageTotalNum;
	}

	public void setTurnPageTotalNum(String turnPageTotalNum) {
		this.turnPageTotalNum = turnPageTotalNum;
	}

	@JsonProperty("ScoreIndexBak")
	public List<ScoreIndexBak> getScoreIndexBak() {
		return ScoreIndexBak;
	}

	public void setScoreIndexBak(List<ScoreIndexBak> scoreIndexBak) {
		ScoreIndexBak = scoreIndexBak;
	}
	
}

package com.ycnet.mirage.zx.integration.response.usersetting;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScoreIndexBak {
	
	private String SCD_BSNCODE;
	
	private String SCD_SUBMITTIME;
	
	private String SCD_TRANAMT;
	
	private String SCD_SCORE;
	
	private String SCD_TYPE;

	@JsonProperty("SCD_BSNCODE")
	public String getSCD_BSNCODE() {
		return SCD_BSNCODE;
	}

	public void setSCD_BSNCODE(String sCD_BSNCODE) {
		SCD_BSNCODE = sCD_BSNCODE;
	}

	@JsonProperty("SCD_SUBMITTIME")
	public String getSCD_SUBMITTIME() {
		return SCD_SUBMITTIME;
	}

	public void setSCD_SUBMITTIME(String sCD_SUBMITTIME) {
		SCD_SUBMITTIME = sCD_SUBMITTIME;
	}

	@JsonProperty("SCD_TRANAMT")
	public String getSCD_TRANAMT() {
		return SCD_TRANAMT;
	}

	public void setSCD_TRANAMT(String sCD_TRANAMT) {
		SCD_TRANAMT = sCD_TRANAMT;
	}

	@JsonProperty("SCD_SCORE")
	public String getSCD_SCORE() {
		return SCD_SCORE;
	}

	public void setSCD_SCORE(String sCD_SCORE) {
		SCD_SCORE = sCD_SCORE;
	}

	@JsonProperty("SCD_TYPE")
	public String getSCD_TYPE() {
		return SCD_TYPE;
	}

	public void setSCD_TYPE(String sCD_TYPE) {
		SCD_TYPE = sCD_TYPE;
	}
	
}

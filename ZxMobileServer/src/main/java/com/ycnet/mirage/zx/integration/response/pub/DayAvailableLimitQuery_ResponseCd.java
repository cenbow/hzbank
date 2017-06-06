package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DayAvailableLimitQuery_ResponseCd {

	private String dayAvailableLimit; //日累计剩余限额

	public String getDayAvailableLimit() {
		return dayAvailableLimit;
	}

	public void setDayAvailableLimit(String dayAvailableLimit) {
		this.dayAvailableLimit = dayAvailableLimit;
	}

}

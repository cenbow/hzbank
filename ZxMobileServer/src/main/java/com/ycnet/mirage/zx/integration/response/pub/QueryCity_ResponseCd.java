package com.ycnet.mirage.zx.integration.response.pub;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class QueryCity_ResponseCd {
	private List<ICityInfo> iCityInfo;

	public List<ICityInfo> getiCityInfo() {
		return iCityInfo;
	}

	public void setiCityInfo(List<ICityInfo> iCityInfo) {
		this.iCityInfo = iCityInfo;
	}
}

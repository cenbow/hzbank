package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 城市信息
 * @author lisp
 * 2015年4月14日17:35:26
 *
 */

@JsonIgnoreProperties(ignoreUnknown = true)
public class ICityInfo {
	private String cityCode;
	private String cityName;
	
	
	public String getCityCode() {
		return cityCode;
	}
	public void setCityCode(String cityCode) {
		this.cityCode = cityCode;
	}
	public String getCityName() {
		return cityName;
	}
	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
	
	
}

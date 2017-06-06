package com.ycnet.mirage.zx.integration.response.pub;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class QueryProvince_ResponseCd {
	private List<IProvinceInfo2> iProvinceInfo2;

	public List<IProvinceInfo2> getiProvinceInfo2() {
		return iProvinceInfo2;
	}

	public void setiProvinceInfo2(List<IProvinceInfo2> iProvinceInfo2) {
		this.iProvinceInfo2 = iProvinceInfo2;
	}
	
	
}

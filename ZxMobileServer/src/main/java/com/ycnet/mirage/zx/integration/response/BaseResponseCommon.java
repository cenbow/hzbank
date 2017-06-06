package com.ycnet.mirage.zx.integration.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BaseResponseCommon {
	
	private String repServiceId;
	
	private String repFlowNo;
	
	private String errorCode;
	
	private String errorMessage;

	public String getRepServiceId() {
		return repServiceId;
	}

	public void setRepServiceId(String repServiceId) {
		this.repServiceId = repServiceId;
	}

	public String getRepFlowNo() {
		return repFlowNo;
	}

	public void setRepFlowNo(String repFlowNo) {
		this.repFlowNo = repFlowNo;
	}

	@JsonProperty("ec")
	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	@JsonProperty("em")
	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
}

package com.ycnet.mirage.zx.integration.response.register;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class InviteIdQuery_ResponseCd {
	
	private String inviteCode;

	public String getInviteCode() {
		return inviteCode;
	}

	public void setInviteCode(String inviteCode) {
		this.inviteCode = inviteCode;
	}
	

	
}

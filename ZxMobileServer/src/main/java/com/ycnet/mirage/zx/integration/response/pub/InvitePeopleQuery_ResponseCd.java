package com.ycnet.mirage.zx.integration.response.pub;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class InvitePeopleQuery_ResponseCd {
	
	private List<InvitePeopleList> invitePeopleList;

	private String turnPageTotalNum;
	
	

	public List<InvitePeopleList> getInvitePeopleList() {
		return invitePeopleList;
	}

	public void setInvitePeopleList(List<InvitePeopleList> invitePeopleList) {
		this.invitePeopleList = invitePeopleList;
	}

	public String getTurnPageTotalNum() {
		return turnPageTotalNum;
	}

	public void setTurnPageTotalNum(String turnPageTotalNum) {
		this.turnPageTotalNum = turnPageTotalNum;
	}

	
	
	
	
}

package com.ycnet.mirage.zx.integration.response.pub;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserCardListQueryResponseCd{
	private List<ICardList> iCardList;

	public List<ICardList> getiCardList() {
		return iCardList;
	}

	public void setiCardList(List<ICardList> iCardList) {
		this.iCardList = iCardList;
	}




}

package com.ycnet.mirage.zx.integration.response.usersign;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CardInfo implements Serializable{
	
	private String cardNo;
	
	private String accountType;
	
	private String cardType;
	
	private String cardOpenNode;
	
	private String cardStatus;
	
	private String cardCategory;
	
	private String cardSeries;
	
	private String cardAlias;
	
	private String balance;
	
	private String transferDate;
	
	private String payCardState;
	
	private String cardFlag1;
	
	private String cardFlag2;
	
	private String cardFlag3;
	
	private String cardFlag4;
	
	private String cardFlag5;
	
	private String cardFlag6;

	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getAccountType() {
		return accountType;
	}

	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}

	public String getCardType() {
		return cardType;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
	}

	public String getCardOpenNode() {
		return cardOpenNode;
	}

	public void setCardOpenNode(String cardOpenNode) {
		this.cardOpenNode = cardOpenNode;
	}

	public String getCardStatus() {
		return cardStatus;
	}

	public void setCardStatus(String cardStatus) {
		this.cardStatus = cardStatus;
	}

	public String getCardCategory() {
		return cardCategory;
	}

	public void setCardCategory(String cardCategory) {
		this.cardCategory = cardCategory;
	}

	public String getCardSeries() {
		return cardSeries;
	}

	public void setCardSeries(String cardSeries) {
		this.cardSeries = cardSeries;
	}

	public String getCardAlias() {
		return cardAlias;
	}

	public void setCardAlias(String cardAlias) {
		this.cardAlias = cardAlias;
	}

	public String getBalance() {
		return balance;
	}

	public void setBalance(String balance) {
		this.balance = balance;
	}

	public String getTransferDate() {
		return transferDate;
	}

	public void setTransferDate(String transferDate) {
		this.transferDate = transferDate;
	}

	public String getPayCardState() {
		return payCardState;
	}

	public void setPayCardState(String payCardState) {
		this.payCardState = payCardState;
	}

	public String getCardFlag1() {
		return cardFlag1;
	}

	public void setCardFlag1(String cardFlag1) {
		this.cardFlag1 = cardFlag1;
	}

	public String getCardFlag2() {
		return cardFlag2;
	}

	public void setCardFlag2(String cardFlag2) {
		this.cardFlag2 = cardFlag2;
	}

	public String getCardFlag3() {
		return cardFlag3;
	}

	public void setCardFlag3(String cardFlag3) {
		this.cardFlag3 = cardFlag3;
	}

	public String getCardFlag4() {
		return cardFlag4;
	}

	public void setCardFlag4(String cardFlag4) {
		this.cardFlag4 = cardFlag4;
	}

	public String getCardFlag5() {
		return cardFlag5;
	}

	public void setCardFlag5(String cardFlag5) {
		this.cardFlag5 = cardFlag5;
	}

	public String getCardFlag6() {
		return cardFlag6;
	}

	public void setCardFlag6(String cardFlag6) {
		this.cardFlag6 = cardFlag6;
	}
	
}

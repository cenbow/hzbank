package com.ycnet.mirage.zx.integration.response.usersign;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AccountInfo implements Serializable{
	
	private String session_accountNo;
	
	private String session_accountType;
	
	private String session_accountOpenNode;
	
	private String accountAlias;
	
	private String accountFlag;
	
	private String accountLastUse;
	
	private String accountNote;
	
	private String cardNo;
	
	private String accountState;
	
	private String accountFlag1;
	
	private String accountFlag2;
	
	private String accountFlag3;
	
	private String accountFlag4;
	
	private String accountFlag5;
	
	private String accountFlag6;

	public String getSession_accountNo() {
		return session_accountNo;
	}

	public void setSession_accountNo(String session_accountNo) {
		this.session_accountNo = session_accountNo;
	}

	public String getSession_accountType() {
		return session_accountType;
	}

	public void setSession_accountType(String session_accountType) {
		this.session_accountType = session_accountType;
	}

	public String getSession_accountOpenNode() {
		return session_accountOpenNode;
	}

	public void setSession_accountOpenNode(String session_accountOpenNode) {
		this.session_accountOpenNode = session_accountOpenNode;
	}

	public String getAccountAlias() {
		return accountAlias;
	}

	public void setAccountAlias(String accountAlias) {
		this.accountAlias = accountAlias;
	}

	public String getAccountFlag() {
		return accountFlag;
	}

	public void setAccountFlag(String accountFlag) {
		this.accountFlag = accountFlag;
	}

	public String getAccountLastUse() {
		return accountLastUse;
	}

	public void setAccountLastUse(String accountLastUse) {
		this.accountLastUse = accountLastUse;
	}

	public String getAccountNote() {
		return accountNote;
	}

	public void setAccountNote(String accountNote) {
		this.accountNote = accountNote;
	}

	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getAccountState() {
		return accountState;
	}

	public void setAccountState(String accountState) {
		this.accountState = accountState;
	}

	public String getAccountFlag1() {
		return accountFlag1;
	}

	public void setAccountFlag1(String accountFlag1) {
		this.accountFlag1 = accountFlag1;
	}

	public String getAccountFlag2() {
		return accountFlag2;
	}

	public void setAccountFlag2(String accountFlag2) {
		this.accountFlag2 = accountFlag2;
	}

	public String getAccountFlag3() {
		return accountFlag3;
	}

	public void setAccountFlag3(String accountFlag3) {
		this.accountFlag3 = accountFlag3;
	}

	public String getAccountFlag4() {
		return accountFlag4;
	}

	public void setAccountFlag4(String accountFlag4) {
		this.accountFlag4 = accountFlag4;
	}

	public String getAccountFlag5() {
		return accountFlag5;
	}

	public void setAccountFlag5(String accountFlag5) {
		this.accountFlag5 = accountFlag5;
	}

	public String getAccountFlag6() {
		return accountFlag6;
	}

	public void setAccountFlag6(String accountFlag6) {
		this.accountFlag6 = accountFlag6;
	}
	
}

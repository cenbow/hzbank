package com.ycnet.mirage.zx.integration.response.usersign;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhiteList implements Serializable{
	//白名单功能交易码
	private String whiteBsnCode;
	//白名单功能交易名称
	private String whiteBsnName;
	//白名单功能状态
	private String whiteBsnState;
	//白名单用户手机
	private String whiteMobileNo;
	//白名单用户名
	private String whiteUserName;
	//白名单用户状态
	private String whiteUserState;
	//黑白名单标志
	private String whiteBsnType;
	//开始时间
	private String whiteBeginTime;
	//结束时间
	private String whiteEndTime;

	public String getWhiteBsnCode() {
		return whiteBsnCode;
	}

	public void setWhiteBsnCode(String whiteBsnCode) {
		this.whiteBsnCode = whiteBsnCode;
	}

	public String getWhiteBsnName() {
		return whiteBsnName;
	}

	public void setWhiteBsnName(String whiteBsnName) {
		this.whiteBsnName = whiteBsnName;
	}

	public String getWhiteBsnState() {
		return whiteBsnState;
	}

	public void setWhiteBsnState(String whiteBsnState) {
		this.whiteBsnState = whiteBsnState;
	}

	public String getWhiteMobileNo() {
		return whiteMobileNo;
	}

	public void setWhiteMobileNo(String whiteMobileNo) {
		this.whiteMobileNo = whiteMobileNo;
	}

	public String getWhiteUserName() {
		return whiteUserName;
	}

	public void setWhiteUserName(String whiteUserName) {
		this.whiteUserName = whiteUserName;
	}

	public String getWhiteUserState() {
		return whiteUserState;
	}

	public void setWhiteUserState(String whiteUserState) {
		this.whiteUserState = whiteUserState;
	}

	public String getWhiteBsnType() {
		return whiteBsnType;
	}

	public void setWhiteBsnType(String whiteBsnType) {
		this.whiteBsnType = whiteBsnType;
	}

	public String getWhiteBeginTime() {
		return whiteBeginTime;
	}

	public void setWhiteBeginTime(String whiteBeginTime) {
		this.whiteBeginTime = whiteBeginTime;
	}

	public String getWhiteEndTime() {
		return whiteEndTime;
	}

	public void setWhiteEndTime(String whiteEndTime) {
		this.whiteEndTime = whiteEndTime;
	}
	
}

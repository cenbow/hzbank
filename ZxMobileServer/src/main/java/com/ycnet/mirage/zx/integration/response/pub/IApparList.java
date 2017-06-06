package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 公共参数查询返回集合
 * @author lisp
 * 2015年4月14日16:51:06
 *
 */

@JsonIgnoreProperties(ignoreUnknown = true)
public class IApparList {
	private String aprCode; //参数代码
	private String aprValue;//参数值
	private String aprName;//参数名称
	private String aprLanguage;//语种
	private String aprShowMsg;//参数显示信息
	
	public String getAprCode() {
		return aprCode;
	}
	public void setAprCode(String aprCode) {
		this.aprCode = aprCode;
	}
	public String getAprValue() {
		return aprValue;
	}
	public void setAprValue(String aprValue) {
		this.aprValue = aprValue;
	}
	public String getAprName() {
		return aprName;
	}
	public void setAprName(String aprName) {
		this.aprName = aprName;
	}
	public String getAprLanguage() {
		return aprLanguage;
	}
	public void setAprLanguage(String aprLanguage) {
		this.aprLanguage = aprLanguage;
	}
	public String getAprShowMsg() {
		return aprShowMsg;
	}
	public void setAprShowMsg(String aprShowMsg) {
		this.aprShowMsg = aprShowMsg;
	}
	
	
}

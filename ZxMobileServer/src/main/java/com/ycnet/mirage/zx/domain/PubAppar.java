package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;

import com.ycnet.mirage.domain.DomainImpl;

/**
 * 公共参数配置表
 * @author lingal
 *
 */
@SuppressWarnings("serial")
@Entity
public class PubAppar extends DomainImpl{
	
	//参数名称
	private String name;
	
	//参数编号
	private String code;
	
	//参数值
	private String value;
	
	//所属语种
	private String language;
	
	//参数值展示名称
	private String showMsg;
	
	//所属类型
	private String type;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getShowMsg() {
		return showMsg;
	}

	public void setShowMsg(String showMsg) {
		this.showMsg = showMsg;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
}

package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;

import com.ycnet.mirage.domain.DomainImpl;

/**
 * URL名称绑定关系表
 * @author lingal
 *
 */
@Entity
public class UrlBindName extends DomainImpl{
	
	//页面URL
	private String url;
	
	//名称
	private String name;
	
	//版本
	private String version;

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}
	
}

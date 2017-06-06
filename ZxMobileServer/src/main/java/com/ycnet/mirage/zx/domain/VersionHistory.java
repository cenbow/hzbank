package com.ycnet.mirage.zx.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

import org.hibernate.validator.constraints.NotBlank;

import com.ycnet.mirage.domain.DomainImpl;

@Entity
public class VersionHistory extends DomainImpl{
	
	@NotBlank
	@Column(length = 2)
	private String platform; // 01,iphone;02 ipad;03 android
	
	@NotBlank
	@Column(length = 10)
	private String appversion;
	
	//发布时日 yyyyMMdd
	private String date;
	
	private String updatestate; // 0-不更新；1-强制更新；2-提示非强制更新；
	
	private String staticUpdateStatus; // 0-不更新；1-更新；
	
	
	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getPlatform() {
		return platform;
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}

	public String getAppversion() {
		return appversion;
	}

	public void setAppversion(String appversion) {
		this.appversion = appversion;
	}
	
	public String getUpdatestate() {
		return updatestate;
	}

	public void setUpdatestate(String updatestate) {
		this.updatestate = updatestate;
	}

	/**
	 * @return the staticUpdateStatus
	 */
	public String getStaticUpdateStatus() {
		return staticUpdateStatus;
	}

	/**
	 * @param staticUpdateStatus the staticUpdateStatus to set
	 */
	public void setStaticUpdateStatus(String staticUpdateStatus) {
		this.staticUpdateStatus = staticUpdateStatus;
	}

}

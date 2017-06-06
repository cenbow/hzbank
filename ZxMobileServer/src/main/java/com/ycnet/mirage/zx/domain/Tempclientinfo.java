package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;

import org.hibernate.validator.constraints.NotBlank;

import com.ycnet.mirage.domain.DomainImpl;

/**
 * 临时用户信息存储表
 * @author syh
 *
 */
@Entity
public class Tempclientinfo extends DomainImpl{
	
	private String ipdddress;
	
	private String macaddress;
	
	private String location;
	
	private String platform;
	
	private String sysversion;
	
	private String networktype;
	
	private String mertype;
	
	private String appversion;
	
	private String mobiletype;
	

	public String getIpdddress() {
		return ipdddress;
	}

	public void setIpdddress(String ipdddress) {
		this.ipdddress = ipdddress;
	}

	public String getMacaddress() {
		return macaddress;
	}

	public void setMacaddress(String macaddress) {
		this.macaddress = macaddress;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getPlatform() {
		return platform;
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}

	public String getSysversion() {
		return sysversion;
	}

	public void setSysversion(String sysversion) {
		this.sysversion = sysversion;
	}

	public String getNetworktype() {
		return networktype;
	}

	public void setNetworktype(String networktype) {
		this.networktype = networktype;
	}

	public String getMertype() {
		return mertype;
	}

	public void setMertype(String mertype) {
		this.mertype = mertype;
	}

	public String getAppversion() {
		return appversion;
	}

	public void setAppversion(String appversion) {
		this.appversion = appversion;
	}

	public String getMobiletype() {
		return mobiletype;
	}

	public void setMobiletype(String mobiletype) {
		this.mobiletype = mobiletype;
	}
	
}

package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;

import com.ycnet.mirage.domain.DomainImpl;
import com.ycnet.mirage.domain.annotation.UniqueConstrain;
import com.ycnet.mirage.domain.annotation.UniqueConstrains;

/**
 * 消息推送设备信息表
 * @author xfc
 */
@Entity
public class MsgClientInfo extends DomainImpl{
	
	private static final long serialVersionUID = 1L;

	/**
	 * 个推推送唯一标识
	 */
	private String cId;
	
	/**
	 * 苹果推送设备标识
	 */
	private String token;
	
	/**
	 * 设备唯一号
	 */
	private String macAddress;
	
	/**
	 * 客户号
	 */
	private String customerId;
	
	//客户注册手机号
	private String regMobile;
		
	//ip地址
	private String ipAddress;
		
	//平台类型  01,iphone;02 ipad;03 android
	private String platform;
	
	//操作系统版本
	private String sysVersion;
	
	//网络类型
	private String networkType;
	
	//运营商类型
	private String merType;
	
	//app版本号
	private String appVersion;
	
	//手机型号
	private String mobileType;
	
	//静态资源版本号
	private String staticVersion;

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getRegMobile() {
		return regMobile;
	}

	public void setRegMobile(String regMobile) {
		this.regMobile = regMobile;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getMacAddress() {
		return macAddress;
	}

	public void setMacAddress(String macAddress) {
		this.macAddress = macAddress;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public String getCId() {
		return cId;
	}

	public void setCId(String cId) {
		this.cId = cId;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getPlatform() {
		return platform;
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}

	public String getSysVersion() {
		return sysVersion;
	}

	public void setSysVersion(String sysVersion) {
		this.sysVersion = sysVersion;
	}

	public String getNetworkType() {
		return networkType;
	}

	public void setNetworkType(String networkType) {
		this.networkType = networkType;
	}

	public String getMerType() {
		return merType;
	}

	public void setMerType(String merType) {
		this.merType = merType;
	}

	public String getAppVersion() {
		return appVersion;
	}

	public void setAppVersion(String appVersion) {
		this.appVersion = appVersion;
	}

	public String getMobileType() {
		return mobileType;
	}

	public void setMobileType(String mobileType) {
		this.mobileType = mobileType;
	}

	public String getStaticVersion() {
		return staticVersion;
	}

	public void setStaticVersion(String staticVersion) {
		this.staticVersion = staticVersion;
	}
	
}

package com.ycnet.mirage.zx.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ycnet.mirage.context.MirageException;
import com.ycnet.mirage.utils.MirageUtils;
import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.utils.SpecificalMirageException;

@Entity
public class UserLogonFlowData {
	
	private static Logger logger = LoggerFactory.getLogger(UserLogonFlowData.class);

	@Id
	private String id;
	
	//登录用户名
	private String userName;
	
	//客户号
	private String customerId;
	
	//客户名称
	private String customerName;
	
	//客户注册手机号
	private String regMobile;
	
	//交易开始时间(yyyyMMddHHmmss)
	private String transDate;
	
	//交易结束时间
	private Long timeMilis;
	
	//登录缓存号
	private String sessionToken;
	
	//指令状态 10 可疑 20 成功 30 失败
	private String status;
	
	//ip地址
	private String ipAddress;
	
	//经纬度
	private String location;
	
	//设备编号
	private String macAddress;
	
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
	
	//分辨率
	private String resolution;
	
	//浏览器版本
	private String browserVersion;
	
	//IP地址
	private String clientIp;
	
	private String errorCode;
	
	@Column(length = 4000)
	private String errorMessage;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getRegMobile() {
		return regMobile;
	}

	public void setRegMobile(String regMobile) {
		this.regMobile = regMobile;
	}

	public String getTransDate() {
		return transDate;
	}

	public void setTransDate(String transDate) {
		this.transDate = transDate;
	}

	public Long getTimeMilis() {
		return timeMilis;
	}

	public void setTimeMilis(Long timeMilis) {
		this.timeMilis = timeMilis;
	}

	public String getSessionToken() {
		return sessionToken;
	}

	public void setSessionToken(String sessionToken) {
		this.sessionToken = sessionToken;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getMacAddress() {
		return macAddress;
	}

	public void setMacAddress(String macAddress) {
		this.macAddress = macAddress;
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

	public String getResolution() {
		return resolution;
	}

	public void setResolution(String resolution) {
		this.resolution = resolution;
	}

	public String getBrowserVersion() {
		return browserVersion;
	}

	public void setBrowserVersion(String browserVersion) {
		this.browserVersion = browserVersion;
	}

	public String getClientIp() {
		return clientIp;
	}

	public void setClientIp(String clientIp) {
		this.clientIp = clientIp;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	
	/**
	 * 设置客户端信息
	 * @param detail
	 */
	public void updateClientInfo(ClientInfoDetail detail)
	{
		setIpAddress(detail.getIpAddress());
		setMacAddress(detail.getMacAddress());
		setLocation(detail.getLocation());
		setPlatform(detail.getPlatform());
		setSysVersion(detail.getSysVersion());
		setNetworkType(detail.getNetworkType());
		setMerType(detail.getMerType());
		setAppVersion(detail.getAppVersion());
		setMobileType(detail.getMobileType());
		setResolution(detail.getResolution());
		setBrowserVersion(detail.getBrowserVersion());
		setClientIp(detail.getClientIp());
	}
	
	/**
	 * 更新平台错误信息
	 * @param e
	 */
	public void updateMirageException(MirageException e) throws Exception
	{
		setErrorCode(e.getCode());
		setErrorMessage(e.getMessage());
		
		try
		{
			setErrorCode((String) MirageUtils.buildFailResult(e).get("errorCode"));
			setErrorMessage((String) MirageUtils.buildFailResult(e).get("errorMessage"));
		}
		catch(Exception ex)
		{
			logger.error(ex.getMessage(), ex);
		}
		
		if("100003".equals(e.getCode()))
		{
			setStatus("10");
		}
		else
		{
			setStatus("30");
		}
	}
	
	/**
	 * 更新平台错误信息
	 * @param e
	 */
	public void updateSpecificalMirageException(SpecificalMirageException e) throws Exception
	{
		setErrorCode(e.getErrorCode());
		setErrorMessage(e.getErrorMessage());
		
		if("100003".equals(e.getErrorCode()))
		{
			setStatus("10");
		}
		else
		{
			setStatus("30");
		}
	}
}

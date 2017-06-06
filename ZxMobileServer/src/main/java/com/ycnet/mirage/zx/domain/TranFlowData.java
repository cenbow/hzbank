package com.ycnet.mirage.zx.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.ycnet.mirage.context.MirageException;
import com.ycnet.mirage.utils.MirageUtils;
import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.utils.SpecificalMirageException;

@Entity
public class TranFlowData {

	@Id
	private String id;
	
	//交易代码
	private String transCode;
	
	//交易名称
	private String transName;
	
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
	
	//用户登录缓存编号
	private String userSessionToken;
	
	//手机型号
	private String mobileType;
	
	//交易开始时间(yyyyMMddHHmmss)
	private String transDate;
	
	//交易耗时(毫秒)
	private Long timeMilis;
	
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

	public String getTransCode() {
		return transCode;
	}

	public void setTransCode(String transCode) {
		this.transCode = transCode;
	}

	public String getTransName() {
		return transName;
	}

	public void setTransName(String transName) {
		this.transName = transName;
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

	public String getUserSessionToken() {
		return userSessionToken;
	}

	public void setUserSessionToken(String userSessionToken) {
		this.userSessionToken = userSessionToken;
	}

	public String getMobileType() {
		return mobileType;
	}

	public void setMobileType(String mobileType) {
		this.mobileType = mobileType;
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
	 * 更新客户端信息
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
		setUserSessionToken(detail.getUserSessionToken());
		setResolution(detail.getResolution());
		setBrowserVersion(detail.getBrowserVersion());
		setClientIp(detail.getClientIp());
	}
	
	/**
	 * 设置客户端信息
	 * @param detail
	 */
	public void updateClientInfo(SessionTokenDetail detail)
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
		setUserSessionToken(detail.getSessionToken());
	}
	
	/**
	 * 更新平台错误信息
	 * @param e
	 */
	public void updateMirageException(MirageException e) throws Exception
	{
		setErrorCode((String) MirageUtils.buildFailResult(e).get("errorCode"));
		setErrorMessage((String) MirageUtils.buildFailResult(e).get("errorMessage"));
	}
	
	/**
	 * 更新平台错误信息
	 * @param e
	 */
	public void updateSpecificalMirageException(SpecificalMirageException e) throws Exception
	{
		setErrorCode(e.getErrorCode());
		setErrorMessage(e.getErrorMessage());
	}
	
}

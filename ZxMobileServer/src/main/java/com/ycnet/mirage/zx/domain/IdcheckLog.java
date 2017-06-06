package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import org.hibernate.id.enhanced.SequenceStyleGenerator;

import com.ycnet.mirage.domain.Domain;
import com.ycnet.mirage.zx.repository.PubApparRepository;
import com.ycnet.mirage.zx.repository.TempclientinfoRepository;

/**
 * 身份识别记录表
 * @author lingal
 *
 */
@SuppressWarnings("serial")
@Entity
public class IdcheckLog implements Domain{
	
	private static PubApparRepository pubApparRepository;
	
	@Id
	@GeneratedValue(generator = "idcheckLogSequenceGenerator")
	@GenericGenerator(name = "idcheckLogSequenceGenerator", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator", parameters = {@Parameter(name = SequenceStyleGenerator.SEQUENCE_PARAM, value = "YC_IDCHECK_LOG_SEQUENCE"), @Parameter(name = SequenceStyleGenerator.INITIAL_PARAM, value = "1000"),
			@Parameter(name = SequenceStyleGenerator.INCREMENT_PARAM, value = "1"), @Parameter(name = SequenceStyleGenerator.OPT_PARAM, value = "pooled")})
	private Long id;
	
	//交易开始时间(yyyy-MM-dd HH:mm:ss miss)
	private String startDate;
	
	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	//app版本号
	private String appVersion;
	
	//ip地址
	private String ipAddress;
	
	//设备编号
	private String macAddress;
	
	//运营商类型
	private String merType;
	
	//手机型号
	private String mobileType;
	
	//网络类型
	private String networkType;
	
	//平台类型  01,iphone;02 ipad;03 android
	private String platform;
	
	private String location;
	
	//操作系统版本
	private String sysVersion;
	
	//身份核查时间
	private Long base64Time;
	
	//身份比对时间
	private Long compTime;
	
	//总时间
	private Long totalTime;
	
	private String returnValue;
	
	private String certNo;
	
	private String userName;
	
	private String people;
	
	private String gender;
	
	private String birth;
	
	private String address;
	
	private String authority;
	
	private String validdate;
	
	public String getCertNo() {
		return certNo;
	}

	public void setCertNo(String certNo) {
		this.certNo = certNo;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPeople() {
		return people;
	}

	public void setPeople(String people) {
		this.people = people;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getBirth() {
		return birth;
	}

	public void setBirth(String birth) {
		this.birth = birth;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getAuthority() {
		return authority;
	}

	public void setAuthority(String authority) {
		this.authority = authority;
	}

	public String getValiddate() {
		return validdate;
	}

	public void setValiddate(String validdate) {
		this.validdate = validdate;
	}

	public String getReturnValue() {
		return returnValue;
	}

	public void setReturnValue(String returnValue) {
		this.returnValue = returnValue;
	}

	
	public static PubApparRepository getPubApparRepository() {
		return pubApparRepository;
	}

	public static void setPubApparRepository(PubApparRepository pubApparRepository) {
		IdcheckLog.pubApparRepository = pubApparRepository;
	}

	public Long getId() {
		return id;
	}
	
	public boolean isNew() {
		// TODO Auto-generated method stub
		return null == getId();
	}

	public String getAppVersion() {
		return appVersion;
	}

	public void setAppVersion(String appVersion) {
		this.appVersion = appVersion;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getMacAddress() {
		return macAddress;
	}

	public void setMacAddress(String macAddress) {
		this.macAddress = macAddress;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getMerType() {
		return merType;
	}

	public void setMerType(String merType) {
		this.merType = merType;
	}

	public String getMobileType() {
		return mobileType;
	}

	public void setMobileType(String mobileType) {
		this.mobileType = mobileType;
	}

	public String getNetworkType() {
		return networkType;
	}

	public void setNetworkType(String networkType) {
		this.networkType = networkType;
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

	public Long getBase64Time() {
		return base64Time;
	}

	public void setBase64Time(Long base64Time) {
		this.base64Time = base64Time;
	}

	public Long getCompTime() {
		return compTime;
	}

	public void setCompTime(Long compTime) {
		this.compTime = compTime;
	}

	public Long getTotalTime() {
		return totalTime;
	}

	public void setTotalTime(Long totalTime) {
		this.totalTime = totalTime;
	}

	public void setId(Long id) {
		this.id = id;
	}
}

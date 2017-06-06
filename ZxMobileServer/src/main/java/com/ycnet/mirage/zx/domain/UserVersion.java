package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import org.hibernate.id.enhanced.SequenceStyleGenerator;

import com.ycnet.mirage.domain.Domain;
import com.ycnet.mirage.domain.DomainImpl;

/**
 * 用户版本关联表
 * @author lingal
 *
 */
@Entity
public class UserVersion implements Domain{
	
	@Id
	@GeneratedValue(generator = "userVersionSequenceGenerator")
	@GenericGenerator(name = "userVersionSequenceGenerator", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator", parameters = {@Parameter(name = SequenceStyleGenerator.SEQUENCE_PARAM, value = "YC_USER_VERSION_SEQUENCE"), @Parameter(name = SequenceStyleGenerator.INITIAL_PARAM, value = "1000"),
			@Parameter(name = SequenceStyleGenerator.INCREMENT_PARAM, value = "1"), @Parameter(name = SequenceStyleGenerator.OPT_PARAM, value = "pooled")})
	private Long id;

	//mac地址
	private String macAddress;
	
	//客户端类型 01 IOS 03 andriod
	private String platform;
	
	//系统版本
	private String sysVersion;
		
	//手机型号
	private String mobileType;
	
	//分辨率
	private String resolution;
	
	//初次使用版本号
	private String version;
	
	//录入日期 yyyyMMdd
	private String date;
	
	//升级版本号
	private String updateVersion;
	
	//升级日期 yyyyMMdd
	private String updateDate;
	
	public String getMobileType() {
		return mobileType;
	}

	public void setMobileType(String mobileType) {
		this.mobileType = mobileType;
	}

	public String getSysVersion() {
		return sysVersion;
	}

	public void setSysVersion(String sysVersion) {
		this.sysVersion = sysVersion;
	}

	public String getResolution() {
		return resolution;
	}

	public void setResolution(String resolution) {
		this.resolution = resolution;
	}

	public String getPlatform() {
		return platform;
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}

	public String getMacAddress() {
		return macAddress;
	}

	public void setMacAddress(String macAddress) {
		this.macAddress = macAddress;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getUpdateVersion() {
		return updateVersion;
	}

	public void setUpdateVersion(String updateVersion) {
		this.updateVersion = updateVersion;
	}

	public String getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	@Override
	public boolean isNew() {
		// TODO Auto-generated method stub
		return null == getId();
	}
}

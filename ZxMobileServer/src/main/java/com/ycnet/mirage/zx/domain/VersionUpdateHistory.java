package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import org.hibernate.id.enhanced.SequenceStyleGenerator;

import com.ycnet.mirage.domain.Domain;

/**
 * 版本更新历史记录表
 * @author lingal
 *
 */
@Entity
public class VersionUpdateHistory implements Domain{
	
	@Id
	@GeneratedValue(generator = "versionUpdateHistorySequenceGenerator")
	@GenericGenerator(name = "versionUpdateHistorySequenceGenerator", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator", parameters = {@Parameter(name = SequenceStyleGenerator.SEQUENCE_PARAM, value = "YC_VERSION_UPDATEHIS_SEQUENCE"), @Parameter(name = SequenceStyleGenerator.INITIAL_PARAM, value = "1000"),
			@Parameter(name = SequenceStyleGenerator.INCREMENT_PARAM, value = "1"), @Parameter(name = SequenceStyleGenerator.OPT_PARAM, value = "pooled")})
	private Long id;
	
	//mac地址
	private String macAddress;
	
	//更新日期 yyyyMMddHHmmss
	private String date;
	
	//平台类型
	private String platform;
	
	//旧版本
	private String version;
	
	//更新版本
	private String updateVersion;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public String getMacAddress() {
		return macAddress;
	}

	public void setMacAddress(String macAddress) {
		this.macAddress = macAddress;
	}

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

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getUpdateVersion() {
		return updateVersion;
	}

	public void setUpdateVersion(String updateVersion) {
		this.updateVersion = updateVersion;
	}

	@Override
	public boolean isNew() {
		// TODO Auto-generated method stub
		return null == this.id;
	}
}

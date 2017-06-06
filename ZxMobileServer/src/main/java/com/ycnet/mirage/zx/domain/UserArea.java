package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import org.hibernate.id.enhanced.SequenceStyleGenerator;

import com.ycnet.mirage.domain.Domain;

/**
 * 用户区域关联
 * @author lingal
 *
 */
@Entity
public class UserArea implements Domain {

	@Id
	@GeneratedValue(generator = "userAreaSequenceGenerator")
	@GenericGenerator(name = "userAreaSequenceGenerator", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator", parameters = {@Parameter(name = SequenceStyleGenerator.SEQUENCE_PARAM, value = "YC_USER_AREA_SEQUENCE"), @Parameter(name = SequenceStyleGenerator.INITIAL_PARAM, value = "1000"),
			@Parameter(name = SequenceStyleGenerator.INCREMENT_PARAM, value = "1"), @Parameter(name = SequenceStyleGenerator.OPT_PARAM, value = "pooled")})
	private Long id;
	
	//mac地址
	private String macAddress;
	
	//客户ip
	private String clientIp;
	
	//录入时间 yyyyMMdd
	private String date;
	
	//最新ip
	private String updateClientIp;
	
	//更新时间 yyyyMMdd
	private String updateDate;
	
	public String getClientIp() {
		return clientIp;
	}

	public void setClientIp(String clientIp) {
		this.clientIp = clientIp;
	}

	public String getUpdateClientIp() {
		return updateClientIp;
	}

	public void setUpdateClientIp(String updateClientIp) {
		this.updateClientIp = updateClientIp;
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

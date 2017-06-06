package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import org.hibernate.id.enhanced.SequenceStyleGenerator;

import com.ycnet.mirage.domain.Domain;

/**
 * 区域打开历史表
 * @author lingal
 *
 */
@Entity
public class AreaOpenHistory implements Domain{
	
	@Id
	@GeneratedValue(generator = "areaOpenHistorySequenceGenerator")
	@GenericGenerator(name = "areaOpenHistorySequenceGenerator", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator", parameters = {@Parameter(name = SequenceStyleGenerator.SEQUENCE_PARAM, value = "YC_AREA_OPENHIS_SEQUENCE"), @Parameter(name = SequenceStyleGenerator.INITIAL_PARAM, value = "1000"),
			@Parameter(name = SequenceStyleGenerator.INCREMENT_PARAM, value = "1"), @Parameter(name = SequenceStyleGenerator.OPT_PARAM, value = "pooled")})
	private Long id;

	//mac地址
	private String macAddress;
	
	//ip地址
	private String clientIp;
	
	//日期 yyyyMMddHHmmss
	private String date;
	
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
	
	public String getClientIp() {
		return clientIp;
	}

	public void setClientIp(String clientIp) {
		this.clientIp = clientIp;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	@Override
	public boolean isNew() {
		// TODO Auto-generated method stub
		return null == getId();
	}
}

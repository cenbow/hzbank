package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import org.hibernate.id.enhanced.SequenceStyleGenerator;

import com.ycnet.mirage.domain.Domain;

/**
 * 用户行为表
 * @author lingal
 *
 */
@Entity
public class UserBehavior implements Domain{
	
	@Id
	@GeneratedValue(generator = "userBehaviorHistorySequenceGenerator")
	@GenericGenerator(name = "userBehaviorHistorySequenceGenerator", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator", parameters = {@Parameter(name = SequenceStyleGenerator.SEQUENCE_PARAM, value = "YC_USER_BEHAVIORHIS_SEQUENCE"), @Parameter(name = SequenceStyleGenerator.INITIAL_PARAM, value = "1000"),
			@Parameter(name = SequenceStyleGenerator.INCREMENT_PARAM, value = "1"), @Parameter(name = SequenceStyleGenerator.OPT_PARAM, value = "pooled")})
	private Long id;
	
	//mac地址
	private String macAddress;
	
	//yyyyMMddHHmmss
	private String date;
	
	//页面URL
	private String url;
	
	//停留时间(毫秒)
	private Long stayTime;

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

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
	
	public Long getStayTime() {
		return stayTime;
	}

	public void setStayTime(Long stayTime) {
		this.stayTime = stayTime;
	}

	@Override
	public boolean isNew() {
		// TODO Auto-generated method stub
		return null == getId();
	}
}

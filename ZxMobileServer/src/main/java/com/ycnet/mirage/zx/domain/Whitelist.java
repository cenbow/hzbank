package com.ycnet.mirage.zx.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import org.hibernate.validator.constraints.NotBlank;

import com.ycnet.mirage.domain.DomainImpl;

/**
 * 身份证号白名单
 * @author syh
 *
 */
@Entity
public class Whitelist extends DomainImpl{
	
	private static final long serialVersionUID = 1L;
	
	@NotBlank
	@Column(length = 200)
	private String personid; 

	public String getPersonid() {
		return personid;
	}

	public void setPersonid(String personid) {
		this.personid = personid;
	}


}

package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;

import org.hibernate.validator.constraints.NotBlank;

import com.ycnet.mirage.domain.DomainImpl;

@Entity
public class Tempvalue extends DomainImpl{
	@NotBlank
	private String certno;
	
	private String idfilename;
	
	public String getCertno() {
		return certno;
	}

	public void setCertno(String certno) {
		this.certno = certno;
	}

	public String getIdfilename() {
		return idfilename;
	}

	public void setIdfilename(String idfilename) {
		this.idfilename = idfilename;
	}

	
}

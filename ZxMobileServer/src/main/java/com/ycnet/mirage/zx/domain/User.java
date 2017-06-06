package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;
import javax.persistence.NamedQuery;

import org.hibernate.validator.constraints.NotBlank;

import com.ycnet.mirage.domain.MirageUser;

/**
 * <pre>spring security配置类</pre>
 * 
 * @author lingal
 * 
 */

@Entity
@NamedQuery(name = "User.loadUserByUsername", query = "select u from User u where u.username = ?1")
public class User extends MirageUser{

	/**
	 * 
	 */
	private static final long serialVersionUID = 2896784220531169881L;

	@NotBlank
	private String username;
	
	@NotBlank
	private String password;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}

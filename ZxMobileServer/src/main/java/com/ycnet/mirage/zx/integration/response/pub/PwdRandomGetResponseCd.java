package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PwdRandomGetResponseCd {
	
	private String pwdkey;
	
	private String pwdvalue;

	public String getPwdkey() {
		return pwdkey;
	}

	public void setPwdkey(String pwdkey) {
		this.pwdkey = pwdkey;
	}

	public String getPwdvalue() {
		return pwdvalue;
	}

	public void setPwdvalue(String pwdvalue) {
		this.pwdvalue = pwdvalue;
	}
	
}

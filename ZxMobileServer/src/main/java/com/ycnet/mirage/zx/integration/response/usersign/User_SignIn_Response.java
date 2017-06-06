package com.ycnet.mirage.zx.integration.response.usersign;

import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

public class User_SignIn_Response extends BaseResponseCommon{
	
	private UserSignInResponseCd cd;

	public UserSignInResponseCd getCd() {
		return cd;
	}

	public void setCd(UserSignInResponseCd cd) {
		this.cd = cd;
	}
	
}

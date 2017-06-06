package com.ycnet.mirage.zx.integration.response.pub;

import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

//支持银行列表查询&支行列表查询 共用返回
public class BranchBankList_Query_Response extends BaseResponseCommon{
	
	private BranchBankList_Query_ResponseCd cd;

	public BranchBankList_Query_ResponseCd getCd() {
		return cd;
	}

	public void setCd(BranchBankList_Query_ResponseCd cd) {
		this.cd = cd;
	}
	
}

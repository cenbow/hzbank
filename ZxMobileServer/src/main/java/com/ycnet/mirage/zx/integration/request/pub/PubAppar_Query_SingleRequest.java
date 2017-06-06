package com.ycnet.mirage.zx.integration.request.pub;

import javax.xml.bind.annotation.XmlRootElement;

import com.ycnet.mirage.zx.integration.request.BaseRequestCommon;

/**
 * 公共参数查询发送报文
 * @author lingal
 */
@XmlRootElement(name = "root")
public class PubAppar_Query_SingleRequest extends BaseRequestCommon{
	
	private PubApparQuerySingleRequestCd cd;

	public PubApparQuerySingleRequestCd getCd() {
		return cd;
	}

	public void setCd(PubApparQuerySingleRequestCd cd) {
		this.cd = cd;
	}
	
}

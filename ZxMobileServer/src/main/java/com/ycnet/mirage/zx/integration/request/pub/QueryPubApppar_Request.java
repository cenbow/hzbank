package com.ycnet.mirage.zx.integration.request.pub;

import javax.xml.bind.annotation.XmlRootElement;

import com.ycnet.mirage.zx.integration.request.BaseRequestCommon;

@XmlRootElement(name = "root")
public class QueryPubApppar_Request extends BaseRequestCommon {
	private QueryPubApppar_RequestCd cd;

	public QueryPubApppar_RequestCd getCd() {
		return cd;
	}

	public void setCd(QueryPubApppar_RequestCd cd) {
		this.cd = cd;
	}
	
	
}

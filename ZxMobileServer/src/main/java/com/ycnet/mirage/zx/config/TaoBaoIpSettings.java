package com.ycnet.mirage.zx.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 淘宝IP API设置
 * @author lingal
 *
 */
@Component
@ConfigurationProperties("taobao.ip")
public class TaoBaoIpSettings {
	
	//请求地址
	private String url;

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
	
}

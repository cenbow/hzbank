/**
 * 
 */
package com.ycnet.mirage.zx.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * <pre></pre>
 *
 * @author jojo 2014-2-18 下午8:21:41
 *
 */
@Component
@ConfigurationProperties("http.server.proxy")
public class HttpServerProxySettings {
	
	private String host;
	
	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

}

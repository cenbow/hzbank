package com.ycnet.mirage.zx.web.config;

import java.nio.charset.Charset;
import java.util.List;

import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.config.ConnectionConfig;
import org.apache.http.config.SocketConfig;
import org.apache.http.conn.ConnectionKeepAliveStrategy;
import org.apache.http.conn.routing.HttpRoute;
import org.apache.http.impl.DefaultConnectionReuseStrategy;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.protocol.HttpContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.integration.support.json.Jackson2JsonObjectMapper;
import org.springframework.integration.support.json.JacksonJsonUtils;
import org.springframework.integration.support.json.JsonObjectMapper;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;



import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ycnet.mirage.web.config.MirageWebMvcConfig;
import com.ycnet.mirage.zx.utils.MobileDataCacheInitUtils;
import com.ycnet.mirage.zx.web.interceptor.LogInterceptor;

/**
 * @author caoduo
 *
 */
@Configuration
public class MobileWebMvcConfig extends MirageWebMvcConfig {

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new LogInterceptor()).addPathPatterns("/**");
	}
	
	@Bean(initMethod = "init")
	public MobileDataCacheInitUtils mobileDataCacheInitUtils()
	{
		return new MobileDataCacheInitUtils();
	}
	
	@Value("${http.url}")
	private String httpUrl;
	
	@Bean(name = "pollingConnectionManager")
	public PoolingHttpClientConnectionManager poolingHttpClientConnectionManager()
	{
		PoolingHttpClientConnectionManager manager = new PoolingHttpClientConnectionManager();
		
		HttpHost httpHost = new HttpHost(httpUrl);
		
		manager.setConnectionConfig(httpHost, ConnectionConfig.DEFAULT);
		
		SocketConfig socketConfig = SocketConfig.custom().setSoKeepAlive(false).build();
		manager.setDefaultSocketConfig(socketConfig);
		
		manager.setMaxTotal(120);
		manager.setDefaultMaxPerRoute(120);
		manager.setMaxPerRoute(new HttpRoute(httpHost), 120);
		
		return manager;
	}
	
	@Bean(name = "httpClientBuilder")
	public HttpClientBuilder httpClientBuilder()
	{
		HttpClientBuilder builder = HttpClientBuilder.create();
		
		builder.setConnectionManager(poolingHttpClientConnectionManager());
		builder.setConnectionReuseStrategy(new DefaultConnectionReuseStrategy());
		builder.setKeepAliveStrategy(new ConnectionKeepAliveStrategy() {
			
			@Override
			public long getKeepAliveDuration(HttpResponse response, HttpContext context) {
				// TODO Auto-generated method stub
				return 1;
			}
		});
		
		return builder;
	}
	
	@Bean(name = "httpClient")
	public HttpClient httpClient()
	{
		HttpClient httpClient = httpClientBuilder().build();
		
		return httpClient;
	}
	
	@Bean(name = "clientHttpRequestFactory")
	public HttpComponentsClientHttpRequestFactory httpComponentsClientHttpRequestFactory()
	{
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient());
		
		requestFactory.setConnectTimeout(5000);
		requestFactory.setReadTimeout(60000);
		
		return requestFactory;
	}
	
	/**
	 * 配置http方式数据转换器
	 * @return
	 */
	@Bean(name = "stringHttpMessageConverter")
	public StringHttpMessageConverter stringHttpMessageConverter()
	{
		StringHttpMessageConverter converter = new StringHttpMessageConverter(Charset.forName("UTF-8"));
		
		return converter;
	}
	
	@Bean(name = "localRestTemplate")
	public RestTemplate restTemplate()
	{
		RestTemplate restTemplate = new RestTemplate(httpComponentsClientHttpRequestFactory());
		
		List<HttpMessageConverter<?>> messageConverters = restTemplate.getMessageConverters();
		
		for(int i = 0; i < messageConverters.size(); i++)
		{
			HttpMessageConverter<?> httpMessageConverter = messageConverters.get(i);
			
			if(httpMessageConverter instanceof StringHttpMessageConverter)
			{
				messageConverters.remove(i);
				messageConverters.add(stringHttpMessageConverter());
			}
		}
		
		return restTemplate;
	}
	
	/**
	 * 配置json报文解析器
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	@Bean
    public JsonObjectMapper jsonObjectMapper() {
    	ObjectMapper objectMapper = new ObjectMapper();
    	objectMapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
		if (JacksonJsonUtils.isJackson2Present()) {
			return new Jackson2JsonObjectMapper(objectMapper);
		}
		throw JacksonJsonUtils.getNoJacksonLibException();
    }
}

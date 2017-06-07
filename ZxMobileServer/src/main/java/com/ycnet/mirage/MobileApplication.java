package com.ycnet.mirage;

import java.nio.charset.Charset;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jms.JmsTemplateAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.ycnet.mirage.repository.MirageRepositoryFactoryBean;
import com.ycnet.mirage.zx.config.IfpJedisSentinelConnectionFactory;
import com.ynet.ifp.integration.config.EnableGateway;

/**
 * @author caoduo
 *
 */
@Configuration
@ComponentScan
@EnableScheduling
@EnableAutoConfiguration(exclude = {JmsTemplateAutoConfiguration.class})
@EnableTransactionManagement
@EnableConfigurationProperties
@EnableJpaRepositories
@PropertySource(value = "classpath:/application.properties")
@EnableGateway(basePackages = "com.ycnet.mirage.zx.integration")
public class MobileApplication {
	
	static
	{
		System.setProperty("org.jboss.logging.provider", "slf4j");
	}
	
/*	@Autowired
	private RedisCacheSettings redisCacheSettings;
	*/
	/**
	 * <ol><b>Jedis Sentinel 连接池</b>
	 * </ol>
	 * 
	 * @return
	 */
/*	@Bean
    public RedisConnectionFactory ifpJedisSentinelConnectionFactory(){
		
		GenericObjectPoolConfig poolConfig = new GenericObjectPoolConfig();
		
		poolConfig.setMaxIdle(redisCacheSettings.getMaxIdle());  //最大空闲
		poolConfig.setMaxTotal(redisCacheSettings.getMaxTotal()); //最大连接
		poolConfig.setMinIdle(redisCacheSettings.getMinIdle());	//最小空闲
		poolConfig.setMaxWaitMillis(redisCacheSettings.getMaxWaitMillis()); //最大等待时间（毫秒）
		poolConfig.setTestOnBorrow(redisCacheSettings.getTestOnBorrow());//获得一个jedis是否检查连接可用性
		poolConfig.setTestOnReturn(redisCacheSettings.getTestOnReturn());//return一个jedis是否检查连接可用性
		poolConfig.setTimeBetweenEvictionRunsMillis(redisCacheSettings.getTimeBetweenEviction());//两次扫描之间休眠的毫秒数
		poolConfig.setNumTestsPerEvictionRun(redisCacheSettings.getNumTestPerEviction());//每次扫描最多的对象数
		poolConfig.setSoftMinEvictableIdleTimeMillis(redisCacheSettings.getSoftMinEvictableIdleTime());//对象空闲多久后逐出
		
		IfpJedisSentinelConnectionFactory redisConnectionFactory = new IfpJedisSentinelConnectionFactory();
    	redisConnectionFactory.setMastername(redisCacheSettings.getMasterName());
    	redisConnectionFactory.setSentinelAndPort(redisCacheSettings.getSentinelAndPort());
    	redisConnectionFactory.setPoolConfig(poolConfig);
    	
    	return redisConnectionFactory;
    }*/

	/**
	 * <ol><b>Jedis模板</b>
	 * </ol>
	 * 
	 * @return
	 */
	/*@SuppressWarnings("rawtypes")
	@Bean
	public RedisTemplate redisTemplate() {
		RedisTemplate template = new RedisTemplate();
		template.setConnectionFactory(ifpJedisSentinelConnectionFactory());
		return template;
	}*/
	
	/**
	 * 配置http方式数据转换器
	 * @return
	 */
	@Bean
	public StringHttpMessageConverter stringHttpMessageConverter()
	{
		StringHttpMessageConverter converter = new StringHttpMessageConverter(Charset.forName("UTF-8"));
		
		return converter;
	}
	
	public static void main(String[] args) {
		SpringApplication.run(MobileApplication.class, args);
	}
	
}

package com.ycnet.mirage.zx.web.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;


import com.ycnet.mirage.web.security.MirageSecurityConfig;
import com.ycnet.mirage.zx.repository.UserRepository;

/**
 * <pre>spring security配置类</pre>
 * 
 * @author lingal
 * 
 */

@Configuration 
public class UserSecurityConfig extends MirageSecurityConfig { 

	@Autowired
	private UserRepository userRepository; 

	@Bean
	@Override
	protected UserDetailsService userDetailsService() { 
		return userRepository;
	}
}
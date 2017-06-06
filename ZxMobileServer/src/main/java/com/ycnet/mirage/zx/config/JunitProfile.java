package com.ycnet.mirage.zx.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;

@Configuration
@Profile("junit")
@PropertySource(value = "classpath:/application-junit.properties")
public class JunitProfile {

}

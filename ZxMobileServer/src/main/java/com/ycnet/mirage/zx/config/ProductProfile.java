package com.ycnet.mirage.zx.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;

import com.ycnet.mirage.config.env.JndiEnvironment;

@Configuration
@Profile("product")
@PropertySource(value = "classpath:/application-product.properties")
public class ProductProfile extends JndiEnvironment{

}

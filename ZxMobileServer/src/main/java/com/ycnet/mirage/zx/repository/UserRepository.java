package com.ycnet.mirage.zx.repository;

import org.springframework.security.core.userdetails.UserDetailsService;


import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.User;

/**
 * <pre>spring security配置类</pre>
 * 
 * @author lingal
 * 
 */

public interface UserRepository extends MirageRepository<User>,
		UserDetailsService {

}

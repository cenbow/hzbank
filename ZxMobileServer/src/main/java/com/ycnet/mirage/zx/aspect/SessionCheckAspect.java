package com.ycnet.mirage.zx.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.utils.MobileCacheUtils;

/**
 * session有效性验证
 * @author lingal
 *
 */
@Component
@Aspect
public class SessionCheckAspect {
	
	@Before("execution(* com.ycnet.mirage.zx.web.controller.*.*(..))")
	public void checkSession(JoinPoint jp) throws Throwable
	{
		Object[] objects = jp.getArgs();
		
		for(Object object : objects)
		{
			if(object instanceof SessionTokenDetail)
			{
				SessionTokenDetail detail = (SessionTokenDetail) object;
				
				String SessionToken = detail.getSessionToken();
				
				MobileCacheUtils.checkSession(SessionToken);
			}
		}
	}
}

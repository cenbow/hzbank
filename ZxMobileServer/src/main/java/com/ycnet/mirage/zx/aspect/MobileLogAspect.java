package com.ycnet.mirage.zx.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class MobileLogAspect extends MobileApplicationLogAspect{
	
	@Around("execution(* com.ycnet.mirage.zx.service.*.*(..)) && "
			+ "!bean(tranFlowDataService) && !bean(userLogonFlowDataService)")
	public Object logServiceInvoke(ProceedingJoinPoint joinPoint) throws Throwable
	{
		return super.logServiceInvoke(joinPoint);
	}
	
}

package com.ycnet.mirage.zx.aspect;

import java.lang.reflect.Method;
import java.util.Collection;
import java.util.Map;

import javax.servlet.ServletResponse;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.aspectj.lang.ProceedingJoinPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.data.domain.Page;
import org.aspectj.lang.reflect.MethodSignature;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.ycnet.mirage.context.MirageException;
import com.ycnet.mirage.domain.Domain;

public abstract class MobileApplicationLogAspect implements InitializingBean {
	private Logger logger = LoggerFactory.getLogger(getClass()); 
	
	private ParameterNameDiscoverer parameterNameDiscoverer = new DefaultParameterNameDiscoverer();
	
	@Autowired
	ApplicationContext applicationContext;
	
	public Object logServiceInvoke(ProceedingJoinPoint joinPoint) throws Throwable
	{
		StringBuffer argsBuf = new StringBuffer();
		
		if(ArrayUtils.isNotEmpty(joinPoint.getArgs()))
		{
			for(int i = 0 ; i < joinPoint.getArgs().length; i++)
			{
				Object arg = joinPoint.getArgs()[i];
				
				String argName = getArgName(joinPoint)[i];
				
				argsBuf.append("参数"+(i+1)+"-"+argName+":");
				
				appendArgContent(argsBuf, arg);
			}
		}
		
		StringBuffer request = new StringBuffer("\n调用服务接口:" + joinPoint.getSignature() + ".\n实现类:" + joinPoint.getTarget() + "\n");
		
		if(StringUtils.isNoneBlank(argsBuf.toString()))
		{
			request.append(argsBuf);
		}
		
		String requestStr = request.toString();
		
		if(requestStr != null && requestStr.length() < 5000)
		{
			logger.info(requestStr);
		}
		
		Object result = joinPoint.proceed();
		
		StringBuffer response = new StringBuffer("返回：");
		
		appendArgContent(response, result);
		
		String responseStr = response.toString();
		
		if(responseStr != null && responseStr.length() < 5000)
		{
			logger.info(responseStr);
		}
		
		return result;
	}
	
	private String[] getArgName(ProceedingJoinPoint joinPoint) throws Exception
	{
		Method interfaceMethod = ((MethodSignature) joinPoint.getSignature()).getMethod();
		Method method = joinPoint.getTarget().getClass().getDeclaredMethod(joinPoint.getSignature().getName(), interfaceMethod.getParameterTypes());
		
		return parameterNameDiscoverer.getParameterNames(method);
	}
	
	@SuppressWarnings("rawtypes")
	private void appendArgContent(StringBuffer argsBuf, Object arg) {
		if(arg == null){
			argsBuf.append("null\n");
		}else{
			if(arg instanceof ServletResponse){
				argsBuf.append("HttpSevletResponse \n");
			}else if(arg.getClass().isPrimitive() || arg instanceof String){
				argsBuf.append(arg.toString()+"\n");
			}else if(arg.getClass().isArray()){
				Object[] args = (Object[])arg;
				argsBuf.append("size:"+args.length+"\n");
				for (Object sub : args) {
					appendArgContent(argsBuf, sub);
				}
			}else if(arg instanceof Collection){
				Collection args = (Collection)arg;
				argsBuf.append("size:"+args.size()+"\n");
				for (Object sub : args) {
					appendArgContent(argsBuf, sub);
				}
			}else if(arg instanceof Page){
				argsBuf.append(writeArgToJson(arg)+"\n");
				appendArgContent(argsBuf, ((Page)arg).getContent());
			}else if(arg instanceof Map){
				Map<?, ?> map = (Map<?, ?>)arg;
				argsBuf.append("size:" + map.size() + "\n");
				argsBuf.append(String.valueOf(map));
			}else{
				argsBuf.append(writeArgToJson(arg)+"\n");
			}
		}
	}
	
	private ObjectMapper objectMapper = new ObjectMapper();
	
	private String writeArgToJson(Object arg) {
//		return ReflectionToStringBuilder.toString(arg, ToStringStyle.MULTI_LINE_STYLE, false);
		try {
			if(!(arg instanceof Domain)){
				return objectMapper.writeValueAsString(arg);
			}else{
				return ReflectionToStringBuilder.toString(arg, ToStringStyle.MULTI_LINE_STYLE, false);
			}
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
			return "";
		}
	}
	
	public void afterPropertiesSet() throws Exception {
		// TODO Auto-generated method stub
		objectMapper = objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
	}
}

/**
 * 
 */
package com.ycnet.mirage.zx.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.ycnet.mirage.zx.utils.SpecificalMirageController;

/**
 * 请求转发控制器,拦截/service/**的http请求，将这类请求转发到“统一服务平台”提供的接口上。获取返回值并返回
 * @author caoduo
 *
 */
@Controller
@RequestMapping("/service")
public class HttpProxyController extends SpecificalMirageController{
	
	private static final String MD5_KEY = "ADB4545DFD232DFDG";
	
	Logger logger = LoggerFactory.getLogger(getClass());
	
	@RequestMapping(value = "/**", method={RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
	public ModelAndView tranmit(HttpServletRequest req, HttpServletResponse rep, String clientip)throws Exception{
		logger.info("request url is " + req.getRequestURI());
		
		String realUri = getRealRequestURI(req.getRequestURI(), req);
		
		req.setAttribute("REQUEST_MATCH_CODE", MD5_KEY);
		
		ModelAndView modelAndView = new ModelAndView();
		
		modelAndView.setViewName("forward:" + realUri);
		
		logger.info("request url " + req.getRequestURI() + " end");
		
		return modelAndView;
	}
	
	/**
	 * 获取“统一服务系统”接口
	 * @param originUri
	 * @return
	 */
	private String getRealRequestURI(String originUri,HttpServletRequest req) {
		String realUri = originUri;
		if(StringUtils.contains(originUri, "service")){
			realUri = StringUtils.substringAfter(originUri, "service");
		}
		if(StringUtils.contains(realUri,req.getContextPath() )){
			realUri = StringUtils.substringAfter(realUri, req.getContextPath());
		}
		return realUri;
	}
	
	
}
package com.ycnet.mirage.zx.web.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ycnet.mirage.web.interceptor.MirageInterceptor;

/**
 * <pre></pre>
 *
 * @author lingal
 *
 */
public class LogInterceptor extends MirageInterceptor {
	
	private static final String MD5_KEY = "ADB4545DFD232DFDG";
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		logger.info("Request url is：" + request.getRequestURI());
		
		//排除数据统计请求
		if(request.getRequestURI().indexOf("/pubServer/statisticServerInfo") == -1 && 
				request.getRequestURI().indexOf("/userSign/imageCode") == -1&&
				request.getRequestURI().indexOf("/sessionTimeout") == -1&&
				request.getRequestURI().indexOf("/redPacket/createInviterelation") == -1&&
				request.getRequestURI().indexOf("/weixin/") == -1)
		{
			//排除走统一入口的请求
			if(request.getRequestURI().indexOf(request.getContextPath() + "/service") == -1)
			{
				//排除根目录请求
				if(!request.getRequestURI().equals(request.getContextPath()) && !request.getRequestURI().equals(request.getContextPath() + "/"))
				{
					//校验头信息
					String checkData = (String) request.getAttribute("REQUEST_MATCH_CODE");
					
					if(checkData == null || !MD5_KEY.equals(checkData))
					{
						logger.info("非法其请求地址");
						return false;
					}
				}
			}
		}
		
		return true;
	}

}

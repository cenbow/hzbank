package com.ycnet.mirage.zx.utils;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.oro.text.regex.Pattern;
import org.apache.oro.text.regex.PatternCompiler;
import org.apache.oro.text.regex.PatternMatcher;
import org.apache.oro.text.regex.Perl5Compiler;
import org.apache.oro.text.regex.Perl5Matcher;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ycnet.mirage.context.MirageException;
import com.ycnet.mirage.zx.config.MobileApplicationErrorCode;

public class MirageRequestWrapper extends HttpServletRequestWrapper {
	
	private static Logger logger = LoggerFactory.getLogger(MirageRequestWrapper.class);

	private static final String invalidChar = String.valueOf((char)00);
	
	private static PatternMatcher matcher = new Perl5Matcher();
	
	private static Pattern invalidInputPattern = null;
	
	static {
		PatternCompiler myCompiler = new Perl5Compiler();
		try {
			invalidInputPattern = myCompiler.compile("<[\\s\\x00]*SCRIPT|SELECT[\\w\\W]*FROM|INSERT[\\w\\W]*INTO|DELETE[\\w\\W]*FROM|UPDATE[\\w\\W]*SET|DROP[\\w\\W]*TABLE|<!--|-->|<FRAME|<IFRAME|<FRAMESET|<NOFRAME|<PLAINTEXT|<A\\s|<LINK|<MAP|<BGSOUND|<IMG|<FORM|<INPUT|<SELECT|<OPTION|<TEXTAREA|<APPLET|<OBJECT|onmouseover|<EMBED|<NOSCRIPT|<STYLE|ALERT[\\s\\x00]*\\(");
		} catch (Exception e) {

			logger.error(e.getMessage(), e);
			
			invalidInputPattern = null;
		}
	}
	
	private HttpServletRequest request;
	
	public MirageRequestWrapper(HttpServletRequest request) {
		super(request);
		// TODO Auto-generated constructor stub
		this.request = request;
	}
	
	@Override
	public ServletInputStream getInputStream() throws IOException {
		// TODO Auto-generated method stub
		try {
			request.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage(), e);
		}
		
		String method = request.getMethod();
		
		if(!"POST".equals(method.toUpperCase()))
		{
			logger.info("只支持POST方式请求");
			
			throw new MirageException(MobileApplicationErrorCode.REQUEST_METHOD_NOT_SUPPORT);
		}
		
		String contentType = request.getContentType();
		
		logger.info("request请求头信息：" + contentType);
		
		if(contentType == null || contentType.toLowerCase().indexOf("application/json") == -1)
		{
			logger.info("请求只支持application/json格式数据");
			
			throw new MirageException(MobileApplicationErrorCode.REQUEST_DATA_NOT_SUPPORT);
		}
		
		InputStream in = null;
		
		try
		{
			StringBuffer buffer = new StringBuffer();
			
			in = request.getInputStream();
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
			
			String str = null;
			
			while((str = reader.readLine()) != null)
			{
				buffer.append(str);
			}
			
			String requestStr = buffer.toString();
			
			//验证签名
			requestStr = checkSignData(requestStr);
			
			if(requestStr != null && requestStr.length() < 5000)
			{
				logger.info("请求参数：" + requestStr);
			}
			
			String tempStr = requestStr.toUpperCase().replaceAll(invalidChar, "");
			
			if(requestStr != null && requestStr.length() < 5000)
			{
				if(matcher.contains(tempStr, invalidInputPattern))
				{
					logger.info("请求参数包含非法字符");
					
					throw new MirageException(MobileApplicationErrorCode.TRAN_FAIL_ERROR, "请求参数包含非法字符");
				}
			}
			
			String clientIp = request.getParameter("clientip");
			
			//将IP信息加入到请求参数
			if(clientIp != null && !"".equals(clientIp))
			{
				logger.info("ClientIp is : " + clientIp);
				
				try
				{
					JSONObject jsonObject = null;
					
					if(requestStr == null || "".equals(requestStr))
					{
						jsonObject = new JSONObject();
					}
					else
					{
						jsonObject = new JSONObject(requestStr);
					}
					
					jsonObject.put("clientIp", clientIp);
					
					requestStr = jsonObject.toString();
					
					if(requestStr != null && requestStr.length() < 5000)
					{
						logger.info("处理后请求参数：" + requestStr);
					}
					
				}
				catch(Exception e)
				{
					logger.info("请求参数转换json失败");
					
					logger.error(e.getMessage(), e);
				}
			}
			
			byte[] byteArray = null;
			
			try
			{
				byteArray = requestStr.getBytes("UTF-8");
			}
			catch(Exception e)
			{
				logger.error(e.getMessage(), e);
			}
			
			final ByteArrayInputStream bais = new ByteArrayInputStream(byteArray);
			
			ServletInputStream newStream = new ServletInputStream() {
				
				@Override
				public int read() throws IOException {
					// TODO Auto-generated method stub
					return bais.read();
				}
			};
			
			return newStream;
		}
		catch(MirageException e)
		{
			throw e;
		}
		catch (Exception e) {
			// TODO: handle exception
			logger.info("读取请求参数失败");
			
			logger.error(e.getMessage(), e);
			
			throw new MirageException(MobileApplicationErrorCode.TRAN_FAIL_ERROR, "获取请求参数失败");
		}
		finally
		{
			if(in != null)
			{
				try
				{
					in.close();
				}
				catch(Exception e)
				{
					logger.error(e.getMessage(), e);
				}
			}
		}
	}
	
	/**
	 * 验证请求
	 * @param requestStr
	 * @return
	 */
	private String checkSignData(String requestStr) throws Exception
	{
		
		if(requestStr == null || "".equals(requestStr) )
		{
			return "";
		}
		else
		{
			return CheckDataSignUtil.checkSign(requestStr);
		}
	}

}

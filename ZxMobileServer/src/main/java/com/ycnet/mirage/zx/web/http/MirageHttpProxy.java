/**
 * 
 */
package com.ycnet.mirage.zx.web.http;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URL;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.apache.oro.text.regex.Pattern;
import org.apache.oro.text.regex.PatternCompiler;
import org.apache.oro.text.regex.PatternMatcher;
import org.apache.oro.text.regex.Perl5Compiler;
import org.apache.oro.text.regex.Perl5Matcher;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;

import com.ycnet.mirage.context.MirageException;
import com.ycnet.mirage.context.MirageService;
import com.ycnet.mirage.zx.repository.IpAddressRepository;
import com.ycnet.mirage.zx.utils.CheckDataSignUtil;
import com.ycnet.mirage.zx.config.HttpServerProxySettings;
import com.ycnet.mirage.zx.config.MobileApplicationErrorCode;
import com.ycnet.mirage.zx.config.ProxySettings;
import com.ycnet.mirage.zx.config.TaoBaoIpSettings;
import com.ycnet.mirage.zx.domain.IpAddress;

/**
 * http代理，用于调用 商城统一服务 接口
 * 
 * @author caoduo
 * 
 */
public class MirageHttpProxy {
	
	@Autowired
	TaoBaoIpSettings ipSettings;
	
	@Autowired
	ProxySettings proxySettings;
	
	@Autowired
	AnnotationConfigWebApplicationContext applicationContext;
	
	private static Logger logger = LoggerFactory.getLogger(MirageHttpProxy.class);
	
	private static final String MD5_KEY = "ADB4545DFD232DFDG";
	
	@Autowired
	private HttpServerProxySettings httpServerProxySettings;
	
	@Autowired
	IpAddressRepository ipAddressRepository;
	
	private static final String invalidChar = String.valueOf((char)00);
	
	private static PatternMatcher matcher = new Perl5Matcher();
	
	private static Pattern invalidInputPattern = null;
	
	static {
		PatternCompiler myCompiler = new Perl5Compiler();
		try {
			invalidInputPattern = myCompiler.compile("<[\\s\\x00]*SCRIPT|SELECT[\\w\\W]*FROM|INSERT[\\w\\W]*INTO|DELETE[\\w\\W]*FROM|UPDATE[\\w\\W]*SET|DROP[\\w\\W]*TABLE|<!--|-->|<FRAME|<IFRAME|<FRAMESET|<NOFRAME|<PLAINTEXT|<A\\s|<LINK|<MAP|<BGSOUND|<IMG|<FORM|<INPUT|<SELECT|<OPTION|<TEXTAREA|<APPLET|<OBJECT|onmouseover|<EMBED|<NOSCRIPT|<STYLE|ALERT[\\s\\x00]*\\(");
		} catch (Exception err) {

			logger.error(err.getMessage(), err);
			
			invalidInputPattern = null;
		}
	}
	
	
	/**
	 * Http 请求发送
	 * @param req 
	 * @return 
	 */
	public void send(HttpServletRequest req,HttpServletResponse rep, String clientip) throws Exception{
		
		HttpClientBuilder httpClientBuilder = HttpClientBuilder.create();
		CloseableHttpClient client = httpClientBuilder.build();
		
		OutputStream out = null;
		InputStream in = null;
		
		HttpRequestBase post = getHttpRequest(req, clientip);
		
		try {
			logger.info("executing request " + post.getURI());
			
			HttpResponse response = client.execute(post);
			
			logger.info(response.getStatusLine().toString());
			
			Header[] headers = response.getAllHeaders();
			
			for(Header header : headers)
			{
				rep.addHeader(header.getName(), header.getValue());
			}
			
			Header contentType = response.getEntity().getContentType();
			
			if((contentType.getValue().toLowerCase()).indexOf("image/png") == -1)
			{
				HttpEntity entity = response.getEntity();
				String retContent = null;
				if(entity != null){
					logger.info("Response content length: " + entity.getContentLength());
					
					retContent = EntityUtils.toString(entity,"UTF-8");
					
					logger.info("Response content: " + retContent);
				}
				
				in = new ByteArrayInputStream(retContent.getBytes("UTF-8"));
			}
			else
			{
				in = response.getEntity().getContent();
			}
			
			out = rep.getOutputStream();
			
			byte[] array = new byte[1024];
			
			int len = 0;
			
			while((len = in.read(array)) > 0)
			{
				out.write(array.clone(), 0 , len);
			}
			
			out.flush();
			
		} catch (ClientProtocolException e) {
			logger.error(e.getMessage(), e);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		} catch(MirageException e){
			logger.error(e.getMessage(), e);

			throw e;
		} catch(Exception e){
			logger.error(e.getMessage(), e);
		}
	}
	
	/**
	 * 转发返回文件流请求
	 * @param req
	 * @param rep
	 * @throws Exception
	 */
	public void sendStreamReq(HttpServletRequest req, HttpServletResponse rep, String clientIp) throws Exception
	{
		HttpClientBuilder httpClientBuilder = HttpClientBuilder.create();
		CloseableHttpClient client = httpClientBuilder.build();
		
		HttpRequestBase post = getHttpRequest(req, clientIp);
		
		logger.info("executing request " + post.getURI());
		
		OutputStream out = null;
		InputStream in = null;
		
		try {
			HttpResponse response = client.execute(post);
			
			logger.debug(response.getStatusLine().toString());
			
			Header[] headers = response.getAllHeaders();
			
			for(Header header : headers)
			{
				rep.addHeader(header.getName(), header.getValue());
			}
			
			Header contentType = response.getEntity().getContentType();
			
			if(!"image/png".equals(contentType.getValue().toLowerCase()))
			{
				HttpEntity entity = response.getEntity();
				String retContent = null;
				if(entity != null){
					logger.info("Response content length: " + entity.getContentLength());
					
					retContent = EntityUtils.toString(entity,"UTF-8");
					
					logger.info("Response content: " + retContent);
				}
				
				in = new ByteArrayInputStream(retContent.getBytes("UTF-8"));
			}
			else
			{
				in = response.getEntity().getContent();
			}
			
			out = rep.getOutputStream();
			
			byte[] array = new byte[1024];
			
			int len = 0;
			
			while((len = in.read(array)) > 0)
			{
				out.write(array, 0 , len);
			}
			
			out.flush();
			
		} catch (ClientProtocolException e) {
			logger.error(e.getMessage(), e);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		} finally {
			
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
			
			if(out != null)
			{
				try
				{
					out.close();
				}
				catch(Exception e)
				{
					logger.error(e.getMessage(), e);
				}
			}
            //关闭连接,释放资源
			try {
				client.close();
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
			}
        }
	}
	
	private HttpRequestBase getHttpRequest(HttpServletRequest req, String clientIp) throws Exception{
		try {
			req.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e1) {
			logger.error(e1.getMessage(), e1);
		}
		
		String method = req.getMethod();
		String uri = getRealRequestURI(req.getRequestURI(),req);
		
		if(!"POST".equals(method.toUpperCase()))
		{
			logger.info("只支持POST方式请求");
			
			throw new MirageException(MobileApplicationErrorCode.REQUEST_METHOD_NOT_SUPPORT, "POST");
		}
		
		HttpPost httpPost = new HttpPost(uri);
		
		String contentType = req.getContentType();
		
		logger.info("request请求头信息：" + contentType);
		
		if(contentType == null || contentType.toLowerCase().indexOf("application/json") == -1)
		{
			logger.info("请求只支持application/json格式数据");
			
			throw new MirageException(MobileApplicationErrorCode.REQUEST_DATA_NOT_SUPPORT, "JSON");
		}
		
		httpPost.setHeader("Content-type", contentType);
		
		StringBuffer buffer = new StringBuffer();
		
		InputStream in = req.getInputStream();
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
		
		String str = null;
		
		while((str = reader.readLine()) != null)
		{
			buffer.append(str);
		}
		
		String requestStr = buffer.toString();
		
		logger.info("请求参数：" + requestStr);
		
		//验证签名
		requestStr = checkSignData(requestStr);
		
		String tempStr = requestStr.toUpperCase().replaceAll(invalidChar, "");
		
		if(matcher.contains(tempStr, invalidInputPattern))
		{
			logger.info("请求参数包含非法字符");
			
			throw new MirageException(MobileApplicationErrorCode.TRAN_FAIL_ERROR, "请求参数包含非法字符");
		}
		
		httpPost.setHeader("REQUEST_MATCH_CODE", MD5_KEY);
		
		//将IP信息加入到请求参数
		if(clientIp != null && !"".equals(clientIp))
		{
			logger.info("ClientIp is : " + clientIp);
			
			try
			{
				if(uri.indexOf("/version/query") == -1)
				{
					try
					{
						applicationContext.getBean(MirageHttpProxy.class).saveClientIp(clientIp);
					}
					catch(Exception e)
					{
						logger.error(e.getMessage(), e);
					}
				}
				
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
				
				logger.info("处理后请求参数：" + requestStr);
				
			}
			catch(Exception e)
			{
				logger.info("请求参数转换json失败");
				
				logger.error(e.getMessage(), e);
			}
		}
		
		HttpEntity entity = new StringEntity(requestStr, "UTF-8");
		httpPost.setEntity(entity);
		
		return httpPost;
	}
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void saveClientIp(String clientIp) throws Exception
	{
		//录入IP库
		IpAddress ipAddress = ipAddressRepository.findByIp(clientIp);
		
		if(ipAddress == null)
		{
			ipAddress = new IpAddress();
			
			ipAddress.setIp(clientIp);
			
			ipAddressRepository.save(ipAddress);
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
		return httpServerProxySettings.getHost()+realUri;
	}
}

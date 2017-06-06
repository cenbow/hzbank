package com.ycnet.mirage.zx.utils;

import java.security.Key;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ycnet.mirage.context.MirageException;
import com.ycnet.mirage.zx.config.MobileApplicationErrorCode;

/**
 * 解密处理类
 * @author lingal
 *
 */
public class CheckDataSignUtil {
	
	private static Logger logger = LoggerFactory.getLogger(CheckDataSignUtil.class);

	/**
	 * 解密处理，解密成功将返回
	 * 
	 * @param data
	 * @return
	 */
	public static String checkSign(String data) throws Exception {
		String resData = null;
		long startDate = System.currentTimeMillis();
		try {
			logger.info("请求数据解密开始");
			if(data.length() < 1500)
			{
				logger.info("待解密数据：" + data);
			}
			
			String[] array = getSignDataArray(data);
			
			// 数据摘要
			String md5Str = array[0];
			
			logger.info("MD5数据：" + md5Str);
			
			// 数字信封
			String keyStr = getKeyStr(array[2]);
			
			logger.info("随机数：" + keyStr);
			
			resData = decodeSignData(array[1], keyStr);
			
			if(resData.length() < 1500)
			{
				logger.info("报文：" + resData);
			}
			
			//验证MD5数据
			checkMD5Data(md5Str, keyStr, resData);
			
			long endDate = System.currentTimeMillis();
			
			logger.info("解密耗时：" + (endDate - startDate));
			logger.info("请求数据解密结束");
		} catch (Exception e) {
			logger.info("解密发生异常", e);
			logger.error(e.getMessage(), e);
			// 2016-05-23 祝美东修改错误信息提示 请求数据解密失败，非法请求数据
			throw new MirageException(MobileApplicationErrorCode.TRAN_FAIL_ERROR, "请求数据失败,请重试");
		}
		return resData;
	}

	/**
	 * 验证签名数据结构
	 * @param data
	 * @return
	 * @throws Exception
	 */
	public static String[] getSignDataArray(String data) throws Exception
	{
		String[] array = data.split((char) (29) + "");
		
		if (array.length != 3) {
			logger.debug("请求数据结构不正确!");
			throw new Exception("请求数据结构不正确!");
		}
		
		return array;
	}
	
	/**
	 * 获取key
	 * @param keyStrSignData
	 * @return
	 * @throws Exception
	 */
	public static String getKeyStr(String keyStrSignData) throws Exception
	{
		SignDataRSACerPlus plus = SignDataRSACerPlus.getInstance();
		
		String keyStr = plus.doDecrypt(keyStrSignData);
		
		return keyStr;
	}
	
	/**
	 * 对加密数据解密
	 * @param data
	 * @param keyStr
	 * @return
	 * @throws Exception
	 */
	public static String decodeSignData(String data, String keyStr) throws Exception
	{
		if(data.length() < 1500)
		{
			logger.info("加密数据：" + data);
		}
		
		Key k = SignDataAESCoder.getKey(keyStr.getBytes());
		// 交易报文解密
		byte[] dataArr = Converts.strToBase64(data);
		byte[] encryptData = SignDataAESCoder.decodeData(dataArr, k);
		data = new String(encryptData, "utf-8");
		
		return data;
	}
	
	/**
	 * 验证MD5数据
	 * @param md5Str
	 * @param keyStr
	 * @param resData
	 * @throws Exception
	 */
	public static void checkMD5Data(String md5Str, String keyStr, String resData) throws Exception
	{
		// 对数据摘要生产的报文进行md5校验
		String strRemark = keyStr + resData;
		if (!md5Str.equals(MD5Encrypt.MD5(strRemark))) {
			logger.info("数据摘要不正确，报文非法!");
			throw new Exception("数据摘要不正确，报文非法!");
		}
	}
	
	/**
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		/*Key k = AESCoder.toKey("AAAAAAAAAAAAAAAA".getBytes());
		String desData = "FFHiQrBeZN/pt5iYD7EQsot0aYKkq1zPwVkR9/V3iBY=";
		byte[] encryptData = AESCoder.decrypt(Converts.strToBase64(desData), k);
		desData = new String(encryptData);
		System.out.println(desData);*/
		String revData = "18b9f583dfe97ae72c1e84729b5eda3efWpm/ekhGiyuj5B04XTkxLnvVMNqDXrYa28OiNlI4NVqh6c3xA+trwxghxVo68uOtFG3idpoIQwjB76p7M/sOclgu2tYxNGeH7DHNqfx1G4=HPtU9jGclvpmEFtXISx7LVBNeveWSs9KWn+7vVlg1g0ngiAi4yq5VHQELdzb5VVWDq+j9AAaFNu+b0qBpHztSUJcgVvpJi186j+mRhyk5Qwq49frEyFxMcllRLv36sN7tIZFB2dXCq9kQw1bq64jdMaqZAXuU5Dd5HgY0o5RTPQ=";
		//System.out.println(MD5Encrypt.MD5("N7nkd_P881rIG_0L" + "{\"aprValue\":\"VERSION\",\"appid\":\"1\",\"aprCode\":\"APP_INFO\",\"platform\":\"01\"}"));
		CheckDataSignUtil.checkSign(revData);
	}

}

package com.ycnet.mirage.zx.utils;

import java.io.FileInputStream;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;

import javax.crypto.Cipher;

import org.apache.commons.lang.ArrayUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/**
 * 公私钥解密
 * @author lingal
 *
 */
public class SignDataRSACerPlus {
	
	private static Logger logger = LoggerFactory.getLogger(SignDataRSACerPlus.class);

	private static final String keystoreFilePath = "hzbankrsa.keystore";

	private static final String publickeyFilePath = "hzbank.cer";

	private static final String storepass = "hzbank";

	private static final String keypass = "hzbank";

	private static final String keyalias = "hzbank";

	private static SignDataRSACerPlus rsaPlus = null;
	private PrivateKey pk2;

	String rootpath = null;

	private SignDataRSACerPlus() {
		rootpath = SignDataRSACerPlus.class.getResource("SignDataRSACerPlus.class").getPath();
		
		rootpath = rootpath.substring(0, rootpath.indexOf("classes/") + 8);
	}

	public static SignDataRSACerPlus getInstance() {
		if (null == rsaPlus) {
			rsaPlus = new SignDataRSACerPlus();
			try {
				rsaPlus.initCer();
			} catch (Exception e) {
				logger.error("init the cer ERROR!", e);
			}
		}
		return rsaPlus;
	}

	/**
	 * 初始化证书
	 * @throws Exception
	 */
	private void initCer() throws Exception {
		String filePath = rootpath + keystoreFilePath;
		FileInputStream fis2 = new FileInputStream(filePath);
		KeyStore ks = KeyStore.getInstance("JKS"); // 加载证书库
		char[] kspwd = storepass.toCharArray(); // 证书库密码
		char[] keypwd = keypass.toCharArray(); // 证书密码
		ks.load(fis2, kspwd); // 加载证书
		pk2 = (PrivateKey) ks.getKey(keyalias, keypwd); // 获取证书私钥
		fis2.close();
	}

	/**
	 * 使用公钥加密
	 * @param str
	 * @return
	 * @throws Exception
	 */
	public String doEncrypt(String str) throws Exception {
		CertificateFactory cff = CertificateFactory.getInstance("X.509");

		String filePath = rootpath + "conf/" + publickeyFilePath;
		InputStream fis = new FileInputStream(filePath);// 证书文件
		Certificate cf = cff.generateCertificate(fis);
		fis.close();
		PublicKey pk1 = cf.getPublicKey(); // 得到证书文件携带的公钥
		Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding"); // 定义算法：RSA
		// 加密模式
		cipher.init(Cipher.ENCRYPT_MODE, pk1);
		byte[] msg1 = cipher.doFinal(str.getBytes("UTF-8")); // 加密后的数据
		return new BASE64Encoder().encode(msg1);
	}

	/**
	 * 字符串解密
	 * @param str
	 * @return
	 * @throws Exception
	 */
	public String doDecrypt(String str) throws Exception {
		byte[] msg = new BASE64Decoder().decodeBuffer(str);
		StringBuffer sb = new StringBuffer();
		try {
			Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
			cipher.init(Cipher.DECRYPT_MODE, pk2);
			for (int i = 0; i < msg.length; i += 128) {
				byte[] doFinal = cipher.doFinal(ArrayUtils.subarray(msg, i,
						i + 128));
				sb.append(new String(doFinal, "UTF-8"));
			}
		} catch (Exception e) {
			initCer();
			logger.debug("解密数据失败!", e);
			throw e;
		}
		return sb.toString();
	}
}

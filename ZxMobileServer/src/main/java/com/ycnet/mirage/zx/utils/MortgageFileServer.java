package com.ycnet.mirage.zx.utils;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;
import com.ycnet.mirage.zx.config.MortgageConfig;

public class MortgageFileServer {
	private static Logger logger = LoggerFactory.getLogger(MortgageFileServer.class);
	private static String ip;
	private static String port ;
	private static String username ;
	private static String password ;
	private static String basedirUrl ;
	private static int timeout;
	
	public static void initdata(MortgageConfig fileserver){
		MortgageFileServer.setBasedirUrl(fileserver.getBasedirUrl());
		MortgageFileServer.setIp(fileserver.getIp());
		MortgageFileServer.setPassword(fileserver.getPassword());
		MortgageFileServer.setPort(fileserver.getPort());
		MortgageFileServer.setTimeout(fileserver.getTimeout());
		MortgageFileServer.setUsername(fileserver.getUsername());
	}
	
	public static Session getSshSession(){
		JSch jsch = new JSch();
		String userName=MortgageFileServer.getUsername();  //sftp 用户名
		String sftpServer=MortgageFileServer.getIp(); //sftp 服务器ip地址
		String password=MortgageFileServer.getPassword();  //sftp 用户密码
		int port=Integer.parseInt(MortgageFileServer.getPort()); 
		Session sshSession=null;
		
		try {
			sshSession = jsch.getSession(userName, sftpServer, port);
			sshSession.setPassword(password);
			Properties sshConfig = new Properties();
			sshConfig.put("StrictHostKeyChecking", "no");
			sshSession.setConfig(sshConfig); 
			sshSession.setTimeout(timeout);//设置timeout时间
			sshSession.connect();
			
		} catch (JSchException e) {
			logger.error(e.getMessage(), e);
		}
		return sshSession;
	}
	
	public static ChannelSftp getsftp(Session sshSession){
		ChannelSftp sftp = null;
		Channel channel;
		try {
			channel = sshSession.openChannel("sftp");
			channel.connect();
			sftp = (ChannelSftp) channel;
		} catch (JSchException e) {
			logger.error(e.getMessage(), e);
		}
		return sftp;
	}
	
	public static void upFile(ChannelSftp sftp,String filedir,String filename,String remotedir,String remoteFilename){
		java.io.FileInputStream fi2;
		try {
			fi2 = new java.io.FileInputStream(filedir+filename);
			sftp.cd(remotedir);
			sftp.put(fi2, remoteFilename, ChannelSftp.OVERWRITE); 
			fi2.close();
		} catch (FileNotFoundException e) {
			logger.error(e.getMessage(), e);
		} catch (SftpException e) {
			logger.error(e.getMessage(), e);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}
	
	public static void upFile(ChannelSftp sftp,InputStream ins,String remotedir,String remoteFilename){
		try {
			sftp.cd(MortgageFileServer.getBasedirUrl());
			try{
				sftp.cd(remotedir);
			}catch(Exception e){
				sftp.mkdir(remotedir);
				sftp.cd(remotedir);
			}
			sftp.put(ins, remoteFilename, ChannelSftp.OVERWRITE); 
			ins.close();
		} catch (FileNotFoundException e) {
			logger.error(e.getMessage(), e);
		} catch (SftpException e) {
			logger.error(e.getMessage(), e);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}
	
	public static void delFile(ChannelSftp sftp,String remotedir,String remoteFilename){
		try {
			sftp.cd(MortgageFileServer.getBasedirUrl());
			try{
				sftp.cd(remotedir);
				sftp.rm(remoteFilename);
			}catch(Exception e){
				 
			}
		} catch (SftpException e) {
			logger.error(e.getMessage(), e);
		}
	}
	
	
	public static byte[] getFile(ChannelSftp sftp,String remotedir,String remoteFilename){
		InputStream  os = null;
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		byte[] array=null;
		try {
			sftp.cd(MortgageFileServer.getBasedirUrl());
			sftp.cd(remotedir);
			os = sftp.get(remoteFilename);
			byte[] buffer = null;
			buffer = new byte[1024];
			while (true) {
				
				int len = os.read(buffer);
				if (len == 0 || len == -1) {
					break;
				}
				baos.write(buffer,0,len);
				baos.flush();
			}
			array= baos.toByteArray();
			os.close();
			
		} catch (SftpException e) {
			logger.error(e.getMessage(), e);
		} catch (FileNotFoundException e) {
			logger.error(e.getMessage(), e);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}finally{
			if(os!=null){
				try {
					os.close();
				} catch (IOException e) {
				}
			}
			if(baos!=null){
				try {
					baos.close();
				} catch (IOException e) {
				}
			}
		}
		return array;
	}
	

	public static Logger getLogger() {
		return logger;
	}

	public static void setLogger(Logger logger) {
		MortgageFileServer.logger = logger;
	}

	public static String getIp() {
		return ip;
	}

	public static void setIp(String ip) {
		MortgageFileServer.ip = ip;
	}

	public static String getPort() {
		return port;
	}

	public static void setPort(String port) {
		MortgageFileServer.port = port;
	}

	public static String getUsername() {
		return username;
	}

	public static void setUsername(String username) {
		MortgageFileServer.username = username;
	}

	public static String getPassword() {
		return password;
	}

	public static void setPassword(String password) {
		MortgageFileServer.password = password;
	}

	public static String getBasedirUrl() {
		return basedirUrl;
	}

	public static void setBasedirUrl(String basedirUrl) {
		MortgageFileServer.basedirUrl = basedirUrl;
	}

	public static int getTimeout() {
		return timeout;
	}

	public static void setTimeout(int timeout) {
		MortgageFileServer.timeout = timeout;
	}
	
}

package com.ycnet.mirage.zx.utils;

public class SpecificalMirageException extends RuntimeException{
	
	private String errorCode;
	
	private String errorMessage;
	
	public SpecificalMirageException() {
		// TODO Auto-generated constructor stub
	}
	
	public SpecificalMirageException(String errorCode, String errorMessage)
	{
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	
}

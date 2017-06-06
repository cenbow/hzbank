package com.ycnet.mirage.zx.utils;

import static com.ycnet.mirage.utils.MirageUtils.buildFailResult;
import static com.ycnet.mirage.utils.MirageUtils.getMessage;

import java.util.HashMap;
import java.util.Map;

import javax.validation.ConstraintViolationException;

import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ycnet.mirage.web.controller.MirageController;

@ControllerAdvice(annotations = RestController.class)
public class SpecificalMirageController extends MirageController{
	
	private static final String RESULT_FAIL = "fail";
	
	@ExceptionHandler(SpecificalMirageException.class)
	@ResponseBody
	public Map<String, Object> handleMirageException(SpecificalMirageException ex) {
		logger.info(ex.getErrorCode(), ex.getErrorMessage());
		
		Map<String, Object> returnMap = new HashMap<String, Object>();
		
		returnMap.put("result", RESULT_FAIL);
		returnMap.put("errorCode", ex.getErrorCode());
		returnMap.put("errorMessage", ex.getErrorMessage());
		
		return returnMap;
	}
	
	@Override
	@ExceptionHandler(Exception.class)
	@ResponseBody
	public Map<String, Object> handleError(Exception ex) {
		// TODO Auto-generated method stub
		logger.error(ex.getMessage(), ex);
		
		String code = "999999";
		String message = "系统开小差中...";
		
		//处理hibernate validate校验失败的异常信息
		if(ex.getCause() != null && ex.getCause().getCause() instanceof ConstraintViolationException){
			ConstraintViolationException validateException = (ConstraintViolationException) ex.getCause().getCause();
			code = validateException.getConstraintViolations().iterator().next().getMessage();
			if(NumberUtils.isNumber(code)){
				message = getMessage(code);
			}else{
				message = "系统开小差中...";
				code = "000000";
			}
		}
		return buildFailResult(code, message);
	}
}

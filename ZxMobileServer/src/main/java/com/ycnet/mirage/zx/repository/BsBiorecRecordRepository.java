package com.ycnet.mirage.zx.repository;

import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.BsBiorecRecord;

/**
 * 人脸认证流水处理类
 *
 */
public interface BsBiorecRecordRepository extends MirageRepository<BsBiorecRecord>{
	
	/**
	 * 根据id去查询
	 * @param idNo
	 * @return
	 */
	@Transactional
	List<BsBiorecRecord> findAllByIdNo(String idNo);
	
	/**
	 * 更新数据库表 插入
	 */
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public BsBiorecRecord saveAndFlush(BsBiorecRecord entity);
	
	
}

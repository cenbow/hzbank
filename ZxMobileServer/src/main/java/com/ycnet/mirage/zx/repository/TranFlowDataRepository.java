package com.ycnet.mirage.zx.repository;

import org.springframework.data.jpa.repository.Query;

import com.ycnet.mirage.zx.domain.TranFlowData;
import com.ycnet.mirage.zx.utils.SpecificalRepository;

public interface TranFlowDataRepository extends SpecificalRepository<TranFlowData>{

	@Query(value = "SELECT YC_TRAN_FLOW_DATA_SEQUENCE.NEXTVAL FROM DUAL", nativeQuery = true)
	String queryTranFlowNo();
}

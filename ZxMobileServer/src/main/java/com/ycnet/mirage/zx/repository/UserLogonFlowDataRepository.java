package com.ycnet.mirage.zx.repository;

import org.springframework.data.jpa.repository.Query;

import com.ycnet.mirage.zx.domain.UserLogonFlowData;
import com.ycnet.mirage.zx.utils.SpecificalRepository;

public interface UserLogonFlowDataRepository extends SpecificalRepository<UserLogonFlowData>{

	@Query(value = "SELECT YC_LOGON_FLOW_DATA_SEQUENCE.NEXTVAL FROM DUAL", nativeQuery = true)
	String queryUserLogonFlowNo();
}

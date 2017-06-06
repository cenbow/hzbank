package com.ycnet;

import com.ycnet.mirage.MobileApplication;
import com.ycnet.mirage.context.MirageWebApplication;

public class MobileWebApplication extends MirageWebApplication{

	@Override
	protected Class<?> getApplicationClass() {
		// TODO Auto-generated method stub
		return MobileApplication.class;
	}

}

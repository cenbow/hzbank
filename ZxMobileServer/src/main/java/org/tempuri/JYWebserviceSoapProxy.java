package org.tempuri;

public class JYWebserviceSoapProxy implements org.tempuri.JYWebserviceSoap {
  private String _endpoint = null;
  private org.tempuri.JYWebserviceSoap jYWebserviceSoap = null;
  
  public JYWebserviceSoapProxy() {
    _initJYWebserviceSoapProxy();
  }
  
  public JYWebserviceSoapProxy(String endpoint) {
    _endpoint = endpoint;
    _initJYWebserviceSoapProxy();
  }
  
  private void _initJYWebserviceSoapProxy() {
    try {
      jYWebserviceSoap = (new org.tempuri.JYWebserviceLocator()).getJYWebserviceSoap();
      if (jYWebserviceSoap != null) {
        if (_endpoint != null)
          ((javax.xml.rpc.Stub)jYWebserviceSoap)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
        else
          _endpoint = (String)((javax.xml.rpc.Stub)jYWebserviceSoap)._getProperty("javax.xml.rpc.service.endpoint.address");
      }
      
    }
    catch (javax.xml.rpc.ServiceException serviceException) {}
  }
  
  public String getEndpoint() {
    return _endpoint;
  }
  
  public void setEndpoint(String endpoint) {
    _endpoint = endpoint;
    if (jYWebserviceSoap != null)
      ((javax.xml.rpc.Stub)jYWebserviceSoap)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
    
  }
  
  public org.tempuri.JYWebserviceSoap getJYWebserviceSoap() {
    if (jYWebserviceSoap == null)
      _initJYWebserviceSoapProxy();
    return jYWebserviceSoap;
  }
  
  public java.lang.String toIngestInvoke(java.lang.String strXmlIn) throws java.rmi.RemoteException{
    if (jYWebserviceSoap == null)
      _initJYWebserviceSoapProxy();
    return jYWebserviceSoap.toIngestInvoke(strXmlIn);
  }
  
  
}
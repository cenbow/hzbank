/**
 * JYWebserviceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package org.tempuri;

public class JYWebserviceLocator extends org.apache.axis.client.Service implements org.tempuri.JYWebservice {

    public JYWebserviceLocator() {
    }


    public JYWebserviceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public JYWebserviceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for JYWebserviceSoap
    private java.lang.String JYWebserviceSoap_address = "http://faceapp:12303/Service1.asmx";

    public java.lang.String getJYWebserviceSoapAddress() {
        return JYWebserviceSoap_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String JYWebserviceSoapWSDDServiceName = "JYWebserviceSoap";

    public java.lang.String getJYWebserviceSoapWSDDServiceName() {
        return JYWebserviceSoapWSDDServiceName;
    }

    public void setJYWebserviceSoapWSDDServiceName(java.lang.String name) {
        JYWebserviceSoapWSDDServiceName = name;
    }

    public org.tempuri.JYWebserviceSoap getJYWebserviceSoap() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(JYWebserviceSoap_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getJYWebserviceSoap(endpoint);
    }

    public org.tempuri.JYWebserviceSoap getJYWebserviceSoap(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            org.tempuri.JYWebserviceSoapStub _stub = new org.tempuri.JYWebserviceSoapStub(portAddress, this);
            _stub.setPortName(getJYWebserviceSoapWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setJYWebserviceSoapEndpointAddress(java.lang.String address) {
        JYWebserviceSoap_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (org.tempuri.JYWebserviceSoap.class.isAssignableFrom(serviceEndpointInterface)) {
                org.tempuri.JYWebserviceSoapStub _stub = new org.tempuri.JYWebserviceSoapStub(new java.net.URL(JYWebserviceSoap_address), this);
                _stub.setPortName(getJYWebserviceSoapWSDDServiceName());
                return _stub;
            }
        }
        catch (java.lang.Throwable t) {
            throw new javax.xml.rpc.ServiceException(t);
        }
        throw new javax.xml.rpc.ServiceException("There is no stub implementation for the interface:  " + (serviceEndpointInterface == null ? "null" : serviceEndpointInterface.getName()));
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(javax.xml.namespace.QName portName, Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        if (portName == null) {
            return getPort(serviceEndpointInterface);
        }
        java.lang.String inputPortName = portName.getLocalPart();
        if ("JYWebserviceSoap".equals(inputPortName)) {
            return getJYWebserviceSoap();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://tempuri.org/", "JYWebservice");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://tempuri.org/", "JYWebserviceSoap"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("JYWebserviceSoap".equals(portName)) {
            setJYWebserviceSoapEndpointAddress(address);
        }
        else 
{ // Unknown Port Name
            throw new javax.xml.rpc.ServiceException(" Cannot set Endpoint Address for Unknown Port" + portName);
        }
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(javax.xml.namespace.QName portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        setEndpointAddress(portName.getLocalPart(), address);
    }

}

package com.ycnet.mirage.zx.config;

public class Distance {
	private static final double EARTH_RADIUS = 6378137;

	private static double rad(double d) {
		return d * Math.PI / 180.0;
	}

	/**
	 * 根据两点间经纬度坐标（double值），计算两点间距离，单位为米
	 * 
	 * @param lng1
	 * @param lat1
	 * @param lng2
	 * @param lat2
	 * @return
	 */
	public static double getDistance(double lng1, double lat1, double lng2,
			double lat2) {
		double radLat1 = rad(lat1);
		double radLat2 = rad(lat2);
		double a = radLat1 - radLat2;
		double b = rad(lng1) - rad(lng2);
		double s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
				+ Math.cos(radLat1) * Math.cos(radLat2)
				* Math.pow(Math.sin(b / 2), 2)));
		s = s * EARTH_RADIUS;
		s = Math.round(s * 10000) / 10000;
		return s;
	}

	public static double getDistance(String posX, String posY, String posX2,
			String poxY2) {
		try {
			double x1 = Double.parseDouble(posX);
			double y1 = Double.parseDouble(posY);
			double x2 = Double.parseDouble(posX2);
			double y2 = Double.parseDouble(poxY2);
			return getDistance(x1, y1, x2, y2);
		} catch (Exception e) {
		}
		return 0;
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		double distance = getDistance(121.000000, 31.000000, 121.015000,
				31.000000);
		System.out.println("Distance is:" + distance);

		int range = 500;
		float posYfloat = (float) (0.1 * range / 10000.0);
		System.out.println(range + ":	" + posYfloat);
		range = 1000;
		posYfloat = (float) (0.1 * range / 10000.0);
		System.out.println(range + ":	" + posYfloat);
		range = 1500;
		posYfloat = (float) (0.1 * range / 10000.0);
		System.out.println(range + ":	" + posYfloat);

	}
}
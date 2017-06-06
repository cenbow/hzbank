package com.ycnet.mirage.zx.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import org.apache.commons.lang3.time.DateFormatUtils;

public class DateUtils {
	public static final String DEFAULT_DATE_PATTERN = "yyyy-MM-dd HH:mm:ss";
	public static final String DATE_TIME_FORMAT = "yyyyMMddHHmmss";
	public static final String DATE_FORMAT = "yyyyMMdd";
	static final SimpleDateFormat sdf1 = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");
	static final SimpleDateFormat sdfNoTime = new SimpleDateFormat("yyyy-MM-dd");

	public static Date getFirstDayOfMonth(int monthDiff) {
		Calendar cal = Calendar.getInstance(Locale.CHINA);
		cal.set(5, 1);
		cal.add(2, monthDiff);
		cal = org.apache.commons.lang3.time.DateUtils.truncate(cal, 2);
		return cal.getTime();
	}

	public static Date getLastDayOfMonth(int monthDiff) {
		Calendar cal = Calendar.getInstance(Locale.CHINA);
		cal.set(5, 1);
		cal.add(2, monthDiff);
		cal = org.apache.commons.lang3.time.DateUtils.ceiling(cal, 2);
		return cal.getTime();
	}

	public static Date getLastDayOfMonth(int year, int month) {
		Calendar cal = Calendar.getInstance(Locale.CHINA);
		cal.set(1, year);
		cal.set(5, 1);
		cal.set(2, month - 1);
		cal = org.apache.commons.lang3.time.DateUtils.ceiling(cal, 2);
		return cal.getTime();
	}

	public static Date getFirstDayOfMonth(int year, int month) {
		Calendar cal = Calendar.getInstance(Locale.CHINA);
		cal.set(1, year);
		cal.set(5, 1);
		cal.set(2, month - 1);
		cal = org.apache.commons.lang3.time.DateUtils.truncate(cal, 2);
		return cal.getTime();
	}

	public static String getDefaultDateStr(Date d) {
		return DateFormatUtils.format(d, "yyyy-MM-dd HH:mm:ss");
	}

	public static Date getOneMonthBefore(Date now) {
		Calendar cal = Calendar.getInstance(Locale.CHINA);
		cal.setTime(now);
		cal.add(2, 2 - 3);
		return cal.getTime();
	}

	public static Date firstDayOfWeek() {
		Calendar cal = Calendar.getInstance();
		int dayofweek = cal.get(7) - cal.getFirstDayOfWeek();
		cal.add(5, 1 - dayofweek);
		return org.apache.commons.lang3.time.DateUtils.truncate(cal.getTime(),
				5);
	}

	public static Date firstDayOfWeek(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		int dayofweek = cal.get(7) - cal.getFirstDayOfWeek();
		cal.add(5, 1 - dayofweek);
		return org.apache.commons.lang3.time.DateUtils.truncate(cal.getTime(),
				5);
	}

	public static Date startOfWeek(int year, int month, int week) {
		Calendar cal = Calendar.getInstance();
		cal.set(1, year);
		cal.set(2, month - 1);
		cal.set(5, (week - 1) * 7 + 1);
		return cal.getTime();
	}

	public static Date endOfWeek(int year, int month, int week) {
		Calendar cal = Calendar.getInstance();
		cal.set(1, year);
		cal.set(2, month - 1);
		cal.set(5, week * 7 + 1);
		return cal.getTime();
	}

	public static Date lastDayOfWeek(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		int dayofweek = cal.get(7) - cal.getFirstDayOfWeek();
		cal.add(5, 7 - dayofweek);
		cal.add(5, dayofweek - 7);
		return org.apache.commons.lang3.time.DateUtils
				.ceiling(cal.getTime(), 5);
	}

	public static Date lastDayOfWeek() {
		Calendar cal = Calendar.getInstance();
		int dayofweek = cal.get(7) - cal.getFirstDayOfWeek();
		cal.add(5, 7 - dayofweek);
		cal.add(5, dayofweek - 7);
		return org.apache.commons.lang3.time.DateUtils
				.ceiling(cal.getTime(), 5);
	}

	public static int getDaysOfMonth() {
		Calendar cal = Calendar.getInstance();
		cal.add(2, 1);
		cal.set(5, 1);
		cal.add(5, -1);
		return cal.get(5);
	}

	public static Date getDiffTime(Date date, Long timeDiff) {
		if (null != timeDiff) {
			Long milliseconds = Long.valueOf(date.getTime());
			Long timeDiffLong = Long
					.valueOf(timeDiff.longValue() * 60L * 1000L);
			Date result = new Date(milliseconds.longValue()
					- timeDiffLong.longValue());
			return result;
		}
		return date;
	}

	public static Date getToday(String dateFormatString) {
		try {
			return parse(
					new SimpleDateFormat(dateFormatString).format(Calendar
							.getInstance().getTime())).getTime();
		} catch (Exception e) {
		}
		return null;
	}

	public static Date getTomorrow(String dateFormatString) {
		try {
			return parse(
					new SimpleDateFormat(dateFormatString).format(new Date(
							new Date().getTime() + 86400000L))).getTime();
		} catch (Exception e) {
		}

		return null;
	}

	public static Calendar parse(String datetime) {
		if (datetime != null) {
			if (datetime.length() != 19) {
				datetime = formatToEnglish(datetime);
			}
			try {
				Calendar rightNow = Calendar.getInstance();

				rightNow.setTime(sdf1.parse(datetime));

				return rightNow;
			} catch (Exception e) {
			}
		}
		return null;
	}

	public static String formatToEnglish(String datetime) {
		String date = sdfNoTime.format(Calendar.getInstance().getTime());

		String yy = date.substring(0, 2);
		String year = date.substring(0, 4);
		String month = date.substring(5, 7);
		String day = date.substring(8, 10);

		String datetimeBak = datetime.replace("旄1�7", " ");
		datetimeBak = datetimeBak.replace("〄1�7", " ");
		datetimeBak = datetimeBak.replaceAll(" +", " ");

		String[] dt = datetimeBak.split(" ");

		String format = null;

		String[] temp = getArray(datetime);
		if ((temp != null) && (dt != null)) {
			switch (temp.length) {
			case 1:
				if (temp[0].length() == 1) {
					temp[0] = ("0" + temp[0]);
				}
				format = year + "-" + month + "-" + temp[1] + " 00:00:00";
				break;
			case 2:
				for (int i = 0; i < temp.length; i++) {
					if (temp[i].length() == 1) {
						temp[i] = ("0" + temp[i]);
					}

				}

				if (dt.length == 1) {
					if ((dt[0].contains(":")) || (dt[0].contains("＄1�7"))
							|| (dt[0].contains("炄1�7"))) {
						format = year + "-" + month + "-" + day + " " + temp[0]
								+ ":" + temp[1] + ":00";
					} else {
						format = year + "-" + temp[0] + "-" + temp[1]
								+ " 00:00:00";
					}

				} else if (dt.length == 2)
					format = year + "-" + month + "-" + temp[0] + " " + temp[1]
							+ ":00:00";
				break;
			case 3:
				if (dt.length == 1) {
					if ((dt[0].contains(":")) || (dt[0].contains("＄1�7"))
							|| (dt[0].contains("炄1�7"))) {
						for (int i = 0; i < temp.length; i++) {
							if (temp[i].length() == 1) {
								temp[i] = ("0" + temp[i]);
							}
						}
						format = year + "-" + month + "-" + day + " " + temp[0]
								+ ":" + temp[1] + ":" + temp[2];
					} else {
						for (int i = 0; i < temp.length; i++) {
							if (temp[0].length() != 4)
								temp[0] = (yy + temp[0]);
							else if (temp[i].length() == 1) {
								temp[i] = ("0" + temp[i]);
							}
						}
						format = temp[0] + "-" + temp[1] + "-" + temp[2]
								+ " 00:00:00";
					}

				} else if (dt.length == 2) {
					for (int i = 0; i < temp.length; i++) {
						if (temp[i].length() == 1) {
							temp[i] = ("0" + temp[i]);
						}
					}

					String[] dateArray = getArray(dt[0]);
					String[] timeArray = getArray(dt[1]);

					if ((dateArray.length == 2) && (timeArray.length == 1)) {
						format = year + "-" + temp[0] + "-" + temp[1] + " "
								+ temp[2] + ":00:00";
					} else if ((dateArray.length == 1)
							&& (timeArray.length == 2))
						format = year + "-" + month + "-" + temp[0] + " "
								+ temp[1] + ":" + temp[2] + ":00";
				}
				break;
			case 4:
				if (dt.length == 2) {
					String[] dateArray = getArray(dt[0]);
					String[] timeArray = getArray(dt[1]);

					if ((dateArray.length == 3) && (timeArray.length == 1)) {
						for (int i = 0; i < temp.length; i++) {
							if (temp[0].length() != 4)
								temp[0] = (yy + temp[0]);
							else if (temp[i].length() == 1) {
								temp[i] = ("0" + temp[i]);
							}
						}
						format = temp[0] + "-" + temp[1] + "-" + temp[2] + " "
								+ temp[3] + ":" + "00:00";
					} else {
						for (int i = 0; i < temp.length; i++) {
							if (temp[i].length() == 1) {
								temp[i] = ("0" + temp[i]);
							}

						}

						if ((dateArray.length == 1) && (timeArray.length == 3)) {
							format = year + "-" + month + "-" + temp[0] + " "
									+ temp[1] + ":" + temp[2] + ":" + temp[3];
						} else if ((dateArray.length == 2)
								&& (timeArray.length == 2))
							format = year + "-" + temp[0] + "-" + temp[1] + " "
									+ temp[2] + ":" + temp[3] + ":00";
					}
				}
				break;
			case 5:
				if (dt.length == 2) {
					String[] dateArray = getArray(dt[0]);
					String[] timeArray = getArray(dt[1]);

					if ((dateArray.length == 2) && (timeArray.length == 3)) {
						for (int i = 0; i < temp.length; i++) {
							if (temp[i].length() == 1) {
								temp[i] = ("0" + temp[i]);
							}
						}
						format = year + "-" + temp[0] + "-" + temp[1] + " "
								+ temp[2] + ":" + temp[3] + ":" + temp[4];
					} else if ((dateArray.length == 3)
							&& (timeArray.length == 2)) {
						for (int i = 0; i < temp.length; i++) {
							if (temp[0].length() != 4)
								temp[0] = (yy + temp[0]);
							else if (temp[i].length() == 1) {
								temp[i] = ("0" + temp[i]);
							}
						}
						format = temp[0] + "-" + temp[1] + "-" + temp[2] + " "
								+ temp[3] + ":" + temp[4] + ":00";
					}
				}
				break;
			case 6:
				for (int i = 0; i < temp.length; i++) {
					if (temp[0].length() != 4)
						temp[0] = (yy + temp[0]);
					else if (temp[i].length() == 1) {
						temp[i] = ("0" + temp[i]);
					}
				}
				format = temp[0] + "-" + temp[1] + "-" + temp[2] + " "
						+ temp[3] + ":" + temp[4] + ":" + temp[5];
			}

		}

		return format;
	}

	private static String[] getArray(String datetime) {
		String[] array = null;
		if (datetime != null) {
			datetime = datetime.replace(" ", "-");

			datetime = datetime.replace("〄1�7", "-");
			datetime = datetime.replace("幄1�7", "-");
			datetime = datetime.replace("朄1�7", "-");
			datetime = datetime.replace("旄1�7", "-");
			datetime = datetime.replace("炄1�7", "-");
			datetime = datetime.replace("刄1�7", "-");
			datetime = datetime.replace("秄1�7", "");
			datetime = datetime.replace(",", "-");
			datetime = datetime.replace("＄1�7", "-");
			datetime = datetime.replace(".", "-");
			datetime = datetime.replace(":", "-");
			datetime = datetime.replace("＄1�7", "-");
			datetime = datetime.replace("＄1�7", "-");
			datetime = datetime.replace("/", "-");

			datetime = datetime.replaceAll("-+", "-");

			array = datetime.split("-");
		}

		return array;
	}

	public static String format2DefaultYMD(Date source) {
		return sdfNoTime.format(source);
	}

	public static boolean compareDate(int year, int month) {
		Calendar cal = Calendar.getInstance();
		if (year < cal.get(1)) {
			return true;
		}
		if (month < cal.get(2)) {
			return true;
		}

		return false;
	}

	public static Date getFirst(Date date) {
		return org.apache.commons.lang3.time.DateUtils.truncate(date, 5);
	}

	public static Date getLast(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		c.add(5, 1);
		return org.apache.commons.lang3.time.DateUtils.truncate(c.getTime(), 5);
	}

	public static boolean timeCompare() {
		Calendar c1 = Calendar.getInstance();
		Calendar c2 = Calendar.getInstance();
		Calendar now = Calendar.getInstance();
		c1.set(c1.get(1), c1.get(2), c1.get(5), 6, 0, 0);
		c2.set(c2.get(1), c2.get(2), c2.get(5), 16, 0, 0);
		if ((c1.before(now)) && (c2.after(now))) {
			return true;
		}
		return false;
	}

	public static Date getFirstWeekDay(int year, int month, int week) {
		Calendar c = Calendar.getInstance();
		c.set(1, year);
		c.set(2, month - 1);
		c.set(4, week);
		c.set(7, 1);
		c.set(11, 0);
		c.set(12, 0);
		c.set(13, 0);

		if (c.get(2) != month - 1) {
			return getFirstDayOfMonth(year, month);
		}
		return c.getTime();
	}

	public static Date getLastWeekDay(int year, int month, int week) {
		Calendar c = Calendar.getInstance();
		c.set(1, year);
		c.set(2, month - 1);
		c.set(4, week);
		c.set(7, 7);
		c.set(11, 24);
		c.set(12, 0);
		c.set(13, 0);

		if (c.get(2) != month - 1) {
			return getLastDayOfMonth(year, month);
		}
		return c.getTime();
	}

	public static int getWeeksInMonth(int year, int month) {
		Calendar c = Calendar.getInstance();
		c.set(1, year);
		c.set(2, month - 1);
		return c.getMaximum(4);
	}

	public static String getStringDate(Integer year, Integer month) {
		StringBuilder sb = new StringBuilder();
		sb.append(year);
		if (month.intValue() < 10) {
			sb.append(0);
		}
		sb.append(month);
		if (sb.toString().length() != 6) {
			throw new IllegalArgumentException("check the params year: " + year
					+ ", month: " + month);
		}
		return sb.toString();
	}

	public static String getStringDate(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		return getStringDate(Integer.valueOf(c.get(1)),
				Integer.valueOf(c.get(2) + 1));
	}

	public static Integer getYearFromYm(String ym) {
		String year = ym.substring(0, 4);
		return Integer.valueOf(Integer.parseInt(year));
	}

	public static Integer getMonthFromYm(String ym) {
		String month = ym.substring(4, 6);
		return Integer.valueOf(Integer.parseInt(month));
	}

	public static Date getNow() {
		return new Date();
	}

	/**
	 * 当前时间,14位的字符丄1�7
	 * @return
	 */
	public static String getCurrentTimeStr() {
		Calendar calendar = Calendar.getInstance();
		Date date = calendar.getTime();
		SimpleDateFormat formatter = new SimpleDateFormat(DATE_TIME_FORMAT);
		return formatter.format(date);
	}
	/**
	 * 时间14位的字符丄1�7
	 * @return
	 */
	public static String getTimeStr(Date date) {
		SimpleDateFormat formatter = new SimpleDateFormat(DATE_TIME_FORMAT);
		return formatter.format(date);
	}
	
	/**
	 * 当前日期,8位的字符丄1�7
	 * @return
	 */
	public static String getCurrentDateStr() {
		Calendar calendar = Calendar.getInstance();
		Date date = calendar.getTime();
		SimpleDateFormat formatter = new SimpleDateFormat(DATE_FORMAT);
		return formatter.format(date);
	}
	
	/**
	 * 昨天日期,8位的字符格式
	 * @return
	 */
	public static String getCurrentyesterdayDateStr() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(5, -1);
		Date date = calendar.getTime();
		SimpleDateFormat formatter = new SimpleDateFormat(DATE_FORMAT);
		return formatter.format(date);
	}

}
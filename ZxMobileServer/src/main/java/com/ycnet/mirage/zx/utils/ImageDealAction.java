package com.ycnet.mirage.zx.utils;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.awt.image.WritableRaster;
import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.imageio.ImageIO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * 图片处理
 * @author keym
 *
 */
public class ImageDealAction {
	private static Logger logger = LoggerFactory.getLogger(ImageDealAction.class);
	
	
	public static void imageDeal(String pathName){
		if (isImage(pathName)) {
			String newSaveFile = null;
			try {
				newSaveFile = pathName.substring(0, pathName.lastIndexOf(".")) + "_suo"
						+ pathName.substring(pathName.lastIndexOf("."));
//				addWaterMark(pathName);
				saveImageAsJpg(pathName, newSaveFile, 200, 150);
			} catch (Exception e) {
				logger.error("ImageDealAction.imageDeal-----" + "图片处理失败");
			}
		}
	}

	/**
	 * 
	 * 通过读取文件并获取其width及height的方式，来判断判断当前文件是否图片，这是一种非常简单的方式。
	 * 
	 * @return
	 */
	public static boolean isImage(String pathName){
		Image img = null;

		File imgFile = new File(pathName);
		if (!imgFile.exists()) {
			logger.error("ImageDealAction.isImage-----" + "图片不存在");
		}
		try {
			img = ImageIO.read(imgFile);
		} catch (IOException e) {
			if (imgFile.exists() && imgFile.isFile()) {
				imgFile.delete();
			}
			logger.error("ImageDealAction.isImage-----" + "对不起，您上传的  不是图像文件");

		}
		if (img == null || img.getWidth(null) <= 0 || img.getHeight(null) <= 0) {
			if (imgFile.exists() && imgFile.isFile()) {
				imgFile.delete();
			}
			logger.error("ImageDealAction.isImage-----" + "对不起，您上传的  不是图像文件");

		}

		return true;

	}

	public static BufferedImage resize(BufferedImage source, int targetW, int targetH) {
		// targetW，targetH分别表示目标长和宽
		int type = source.getType();
		BufferedImage target = null;
		double sx = (double) targetW / source.getWidth();
		double sy = (double) targetH / source.getHeight();
		// 这里想实现在targetW，targetH范围内实现等比缩放。如果不需要等比缩放
		// 则将下面的if else语句注释即可
		if (sx > sy) {
			sx = sy;
			targetW = (int) (sx * source.getWidth());
		} else {
			sy = sx;
			targetH = (int) (sy * source.getHeight());
		}
		if (type == BufferedImage.TYPE_CUSTOM) { // handmade
			ColorModel cm = source.getColorModel();
			WritableRaster raster = cm.createCompatibleWritableRaster(targetW, targetH);
			boolean alphaPremultiplied = cm.isAlphaPremultiplied();
			target = new BufferedImage(cm, raster, alphaPremultiplied, null);
		} else
			target = new BufferedImage(targetW, targetH, type);
		Graphics2D g = target.createGraphics();
		// smoother than exlax:
		g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
		g.drawRenderedImage(source, AffineTransform.getScaleInstance(sx, sy));
		g.dispose();
		return target;
	}

	public static void saveImageAsJpg(String fromFileStr, String saveToFileStr, int width, int hight) throws Exception {
		BufferedImage srcImage;
		// String ex =
		// fromFileStr.substring(fromFileStr.indexOf("."),fromFileStr.length());
		String imgType = "JPEG";
		if (fromFileStr.toLowerCase().endsWith(".png")) {
			imgType = "PNG";
		}
		// System.out.println(ex);
		File saveFile = new File(saveToFileStr);
		File fromFile = new File(fromFileStr);
		srcImage = ImageIO.read(fromFile);
		if (width > 0 || hight > 0) {
			srcImage = resize(srcImage, width, hight);
		}
		ImageIO.write(srcImage, imgType, saveFile);

	}

	/*
	 * /** 添加图片水印
	 * 
	 * @param srcImg 目标图片路径，如：C:\\kutuku.jpg
	 * 
	 * @param waterImg 水印图片路径，如：C:\\kutuku.png
	 * 
	 * @throws IOException
	 */
	public static void addWaterMark(String srcImg) throws Exception {

		// 加载目标图片
		File file = new File(srcImg);
		String ext = srcImg.substring(srcImg.lastIndexOf(".") + 1);
		Image image = ImageIO.read(file);

		int width = image.getWidth(null);
		int height = image.getHeight(null);

		// 将目标图片加载到内存。
		BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		Graphics2D g = bufferedImage.createGraphics();
		g.drawImage(image, 0, 0, width, height, null);

		// 加载水印图片。
//		String waterImg = LifeStandard.getRootPath() + LifeStandard.getBankSettingsValue("waterImgFile");
		String waterImg = "";
		Image waterImage = ImageIO.read(new File(waterImg));
		int width_1 = waterImage.getWidth(null);
		int height_1 = waterImage.getHeight(null);
		// 设置水印图片的透明度。
		g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP, (float) 0.2));

		// 设置水印图片的位置。
		int width_x;
		int height_y;
		if (width % width_1 > 0) {
			width_x = width / width_1 + 1;
		} else {
			width_x = width / width_1;
		}
		if (height % height_1 > 0) {
			height_y = height / height_1 + 1;
		} else {
			height_y = height / height_1;
		}
		int widthDif = 0;
		int heightDiff = 0;
		for (int i = 0; i < height_y; i++) {
			for (int j = 0; j < width_x; j++) {
				widthDif = width_1 * j;
				heightDiff = height_1 * i;
				// 将水印图片“画”在原有的图片的制定位置。
				g.drawImage(waterImage, widthDif, heightDiff, width_1, height_1, null);
			}
		}

		// 关闭画笔。
		g.dispose();

		// 保存目标图片。
		ImageIO.write(bufferedImage, ext, file);

	}
	
}

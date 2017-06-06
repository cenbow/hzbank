$(function(){
	
	
	var prePara = Utils.search();
	var userName = decodeURIComponent(prePara['userName']);
	var cardNo = decodeURIComponent(prePara['cardNo']);
	var time = decodeURIComponent(prePara['subTime']);
    time = time.substr(0,4)+'-'+time.substr(4,2)+'-'+time.substr(6,2);
	$("#userName").html("持卡人:"+userName);
	$("#bindCardNo").html(Utils.getFmtAcc(cardNo));
	$("#time").html("开始持卡日:"+time);
	
	$("#submit").click(function(){
		location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.yt.hz.financial#rd";
	});
	
	
});
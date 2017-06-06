$.fn.swipeBanner = function(options){
	var defaults = {
		ratio: 320/140,
		delay: 3000,
		autoPlay: true,
		callback: function(e){},
		stopFn: function(){},
		allowFn: function(){}
	}

	var opts = $.extend(defaults, options);

	return this.each(function(){ 
		var con = $(this),
			imgs = con.find('.img'),
			dotCon = con.find('.dotCon'),
			width = con.width(),
			num = imgs.size(),
			previous = 0,
			cur = 0,
			swipeTimer = null;
		
		con.css('height', width/opts.ratio + 'px');
		
		if (num <= 1) {
			return
		}

		var startY, moveY;

		con.on('touchstart', function(e){
			startY = e.targetTouches[0].clientY;
		}).on('touchmove', function(e){
			moveY = e.targetTouches[0].clientY;
			distanceY = Math.abs(startY - moveY);
			if(distanceY < 10) {
				opts.stopFn();
				e.preventDefault();
			}
		}).on('touchend', function(e){
			opts.allowFn();
		})

		function showCurrent(i){
			imgs.css('z-index' , '').removeClass('fadeIn');
			imgs.eq(previous).css('z-index' , num-1);

			imgs.eq(i).css('z-index' , num).addClass('fadeIn');

			previous = i;

			dots.removeClass('active');
			dots.eq(i).addClass('active');
		}

		imgs.each(function(i,e){
			$(e).css('z-index', num-i)
		})

		var str = '';
		for(var i = 0; i < num; i++){
			var atv = '';
			i == 0 ? atv = ' class="active"' : null;
			str += '<i'+ atv +'></i>';
		}
		dotCon.html(str);

		var dots = dotCon.find('i');


		function next() {
			cur == num-1 ? cur = 0 : cur++;
			showCurrent(cur);
			opts.callback(cur);
		}

		function prev() {
			cur == 0 ? cur = num-1 : cur--;
			showCurrent(cur);
			opts.callback(cur);
		}

		var flip = function(){
	        swipeTimer && clearTimeout(swipeTimer);
			swipeTimer = setTimeout(function(){
				next();
				flip();
			}, opts.delay)
	    };

	    if(opts.autoPlay) flip();

		con.on('swipeRight', prev).on('swipeLeft', next).on('touchstart', function(){
			swipeTimer && clearTimeout(swipeTimer);
		}).on('touchend', function(){
			opts.autoPlay && flip();
		})
	})
}
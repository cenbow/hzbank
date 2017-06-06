define(['echarts','echarts/chart/line','echarts/chart/bar'],function(){

	 var echarts = require('echarts');
	 var line = require("echarts/chart/line");
	 var bar = require("echarts/chart/bar");
	 
	 function CreatChart(element, options) {
        this.$element  = $(element);
        this.options  = options;
    
        this.creatInit();
    }
	
	 CreatChart.DEFAULTS = {
         //TODO EXTEND
     };
	
	CreatChart.prototype.creatInit = function(){
			echarts.init(this.$element[0]).setOption(this.options);
	}

    MUI.createchart = function (els,option) {
        return $(els).each(function () {
            var $this = $(this);
            var options = $.extend({}, CreatChart.DEFAULTS,typeof option == 'object' && option);
           
			return new CreatChart($(this),options); 
        })
    }
	return MUI;
})



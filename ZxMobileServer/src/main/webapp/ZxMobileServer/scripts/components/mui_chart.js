define(['chart'],function(){

	function charts(element, options){
	  this.$elenemt = document.querySelector(element);
	  this.options = options;
	  this.createChart();	
	};

	charts.prototype.createChart = function(){
          //设置容器高度
		this.$elenemt.style.overflow = 'hidden';
		  this.$elenemt.style.height = (this.$elenemt.offsetWidth)*0.5 + 'px';  
		  //在选中的div元素内部插入canvas标签
		  this.$elenemt.innerHTML = '<canvas></canvas>';
		  //选中插入的标签元素
	  var mapArea = this.$elenemt.querySelector('canvas'),
	      axisData = this.options.myData.data,
	      dataLength = axisData.length,
	      scaleStepWidth = 0,
	      minData = 0,
	      maxData = 0,
	      scaleStartValue = 0;
		  
		  for(var i=0; i<dataLength; i++){
			  if(i == 0){
				  minData = axisData[0];
				  maxData = axisData[0];
			  }else{
			    scaleStepWidth += Math.abs(axisData[i] - axisData[i-1]);
			    axisData[i] < minData ? minData = axisData[i] : null;
				axisData[i] > maxData ? maxData = axisData[i] : null;
			  }
		  }
		  var reg = /([0-9]+.[0-9]{3})[0-9]*/;
		  if(minData == maxData){
			//(scaleStepWidth/(dataLength-1)+'').replace(reg,"$1")*1; 
			  scaleStartValue = (0.5*maxData+'').replace(reg,"$1")*1;
			  scaleStepWidth = (maxData/5.6+'').replace(reg,"$1")*1;
			  scaleStartValue<0 ? scaleStartValue = 0 : null;
		  }else{
			//(scaleStepWidth/(dataLength-1)+'').replace(reg,"$1")*1; 
			  scaleStartValue = ((1.5*minData - 0.5*maxData)+'').replace(reg,"$1")*1;
			  scaleStepWidth = (((maxData-scaleStartValue))/5.6+'').replace(reg,"$1")*1;
			  scaleStartValue<0 ? scaleStartValue = 0 : null;
		  }
		  
		  
		  if(this.options.chartType=="bar"){
	
			 var barChartSet = {
			  scaleOverride : true,	
			  scaleSteps : 6,
			  scaleStepWidth : scaleStepWidth,
			  scaleStartValue : scaleStartValue,
				
			  responsive : true,
			  barValueSpacing : 12,
			  barShowStroke : false,
			  scaleGridLineColor : "rgba(0,0,0,.04)",
			  scaleShowLabels : true,
			  //animation: false,
			  animationSteps: 29,
			  animationEasing:'linear'
			}; 
			  
		     var barChartData = {
				  labels : this.options.myData.labels,
				  datasets : [
					  {
						  fillColor : "rgba(255,108,0,1)",
						  highlightFill: "rgba(228,96,0,1)",
						  data : this.options.myData.data
					  }
				  ]
			 };
			 new Chart(mapArea.getContext("2d")).Bar(barChartData, barChartSet);

		  }else if(this.options.chartType=="line"){
			  
			 var lineChartSet = {
			  scaleOverride : true,	
			  scaleSteps : 6,
			  scaleStepWidth : scaleStepWidth,
			  scaleStartValue : scaleStartValue,
			  
			  responsive : true,  
			  bezierCurve : false,
			  scaleGridLineColor : "rgba(0,0,0,.04)",
			  pointDotRadius : 4,
			  pointDotStrokeWidth : 2,
			  animationSteps: 29,
			  tooltipTemplate: '<%= value %>'
			}; 
			
			 var lineChartData = {
				labels : this.options.myData.labels,
				datasets : [
					{
						fillColor : "rgba(255,108,0,0.2)",
						strokeColor : "rgba(255,108,0,1)",
						pointColor : "rgba(255,108,0,1)",
						pointStrokeColor : "#fff",
						data : this.options.myData.data
					}
				]
			};
	    new Chart(mapArea.getContext("2d")).Line(lineChartData,lineChartSet);
	  }
	  
	};

	MUI.creatChart = function(elem, option){
	   return new charts(elem,option);
	}
	
	return MUI;
})



module.exports = ['ColorRange', '$log', function(ColorRange, $log) {
	var availColors, chartData, chartOptions;
	var WidgetChart = {};

	WidgetChart.makeChart = function(chartType, chartCanvas, chartLabels, chartDataVals, chartOptions) {
		var chartLabels, chartDataValues, chartDataSets, bgColor;
		var chartCtx = chartCanvas.getContext("2d")
		var midX = chartCanvas.width/2;
		var midY = chartCanvas.height/2

		// chartLabels = [];
		// chartDataValues = [];
		// for(var o in chartData) {
		// 	chartLabels.push(chartData[o].label);
		// 	chartDataValues.push(chartData[o].value);
		// }

		availColors = ColorRange.getColorRange(chartLabels.length);

		if (chartType === 'doughnut' || chartType === 'pie') {
			bgColor = availColors;
			chartOptions = {
				// fullWidth: false
				// showTooltips: false,
				// tooltips: {
				// 	enabled: false,
				// },
				// animation: {
				// 	onProgress: drawSegmentValues,
				// }
			};
		} else if (chartType === 'bar') {
			bgColor = availColors[0];
			chartOptions = {
				// fullWidth: false
			};
		}

		chartDataSets = [
			{
				// label: "Metric Label",
				data: chartDataVals,
				backgroundColor: bgColor,
			}
		];

		chartData = {
			labels: chartLabels,
			datasets: chartDataSets
		};

		var thisChart = new Chart(chartCtx, {
			type: chartType,
			data: chartData,
			options: chartOptions,
		});

		// var thisChart = new Chart(chartCtx).Pie(chartData, {
		// 	showTooltips: false,
		// 	onAnimationProgress: drawSegmentValues
		// });

		// var radius = thisChart.outerRadius;

		// function drawSegmentValues() {
		// 	$log.log('hey!');

		// 	for (var i=0; i<thisChart.segments.length; i++) {
		// 		chartCtx.fillStyle="white";
		// 		var textSize = chartCanvas.width/10;
		// 		chartCtx.font = textSize + 'px Verdana';
		// 		// Get needed variables
		// 		var value = thisChart.segments[i].value;
		// 		var startAngle = thisChart.segments[i].startAngle;
		// 		var endAngle = thisChart.segments[i].endAngle;
		// 		var middleAngle = startAngle + ((endAngle = startAngle)/2);

		// 		//Computer text location
		// 		var posX = (radius/2) * Math.cos(middleAngle) + midX;
		// 		var posY = (radius/2) * Math.sin(middleAngle) + midY;

		// 		//Text offside by middle
		// 		var w_offset = chartCtx.measureText(value).width/2;
		// 		var h_offset = textSize/4;

		// 		chartCtx.fillText(value, posX - w_offset, posY + h_offset);
		// 	}
		// }

		return thisChart;
	};

	return WidgetChart;
}];

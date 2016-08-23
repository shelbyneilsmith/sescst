module.exports = ['ColorRange', function(ColorRange) {
	var availColors, chartData, chartOptions;
	var WidgetChart = {};

	WidgetChart.makeChart = function(chartType, chartCtx, chartData, chartOptions) {
		var chartLabels, chartDataValues, chartDataSets, bgColor;

		chartLabels = [];
		chartDataValues = [];
		for(var o in chartData) {
			chartLabels.push(chartData[o].label);
			chartDataValues.push(chartData[o].value);
		}
		availColors = ColorRange.getColorRange(chartLabels.length);

		if (chartType === 'doughnut' || chartType === 'pie') {
			bgColor = availColors;
			chartOptions = {
				// fullWidth: false
			};
		} else if (chartType === 'bar') {
			bgColor = availColors[0];
			chartOptions = {
				// fullWidth: false
			};
		}

		chartDataSets = [
			{
				label: "Metric Label",
				data: chartDataValues,
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
			options: chartOptions
		});

		return thisChart;
	};

	return WidgetChart;
}];

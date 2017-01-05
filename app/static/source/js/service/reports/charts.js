module.exports = ['ColorRange', '$log', '$filter', function(ColorRange, $log, $filter) {
	var WidgetChart = {};

	WidgetChart.makeChart = function(chartType, chartCanvas, chartLabels, chartDataVals, formatter) {
		var chartData, chartDataValues, chartDataSets, bgColor;
		var chartCtx = chartCanvas.getContext("2d");
		var availColors = [];
		var midX = chartCanvas.width/2;
		var midY = chartCanvas.height/2;

		chartOptions = typeof chartOptions !== 'undefined' ? chartOptions : {
			events: false,
			// tooltips: {
			// 	enabled: false
			// },
    			animation: {
				duration: 500,
				easing: "easeOutQuart",
				onProgress: function(state) {
					if (this.type === 'bar') {
						var animation = state.animationObject;
						drawValue(this, animation.currentStep / animation.numSteps, this.formatter);
					}
				},
				onComplete: function() {
					if (this.type === 'bar') {
      						this.chart.controller.draw();
						drawValue(this, 1, this.formatter);
					} else {

						var ctx = this.chart.ctx;
						// ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
						ctx.textAlign = 'center';
						ctx.textBaseline = 'bottom';

						valFormatter = this.formatter;

						this.data.datasets.forEach(function (dataset) {
							for (var i = 0; i < dataset.data.length; i++) {
								var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
								total = dataset._meta[Object.keys(dataset._meta)[0]].total,
								mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
								start_angle = model.startAngle,
								end_angle = model.endAngle,
								mid_angle = start_angle + (end_angle - start_angle)/2;

								var x = mid_radius * Math.cos(mid_angle);
								var y = mid_radius * Math.sin(mid_angle);

		     							ctx.fillStyle = '#fff';
								// if (i === 3){ // Darker text color for lighter background
								// 	ctx.fillStyle = '#444';
								// }
								var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
								var value = String(dataset.data[i]);
								if (valFormatter) {
									value = $filter(valFormatter)(value);
								}

								ctx.font= "13px Verdana";
								ctx.fillText(value, model.x + x, model.y + y);
								// Display percent in another line, line break doesn't work for fillText
								ctx.font= "bold 16px Verdana";
								ctx.fillText(percent, model.x + x, model.y + y + 15);
							}
						});
					}
				}
			}
      		};

		// Font color for values inside the bar
		var insideFontColor = '255,255,255';
		// Font color for values above the bar
		var outsideFontColor = '0,0,0';
		// How close to the top edge bar can be before the value is put inside it
		var topThreshold = 20;

		var modifyCtx = function(ctx) {
			// ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
			ctx.font= "bold 12px Verdana";
			ctx.textAlign = 'center';
			ctx.textBaseline = 'bottom';
			return ctx;
		};

		var fadeIn = function(ctx, obj, x, y, black, step) {
			var alpha = 0;
			ctx = modifyCtx(ctx);
			ctx.fillStyle = black ? 'rgba(' + outsideFontColor + ',' + step + ')' : 'rgba(' + insideFontColor + ',' + step + ')';
			ctx.fillText(obj, x, y);
		};

		var drawValue = function(context, step, formatter) {
			var ctx = context.chart.ctx;

			context.data.datasets.forEach(function (dataset) {
				for (var i = 0; i < dataset.data.length; i++) {
					var value = String(dataset.data[i]);
					if (formatter) {
						value = $filter(formatter)(value);
					}

					var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
					var textY = (model.y > topThreshold) ? model.y - 3 : model.y + 20;
					fadeIn(ctx, value, model.x, textY, model.y > topThreshold, step);
				}
			});
		};

		availColors = ColorRange.getColorRange(chartLabels.length);

		chartDataSets = [
			{
				data: chartDataVals,
				backgroundColor: availColors,
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

		thisChart.formatter = formatter;
		thisChart.type = chartType;

		var radius = thisChart.outerRadius;

		return thisChart;
	};

	return WidgetChart;
}];

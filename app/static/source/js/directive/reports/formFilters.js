module.exports = [function() {
	var tpl = "{{ widget.id }} - {{ widget.type }} \
			<label>Filter By:</label> \
			<select class='form-control' ng-options='option.value as option.name for option in widgetFilters'> \
			<option>--select filter control--</option> \
			</select> \
			<input type='submit' class='btn btn-primary btn-sm' value='Add Another Filter' />";

	return {
		restrict: 'E',
		replace: true,
		template: tpl,
		link: function(scope, element, attrs) {
		}
	};
}];

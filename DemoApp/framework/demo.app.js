// Knockout Demo App JavaScript library
// (c) Joe McBride - http://uicraftsman.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

App.init = function () {

	var globalViewModel = {
		navItems: ko.observableArray(),
		selectedItem: ko.observable()
	};

	globalViewModel.findItemByUrl = function (url) {

		var searchUrl = url;

		if (ko.utils.stringStartsWith(searchUrl, '/')) {
			searchUrl = searchUrl.substring(1, searchUrl.length);
		}

		return ko.utils.arrayFirst(globalViewModel.navItems(), function (item) {

			return ko.utils.stringStartsWith(item.url().toLowerCase(), searchUrl.toLowerCase());
		});
	};

	globalViewModel.navItems.push(new NavItem('About', 'dashboard/about', 'App.Dashboard.About'));
	globalViewModel.navItems.push(new NavItem('Photos', 'dashboard/photos', 'App.Dashboard.Photos'));

	globalViewModel.selectedItem.subscribe(function (newValue) {

		ko.utils.arrayForEach(this.navItems(), function (item) {

			item.isSelected(false);
		});

		newValue.isSelected(true);

		App.download(newValue.type(), 'content');
	}, globalViewModel);

	ko.applyBindings(globalViewModel);

	$.address.init(function (e) {

		if ('/' === e.value) {

			globalViewModel.selectedItem(globalViewModel.navItems()[0]);
		}
	}).externalChange(function (e) {

		if ('/' !== e.value) {

			var item = globalViewModel.findItemByUrl(e.value);

			if (item) {
				globalViewModel.selectedItem(item);
			}
		}
	});
};

$(function () {

	App.init();
});
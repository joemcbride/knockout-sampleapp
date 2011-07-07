App.Namespace.Register('App.Dashboard');

App.Dashboard.Photos = function () {
	this._id;
};

App.Dashboard.Photos.prototype = {

	init: function (id) {

		this._id = id;
	}
};
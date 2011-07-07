// Knockout Demo App JavaScript library
// (c) Joe McBride - http://uicraftsman.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

var App = window.App = {};

var App = {
	name: "App"
};

App.Namespace = {
	///<remarks>http://www.codeproject.com/KB/scripting/jsnamespaces.aspx</remarks>

	Register: function (name) {
		///<summary>Registers a namespace.</summary>

		var chk = false;
		var cob = "";
		var spc = name.split(".");
		for (var i = 0; i < spc.length; i++) {
			if (cob != "") { cob += "."; }
			cob += spc[i];
			chk = this.Exists(cob);
			if (!chk) { this.Create(cob); }
		}
	},

	Create: function (name) {
		///<summary>Creates a namespace.</summary>

		var oParent = window;
		for (var arrNs = name.split("."); arrNs.length > 0; ) {
			var strName = arrNs.shift();
			// don't overwrite an existing root
			if (!oParent[strName]) {
				oParent[strName] = {};
			}
			oParent = oParent[strName];
		}
	},

	Exists: function (name) {
		///<summary>Determines whether the given namespace exists.</summary>

		var oParent = window;
		for (var arrNs = name.split("."); arrNs.length > 0; ) {
			var strName = arrNs.shift();
			if (!oParent[strName]) {
				return false;
			}
			oParent = oParent[strName];
		}

		return true;
	}
};

App.cleanId = function (id) {

	return id.replace(/^\//, "").replace(".", "-").replace(" ", "").replace("#", "");
};

App.bindTemplate = function (id, controlId, template) {

	var idToUse = controlId;

	//console.log('idToUse ' + idToUse);

	if (!idToUse) {

		idToUse = '#' + id;
	}

	$(idToUse).attr('data-bind-' + App.cleanId(id), 'template: "' + template + '"');
};

App.createDelegate = function (instance, method) {
	/// <summary>Creates a delegate.</summary>
	/// <param name="instance" mayBeNull="true"></param>
	/// <param name="method" type="Function"></param>
	/// <returns type="Function"></returns>

	return function () {
		return method.apply(instance, arguments);
	}
}

App.download = function (type, id) {

	var serviceUrl = 'services/Controls.ashx?c=' + type + "&app=" + this.name;

	$.get(serviceUrl, function (result, status) {

		if ('success' !== status)
			return;

		$(result).find('control').each(function () {

			var controlXml = $(this);

			// create control data class
			var control = {
				type: controlXml.attr('type'),
				script: controlXml.find('script').text(),
				template: controlXml.find('template').text(),
				style: controlXml.find('style').text()
			};

			var head = $('head');

			if (control.script) {

				var s = document.createElement('script');
				s.type = 'text/javascript';
				s.text = control.script;
				head.append(s);
			}

			if (control.style) {

				var style = '<style type="text/css">' + control.style + '</style>';
				head.prepend(style);
			}

			var element = $('#' + id);

			element.html(control.template);

			var viewType = eval(type);

			var instance = new viewType();

			instance.init(id);

			var newid = App.cleanId(id);

			ko.applyBindings(instance, newid);

			if (instance.loaded) {
				instance.loaded();
			}
		});
	});
};
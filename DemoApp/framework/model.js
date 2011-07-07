// Knockout Demo App JavaScript library
// (c) Joe McBride - http://uicraftsman.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

function NavItem(text, url, type) {

	this.text = ko.observable(text);
	this.url = ko.observable(url);
	this.type = ko.observable(type);
	this.isSelected = ko.observable(true);
};

function Employer(name, title, start, end) {

	this.name = ko.protectedObservable(name);
	this.title = ko.protectedObservable(title);
	this.start = ko.protectedObservable(start);
	this.end = ko.protectedObservable(end);

	this.commit = function () {

		this.name.commit();
		this.title.commit();
		this.start.commit();
		this.end.commit();
	};

	this.reset = function () {

		this.name.reset();
		this.title.reset();
		this.start.reset();
		this.end.reset();
	};
}

function User(firstName, lastName) {

	this.firstName = ko.protectedObservable(firstName);
	this.lastName = ko.protectedObservable(lastName);
	this.occupation = ko.protectedObservable();

	this.fullName = ko.dependentObservable(function () {
		return this.firstName() + ' ' + this.lastName();
	}, this);

	this.employment = ko.observableArray();

	this.commit = function () {

		this.firstName.commit();
		this.lastName.commit();
		this.occupation.commit();
	};

	var m = this;

	this.update = function (from) {

		m.firstName(from.firstName);
		m.lastName(from.lastName);
		m.occupation(from.occupation);
		m.commit();

		if (!from.employment)
			return;

		for (var i = 0; i < from.employment.length; i++) {

			var localEmployer = from.employment[i];

			m.employment.push(new Employer(localEmployer.name, localEmployer.title, localEmployer.start, localEmployer.end));
		}
	};
};










User.prototype.toJson = function () {

	var copy = ko.toJS(this);

	delete copy.fullName;
	delete copy.commit;
	delete copy.toJson;
	delete copy.update;

	if (copy.employment) {

		for (var i = 0; i < copy.employment.length; i++) {

			delete copy.employment[i].commit;
			delete copy.employment[i].reset;
		}
	}

	return copy;
}
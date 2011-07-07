// Knockout Demo App JavaScript library
// (c) Joe McBride - http://uicraftsman.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

App.Namespace.Register('App.Dashboard');

App.Dashboard.About = function () {
	this._id;
};

App.Dashboard.About.prototype = {

	user: new User('', ''),
	name: ko.observable(null),
	canEdit: ko.observable(false),

	init: function (id) {

		this._id = id;

		var vm = this;

		this.canEdit.subscribe(function (newValue) {

			if (newValue) {

				vm._addHandlers();
			}
			else {

				vm._removeHandlers();
			}
		});

		App.bindTemplate(id, '#' + id + ' .about .userInfo', 'About-Template');
	},

	loaded: function () {

		$('.editButtons a').button();

		if (this.canEdit()) {

			this._addHandlers();
		}

		this._loadData();
	},

	toggleEdit: function () {

		this.canEdit(!this.canEdit());
	},

	editName: function () {

		if (this.canEdit()) {

			var vm = this;

			$('#about-name-dialog').dialog('destroy');
			$('#about-name-dialog').dialog({
				resizable: false,
				modal: true,
				width: '600px',
				autoOpen: true,
				buttons: {
					'Save': function () {
						$(this).dialog('close');
						vm.user.firstName.commit();
						vm.user.lastName.commit();

						vm._saveData();
					},
					'Cancel': function () {
						$(this).dialog('close');
						vm.user.firstName.reset();
						vm.user.lastName.reset();
					}
				}
			});
		}
	},

	editOccupation: function () {

		if (this.canEdit()) {

			var vm = this;

			$('#about-occupation-dialog').dialog('destroy');
			$('#about-occupation-dialog').dialog({
				resizable: false,
				modal: true,
				width: '500px',
				autoOpen: true,
				buttons: {
					'Save': function () {
						$(this).dialog('close');

						vm.user.occupation.commit();
						vm._saveData();
					},
					'Cancel': function () {
						$(this).dialog('close');
						vm.user.occupation.reset();
					}
				}
			});
		}
	},

	editEmployment: function () {

		if (this.canEdit()) {

			var vm = this;

			$('#about-employment-dialog').dialog('destroy');
			$('#about-employment-dialog').dialog({
				resizable: false,
				modal: true,
				width: '800px',
				autoOpen: true,
				buttons: {
					'Save': function () {
						$(this).dialog('close');

						ko.utils.arrayForEach(vm.user.employment(), function (item) {

							item.commit();
						});

						vm._saveData();
					},
					'Cancel': function () {
						$(this).dialog('close');

						ko.utils.arrayForEach(vm.user.employment(), function (item) {

							item.reset();
						});
					}
				}
			});
		}
	},

	addEmployer: function () {

		this.user.employment.push(new Employer('', '', '', ''));
	},

	removeEmployer: function (employer) {

		this.user.employment.remove(employer);
	},

	_loadData: function () {

		$.getJSON('services/user', null, App.createDelegate(this, this._loadResult));
	},

	_loadResult: function (data, status) {

		if ('success' !== status)
			return;

		this.user.update(data);
	},

	_saveData: function () {

		var postUser = $.parseJSON(ko.toJSON(this.user));

		$.ajax({
			url: 'services/user',
			dataType: 'json',
			data: postUser,
			type: 'PUT',
			success: function (data) {

				// TODO
				console.log('successful save');
			}
		});
	},

	_addHandlers: function () {

		var nameEdit = $('.userInfo .fn');
		nameEdit.hover(
			function () {
				$(this).addClass('highlight');
			},
			function () {
				$(this).removeClass('highlight');
			}
		);

		var ocEdit = $('.userInfo .fields li');
		ocEdit.hover(
			function () {
				$(this).addClass('highlight');
			},
			function () {
				$(this).removeClass('highlight');
			}
		);
	},

	_removeHandlers: function () {

		var nameEdit = $('.userInfo .fn');
		nameEdit.unbind('mouseenter mouseleave');

		var fields = $('.userInfo .fields li');
		fields.unbind('mouseenter mouseleave');
	}
};

ko.bindingHandlers.templateEmployerList = {
	update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
		//call real template binding's update
		ko.bindingHandlers.template.update(element, valueAccessor, allBindingsAccessor, viewModel);
		var options = valueAccessor();
		var value = ko.utils.unwrapObservable(options.foreach); //creates the dependency

		$(element).children('li').children('.ui-icon-closethick').each(function (index, item) {

			$(item).click(function () { viewModel[options.click](value[index]); });
		});
	}
};
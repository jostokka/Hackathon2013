(function($, window, document, undefined){
	var AppController = {
		init: function(options, elem) {
			console.log('appcontroller')
			var self = this;
			self.elem = elem;
			self.$elem = $(elem);
			self.guid = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/x/g, function() {return Math.floor(Math.random()*16).toString(16).toUpperCase();});
			self.options = $.extend({}, $.fn.appController.options, options);
			self.templates = {};
			if (self.options.userid > 0) {
				$(self.options.canvas).html(self.loadTemplate('template-welcome')({}));
				$("#btnLogout").on('click', function() {
					self.logout();
					return false
				}); 

			} else {
				$(self.options.canvas).html(self.loadTemplate('template-register')({}));
				$("#btnReg").on('click', function() {
					self.login($("#useremail").val(), $("#userpassword").val());
					return false
				}); 
			}
			
			
			self.$elem.find('li a').each(function(index, a) {
				$.data(a, 'appController', self);
				console.log('init menu ' + a);
				$(a).on('click', function() {
					$(this).appController('loadContent', $(this).attr('template'));
					return false;
				}); 
			});
			
			//self.fetch().done(function(results){
			//});
		},

		loadTemplate : function(template) {
			var self = this;
			if (self.templates[template]) {
				return self.templates[template];
			}
			var source   = $("#"+template).html();
			var tmplate = Handlebars.compile(source);
			self.templates[template] = tmplate;
			return tmplate;
		},

		loadContent : function(template) {
			var self = this;
			$(self.options.canvas).html(self.loadTemplate(template)({}));
		},

		login: function(email, password) {
			var self = this;
			self.fetch('/login',{'email': email, 'password':password}).done(function(result){
				console.log(result.status);
				if (result.status == 'ok') {
					$(self.options.canvas).html(self.loadTemplate('template-welcome')({name:result.name}));
				} else {
					
				}
			});
		},

		logout: function() {
			var self = this;
			self.fetch('/logout',{}).done(function(result){
				console.log(result.status);
				self.options.userid = -1;
				if (result.status == 'ok') {
					$(self.options.canvas).html(self.loadTemplate('template-register')({}));
				} else {
					
				}
			});
		},

		fetch: function(url, data) {
			return $.ajax({
				url: url,
				type: 'post',
				data: data,
				dataType: 'json'
			});
		},
		
		assembleUrl: function() {
			return  this.options.url;
		}
				  

	}
	$.fn.appController = function(method) {
		// Method calling logic
		if (this.data('appController') && AppController[method]) {
			return AppController[method].apply(this.data('appController'), Array.prototype.slice.call( arguments, 1 ));
		} else if (typeof method === 'object' || ! method) {
			return this.each(function(){
				var obj = Object.create(AppController)
				obj.init(method, this);
				$.data(this, 'appController', obj);
			});
		} else {
			console.log(this.data('appController'))
			$.error( 'Method ' +  method + ' does not exist on jQuery.appController' );
		}  		
	};
    
	$.fn.appController.options = {
		url: '/rest/',
		canvas: '#content',
		userid: -1
	};
})(jQuery, window, document);


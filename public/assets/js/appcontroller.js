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
			$(self.options.canvas).html(self.loadTemplate('template-register')({}));
			self.$elem.find('li a').each(function(index, a) {
				$.data(a, 'appController', self);
				$(a).on('click', function() {
					return $(this).appController('loadContent', $(this).attr('template'));
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

		fetch: function() {
			return $.ajax({
				url: this.assembleUrl(),
				data: {},
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
		canvas: '#content'
	};
})(jQuery, window, document);


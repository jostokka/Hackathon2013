(function($, window, document, undefined){
	var AppController = {
		init: function(options, elem) {
			console.log('aappcontroller'+this)
			var self = this;
			self.elem = elem;
			self.$elem = $(elem);
			self.guid = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/x/g, function() {return Math.floor(Math.random()*16).toString(16).toUpperCase();});
			self.options = $.extend({}, $.fn.appController.options, options);
			self.templates = {};
         console.log(123);
			$(self.options.canvas).html(self.loadTemplate('template-startreg')({}));
			
			$("#btnReg").on('click', function() {
				var tmplate = self.loadTemplate('template-welcome');
				$(self.options.canvas).html(tmplate({name:'Father'}));
				return false
			}); 
			
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
         console.log("loading"+template)
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
 console.log('loadtemplate'+template)
			var self = this;
			$(self.options.canvas).html(self.loadTemplate(template)({}));
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


var forms = {
	init: function(){
		$(document).ready(function(){
			forms.ready();
		});
	},
	ready: function(){
		this.textareas();
		this.placeholders();
		this.attention();
		this.downloads();
	},
	attention: function(){
		$('input:visible:first').focus();
	},
	downloads: function(){
		var download = $('input[name="download"]');
		if ( download.length ) {
			var downloadlink = $('<a class="ui-action ui-action-main ui-action-block ui-action-large">Download File</a>')
			downloadlink.attr('href',download.val());
			$('.pardot-form-thankyou').append(downloadlink);
		}
	},
	textareas: function(){
		$('textarea:visible').each(function(){
			$(this).wrap('<div class="ui-field-helper" />').after('<div class="ui-field ui-field-sizer" />');
			$(this).on('keyup',function(){
				$(this).siblings('.ui-field-sizer').html($(this).val());
				console.log('hi')
			})
		});
	},
	placeholders: function(){
		$('.form-description').each(function(){
			var placeholder = $(this).text();
			$(this).siblings('.ui-field').attr('placeholder',placeholder);
			$(this).hide();
		});
	}
};

forms.init();

 
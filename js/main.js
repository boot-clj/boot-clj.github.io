if ( !$.fn.quartz ) {
	(function($){  
	 /**
	  * Plug in to tame form elements
	  * @param section is a parent element containing HTML form elements
	  * by Joshua Smith http://quartzui.com
	  */
	 $.fn.quartz = function() {
		
		// add a viewport
		if ( !$('head meta[name="viewport"]').length ) {
			$('head').append('<meta name="viewport" content="width=device-width, maximum-scale=1.0" />');
		}
		
		$('input').each(function(){
			switch ( $(this).attr('type') ) {
				case 'file' :
					if ( !$(this).closest('.ui-file').length ) {
						$(this).wrap('<span class="ui-action ui-file" />').closest('.ui-file').prepend('<span>Select File</span>');
					}
					$(this).change(function(){
						var quartz_split_file = $($(this)).val().split(/\\/).pop();
						$(this).closest('.ui-file').find('span').html('File: '+((quartz_split_file)?quartz_split_file:$(input).val()));
					});
					break;
				case 'checkbox' :
					if ( !$(this).closest('.ui-checkbox').length ) {
						$(this).wrap('<span class="ui-field ui-option ui-check" />').closest('.ui-check').append('<span class="ui-option-icon"></span>');
					}
					break;
				case 'radio' :
					if ( !$(this).closest('.ui-radio').length ) {
						$(this).wrap('<span class="ui-field ui-option ui-radio" />').closest('.ui-radio').append('<span class="ui-option-icon"></span>');
					}
					break;
				case undefined :
					$(this).attr('type','text');
					$(this).addClass('ui-field');
					break;
				case 'reset' :
				case 'button' :
					$(this).addClass('ui-action');
					break;
				case 'submit' :
					if ( !$(this).hasClass('ui-action') ) {
						$(this).addClass('ui-action ui-action-main');
					}
					break;
				default: 
					$(this).addClass('ui-field');
					break;
			}
		});
		$('textarea').addClass('ui-field');
		$('button').addClass('ui-action');
		$('label').each(function(){
			if ( $(this).find('input').length ) {
				$(this).addClass('ui-option-label');
			} else {
				$(this).addClass('ui-label');
			}
		});
		
		$('select').each(function(){
			if ( $(this).attr('multiple') ) {
				$(this).addClass('ui-field');
			} else if ( !$(this).closest('.ui-select').length ) {
				$(this).wrap('<span class="ui-action ui-select" />');
			}
		});
		
		if ( $('html').hasClass('ie') ) {
			// ie leaves an ugly focus effect
			$(document).on('change','.ui-select select',function(){
				$(this).blur();
			});
		}
	 };  
	})(jQuery);
	
	$(document).ready(function(){$('body').quartz();});
}


var site = {
	// run asap
	run: function(){
		site.asap();
		$(document).ready(function(){site.ready();});
		$(window).load(function(){site.load();});
	},
	asap: function(){
		site.slides();
		site.login();
	},
	// run when dom ready
	ready: function(){
		site.helpers();
		site.social();
	},
	// load when window completely loaded
	load: function(){
		
	},
	slides: function(){
		$(document).on('click','.slide .slide-toggle',function(){
			var slide = $(this).closest('.slide');
			var h = slide.find('.slide-content').outerHeight();
			slide.animate({'max-height':h},500);
			$(this).fadeOut();
			return false;
		});
	},
	helpers: function(){
	
		// make tables full width
		function table_helper(){
			var items = $('.post-body table, .post-body iframe, .post-body .full');
			if ( items.length ) {
				items.each(function(){
					var wrapper = $('<div class="fluid" />');
					wrapper.addClass('fluid-'+($(this).get(0).tagName).toLowerCase());
					items.wrap(wrapper);
				});
				function update() {
					var win = $(window).width();
					var offset = $('.post-body').offset().left;
					var containers = $('.fluid');
					containers.css({
						width: win,
						left: ('-'+offset+'px')
					});
				}
				update();
				$(window).on('resize',function(){ update(); });
			}
		}
		table_helper();
		
		// make links to other sites appear in new windows
		function link_helper(){
			var domain = document.domain;
			$('a').each(function(){
				var link = $(this);
				var href = link.attr('href'); 
				if ( href && href.indexOf(domain) == -1 && href.indexOf('/') != 0 && href.indexOf('//') != 0 && href.indexOf('#') != 0 ) {
					link.attr('target',(link.attr('target')||'_blank'));
					link.attr('rel',(link.attr('rel')||'nofollow'));
				}
			});
		}
		link_helper();
		
		// tabset helper
		function tabsets(){
			$(document).on('.tabset-tabs a','click',function(){
				$(this).siblings().removeClass('selected');
				$(this).addClass('selected');
				var target = $(this).attr('href').split('#').pop();
				$('#'+target).siblings().removeClass('selected');
				$('#'+target).addClass('selected');
			});
		}
		tabsets();
		
	},
	login: function(){
		$(document).on('click','a[href="#login"]',function(){
			$('#login').addClass('overlay-visible');
			$('#login .modal').removeClass('minimized');
			return false;
		});
		$(document).on('submit','#loginform',function(){
			var val = $.trim($(this).find('#domain').val());
			if ( val ) {
				val = val.replace('http://www','');
				val = val.replace('http://','');
				val = val.replace('.adzerk.com','');
				window.location = 'http://'+val+'.adzerk.com';
			}
			return false;
		});
		$(document).on('click','.modal-close',function(){
			$(this).closest('.modal').addClass('minimized').closest('.overlay').fadeOut(250,function(){
				$(this).removeClass('overlay-visible').removeAttr('style');
			});
			return false;
		});
		$(document).on('click','.header-menu',function(){
			$('.nav-mobile').slideToggle();
			return false;
		});
	},
	social: function(){
		function facebook(){
			(function(d, s, id) {
			  var js, fjs = d.getElementsByTagName(s)[0];
			  if (d.getElementById(id)) return;
			  js = d.createElement(s); js.id = id;
			  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=498498890223082&version=v2.0";
			  fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		}
		function twitter(){
			!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
		}
		function google(){
			(function() {
			    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
			    po.src = 'https://apis.google.com/js/platform.js';
			    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
			  })();
		}
		function linkedin(){
			$.getScript("//platform.linkedin.com/in.js")
		}
		// only add scripts if hooks are present
		if ( $('.share-facebook').length ) { facebook(); }
		if ( $('.share-twitter').length ) { twitter(); }
		if ( $('.share-google').length ) { google(); }
		if ( $('.share-linkedin').length ) { linkedin(); }
	}
}
site.run();
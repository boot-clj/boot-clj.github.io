var app_list = [];
app_list.push({ 	name: "Custom Domain",		id: 236,	min: 0,		cpm: 0,		cost: 1000,		desc: "Customize the domain your ads appear to serve from by CNAMEing your subdomains to Adzerk. Fully brand your ad calls and ad requests to keep your brand consistent across your pages."});
app_list.push({ 	name: "Sales Management",	id: 2346,	min: 0,		cpm: 0,		cost: 2000,		desc: "Book inventory and coordinate sales proposals to streamline your ad sales process. Your sales team can communicate a clear picture of your site’s sold and available inventory to advertisers, and instantly transform proposals into campaigns with a closed deal. Your ad ops and finance teams will also have full transparency into revenue and upcoming campaigns."});
app_list.push({ 	name: "UserDB",				id: 2576,	min: 1000,	cpm: 0.01,	cost: 0,		desc: "Store profiles of your users on Adzerk\'s servers for cookie-free targeting across multiple devices. Pass in a userKey with each ad request to enable frequency capping, blocked creatives, behavioral targeting, etc."});

var pricing = {
	init: function(){
		// activate the impression slider
		this.sliders();
	},
	scrolling: function(){
		if ( $('.adzerk-aside-sticky').length ) {
			$(window).scroll(function(){
				sticky_nav();
			});
			$(window).resize(function(){
				sticky_nav();
			});
			function sticky_nav(){
				if ( $(window).width() > 640 ) {
					var top_diff = $(window).scrollTop() - $('.adzerk-aside-sticky').offset().top;
					if ( top_diff < 0 ) {
						top_diff = 0;
					}
					$('.adzerk-aside-sticky').css('padding-top',top_diff);
				} else {
					$('.adzerk-aside-sticky').css('padding-top',0);
				}
			}
		}
	},
	sliders: function(){
		$('.adzerk-slider').each(function(){
			section = $(this);
			var input = section.find('input');
			var score = section.find('.adzerk-slider-score');
			score.html(pricing.format_score(input.val(),input.attr('data-format')));
			place_score(score,input.val());
			function place_score(elem,score){
				elem.css('left',((input.val()-input.attr('min'))*100/(input.attr('max')-input.attr('min'))+'%'));
			}
			var selected = 'adzerk-slider-section-selected';
			var tiles = input.closest('.adzerk-slider').find('.adzerk-slider-sections');
			tiles.find('.adzerk-slider-section:eq('+Math.round(input.val())+')').addClass(selected).siblings().removeClass(selected);
			var labels = section.find('.adzerk-slider-labels label');
			labels.each(function(i){
				$(this).css('left',((i*100)/(labels.length-1))+'%');
			});
		    var slider = section.find('.adzerk-slider-controls').slider({
				min: Number(input.attr('min')),
				max: Number(input.attr('max')),
				range: 'min',
				step: Number(input.attr('data-increment')),
				value: input.val(),
				slide: function( event, ui ) {
					input.val(ui.value);
					PricingApp.optionsController.set('impressions',ui.value);
					var score = input.closest('.adzerk-slider').find('.adzerk-slider-score');
					var selected = 'adzerk-slider-section-selected';
					var tiles = input.closest('.adzerk-slider').find('.adzerk-slider-sections');
					tiles.find('.adzerk-slider-section:eq('+Math.round(ui.value)+')').addClass(selected).siblings().removeClass(selected);
					score.html(pricing.format_score(ui.value,input.attr('data-format')));
					place_score(score,ui.value);
				}
		    });
			input.change(function() {
				slider.slider( "value", $(this).val() );
				var score = $(this).closest('.adzerk-slider').find('.adzerk-slider-score');
				score.html(pricing.format_score($(this).val(),$(this).attr('data-format')));
				place_score(score,$(this).val());
				var selected = 'adzerk-slider-section-selected';
				var tiles = input.closest('.adzerk-slider').find('.adzerk-slider-sections');
				tiles.find('.adzerk-slider-section:eq('+Math.round($(this).val())+')').addClass(selected).siblings().removeClass(selected);
			});
		});
	},
  annual_wrapper: function (term,cost) {
    if (term === 'annual') {
      cost = cost * 12;
    }
    return cost;
  },
	format_score: function (value,format) {
		switch ( format ) {
			case 'log' :
				var numerical = Math.round(Math.pow(10,value));
				switch ( true ) {
					case ( numerical >= Math.pow(10,9) ) : // billions
						numerical = numerical / Math.pow(10,9);
						return Math.round(numerical) + 'B+';
						break;
					case ( numerical >= Math.pow(10,6) ) : // millions
						numerical = numerical / Math.pow(10,6);
						return Math.round(numerical) + 'M';
						break;
					case ( numerical >= Math.pow(10,3) ) : // thousands
						numerical = numerical / Math.pow(10,3);
						return Math.round(numerical) + 'K';
						break;
					case ( numerical >= Math.pow(10,0) ) : // thousands
						return Math.round(numerical);
						break;
				}
				break;
			default :
				return value;
				break;
		}
	},
	format_number: function(val) {
		while (/(\d+)(\d{3})/.test(val.toString())){
			val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
		}
		return val;
	}
};

$(document).ready(function(){
	pricing.init();
	setupEmber();
});

window.PricingApp;

function setupEmber(){
	
	Ember.RadioButton = Ember.View.extend({  
		tagName : "input",
		type : "radio",
		attributeBindings : [ "name", "type", "value"]
	});

	// Ember application - everything goes in here
	PricingApp = Ember.Application.create();

	// Controller holding all base information - this should be a model
	PricingApp.optionsController = Ember.Controller.create({
		
		// billing cycle
		term: 'monthly',

		// Impression CPM
    monthly_impression_cpm: .02,
		annual_impression_cpm: .02,	
		
		// the lowest cpm we can charge - discount or not
		floor_cpm: .005,
		
		// contracted monthly minimum for year pricing
		impressions_min: 1000,	

		// this is the log() of the impression count
		impressions: 7,
		
		// discount rate
		discounts: [
      {   cap: 0,             year: 0     },
			{ 	cap: 25000000,			year: 0  	  },
			{ 	cap: 50000000,			year: 0   	},
			{ 	cap: 100000000,			year: 0   	},
			{ 	cap: 250000000,			year: 0    	},
			{ 	cap: 500000000,			year: .25 	},
			{ 	cap: 1000000000,		year: .50 	},
			{ 	cap: 2500000000,		year: .55  	},
			{ 	cap: 5000000000,		year: .56  	},
			{ 	cap: 10000000000,		year: .56  	},
			{ 	cap: 20000000000,		year: .56  	},
			{ 	cap: 40000000000,		year: .57  	}
		],

		// start with level of support
		support: 'standard',

		standard_cpm: 0,
		standard_min: 0,
		
		premium_cpm: 0,
		premium_min: 3000,

		// add ons (strings for now)
		apps: [],

		// past this impression count (log) we consider you an enterprise
		enterprise_impression_threshold: 8,	

		choose_month_cycle: function(){			
			this.set('term','monthly');		
			return false;	
		},
		choose_year_cycle: function(){			
			this.set('term','annual');		
			return false;	
		},

		choose_standard_support: function(){		
			this.set('support','standard');	
			return false;	
		},
		choose_premium_support: function(){	
			this.set('support','premium');	
			return false;
		},
		
		// action that shows iframe
		get_quote: function(){		this.set('quote_visible',true);			return false;		},

		// closes the quote lightbox
		close_quote: function(){ 	this.set('quote_visible',false);		return false;		},
		
		quote_visible: false,
	});

	// The summary view (goes in sidebar)
	PricingApp.pricing = Ember.View.extend({
		classNames: ['row'],
		
		
		// what is the script handle for this template
		templateName: 'adzerk-pricing-summary',

    impressions_min: 1000,
		
		rounded_impressions: function(){
			var value = this.get('controller').get('impressions');
			var numerical = Math.pow(10,value);
			switch ( true ) {
				case ( value >= 9 ) : // billions
					numerical = numerical / Math.pow(10,9);
					return Math.round(numerical) * Math.pow(10,9);
					break;
				case ( value >= 6 ) : // millions
					numerical = numerical / Math.pow(10,6);
					return Math.round(numerical) * Math.pow(10,6);
					break;
				case ( value >= 3 ) : // thousands
					numerical = numerical / Math.pow(10,3);
					return Math.round(numerical) * Math.pow(10,3);
					break;
				case ( value >= 0 ) : // thousands
					return Math.round(numerical);
					break;
			}		
		}.property('controller.impressions'),
		
		// bind the controller so both views can access it
		controller: PricingApp.optionsController,
		
		// the name of the selected support level in the right bar
		support_string: function(){
			return this.get('controller').get('support');
		}.property('controller.support'),

    term_string: function(){
      return this.get('controller').get('term');
    }.property('controller.term'),
		
		// calculate the support cost based on tier and impressions
		support_cost: function(){
			var support = this.get('controller').get('support');
			var cpm = this.get('controller').get(support+'_cpm');
			var cpm_cost = cpm*(this.get('rounded_impressions'))/1000;
      var min = this.get('controller').get(support+'_min');
      if (min > cpm_cost) cpm_cost = min;
			return cpm_cost.toFixed(2);
		}.property('rounded_impressions','controller.support'),

		// the cost of all apps combined
		app_cost: function(){
			var apps = this.get('controller').get('apps');
			var cost = 0;
			for ( var i = 0 ; i < apps.length ; i++ ) {
				if ( apps[i].get('selected') && apps[i].get('price') ) {
					cost += Number(apps[i].get('price'));
				}
			}
			return cost;
		}.property('rounded_impressions','controller.apps.length','controller.apps.@each.selected','controller.apps.@each.cpm','controller.apps.@each.min','controller.apps.@each.price'),

    scaled_app_cost: function() {
			var apps = this.get('controller').get('apps');
			var cost = 0;
			for ( var i = 0 ; i < apps.length ; i++ ) {
				if ( apps[i].get('selected') && apps[i].get('price') && (apps[i].get('cost') == 0) ) {
					cost += Number(apps[i].get('price'));
				}
			}
			return cost;
		}.property('rounded_impressions','controller.apps.length','controller.apps.@each.selected','controller.apps.@each.cpm','controller.apps.@each.min','controller.apps.@each.price'),

		// the cpm of all apps combined
		app_cpm: function(){
			var apps = this.get('controller').get('apps');
			var cpm = 0;
			for ( var i = 0 ; i < apps.length ; i++ ) {
				if ( apps[i].get('selected') && apps[i].get('cpm') ) {
					cpm += Number(apps[i].get('cpm'));
				}
			}
			return cpm;
		}.property('controller.apps.length','controller.apps.@each.selected','controller.apps.@each.cpm'),
		
		// make the support cost legible
		support_cost_string: function(){
			var cost = this.get('support_cost');
			return ( Number(cost) ) ? '$'+pricing.format_number(cost) : 'Included';
		}.property('support_cost'),
		
    tier: function(){
			var discounts = this.get('controller').get('discounts');
			var impressions = this.get('rounded_impressions');
      var i = 0;
			for ( ; i < discounts.length - 2 ; i++ ) {
        if (impressions >= discounts[i].cap && impressions < discounts[i+1].cap) {
          return i;
        }
			}
      return i+1;
		}.property('rounded_impressions','controller.discounts.@each'),

		// the number representing the minimum contracted impression count for enterprise
		impressions_tier: function(){
      var tier = this.get('tier');
			var discounts = this.get('controller').get('discounts');
			return discounts[tier].cap;
		}.property('tier','controller.discounts.@each'),
		
		// the string representing the minimum contracted impression count for enterprise
		impressions_tier_string: function(){
			tier = this.get('impressions_tier');
      if (tier == 0) {
        return "0";
      } else {
        var log = Math.log(tier) / Math.log(10);
        var tier = pricing.format_score(log,'log');
        return tier;
      }
		}.property('impressions_tier'),
				
		// make the impression number legible and abbreviated
		impression_string: function(){
      return pricing.format_score(this.get('controller').get('impressions'),'log');
		}.property('controller.impressions','controller.term'),
		
		// the sum of all cpm values used for the yearly additive text "Impression over 500M will be xxx cpm"
		total_cpm: function(){
			var total = Number(this.get('impressions_cpm'));
			total += Number(this.get('support_cpm'));
			total += Number(this.get('app_cpm'));
			return total;
		}.property('impressions_cpm','support_cpm','app_cpm'),	
		
		// if on yearly contract, the overages have a discounted cpm
		discounted_cpm: function(){
			var total = Number(this.get('total_cpm'));
			var discount = 1 - Number(this.get('discount'));
			var discounted_cpm = ( total * discount );
			var floor_cpm = this.get('controller').get('floor_cpm');
			return ( Math.max.apply( Math, [discounted_cpm,floor_cpm] ) ).toFixed(3);
		}.property('total_cpm','discount','controller.floor_cpm'),

    overage_cpm: function(){
      var total_cpm = Number(this.get('total_cpm'));
      var discount_cpm = Number(this.get('discounted_cpm'));
      var overage = total_cpm * 1.5;

      if (discount_cpm < total_cpm)
        overage = discount_cpm * 1.5;

			return overage.toFixed(3);
    }.property('total_cpm','discounted_cpm'),
		
		impressions_cpm: function(){
			var cpm = this.get('controller').get(this.get('controller').get('term')+'_impression_cpm');
			var floor_cpm = this.get('controller').get('floor_cpm').toFixed(3);
			return ( Math.max.apply( Math, [cpm,floor_cpm] ) )
		}.property('controller.term','controller.month_impression_cpm','controller.year_impression_cpm','controller.floor_cpm'),		
		
		// actual cost of impressions based on cpm
		impressions_cost: function(){
			var count = this.get('rounded_impressions');
			var term = this.get('controller').get('term');
			var cpm = this.get('controller').get(term+'_impression_cpm');
      var cpm_cost = (count/1000) * cpm;
      var min = this.get('controller').get('impressions_min');
      if (min > cpm_cost) cpm_cost = min;
			return cpm_cost;
		}.property('rounded_impressions','controller.term','controller.monthly_impression_cpm','controller.year_impression_cpm','controller.impressions_min'),
		
		// legible string containing impression cost
		impressions_cost_string: function(){
			var cost = this.get('impressions_cost');
			return '$'+pricing.format_number(cost.toFixed(2));
		}.property('impressions_cost'),
		
		isYear: function(){		return this.get('controller').get('term') == 'annual';	}.property('controller.term'),
		isMonth: function(){	return this.get('controller').get('term') == 'monthly';	}.property('controller.term'),
		
		support_cpm: function(){
			return this.get('controller').get(this.get('controller').get('support')+'_cpm');
		}.property('controller.support','controller.standard_cpm','controller.premium_cpm'),
		
		support_min: function(){
			return this.get('controller').get(this.get('controller').get('support')+'_min');
		}.property('controller.support','controller.standard_min','controller.premium_min'),
		
		discount: function(){
      var discounts = this.get('controller').get('discounts');
      var tier = this.get('tier');
      return discounts[tier].year;
		}.property('tier','controller.discounts.@each'),
		
		discount_string: function(){
			return ( this.get('discount') ) ? Number(this.get('discount')*100)+'%' : null;
		}.property('discount'),

    get_min: function() {
      var min = this.get('support_min');
      min += this.get('controller').get('impressions_min');
      return min;
    }.property('support_min', 'controller.impressions_min'),
				
		calculated_cost: function(){
			var min = this.get('get_min');

			var impression_cost = Number(this.get('impressions_cost'));
			var support_cost = Number(this.get('support_cost'));
			var app_cost = Number(this.get('app_cost'));
      var term = this.get('controller').get('term');
      var cost = ( impression_cost + support_cost + app_cost );
      if (min > cost) {
        cost = min;
      }
      if (term === "annual") {
        cost = cost * 12;
      }
      return cost;
		}.property('get_min','impressions_cost','support_min','support_cost','app_cost','controller.term'),

		// legible string containging total cost
		calculated_cost_layer: function(){
			var calculated_cost = Number(this.get('calculated_cost'));
			return pricing.format_number( calculated_cost.toFixed(2) );
		}.property('calculated_cost'),
				
		// legible string containging total cost
		final_cost: function(){
			var impression_cost = Number(this.get('impressions_cost'));
			var support_cost = Number(this.get('support_cost'));
			var app_cost = Number(this.get('app_cost'));
      var scaled_apps = Number(this.get('scaled_app_cost'));
      var non_scaled_apps = app_cost - scaled_apps;
			var discounted = ( impression_cost + scaled_apps) * ( 1 - this.get('discount') ) + support_cost + non_scaled_apps;
			var floor = ( this.get('controller').get('term') != 'monthly' ) ? ( ( this.get('rounded_impressions') ) * ( this.get('discounted_cpm') ) / 1000 ) : 0;
			return Math.max.apply( Math, [floor,discounted] );
		}.property('impressions_cost','support_cost','app_cost','discount','discounted_cpm','controller.term'),

    final_cost_layer: function(){
      var final_cost = this.get('final_cost');
      var term = this.get('controller').get('term');
      if (term === "annual") {
        final_cost = final_cost * 12;
      }
			return pricing.format_number( final_cost.toFixed(2) );
		}.property('final_cost','controller.term'),

    annual_discount_cost: function(){
      var final_cost = Number(this.get('final_cost'));
      var discount = this.get('discount');
      var annual_discount = 0;
      var calculated_cost = Number(this.get('calculated_cost'));

      if (discount != 0)
        annual_discount = (final_cost * 12) * 0.8;
      else
        annual_discount = calculated_cost * 0.8;
			return pricing.format_number( annual_discount.toFixed(2) );
		}.property('isBelowMin','final_cost','calculated_cost','discount'),

		// if we are below the monthly min, including support
		isBelowMin: function(){
			var term = this.get('controller').get('term');
			var min = Number(this.get('get_min'));
      var support_min = Number(this.get('support_min'));
			var final_cost = Number(this.get('final_cost'));
      if (support_min > min) {
        min = support_min;
      }
			return ( min > final_cost );
		}.property('controller.term','support_min','final_cost','get_min'),
		
		// if we have chosen any apps at all
		apps_selected: function(){
			var apps = this.get('controller').get('apps');
			var selected = false;
			for ( var i = 0 ; i < apps.length ; i++ ) {
				if ( apps[i].get('selected') ) {
					selected = true;
				}
			}
			return selected;
		}.property('controller.apps.length','controller.apps.@each.selected'),
		
		// returns selected apps as ember array with supplemented data
		apps: function (){
			var apps = this.get('controller').get('apps');
			for ( var i = 0 ; i < apps.length ; i++ ) {
				var cpm  = apps[i].get('cpm')*this.get('rounded_impressions')/1000
				var min = apps[i].get('min');
        var cost = apps[i].get('cost');
				var price = Math.max.apply( Math, [cpm,min,cost] );
				apps[i].set('price',price);
				apps[i].set('price_string',((price)?pricing.format_number(price.toFixed(2)):apps[i].get('cpm')));
			}
			return apps;
		}.property('controller.apps.length','controller.apps.@each.cpm','controller.apps.@each.selected','rounded_impressions'),
		
		// if this is enterprise (used to display quote button)
		enterprise: function(){
			return true;
		}.property('controller.enterprise_impression_threshold','controller.impressions','controller.term'),

	});
	
	// the abbreviated cart tally
	PricingApp.cart = PricingApp.pricing.extend({
		templateName: 'adzerk-pricing-cart',
		didInsertElement: function(){
			$('.cart').draggable({
				containment: 'window',
				start: function(){
					pos = $(this).position();
					$(this).css({top:pos.top, left: pos.left, bottom: 'auto', right: 'auto'})
				}
			});
		}
	});
	
	// Support selections
	PricingApp.support = Ember.View.extend({
		// what is the script handle for this template
		templateName: 'adzerk-pricing-support',
		
		// bind the controller so both views can access it
		controller: PricingApp.optionsController,
		
		// boolean values for support levels
		standardSupport: function(){ return ( this.get('controller').get('support') == 'standard' ); }.property('controller.support'),
		premiumSupport: function(){	return ( this.get('controller').get('support') == 'premium' ); }.property('controller.support'),
	});	
	
	// Term selections
	PricingApp.term = Ember.View.extend({
		// what is the script handle for this template
		templateName: 'adzerk-pricing-term',
		
		// bind the controller so both views can access it
		controller: PricingApp.optionsController,
		
		// boolean values for terms
		monthlyTerm: function(){ return ( this.get('controller').get('term') == 'monthly' ); }.property('controller.term'),
		annualTerm: function(){	return ( this.get('controller').get('term') == 'annual' ); }.property('controller.term'),
				
	});
	
	PricingApp.app = Ember.Object.extend(Ember.Copyable,{
		id: 0,
		min: 0,
		cpm: 0,
		cost: 0,
		name: null,
		desc: null,
		icon: null,
		selected: false,
		fromJSON: function(data){
			this.set('id',data.id);
			this.set('min',data.min);
			this.set('cpm',data.cpm);
			this.set('cost',data.cost);
			this.set('name',data.name);
			this.set('desc',data.desc);
			this.set('icon',data.icon);
		},
		toggle_select: function(){
			this.set('selected',!this.get('selected'));
		},
		cpm_string: function(){		return this.get('cpm').toFixed(2);		}.property('cpm'),
		min_string: function(){		return this.get('min').toFixed(2);		}.property('min'),
		cost_string: function(){	return pricing.format_number(this.get('cost').toFixed(2));		}.property('cost'),
		hasCost: function(){
			return ( this.get('min') || this.get('cpm') || this.get('cost') );
		}.property('min','cpm','cost')
	});

	// Support selections
	PricingApp.apps = Ember.View.extend({
		
		// what is the script handle for this template
		templateName: 'adzerk-pricing-apps',
		
		// bind the controller so both views can access it
		controller: PricingApp.optionsController,
		
		didInsertElement: function(){
			var apps = [];
			this.get('controller').set('apps',[]);
			for ( var i = 0 ; i < app_list.length ; i++ ) {
				if ( app_list[i] ) {
					var app = PricingApp.app.create();
					app.fromJSON(app_list[i]);
					this.get('controller').get('apps').pushObject(app);
				}
			}
		},
		
		toggle_select_app: function(id){
			var apps = this.get('controller').get('apps');
			for ( var i = 0 ; i < apps.length ; i++ ) {
				var app = apps[i];
				if ( app.get('id') == id ) {
					app.toggle_select();
				}
			}
		}
		
	});
	
	// quote overlay
	PricingApp.quote = Ember.View.extend({
		
		// what is the script handle for this template
		templateName: 'adzerk-pricing-quote',
		
		// bind the controller so both views can access it
		controller: PricingApp.optionsController,
		
		update_iframe: function(){
			var src = 'http://www2.adzerk.com/l/19182/2013-11-01/7gqp3';
			var fields = {
				Estimated_Monthly_Impressions: Math.round(Math.pow(10,this.get('controller').get('impressions'))/1000)*1000,
				Pricing_Quote_Details: $.trim($('#adzerk-pricing-message').text()).replace('  ',' '),
			};
			var args = [];
			for ( var x in fields ) {
				if ( fields[x] ) {
					args.push( encodeURIComponent(x) + '=' + encodeURIComponent(fields[x]) );
				}
			}
			this.set('quote_iframe',src + '?' + args.join('&'));
		}.observes('controller.quote_visible'),

		// the src attribute of the quote iframe
		quote_iframe: null,
		
	});	

	
	// define the view and add it to the DOM
	PricingApp.summaryView = PricingApp.pricing.create();
	PricingApp.summaryView.appendTo('#table');
	
	// define the view and add it to the DOM
	PricingApp.cartView = PricingApp.cart.create();
	PricingApp.cartView.appendTo('#cart');
	
	// define the view and add it to the DOM
	PricingApp.supportView = PricingApp.support.create();
	PricingApp.supportView.appendTo('#support');	
	
	// define the view and add it to the DOM
	PricingApp.termView = PricingApp.term.create();
	PricingApp.termView.appendTo('#term');

	// define the view and add it to the DOM
	PricingApp.appView = PricingApp.apps.create();
	PricingApp.appView.appendTo('#apps');	
	
	// define the view and add it to the DOM
	PricingApp.quoteView = PricingApp.quote.create();
	PricingApp.quoteView.appendTo('#quote');
}


(function(window,undefined){
    // Prepare our Variables
    var History = window.History,
        animation = false;
    // Wait for Document
    History.Adapter.onDomLoad(function(){
        // Prepare Variables
        var $content = $('#content'),
            $body = $(document.body),
            rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);
        // Ajaxify our Internal Links
        $.fn.ajaxify = function(){
            $(this).find('a[href^="/"]').not('[href*="."]').add('a[href^="'+rootUrl+'"]').addClass('ajaxify').unbind('click').bind('click',function(event){
                var $this = $(this), url = $this.attr('href'), title = $this.attr('title')||null;
                window.History.pushState(null,title,url);
                event.preventDefault();
                return false;
            });
            return this;
        };
        // Ajaxify Page
        $body.ajaxify();
        // Hook into State Changes
        var first = true;
        $(window).bind('statechange',function(){
            // Prevent Initial
            if ( first ) { first = false; return; };
            // Prepare Variables
            var State = window.History.getState(),
                url = State.url,
                relativeUrl = url.replace(rootUrl,'');
            // Set Loading
            $body.addClass('loading');
            // Ajax Request the Traditional Page
            $.get(url,function(data){
                // Find the content in the page's html, and apply it to our current page's content
                if ( animation ) {
                    $content.stop(true,true).fadeOut('slow',function(){
                        $content.html($(data).find('#content')).ajaxify();
                        $content.fadeIn('slow');
                        $body.removeClass('loading');
                    });
                } else {
                    $content.hide().html($(data).find('#content')).ajaxify().show();
                    $body.removeClass('loading').animate({scrollTop:0},1);
                }
                // Inform Google Analytics of the change
                if ( typeof pageTracker !== 'undefined' ) {
                    pageTracker._trackPageview(relativeUrl);
                }
            }); // end get
        }); // end onStateChange
    }); // end onDomLoad
})(window);
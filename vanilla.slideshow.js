/**
 * Vanilla Slideshow ;) (https://github.com/xylphid)
 * Version 0.1.4
 *
 * @author Anthony PERIQUET
 */
(function(vanilla) {
    var currentSlideshow = null;
    var resize = {
        time: null,
        timeout: false
    };

    vanilla.slideshow = function( query, options ){
        if (!(this instanceof vanilla.slideshow))
            return new vanilla.slideshow( query, options );

        this.options = extend(vanilla.slideshow.defaults, options);
        this.autostart = this.options.autostart;
        this.opened = false;
        this.slides = [];

        if (typeof query !== typeof undefined) {
            this.elm = vanilla( query );
            currentSlideshow = this;

            // Bind window resize
            vanilla(window).on('resize', function() {
                if (!currentSlideshow.opened) return;
                resize.time = new Date();
                if (resize.timeout === false) {
                    resize.timeout = true;
                    setTimeout( vanilla.slideshow.resize, 200 );
                }
            });
            // Bind slideshow opening
            if (!this.elm.attr('data-single'))
                vanilla(document).on('click', query, function(e) { e.preventDefault(); return vanilla.slideshow.open( e.value ); });

            // Bind keyboard event
            vanilla(document).on('keydown', function(event) {
                if (currentSlideshow && currentSlideshow.opened) {
                    if (event.which == 27) vanilla.slideshow.close();
                    if (!currentSlideshow.elm.attr('data-single') && event.which == 37) vanilla.slideshow.prev();
                    if (!currentSlideshow.elm.attr('data-single') && event.which == 39) vanilla.slideshow.next();
                }
            });
        }
    };

    vanilla.slideshow.prototype = {
        constructor: vanilla.slideshow,

        // Open the slideshow
        open: function( elm ) {
            if ( elm instanceof vanilla )
                this.elm = elm;
            this.setOverlay();
            this.setModal();
            this.showSpinner();
            this.show();
            this.opened = true;
            return false;
        },
        
        // Define background overlay
        setOverlay: function() {
            vanilla('.overlay').remove();
            this.overlay = vanilla('<div>')
                .addClass('overlay')
                .css('background', this.options.overlay)
                .css('bottom', 0)
                .css('display', 'none')
                .css('height', '100%')
                .css('left', 0)
                .css('opacity', this.options.opacity)
                .css('position', 'fixed')
                .css('right', 0)
                .css('top', 0)
                .css('width', '100%')
                .css('z-index', this.options.zIndex)
                .appendTo('body')
                .fadeIn();
        },
        
        // Define the modal
        setModal: function() {
            vanilla( '.vanilla-slideshow' ).remove();
            this.modal = vanilla('<div>').addClass( 'vanilla-slideshow' )
                .append( vanilla('<div>').addClass( 'vanilla-slider' ) )
                .append( this.getActions() )
                .appendTo( 'body' )
                .swipe('left', function(event) { vanilla.slideshow.next(); })
                .swipe('right', function(event) { vanilla.slideshow.prev(); });
            this.center();
        },
        
        // Get actions menu
        getActions: function() {
            actions = vanilla('<div>').addClass('actions')
                .append( vanilla('<a>').addClass('fullscreen').on('click', function(event){ vanilla.slideshow.fullscreen(); }) )
                .append( vanilla('<a>').addClass('close').on('click', this.close) );
            if (!this.elm.attr('data-single'))
                actions.prepend( vanilla('<a>').addClass('play').on('click', function(event){ vanilla.slideshow.play(); }) )
                    .prepend( vanilla('<a>').addClass('next').on('click', function(event){ vanilla.slideshow.next(); }) )
                    .prepend( vanilla('<a>').addClass('prev').on('click', function(event){ vanilla.slideshow.prev(); }) )
            return actions;
        },
        
        // Show slide
        show: function( callbackDirection ) {
            this.showSpinner();
            var resizable = this.options.resizeUrl ? 
                this.options.resizeUrl
                    .replace('{width}', parseInt(this.modal.css('width')))
                    .replace('{height}', parseInt(this.modal.css('height'))) : '';
            var slide = vanilla('<img>').attr('src', this.elm.attr('href') + resizable)
                .addClass('slide')
                .addClass( this.options.scaling )
                .attr('alt', 'Vanilla Slideshow')
                .load(function() {
                    vanilla(this).prependTo( '.vanilla-slideshow > .vanilla-slider' );
                    currentSlideshow.centerSlide();
                    vanilla.slideshow.hideSpinner();

                    // If callbackDirection animate the previous slide out
                    if (callbackDirection)
                        currentSlideshow.slideOut( callbackDirection );
                    
                    // Set timeout till next slide
                    if (vanilla.slideshow.isPlaying())
                        vanilla.slideshow.setPlayer(setTimeout(vanilla.slideshow.next, currentSlideshow.options.slideDelay));
                });
            this.slides.push(slide);
        },

        centerSlide: function() {
            var slide = this.slides.slice(-1)[0];
            if (this.options.scaling == 'fill') {
                scalingH = this.modal.outerHeight() / slide.nodes[0].naturalHeight;
                scalingW = this.modal.outerWidth() / slide.nodes[0].naturalWidth;
                var scale = scalingH > scalingW ? scalingH : scalingW;
                var marginTop = (this.modal.outerHeight() - (slide.nodes[0].naturalHeight * scale)) / 2;
                slide.css('transform-origin', '0px 0px 0px')
                    .css('transform', 'translate3d(0px, ' + marginTop + 'px, 0px) scale(' + scale + ')');
            }
        },

        // Center the modal
        center: function() {
            this.modal.css('left', "50%")
                .css('margin-left', -(this.modal.outerWidth() / 2) + 'px')
                .css('margin-top', -(this.modal.outerHeight() / 2) + 'px')
                .css('position', 'fixed')
                .css('top', "50%")
                .css('z-index', this.options.zIndex + 1);
        },

        // Manage window resize event
        resize: function() {
            if (new Date() - resize.time < 200) {
                setTimeout( vanilla.slideshow.resize, 200 );
            } else {
                resize.timeout = false;
                this.center();
                this.centerSlide();
            }
        },

        // Show spinner (loading)
        showSpinner: function() {
            this.working = true;
            if (!this.options.showSpinner) return;
            this.spinner = this.spinner || vanilla('<div>').addClass('spinner');
            this.modal.prepend(this.spinner);
        },

        // Hide spinner (content loaded)
        hideSpinner: function() {
            if (this.spinner) this.spinner.remove();
            this.working = false;
        },

        // Close the slideshow
        close: function() {
            currentSlideshow.modal.fadeOut(100);
            currentSlideshow.overlay.fadeOut()
                .css('z-index', -1);
            this.opened = false;
        },

        // Animate de previous slide out
        slideOut: function(dir) {
            var slide = this.slides.shift();
            // Attach transition end event
            slide.on('transitionend', function() {
                vanilla(this).remove();
            });
            slide.addClass(dir == 'left' ? 'removeToLeft' : 'removeToRight');
        },

        // Go to next slide
        next: function() {
            if (this.options.single) return;
            next = this.elm.next();
            if (!next) { next = this.elm.parent().firstChild(); }
            this.elm = next;
            this.show( 'left' );
        },

        // Go to prevous slide
        prev: function() {
            if (this.options.single) return;
            previous = this.elm.prev();
            if (!previous) { previous = this.elm.parent().lastChild(); }
            this.elm = previous;
            this.show( 'right' );
        },

        // Play the slideshow
        play: function() {
            this.options.autostart = !this.options.autostart;
            this.options.autostart ? this.setPlayer(setTimeout(vanilla.slideshow.next, currentSlideshow.options.slideDelay)) : clearTimeout(this.player);
        },

        // Check if the slideshow is currently playing
        isPlaying: function() {
            return this.options.autostart;
        },

        // Define the player
        setPlayer: function( player ) {
            this.player = player;
        },

        // Display the slide to fullscreen (new window)
        fullscreen: function() {
            if (this.isPlaying()) {
                this.options.autostart = !this.options.autostart;
                clearTimeout(this.player);
            }
            window.open( this.elm.attr('href') );
        }
    };

    // Slideshow default options
    vanilla.slideshow.defaults = {
        autostart: false,
        opacity: 0.75,
        overlay: '#000',
        resizeUrl: null,
        scaling: 'fitmax',
        showSpinner: true,
        slideDelay:5000,
        zIndex: 1,
    }

    vanilla.slideshow.dispatcher = function( event, callable ) {
        if (!currentSlideshow || typeof currentSlideshow[callable] != 'function') return;
        if (/Event/.test(event)) event.preventDefault();
        currentSlideshow[callable]( event );
        return currentSlideshow; 
    };
    vanilla.slideshow.open = function(event) {
        return vanilla.slideshow.dispatcher( event, 'open');
    };
    vanilla.slideshow.close = function(event) {
        return vanilla.slideshow.dispatcher( event, 'close');
    };
    vanilla.slideshow.hideSpinner = function(event) {
        return vanilla.slideshow.dispatcher( event, 'hideSpinner');
    };
    vanilla.slideshow.next = function(event) {
        return vanilla.slideshow.dispatcher( event, 'next');
    };
    vanilla.slideshow.prev = function(event) {
        return vanilla.slideshow.dispatcher( event, 'prev');
    };
    vanilla.slideshow.play = function(event) {
        return vanilla.slideshow.dispatcher( event, 'play');
    };
    vanilla.slideshow.isPlaying = function(event) {
        if (!currentSlideshow) return;
        return currentSlideshow.isPlaying();
    };
    vanilla.slideshow.setPlayer = function(player) {
        if (!currentSlideshow) return;
        currentSlideshow.setPlayer(player);
    };
    vanilla.slideshow.fullscreen = function(event) {
        return vanilla.slideshow.dispatcher( event, 'fullscreen');
    };
    vanilla.slideshow.resize = function(event) {
        vanilla.slideshow.dispatcher( event, 'resize');
    };


    // Common.js extend method: https://github.com/commons/common.js
    var extend = function(destination, source) {
        destination = typeof destination != typeof undefined ? destination : {};
        for (var property in source) {
            if (source[property] && source[property].constructor && source[property].constructor === Object) {
                destination[property] = destination[property] || {};
                arguments.callee(destination[property], source[property]);
            } else {
                destination[property] = source[property];
            }
        }
        return destination;
    };

    vanilla.prototype.slideshow = function(options) {
        if (this instanceof vanilla) {
            this.attr('data-single', 'true');
            currentSlideshow = new vanilla.slideshow(this, options);
            vanilla.slideshow.open();
        }
        return this;
    };

    vanilla(document).on('click', 'a[data-slideshow]', function(event) {
        event.preventDefault();
        vanilla(event.value).slideshow();
    });
    
}) (vanilla);
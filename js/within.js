var enterWithin = (function() {
    var selectors = {
            document: document,
            window: window,
            body: 'body, html',
            scene: '.realm',
            layers: '.layer',
            depth: '.env__depth',
            menu: '.main-nav',
            anchor: 'a[href^="#"]'
        },
        classes = {
            activeMenu: 'nav_item-active'
        },
        distance = 500,
        speed = 2000,
        current = {
            layer: 0,
            progress: 0,
            menu: ''
        },
        depth,
        layers,
        nodes;

    function zoomEnv() {
        var scroll = nodes.window.scrollTop();

        scroll = scroll >= 0 ? (scroll <= depth ? scroll : depth) : 0;

        current.layer = (scroll / distance) | 0;
        current.progress = (scroll - (current.layer * distance)) / distance;
        current.overallProgress = (scroll / (distance * layers));

        setZPosition(nodes.scene, scroll);

        updateActive();
    }

    function updateActive() {

        var position = current.layer + Math.round(current.progress);

        var currentLayer = $('.layer[data-depth="' + (position + 1) * distance + '"]'),
            lastLayer = $('.layer[data-depth="' + position * distance + '"]');

        setOpacity(current.progress, currentLayer);
        reduceOpacity(current.progress, lastLayer);
        //var progress = '';
        //console.log(current.progress);
        /// jumps forward at 1.5

        if (position !== current.menu) {

            var layer = $('.layer[data-depth="' + position * distance + '"]');

            hideImages();
            showActiveImages(layer);

            nodes.menu.find('.' + classes.activeMenu).removeClass(classes.activeMenu);

            nodes.menu.find('a[href="#' + layer.attr('id') + '"]').addClass(classes.activeMenu);

            current.menu = position;
        }

    }

    function setZPosition(element, z) {
        element.css({
            '-webkit-transform': 'translate3d(0, 0px, ' + z + 'px)',
            '-moz-transform': 'translate3d(0, 0, ' + z + 'px)',
            'transform': 'translate3d(0, 0, ' + z + 'px)'
        });
    }

    function scrollToLayer(target) {
        nodes.body.stop(true).animate({
            'scrollTop': target
        }, speed);
    }

    function setDepth() {
        layers = nodes.layers.length;

        depth = (distance * (layers -1)) + nodes.window.height();
        //console.log(depth);

        nodes.depth.css('height', depth + 'px');
    }

    function hideImages() {
        $('.layer').removeClass('active-now');
        //$('img').addClass('hidden');
        $('img').each(function(){
            var element = $(this);
            element.attr('src', "img/test.gif").addClass('hidden');
        });
    }

    function showActiveImages(layer) {
        setTimeout(function(){
            var thisLayer = layer.find('img');

            layer.addClass('active-now');

            if (layer.hasClass('one')) {
                thisLayer.attr('src', 'img/kick.gif').removeClass('hidden');
            } else if (layer.hasClass('two')) {
                thisLayer.attr('src', 'img/hendyriding.gif').removeClass('hidden');
            } else if (layer.hasClass('three')) {
                thisLayer.attr('src', 'img/ridetheirlegsoff.gif').removeClass('hidden');
            } else if (layer.hasClass('four')) {
                thisLayer.attr('src', 'img/nzflagie.gif').removeClass('hidden');
            } else if (layer.hasClass('five')) {
                thisLayer.attr('src', 'img/gohendygo.gif').removeClass('hidden');
            } else if (layer.hasClass('six')) {
                thisLayer.attr('src', 'img/go.gif').removeClass('hidden');
            }

        }, 0);
    }

    function setOpacity(progress, layer) {
        var testOpacityContainer = layer.find('.test-opacity'),
            four = layer.hasClass('four');
            video = testOpacityContainer.find('.video');
            doubleProgress = progress * 2,
            fadeInSegment = progress <= .5;

        console.log(layer);

        if (testOpacityContainer.length == 1 && fadeInSegment && video.length > 0) {
            playVideo(video);
            testOpacityContainer.css('opacity', doubleProgress);
        } else if (testOpacityContainer.length == 1 && fadeInSegment && four) {
            testOpacityContainer.css('opacity', doubleProgress);
        }

    }

    function playVideo(vid) {
        var playing = vid.is('playing');
        console.log(vid);
        if (!playing && vid.length > 0) {
            vid.addClass('playing');
            vid.get(0).play();
        }
    }

    function reduceOpacity(progress, layer) {
        var testOpacityContainer = layer.find('.test-opacity'),
            doubleProgress = 1 - ((progress * 2) - 1),
            fadeOutSegment = progress >= .5;

        if (testOpacityContainer.length == 1 && fadeOutSegment) {
            testOpacityContainer.css('opacity', doubleProgress);
        }

    }

    return {
        init: function() {
            nodes = utils.createNodes(selectors);

            setDepth();

            $.each(nodes.layers, function() {
                var layer = $(this);

                setZPosition(layer, -layer.data('depth'));
            });

            zoomEnv();

            var throttledZoom = _.throttle(zoomEnv, 25);

            nodes.window.on('scroll', throttledZoom);

            nodes.window.on('resize', setDepth);

            nodes.anchor.on('click', function (event) {
                var target = $($(this).attr('href')).data('depth');

                scrollToLayer(target);
                event.preventDefault();
            });
        }
    }

})(jQuery);

$(function () {
    enterWithin.init();
});
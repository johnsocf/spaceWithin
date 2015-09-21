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
        console.log(scroll);
        scroll = scroll >= 0 ? (scroll <= depth ? scroll : depth) : 0;

        current.layer = (scroll / distance) | 0;
        current.progress = (scroll - (current.layer * distance)) / distance;
        current.overallProgress = (scroll / (distance * layers));

        setZPosition(nodes.scene, scroll);

        updateActive();
    }

    function updateActive() {

        var position = current.layer + Math.round(current.progress);

        if (position !== current.menu) {

            var layer = $('.layer[data-depth="' + position * distance + '"]');
            console.log(layer);

            $('.layer').removeClass('active-now');
            //$('img').addClass('hidden');
            $('img').each(function(){
                var element = $(this);
                element.attr('src', "img/test.gif").addClass('hidden');
                console.log(element);
            });
            //$('img').attr('src', "img/test.gif").addClass('hidden');

            setTimeout(function(){
                //layer.append("<div class=\"test-case-wrapper\"><img class=\"hidden\" src=\"img/testcase.gif\"/></div>");
                layer.find('img').attr('src', 'img/testcase.gif').removeClass('hidden');
                console.log(layer.find('img'));
            }, 0);
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

        nodes.depth.css('height', depth + 'px');
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
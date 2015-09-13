var enterWithin = (function() {
    var selectors = {
            document: document,
            window: window,
            body: 'body, html',
            scene: '.scene',
            layers: '.layer',
            depth: '.env__depth',
            menu: '.menu',
            anchor: 'a[href^="#'
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

        setActive();
    }

    function updateActive() {

        var position = current.layer + Math.round(current.progress);

        if (position !== current.menu) {

            var layer = $('.layer[data-depth="' + position * distance + '"]');

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

            zoomScene();

            var throttledZoom = _.throttle(zoomScene, 25);

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
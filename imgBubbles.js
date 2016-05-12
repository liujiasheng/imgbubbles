jQuery.fn.imgBubbles = function(options){
    var $=jQuery;

    var setting=$.extend({}, {
        maxWidth: 300,
        maxHeight: 300,
        speed:'fast'
    }, options); //merge options w/ default settings

    var getPicShowHeight = function(src, maxWidth, maxHeight) {
        var img = new Image();
        img.src = src;
        var picHeight = img.height > maxHeight ? maxHeight : img.height;
        if (img.width > maxWidth) {
            picHeight = img.height * maxWidth / img.width;
            picHeight = picHeight > maxHeight ? maxHeight : picHeight;
        }
        return picHeight;
    };
    var getPicShowWidth = function(src, maxWidth, maxHeight) {
        var img = new Image();
        img.src = src;
        var picWidth = img.width > maxWidth ? maxWidth : img.width;
        if (img.height > maxHeight) {
            picWidth = img.width * maxHeight / img.height;
            picWidth = picWidth > maxWidth ? maxWidth : picWidth;
        }
        return picWidth;
    };

    $('.temp_pic_div').live('mouseleave', function () {
        $(this).stop();
        $('.temp_pic_div').remove();
    });

    return this.each(function() { //return jQuery obj

        $(this).live('mouseenter', function (event) {
            var $bubblewrap = $(this);

            var src = $bubblewrap.attr('imgsrc');
            var div = "<div id='temp_pic_div' class='temp_pic_div' style='position: absolute; z-index:1000;display: none;'></div>";
            $('.temp_pic_div').remove();
            $('body').append(div);

            //html宽高
            var winHeight = $(window).height();
            var winWidth = $(window).width();

            //光标位置
            var x = event.clientX;
            var y = event.clientY;

            //显示展开效果
            var expandEffect = function () {

                //图片实际展示宽高
                var picHeight = getPicShowHeight(src, setting.maxWidth, setting.maxHeight);
                var picWidth = getPicShowWidth(src, setting.maxWidth, setting.maxHeight);
                $('#temp_pic_div img').css({
                    width: picWidth,
                    height: picHeight
                });

                //计算x，y偏差值
                var commonFixed = 5;
                var XRightFixed = winWidth - picWidth/2 - x - commonFixed;
                var YBottomFixed = winHeight - picHeight/2 - y - commonFixed;
                if (XRightFixed < 0) { x += XRightFixed; }
                if (YBottomFixed < 0) { y += YBottomFixed; }
                var XLeftFixed = x - picWidth / 2 - commonFixed;
                var YTopFixed = y - picHeight / 2 - commonFixed;
                if (XLeftFixed < 0) { x -= XLeftFixed; }
                if (YTopFixed < 0) { y -= YTopFixed; }
                
                $('.temp_pic_div').show().css({
                    left: (parseInt(x)) + "px",
                    top: (parseInt(y)) + "px",
                    width: '1px',
                    height: '1px'
                }).animate({
                    top: (parseInt(y) - picHeight / 2) + "px",
                    left: (parseInt(x) - picWidth / 2 ) + "px",
                    width: picWidth + 'px',
                    height: picHeight + 'px'
                }, setting.speed);
            };

            //插入img 
            var img = new Image();
            img.onload = expandEffect;
            img.src = src;
            
            $('#temp_pic_div').html(img);

        });

    });

};


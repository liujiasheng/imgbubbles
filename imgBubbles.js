jQuery.fn.imgBubbles = function(options){
    var $=jQuery;

    var setting=$.extend({}, {
        maxWidth: 300,
        maxHeight: 300,
        speed:'fast',
        showLoading: true, //show loading icon or not
        loadingImgSrc: 'images/loading.gif'
    }, options); //merge options with default settings

    var isLoading = false;
    
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
    var showLoading = function () {
        isLoading = true;
        $('.imgBubbleLoading').show();
    };
    var hideLoading = function () {
        isLoading = false;
        $('.imgBubbleLoading').hide();
    };
    var showFail = function () {
        
    };
    
    if (setting.showLoading) {
        var loadingDiv = '<div class="imgBubbleLoading" id="imgBubbleLoading" style="display: none; position: absolute"></div>';
        $('body').append(loadingDiv);
        var img = new Image();
        img.src = setting.loadingImgSrc;
        $('.imgBubbleLoading').html(img);

        var GetMouse = function(event) {
            var x = event.clientX - 8;
            var y = event.clientY - 8;
            document.getElementById("imgBubbleLoading").style.left = x + "px";
            document.getElementById("imgBubbleLoading").style.top = y + "px";
        };
        $('body').bind('mousemove', function(event){
            GetMouse(event);
        });
    }
    
    $('.temp_pic_div').live('mouseleave', function () {
        $('.temp_pic_div').remove();
    });

    return this.each(function() { //return jQuery obj

        $(this).bind('mouseenter', function (event) {
            if (isLoading) {
                
                return;
            }
            var $bubbleWrap = $(this);
            showLoading();
            var src = $bubbleWrap.attr('imgsrc');
            var div = "<div id='temp_pic_div' class='temp_pic_div' style='position: absolute; z-index:1000;display: none;'></div>";
            $('.temp_pic_div').remove();
            $('body').append(div);

            //window width and height
            var winHeight = $(window).height();
            var winWidth = $(window).width();

            //cursor x y
            var x = event.clientX;
            var y = event.clientY;

            //show expand effect
            var expandEffect = function () {
                hideLoading();
                //image's width and height to show
                var picHeight = getPicShowHeight(src, setting.maxWidth, setting.maxHeight);
                var picWidth = getPicShowWidth(src, setting.maxWidth, setting.maxHeight);
                $('.temp_pic_div img').css({
                    width: picWidth,
                    height: picHeight
                });
                //calculate fixed value of x y
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

            //insert image
            var img = new Image();
            img.onload = expandEffect;
            img.src = src;
            
            $('.temp_pic_div').html(img);

        });
    });

};


jQuery.fn.imgBubbles = function(options){
    var $=jQuery;

    var setting=$.extend({}, {
        maxWidth: 300,
        maxHeight: 300,
        speed:'fast',
        showLoading: true,  //show loading icon or not
        showFail: true,     //show loading fail icon or not
        loadingImgSrc: 'images/loading.gif',
        failImgSrc: 'images/error.png'
    }, options); //merge options with default settings

    var isLoading = false;
    var bubbleIndex = 1;
    
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
    var showLoading = function ($obj) {
        isLoading = true;
        if (setting.showLoading) {
            var loadingDiv = '<div class="imgBubbleNotice"></div>';
            $obj.append(loadingDiv);
            var img = new Image();
            img.src = setting.loadingImgSrc;
            $('.imgBubbleNotice').html(img);
        }
    };
    var hideLoading = function ($obj) {
        isLoading = false;
        $('.imgBubbleNotice').remove();
    };
    var showFail = function ($obj) {
        isLoading = true;
        if (setting.showFail) {
            var loadingDiv = '<div class="imgBubbleNotice"></div>';
            $obj.append(loadingDiv);
            var img = new Image();
            img.src = setting.failImgSrc;
            $('.imgBubbleNotice').html(img);
        }
    };
    
    $('.imgBubbleExpand').live('mouseleave', function () {
        $('.imgBubbleExpand').remove();
    });

    return this.each(function() { //return jQuery obj
        $(this).addClass('imgBubble');
        $(this).bind('mouseenter', function (event) {
            if (isLoading) {
                return;
            }
            var $bubbleWrap = $(this);
            showLoading($bubbleWrap);
            var src = $bubbleWrap.attr('imgsrc');
            var divId = 'imgBubbleExpand-' + bubbleIndex ++;
            var div = "<div id='" + divId + "' class='imgBubbleExpand'></div>";
            $('.imgBubbleExpand').remove();
            $('body').append(div);

            //window width and height
            var winHeight = $(window).height();
            var winWidth = $(window).width();

            //cursor x y
            var x = event.clientX;
            var y = event.clientY;

            //show expand effect
            var expandEffect = function () {
                hideLoading($bubbleWrap);
                if ($('#'+divId).hasClass('hide')) {
                    return;
                }
                //image's width and height to show
                var picHeight = getPicShowHeight(src, setting.maxWidth, setting.maxHeight);
                var picWidth = getPicShowWidth(src, setting.maxWidth, setting.maxHeight);
                $('.imgBubbleExpand img').css({
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
                
                $('.imgBubbleExpand').show().css({
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
            img.onerror = function () { showFail($bubbleWrap) };
            img.src = src;
            
            $('#'+divId).html(img);
           
            $(this).bind('mouseleave', function (event) {
                $('#'+divId).addClass('hide');
                hideLoading($(this));
            });
            
        });
        
    });

};


$(function(){
    var appendCurrent  = null;
    var cateIndex      = 0;
    var cateId         = 0;
    var start          = 0;
    var move           = 0;
    var startTimes     = 0;
    var moveTimes      = 0;
    var endTimes       = 0;
    var moveEnd        = 0;
    var moveMax        = 0;
    var selectWidth    = 0;
    var transWidth     = 0;
    var allTypesWrap   = null;
    var selectTypes    = null;
    var selectTypesLi  = null;
    var dropdownList   = null;
    var dropdownListLi = null;
    var allwrapWidth   = 0;
    var moveType       = false;

    var tabView = {
        init: function () {
            this.render();
            this.elem();
        },
        render: function () {
            allTypesWrap   = $('.allTypesWrap');
            selectTypes    = allTypesWrap.find('.selectAllTypes');
            selectTypesLi  = selectTypes.find('li');
            dropdownList   = $('.dropdownCateList');
            dropdownListLi = dropdownList.find('li');
            // 默认第一个选中
            selectTypesLi.eq(0).addClass('categorySelected');
            dropdownListLi.eq(0).addClass('categorySelected');
            // 防止叠加，重设0
            selectWidth = 0;
            // 动态赋值selectAllTypes宽度
            selectTypesLi.each(function (x, y) {
                selectWidth += parseInt($(y).css('width'), 10);
            });
            selectTypes.width(selectWidth);
            allwrapWidth = parseInt(allTypesWrap.css('width'), 10);
            moveMax      = selectWidth - allwrapWidth;
            selectWidth <= allwrapWidth ? moveType = false : moveType = true;
        },
        elem: function () {
            // 点击箭头
            $('body').on('click', '.cityPickerDown', function(){
                var $this = $(this);
                if (dropdownList.hasClass('hidden')) {
                    dropdownList.removeClass('hidden');
                    $this.addClass('allCategorySelected');
                } else {
                    dropdownList.addClass('hidden');
                    $this.removeClass('allCategorySelected');
                }
            });

            // 点击选择
            $('body').on('click', '.selectAllTypes li, .dropdownCateList li', function(){
                var $this = $(this);
                cateIndex = $this.index();
                cateId    = $this.data('cate-id');

                selectTypesLi.eq(cateIndex).addClass('categorySelected').siblings('li').removeClass('categorySelected');
                dropdownListLi.eq(cateIndex).addClass('categorySelected').siblings('li').removeClass('categorySelected');
                dropdownList.addClass('hidden');
                $('.cityPickerDown').removeClass('allCategorySelected');

                // 防止叠加，重设0
                transWidth  = 0;
                if (selectWidth >= allwrapWidth) {
                    // 点击移动效果
                    selectTypesLi.each(function (x, y) {
                        if (x < cateIndex - 1) {
                            transWidth -= parseInt($(y).css('width'), 10);
                        }
                    });
                    // 判断可移动的最大值
                    if (-transWidth >= moveMax) {
                        transWidth = -moveMax;
                    }
                    selectTypes.css({
                        'transition-duration': '300ms',
                        'transform': 'translate3d(' + transWidth + 'px, 0, 0)'
                    });
                }
            });

            // 触摸事件
            $('.selectAllTypes').on({
                'touchstart': function (event) {
                    start      = event.targetTouches[0].pageX;
                    startTimes = new Date().getTime();
                },
                'touchmove': function (event) {
                    moveTimes = new Date().getTime();
                    console.log(moveType);
                    console.log(moveTimes - startTimes);
                    if (moveType && moveTimes - startTimes > 100) {
                        move = event.targetTouches[0].pageX - start;
                        moveEnd = transWidth + move;
                        selectTypes.css({
                            'transition-duration':' 0ms',
                            'transform': 'translate3d(' + moveEnd + 'px, 0, 0)'
                        });
                    }
                },
                'touchend': function (event) {
                    endTimes = new Date().getTime();
                    if (moveType && endTimes - startTimes > 100) {
                        transWidth = moveEnd;
                        if ( -transWidth > moveMax ) {
                            selectTypes.css({
                                'transition-duration': '300ms',
                                'transform': 'translate3d(' + -moveMax + 'px, 0, 0)'
                            });
                            transWidth = -moveMax;
                        } else if (transWidth > 0) {
                            transWidth = 0;
                            selectTypes.css({
                                'transition-duration': '300ms',
                                'transform': 'translate3d(' + transWidth + 'px, 0, 0)'
                            });
                        }
                    }
                }
            });
        }
    }

    tabView.init();
})

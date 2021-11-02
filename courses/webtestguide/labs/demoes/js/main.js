$(function(){
    /*
     */
    var href = "";
    var pos = 0;
    $(".nav-tags a").click(function(e){
        $(".nav-tags li").each(function () {
            $(this).removeClass("active");
        });
        $(this).parent("li").addClass("active");
        e.preventDefault();
        href = $(this).attr("href");
        pos = $(href).position().top - 30;
        $("html,body").animate({ scrollTop: pos }, 500);
    });
    $(".nav-item.active").next().css("display", "block");

    $.fn.linkFavour = function() {
        var id = $(this).data("id"),
            action = $(this).data('action'),
            rateHolder = $(this).children('.count');
        if ($(this).hasClass('done')) {
            $(this).removeClass('done');
            var _this = $(this);
            var ajaxData = {
                linkId: id,
            };
            $.ajax({
                type: "POST",
                url: currentController+"/ajaxFavour",
                data: ajaxData,
                beforeSend: function () {
                    // _this.find('i').animate({
                    //     "fontSize": "15px"
                    // }, 1, function () {
                    //     $(this).animate({
                    //         "fontSize": "15px"
                    //     }, 1);
                    // });

                },
                success: function(data) {
                    $(rateHolder).html(data);
                }
            });
            return false;
        } else {
            $(this).addClass('done');
            var _this = $(this);
            var ajaxData = {
                linkId: id,
            };
            $.ajax({
                type: "POST",
                url: currentController+"/ajaxFavour",
                data: ajaxData,
                beforeSend: function () {
                    // _this.find('i').animate({
                    //     "fontSize": "15px"
                    // }, 1, function () {
                    //     $(this).animate({
                    //         "fontSize": "15px"
                    //     }, 1);
                    // });

                },
                success: function(data) {
                    $(rateHolder).html(data);
                }
            });
            return false;
        }
    };
    $(document).on("click", ".favour", function() {
        $(this).linkFavour();
    });

    $(".btn-mobile-sidenav").click(function () {
        if ($(this).find(".nav-bar").hasClass("nav-bar-animate")) {
            $(this).find(".nav-bar").removeClass("nav-bar-animate");
            $(".sidenav").removeClass("show-sidenav").addClass("hide-sidenav");
            $(".mobile-header-wrap .sidenav-mark").animate({
                opacity: 0,
            }, 500, function(){
                $(this).remove();
            });
            $('body').css({
                'overflow': 'auto'
            });
        } else {
            $(this).find(".nav-bar").addClass("nav-bar-animate");
            $(".sidenav").addClass("show-sidenav").removeClass("hide-sidenav");
            $(".mobile-header-wrap").append("<div class='sidenav-mark'></div>");
            $('body').css({
                'overflow': 'hidden'
            });
        }
    });

    // var UA = navigator.userAgent.toLowerCase();
    // var scrollWidth = 0;
    // if(UA.indexOf("chrome")>0 && UA.indexOf("edge")<0) {
    //     scrollWidth = "4px";
    // } else if (UA.indexOf("edge")>0) {
    //     scrollWidth = "12px";
    // } else {
    //     scrollWidth = "17px";
    // }

    // $(".sidenav").hover(
    //     function(){
    //         $('body').css({
    //             'overflow': 'hidden',
    //             'paddingRight': scrollWidth,
    //         });
    //     },
    //     function(){
    //         $('body').css({
    //             'overflow': 'auto',
    //             'paddingRight': "0px",
    //         });
    //     }
    // );
    var x = 10;
    var y = 20;

    /**
     * Show Tooltip
     * start
     */
    $("a.link-tooltip").mousemove(function(e){
        var linkTooltip = $("#link-tooltip");
        if(!linkTooltip.length){
            this.tooltipTitle = this.title;
            this.title = "";
            linkTooltip = $("<div id='link-tooltip'><div class='tooltip-content'>"+this.tooltipTitle+"</div></div>");
            $("body").append(linkTooltip);
        }

        linkTooltip.css({
            "top": (e.pageY+y) + "px",
            "left": (e.pageX+x) + "px"
        }).show("fast");

    }).mouseout(function(){
        this.title = this.tooltipTitle;
        $("#link-tooltip").remove();
    });
    /**
     * Show Tooltip
     * end
     */

    $(".tool-img").each(function () {
        $(this).bind({
            mouseenter: function () {
                $(this).find(".tool-platform").slideDown(160);
            },
            mouseleave: function () {
                $(this).find(".tool-platform").slideUp(160);
            }
        });
    });

    Navigator.init();
});

var Navigator = {

    wrapper: null,

    transition: 'transform 0.5s',

    itemHeight: 43,

    displayedItem: 1,

    autoPlaySpeed:8,

    playing: false,

    init : function()
    {
        var ins = this;

        this.wrapper = $('.selected-nav-link-wrapper');

        if(!this.wrapper.size()) return;

        this.wrapper.get(0).style.transition = this.transition;

        this.wrapper.on('transitionend WebkitAnimationEnd', function(){
            ins.animationEnd();
        });

        $('.navigator .up').click(function(){
            ins.playUp();
            return false;
        });

        $('.navigator .down').click(function(){
            ins.playDown();
            return false;
        });

        this.autoPlayStart();

        $('.selected-nav').on('mouseover', function(){ ins.autoPlayStop(); });
        $('.selected-nav').on('mouseout', function(){ ins.autoPlayStart(); });
    },

    playUp: function()
    {
        if(this.playing) return;

        this.playing = true;

        var offsetPx = -this.displayedItem * this.itemHeight + this.itemHeight;
        this.wrapper.get(0).style.transform = 'translateY('+ offsetPx +'px)';

        this.displayedItem--;
    },

    playDown: function()
    {   
        if(this.playing) return;

        this.playing = true;

        var offsetPx = -this.displayedItem*this.itemHeight - this.itemHeight;
        this.wrapper.get(0).style.transform = 'translateY('+ offsetPx +'px)';

        this.displayedItem++;
    },

    autoPlayStart: function()
    {
        var ins = this;
        window.NavigatorAutoPlayT = setInterval(function(){ins.playDown()}, this.autoPlaySpeed*1000);
    },

    autoPlayStop: function()
    {
        clearInterval(window.NavigatorAutoPlayT);
    },

    animationEnd : function()
    {
        var ins = this;

        if(this.playing) this.playing = false;
        else this.wrapper.get(0).style.transition = this.transition;

        if(this.displayedItem > this.wrapper.children().size() - 2)
        {
            this.displayedItem = 1;
            this.wrapper.get(0).style.transition = 'transform 0s';
            this.wrapper.get(0).style.transform = 'translateY('+ -this.displayedItem*this.itemHeight +'px)';

            setTimeout(function(){ins.animationEnd()}, 100);
        }
        else if(this.displayedItem == 0)
        {
            this.displayedItem = this.wrapper.children().size() - 2;
            this.wrapper.get(0).style.transition = 'transform 0s';
            this.wrapper.get(0).style.transform = 'translateY('+ -this.displayedItem*this.itemHeight +'px)';

            setTimeout(function(){ins.animationEnd()}, 100);
        }
    }
}
        
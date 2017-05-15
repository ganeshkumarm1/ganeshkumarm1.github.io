$(document).ready(function(){

    $(window).on('load', function() {
        $('.spinner').fadeOut(500);
    });

    //Smooth transition
    $(function() {
        $('a.page-scroll').bind('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 1500, 'swing');
            event.preventDefault();
        });
    });

    //scroll spy
    $('body').scrollspy({
        target: '.navbar-default'
    })

    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    $('#areas').click(function () {
        $('#areas-modal').modal('show');
    });
    $('#languages').click(function () {
        $('#languages-modal').modal('show');
    });
    $('#tools').click(function () {
        $('#tools-modal').modal('show');
    });
    $('#frameworks').click(function () {
        $('#frameworks-modal').modal('show');
    });


        $('.abelio').click(function () {
            $('#abelio-modal').modal('show');
        });
        $('.org').click(function () {
            $('#org-modal').modal('show');
        });
        $('.timer').click(function () {
            $('#timer-modal').modal('show');
        });
        $('.wiki').click(function () {
            $('#wiki-modal').modal('show');
        });

});

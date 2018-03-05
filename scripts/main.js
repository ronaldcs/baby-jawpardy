window.resizeiframe = function(){
    $('iframe').each(function(){
        if($(this).data("last-height") == this.height){
            return;

        }
        this.height = this.contentWindow.document.body.scrollHeight;
        $(this).data("last-height", this.height);
    })
}

$(window).resize(function(e){
    if(e.originalEvent){
        return;
    }

    $('.table-row').each(function(){
        $(this).css("display", "block");
        var width = $(this).width();
        var count = $(this).children().length
        var cell_width = 1.0*(width)/count
        $(this).children().css({
            width: cell_width
        });
        $(this).css("display", "table");
    });

    var number_of_rows = $('#question-grid .table-row').length + $("#categories").length;

    var top = $('#categories').offset().top;
    var border_bottom_width = 2*parseInt($('#question-grid .table-row:last-child').css("border-bottom-width"), 10);
    var bottom = $(window).height();

    if($("#teams:visible").length){
        bottom = $('#teams').offset().top;
    }

    var offset = bottom - top - border_bottom_width;

    var height_per_row = offset/number_of_rows;
    $('#question-grid .table-cell').css({
        height: height_per_row
    });
    if($("#categories").length > 0){
        $("#categories .table-cell").css({ 
            height: height_per_row
        });
    }

    window.resizeiframe();
});

$(document).ready(function(){
    $('#question-modal').on("click", '#answer-button', function() {
        modal.reveal();
    })

    $('#question-modal').on("click", '#continue-button', function() {
        modal.hide();
    });

    // prevent the buttons from being highlighted
    $('body').on("mousedown", ".minus, .plus", function(e){
        e.preventDefault();
    });

    $('body').on("click", ".plus", function(e){
        var $points = $(this).closest(".team").find(".points")
        var points = parseInt($points.text())
        var val = parseInt($(".active-question").attr("data-points") || 100);
        points += val;
        $points.text(points);

        $('.active-question h3').css({
            "opacity": 0
        })
    });

    $('body').on("click", ".minus", function(e){
        var $points = $(this).closest(".team").find(".points")
        var points = parseInt($points.text())
        var val = parseInt($(".active-question").attr("data-points") || 100);
        points -= val;
        $points.text(points);

        $('.active-question h3').css({
            "opacity": 0
        })
    });

    if(window.MathJax){
        $('.mathy').each(function(){
            this.innerText = '`' + this.innerText + '`';
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,this]);
        })
    }

    game.getData().then(function(snapshot) {
        game.handleData(snapshot.val());
        $('body').animate({opacity:1}, 500);
        $(window).resize();
    });
});

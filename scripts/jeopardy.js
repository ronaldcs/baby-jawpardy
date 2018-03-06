var game = {};
game.init = function() {
    var val = $('#options select').val();
    $('#options').hide();
    var teams = $('#teams .team');
    for(var i = 0; i < val; i++){
        $(teams[i]).show();
    }
    $('#gameplay').css("filter", "blur(0px)");
    $(window).resize();
}
game.getData = function() {
	return db.ref('/categories').once('value');
}
game.handleData = function(data) {
    $.each(data[0].clues, function() {
        $('#question-grid').append($('<div>', {"class": "table-row"}));
    });
    $.each(data, function(categoryIndex, category) {
        $('#categories.table-row').append($.templates("#category").render(category));
        $.each(category.clues || Array(5).fill({amount:0,answer:"",question:""}), function(clueIndex, clue) {
            $($('#question-grid .table-row')[clueIndex]).append($.templates("#clue").render(clue));
        });
    });

    $('#question-grid .table-cell:not(.empty)').on("click", function() {
        // figure out the point value of the thing that was clicked
        modal.show(this);
    });
}

var capSizes = function(el, max_width){
    return;
    var treeWalker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, null, false);
    while(treeWalker.nextNode()){
        node = treeWalker.currentNode;
        if(node.tagName == "IMG" && !node.complete){
            node.style.maxWidth = "0";
        } else {
            try {
                node.style.maxWidth = max_width + "px";
            } catch (e) {
        		// Do nothing
            }
        }
    }

}

var trimHTML = function(el) {
    var treeWalker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
    while(treeWalker.nextNode()){
        var node = treeWalker.currentNode;
    }
    var nodes_to_delete = [];
    do {
        var node = treeWalker.currentNode;
        if(node.nodeType == 3 && $.trim(node.data) == ""){
            nodes_to_delete.push(node);
        } else if(node.tagName == "SCRIPT"){

        } else if (node.tagName == "BR"){
            nodes_to_delete.push(node);
        } else if(node.tagName == "P" && $.trim($(node).text()) == ""){
            nodes_to_delete.push(node);
        } else {
            break;
        }
    } while(treeWalker.previousNode())
    for(var i = 0; i < nodes_to_delete.length; i++){
        $(nodes_to_delete[i]).remove();
    }

}

// var calculateSize = function(el) {
//     var max_width = Math.floor($(window).width() * .9);
//     var max_height = (($('#teams').offset().top || $(window).height()) - $(el).offset().top)/2.0;
//     var html = el.innerHTML
//     var text = $(el).text();

//     var div = document.createElement("div");
//     div.className = "answer-wrapper"
//     div.style.display = "block";
//     div.style.overflowX = "auto";
//     div.style.position = "absolute";
//     div.style.left = "0";
//     div.style.top = "0";
//     div.style.zIndex = 1000;
//     div.style.width = max_width + "px";
//     // first, scale the text
//     div.innerText = text.replace(/\n/g, '');

//     var body = $('body').get(0);
//     body.appendChild(div);
//     font_size = 50;
//     // do {
//     //     div.style.fontSize = font_size + "px";
//     //     var w = div.offsetWidth
//     //     var h = div.offsetHeight;
//     //     if(w <= max_width && h <= max_height){
//     //         break;
//     //     }
//     //     font_size--;
//     // } while(font_size);
//     div.parentNode.removeChild(div);
//     el.style.fontSize = font_size + 'px';
// }

var modal = function() {};

modal.reveal = function() {
    var q = $('#question-modal').find(".question")
    q.css({
        "display": "block",
    });
    function scrollTo(element, to, duration) {
        var start = element.scrollTop,
            change = to - start,
            currentTime = 0,
            increment = 20;
            
        var animateScroll = function() {        
            currentTime += increment;
            var val = easeInOutQuad(currentTime, start, change, duration);
            element.scrollTop = val;
            if(currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }

    //t = current time
    //b = start value
    //c = change in value
    //d = duration
    function easeInOutQuad(t, b, c, d){
      t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };

    var original_val = $('#question-modal .modal-inner').scrollTop()
    $('#question-modal .modal-inner').scrollTop(0)
    var val = $('#question-modal .question').offset().top - $('#question-modal .modal-inner').offset().top
    $('#question-modal .modal-inner').scrollTop(original_val)
    scrollTo($('#question-modal .modal-inner').get(0), val, 250)

    setTimeout(function() {
        q.addClass("reveal");
    }, 0)

    $('.active-question h3').css({
        "opacity": 0
    })
}

modal.show = function(cell) {
    $('.active-question').removeClass("active-question");
    $(cell).addClass("active-question");
    var position = $(cell).closest(".table-row").children().index(cell);
    var category = $($("#categories .table-cell").get(position)).text()
    var points = $(cell).attr("data-points");
    $('#question-title').text(category + " for " + points);
    var bbox = cell.getBoundingClientRect();
    $('#question-modal').css({
        "display": "block",
        "opacity": 0,
    })

    $('#question-modal .modal-inner').html(
        $(cell).find(".answer").prop("outerHTML") +
        $(cell).find(".question").prop("outerHTML")
    )

    $('#question-modal .modal2').scrollTop(0)

    trimHTML($('#question-modal .answer').get(0))
    trimHTML($('#question-modal .question').get(0))
    

    // calculateSize($('#question-modal .modal-inner').get(0))

    var h = ($('#teams').offset().top || $(window).height()) - $('#question-modal .modal2').offset().top - 20;
    $('#question-modal .modal-inner').css({
        maxHeight: h
    });
    $('#question-modal .modal2').css({
        height: h
    })

    $('#question-modal').css({
        transform: "translate(" + bbox.x + "px, " + bbox.y  + "px) scale(" + (bbox.width/$(window).width()) + ", " + (bbox.height / $(window).height()) + ")",
        opacity: 1
    })


    $(window).on("keydown.question-modal", function(e){
        var ESC = 27
        var SPACE = 32
        if(e.keyCode == ESC){
            e.preventDefault();
            modal.hide();
        } else if(e.keyCode == SPACE){
            e.preventDefault();
            modal.reveal();
        }
    });

    $('.expanded').removeClass("expanded");
    
    setTimeout(function() {
        $('#question-modal').addClass("expanded");
        $('#question-modal').css({
            top:0,
            left:0,
            bottom:0,
            right:0,
            width: '100%',
            height: '100%',
            borderWidth:0,
            transform: "translate(0px, 0px) scale(1)"
        });
    }, 1);

}

modal.hide = function() {
    $(window).off("keydown.question-modal");
    $('#question-modal').hide()
    $('#question-modal').removeClass("expanded");
    $('#question-modal').css({
        borderWidth:3
    });
}

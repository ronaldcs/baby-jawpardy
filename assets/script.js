var game={init:function(){var e=$("#options select").val();$("#options").hide();for(var o=$("#teams .team"),t=0;t<e;t++)$(o[t]).show();$("#gameplay").css("filter","blur(0px)"),$(window).resize()},getData:function(){return db.ref("/categories").once("value")},handleData:function(e){$.each(e[0].clues,function(){$("#question-grid").append($("<div>",{class:"table-row"}))}),$.each(e,function(t,e){$("#categories.table-row").append($.templates("#category").render(e)),$.each(e.clues,function(e,o){$($("#question-grid .table-row")[t]).append($.templates("#clue").render(o))})}),$("#question-grid .table-cell:not(.empty)").on("click",function(){modal.show(this)})}},capSizes=function(e,o){},trimHTML=function(e){for(var o=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,null,!1);o.nextNode();)var t=o.currentNode;var a=[];do{if(3==(t=o.currentNode).nodeType&&""==$.trim(t.data))a.push(t);else if("SCRIPT"==t.tagName);else if("BR"==t.tagName)a.push(t);else{if("P"!=t.tagName||""!=$.trim($(t).text()))break;a.push(t)}}while(o.previousNode());for(var i=0;i<a.length;i++)$(a[i]).remove()},calculateSize=function(e){var o=Math.floor(.9*$(window).width()),t=(($("#teams").offset().top||$(window).height())-$(e).offset().top)/2,a=(e.innerHTML,$(e).text()),i=document.createElement("div");i.className="answer-wrapper",i.style.display="block",i.style.overflowX="auto",i.style.position="absolute",i.style.left="0",i.style.top="0",i.style.zIndex=1e3,i.style.width=o+"px",i.innerText=a.replace(/\n/g,""),$("body").get(0).appendChild(i),font_size=100;do{i.style.fontSize=font_size+"px";var n=i.offsetWidth,s=i.offsetHeight;if(n<=o&&s<=t)break;font_size--}while(font_size);return i.parentNode.removeChild(i),e.style.fontSize=font_size+"px",font_size},modal=function(){};modal.reveal=function(){var e=$("#question-modal").find(".question");e.css({display:"block"});var o=$("#question-modal .modal-inner").scrollTop();$("#question-modal .modal-inner").scrollTop(0);var i,t,n,s,l,d,r,a=$("#question-modal .question").offset().top-$("#question-modal .modal-inner").offset().top;$("#question-modal .modal-inner").scrollTop(o),i=$("#question-modal .modal-inner").get(0),t=a,n=250,s=i.scrollTop,l=t-s,d=0,(r=function(){var e,o,t,a=(e=d+=20,o=s,t=l,(e/=n/2)<1?t/2*e*e+o:-t/2*(--e*(e-2)-1)+o);i.scrollTop=a,d<n&&setTimeout(r,20)})(),setTimeout(function(){e.addClass("reveal")},0),$(".active-question h3").css({opacity:0})},modal.show=function(e){$(".active-question").removeClass("active-question"),$(e).addClass("active-question");var o=$(e).closest(".table-row").children().index(e),t=$($("#categories .table-cell").get(o)).text(),a=$(e).attr("data-points");$("#question-title").text(t+" for "+a);var i=e.getBoundingClientRect();$("#question-modal").css({display:"block",opacity:0}),$("#question-modal .modal-inner").html($(e).find(".answer").prop("outerHTML")+$(e).find(".question").prop("outerHTML")),$("#question-modal .modal2").scrollTop(0),trimHTML($("#question-modal .answer").get(0)),trimHTML($("#question-modal .question").get(0));calculateSize($("#question-modal .modal-inner").get(0));var n=($("#teams").offset().top||$(window).height())-$("#question-modal .modal2").offset().top-20;$("#question-modal .modal-inner").css({maxHeight:n}),$("#question-modal .modal2").css({height:n}),$("#question-modal").css({transform:"translate("+i.x+"px, "+i.y+"px) scale("+i.width/$(window).width()+", "+i.height/$(window).height()+")",opacity:1}),$(window).on("keydown.question-modal",function(e){27==e.keyCode?(e.preventDefault(),modal.hide()):32==e.keyCode&&(e.preventDefault(),modal.reveal())}),$(".expanded").removeClass("expanded"),setTimeout(function(){$("#question-modal").addClass("expanded"),$("#question-modal").css({top:0,left:0,bottom:0,right:0,width:"100%",height:"100%",borderWidth:0,transform:"translate(0px, 0px) scale(1)"})},1)},modal.hide=function(){$(window).off("keydown.question-modal"),$("#question-modal").hide(),$("#question-modal").removeClass("expanded"),$("#question-modal").css({borderWidth:3})};
window.resizeiframe=function(){$("iframe").each(function(){$(this).data("last-height")!=this.height&&(this.height=this.contentWindow.document.body.scrollHeight,$(this).data("last-height",this.height))})},$(window).resize(function(t){if(!t.originalEvent){$(".table-row").each(function(){$(this).css("display","block");var t=1*$(this).width()/$(this).children().length;$(this).children().css({width:t}),$(this).css("display","table")});var e=$("#question-grid .table-row").length+$("#categories").length,i=$("#categories").offset().top,n=2*parseInt($("#question-grid .table-row:last-child").css("border-bottom-width"),10),s=$(window).height();$("#teams:visible").length&&(s=$("#teams").offset().top);var a=(s-i-n)/e;$("#question-grid .table-cell").css({height:a}),0<$("#categories").length&&$("#categories .table-cell").css({height:a}),window.resizeiframe()}}),$(document).ready(function(){$("#question-modal").on("click","#answer-button",function(){modal.reveal()}),$("#question-modal").on("click","#continue-button",function(){modal.hide()}),$("body").on("mousedown",".minus, .plus",function(t){t.preventDefault()}),$("body").on("click",".plus",function(t){var e=$(this).closest(".team").find(".points"),i=parseInt(e.text());i+=parseInt($(".active-question").attr("data-points")||100),e.text(i),$(".active-question h3").css({opacity:0})}),$("body").on("click",".minus",function(t){var e=$(this).closest(".team").find(".points"),i=parseInt(e.text());i-=parseInt($(".active-question").attr("data-points")||100),e.text(i),$(".active-question h3").css({opacity:0})}),window.MathJax&&$(".mathy").each(function(){this.innerText="`"+this.innerText+"`",MathJax.Hub.Queue(["Typeset",MathJax.Hub,this])}),game.getData().then(function(t){game.handleData(t.val()),$("body").animate({opacity:1},500),$(window).resize()})});
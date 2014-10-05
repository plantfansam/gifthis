createButton = function(parentjelem) {
  uniq_id = "_gifthis" + getButtonHash(parentjelem)
  offset = parentjelem.offset();
  parentjelem.addClass(uniq_id);
  dialog = $("<div id='" + uniq_id + "' class='_gifthis_button' style='z-index:1000;'>\
  gifthis<span class='_gifthis_minimize'>x</span></div>");
  $("body").after(dialog); 
  return dialog;
}

getButtonHash = function(jelem) {
  return jelem.attr("src").hashCode()
}
var x = {}
//ripped from http://stackoverflow.com/a/7616484/945795
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

$(document).ready(function() {
  $("img").hover(function(e) {
    if ($(this).hasClass("_gifthis_pop_disabled")) {
      return false
    } else if ($(this).width() < 100) {
      return false
    } else {
      $(this).addClass("_gifthis_pop_disabled")
      button = createButton($(this))
      button.css({"top" : $(this).offset()["top"] + "px", "left" : $(this).offset()["left"] + "px"});
    }
  }, function() {
    //setTimeout(function(x){hideButton(getButtonHash(x))}, 2000, $(this));
  })
  $(document).on("click", "._gifthis_button", function() {
    button = $(this);
    button.addClass("_gifthis_loader");
    button.html('');
    image = $("." + button.attr("id"));
    image.css({"height": image.height(), "width":image.width() });
    $.getJSON("http://api.giphy.com/v1/gifs/search?q=pizza&api_key=dc6zaTOxFJmzC&limit=1")
      .done(function(response) {
        gif_url = response.data[0].images.original.url
        button.remove();
        image.addClass("_gifthis_pop_disabled");
        image.attr("src", gif_url);
      });
  })
  $(document).on("click", "._gifthis_minimize", function(e) {
    image = $("." + $(this).parent("div").attr("id"));
    image.addClass("_gifthis_pop_disabled");
    $(this).parent("div").remove();
    return false
  })
});

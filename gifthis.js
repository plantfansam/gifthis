createButton = function(parentjelem) {
  uniq_id = "gifthis" + getButtonHash(parentjelem)
  offset = parentjelem.offset();
  dialog = $("<div id='" + uniq_id + "' class='_gifthis_button' style='z-index:1000;'>\
  gifthis</div>");
  $(parentjelem).after(dialog); 
  return uniq_id;
}

hideButton = function(uniq_id) {
  $("#gifthis" + uniq_id).hide();
}

getButtonHash = function(jelem) {
  return jelem.attr("src").hashCode()
}

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
  $("img").each(function() {
    createButton($(this));
  })
  $("img").hover(function() {
    button = $("#gifthis" + getButtonHash($(this)));
    button.css("top", $(this).offset()["top"], "left", $(this).offset()["left"]);
    button.show()
  }, function() {
    setTimeout(function(x){hideButton(getButtonHash(x))}, 2000, $(this));
  })
  $("._gifthis_button").on("click", function() {
    $(this).addClass("_gifthis_loader");
    $(this).html('');
    $.ajax({
      url: "test.html",
    }).done(function(e) {
      $(this).removeClass( "_gifthis_loader" );
    });
    image = $(this).prev('img');
    image.css({"height": image.height(), "width":image.width() });
    image.attr("src", "");
  })
});

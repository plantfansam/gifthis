var common_words = ["the","be","to","of","and","a","in","that","have","I","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him","know","take","person","into","year","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","us", "video", "photo", "tease", "teaser", "thumb", "thumbnail", "for", "web", "sub", "version", "png"]

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
  return jelem.attr("src").hashCode();
}

getQueryTerm = function(jelem) {
  words = []

  //first check image src for a word
  filename = jelem.attr("src").split("/").pop().split(".")[0].toLowerCase();
  words = words.concat(filename.match(/[a-z]{3,}/g));
  
  //check the title
  title_words = $("title").text().split(/\||-/)[0].split(" ")
  words = words.concat(title_words);

  //try meta keywords and override other stuff if it exists
  if ($("meta[name=keywords]").length > 0) {
    words = $("meta[name=keywords]").attr("content").split(",")
    words = words.map(function(v){return v.split("(")[0]})
  };

  console.log(words);
  console.log(typeof(words));
  if (words.length > 0) {
    good_words = [];
    for (i = 0; i < words.length; i++) { 
      if (common_words.indexOf(words[i]) === -1) {
        if (words[i] !== null) {
          good_words.push(words[i].trim())
        }
      }
    }
  }
  good_words = good_words.filter(function(v){return v!==''}).filter(function(v){return v.trim()});
  return good_words[Math.floor(Math.random() * good_words.length)]
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
    query_term = getQueryTerm(image);
    $.getJSON("http://api.giphy.com/v1/gifs/search?q=" + query_term + "&api_key=dc6zaTOxFJmzC&limit=5")
      .done(function(response) {
        button.width(image.width());
        button.css({
          "letter-spacing": "1px",
          "font-size": "10px",
          "line-height": "14px",
          "font-weight": "normal",
          "height": "auto"
        });
        button.removeClass("_gifthis_loader");
        if (response.data.length > 0) {
          gif_url = response.data[Math.floor(Math.random() * response.data.length)].images.original.url
          button.html("matched search \"" + query_term + "\"");
          image.addClass("_gifthis_pop_disabled");
          image.attr("src", gif_url);
          image.attr("srcset", gif_url);
        } else {
          button.html("no matches for " + query_term + "...");  
        }
      });
  })
  $(document).on("click", "._gifthis_minimize", function(e) {
    image = $("." + $(this).parent("div").attr("id"));
    image.addClass("_gifthis_pop_disabled");
    $(this).parent("div").remove();
    return false
  })
});

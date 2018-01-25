$(document).ready(function() {

  function displaySearchResults(results, store) {
    var searchResults = $('#search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];
        appendString += '<div class="post-box"><h2 class="header small-header item-header"><a href="' + item.url + '">' + item.title + '</a></h2>';
        appendString += '<p class="item-description">' + item.content.substring(0, 150) + '...</p></div>';
      }

      $(searchResults).html(appendString);
    } else {
      $(searchResults).html('<div class="post-box">No results found</div>');
    }
  };

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  };

  var searchTerm = getQueryVariable('query');

  if (searchTerm) {
    $('#search-box').val(searchTerm);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('category');
      this.field('content');
    });

    for (var key in window.store) { // Add the data to lunr
      idx.add({
        'id': key,
        'title': window.store[key].title,
        'category': window.store[key].category,
        'content': window.store[key].content
      });

      var results = idx.search(searchTerm); // Get lunr to perform a search
      displaySearchResults(results, window.store); // We'll write this in the next section
    }
  }
});

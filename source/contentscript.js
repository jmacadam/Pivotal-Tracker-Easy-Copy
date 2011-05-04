chrome.extension.sendRequest({'action': 'pageStart'});
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    var storyId = getStoryId(last_mousedown_element);
    switch(request.action){
    case 'copyId':
      animateStatus("Copied: " + storyId);
      sendResponse(storyId);
      break;
    case 'copyCommit':
      var title = getStoryTitle(last_mousedown_element);
      var co = "[#"+storyId+"] "+title;
      animateStatus(co);
      sendResponse(co);
      break;
    case 'copyBranch':
      var title = getStoryType(last_mousedown_element);
      var branch = "git checkout -b "+storyId+"-"+title+"-";
      animateStatus(branch);
      sendResponse(branch);
      break;
    }
    
    
  });

var last_mousedown_element = null;

function getStoryId(element){
  return element.attr('id').replace(/.*?(\d+).*/,"$1");
}

function getStoryTitle(element){
  //strips (IN) out--could probably do that with some .html() multiline or something.
  return $(element.find('.storyPreviewText > span:eq(1)')[0]).text().replace(/(.*)\(.*\)/,"$1");
}

function getStoryType(element){
  //strips (IN) out--could probably do that with some .html() multiline or something.
  var fname = $(element.find('img.storyTypeIcon')[0]).attr('src').split('/').pop();
  fname = fname.split('.')[0];
  return fname;
}

function animateStatus(text){
  text = "Copied: " + text;
  $('<div id="copy-msg">').css({ color: 'black' }).html(text).prependTo('#status');
  $('#status').fadeIn(10).delay(1000).fadeOut(500, function() { $('#copy-msg').remove(); })
}

$(document).ready(function(){
  $('.item').live('click', function(e){
    if (e.shiftKey) {
      var storyId = getStoryId($(this));
      animateStatus(storyId);
      chrome.extension.sendRequest({'text' : storyId});
    }
  });
  $('.item').live('mousedown', function(e){
    last_mousedown_element = $(this);
  });
  
});

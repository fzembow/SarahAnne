
var TRIE_URL = 'trie.json';
var HOVER_TIMEOUT = 250;
var MAX_WORDS = 10;

var LETTERS_EL = document.getElementById('letters');
var WORDS_MATCHING_EL = document.getElementById('words_matching');


var trieView;

TrieView = function(el, trie){

  var words = [];
  var stack = [];
  var deepestNode;
  var depth = 0;

  var totalWidth = el.offsetWidth;
  var hoverTimeout = null;

  function getAvailableLetters(trie){
    var container = document.createElement("div");
    var keys = Object.keys(trie).filter(function(key) { return key != "\n" }).sort();
    // TODO: Can weight by occurrence.
    var letterWidth = Math.floor(totalWidth / keys.length) + 'px';
    keys.forEach(function(key){
      var letter = document.createElement("span");
      letter.className = 'leaf';
      letter.style.width = letterWidth;
      letter.innerText = key;

      // Mouse over
      letter.addEventListener("mouseover", function(e){
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
        }
        hoverTimeout = setTimeout(function(){
          var elem = e.target;
          var activeSibling = elem.parentNode.querySelector('.active');
          if (activeSibling) {
            activeSibling.classList.remove('active');
          }
          elem.classList.add('active');
          var letter = elem.innerText;

          depth = getSiblingDOMIndex(elem.parentNode);

          while (stack.length > depth){
            stack.pop();
            el.removeChild(el.children[el.children.length - 1]);
          }

          stack.push(letter);

          var numChilden = trie[letter][0];

          deepestNode = trie[letter][1];

          var words = dumpTrie(stack.join(''), deepestNode, MAX_WORDS);
          showMatchingWords(words);

          appendTrieLevel(deepestNode);
        }, HOVER_TIMEOUT);
      });

      container.appendChild(letter);
    });
    return container;
  }

  function appendTrieLevel(trie){
    el.appendChild(getAvailableLetters(trie));
  }
  appendTrieLevel(trie);

}


function showMatchingWords(words) {
  WORDS_MATCHING_EL.innerHTML = '';
  words.forEach(function(word){
    var el = document.createElement('div');
    el.innerText = word;
    WORDS_MATCHING_EL.appendChild(el);
  });
}


function dumpTrie(prefix, trie, maxResults) {
  var words = [];
  dumpTrieRecursive(prefix, trie, maxResults, words);
  return words
}

function dumpTrieRecursive(prefix, trie, maxResults, words) {
  var keys = Object.keys(trie).sort();
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (key == "\n") {
      words.push(prefix);
      if (words.length == maxResults) {
        return false;
      }
    } else {
      if (!dumpTrieRecursive(prefix + key, trie[key][1], maxResults, words)) {
        return false;
      }
    }
  }
  return true;
}


function getSiblingDOMIndex(elem){
  var i = 0;
  while ((elem = elem.previousSibling) != null ){
    i++;
  }
  return i;
}

function init() {
  loadJSON(TRIE_URL, function(trie){
    trieView = new TrieView(LETTERS_EL, trie);
  });
}

function loadJSON(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true );
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200 ) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
}

init();

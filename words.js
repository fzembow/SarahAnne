
var TRIE_URL = 'trie.json';
var HOVER_TIMEOUT = 300;
var LETTERS_EL = document.getElementById('letters');


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
    var keys = Object.keys(trie).sort();
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
            console.log("LESS");
            stack.pop();
            el.removeChild(el.children[el.children.length - 1]);

          }

          stack.push(deepestNode);
          deepestNode = trie[letter];
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

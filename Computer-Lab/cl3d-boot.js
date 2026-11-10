
(function(){
  function openMenu(){
    try{
      if (typeof openSidebar === 'function') openSidebar();
      else {
        var sb = document.getElementById('sidebar'), sc = document.getElementById('sbScrim');
        if (sb) sb.classList.add('open');
        if (sc) sc.classList.add('on');
      }
      var h = document.getElementById('sec-home');
      if (h) h.classList.add('slim');
      return !!(h && h.classList.contains('slim'));
    }catch(e){ return false }
  }
  var tries = 0;
  (function tick(){
    var done = openMenu();
    if (( /*!done ||*/ tries < 3) && tries < 15) { tries++; setTimeout(tick, 450); }
  })();
})();

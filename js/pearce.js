(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Loader ----
  var loader = document.getElementById('loader');
  var barFill = document.getElementById('loader-bar-fill');
  var pctLabel = document.getElementById('loader-pct');
  var pct = 0;
  var loadStart = Date.now();
  var duration = 1600;

  function tickLoader(){
    var elapsed = Date.now() - loadStart;
    pct = Math.min(100, Math.round((elapsed/duration)*100));
    barFill.style.width = pct + '%';
    pctLabel.textContent = pct + '%';
    if(pct < 100){
      requestAnimationFrame(tickLoader);
    } else {
      setTimeout(function(){
        loader.classList.add('hide');
        document.body.style.overflow = '';
      }, 250);
    }
  }
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(tickLoader);

  // ---- Scroll-driven zoom ----
  var track = document.getElementById('zoom-track');
  var imgWrap = document.getElementById('zoom-img-wrap');
  var vignette = document.getElementById('zoom-vignette');
  var blackout = document.getElementById('zoom-blackout');
  var heroCopy = document.getElementById('hero-copy');
  var revealCopy = document.getElementById('reveal-copy');
  var scrollCue = document.getElementById('scroll-cue');

  var MAX_SCALE = reduceMotion ? 1.6 : 9;

  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }

  function update(){
    var rect = track.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    if(total <= 0) return;
    var progress = clamp(-rect.top / total, 0, 1);

    // Phase 1 (0 - 0.55): scale up into the bear
    // Phase 2 (0.55 - 0.75): crossfade to black
    // Phase 3 (0.75 - 1): reveal portfolio intro text, hold

    var p1 = clamp(progress / 0.55, 0, 1);
    var scale = 1 + p1 * (MAX_SCALE - 1);
    imgWrap.style.transform = 'scale(' + scale + ')';

    var vignetteOpacity = clamp(p1, 0, 1);
    vignette.style.opacity = 0.4 + vignetteOpacity*0.6;

    var p2 = clamp((progress - 0.55) / 0.2, 0, 1);
    blackout.style.opacity = p2;

    heroCopy.style.opacity = clamp(1 - progress/0.35, 0, 1);
    scrollCue.style.opacity = clamp(1 - progress/0.12, 0, 1);

    var p3 = clamp((progress - 0.7) / 0.3, 0, 1);
    revealCopy.style.opacity = p3;
    revealCopy.style.transform = 'translateY(' + (1-p3)*18 + 'px)';
  }

  var ticking = false;
  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(function(){ update(); ticking = false; });
      ticking = true;
    }
  }, {passive:true});
  window.addEventListener('resize', update);
  update();
})();


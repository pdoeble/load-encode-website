(function () {
  var lauf = document.querySelector('.pb-lauf'), k = document.querySelector('.pb-lauf-knopf');
  if (!lauf || !k) { return; }
  k.addEventListener('click', function () {
    var an = lauf.classList.toggle('pause');
    k.textContent = an ? 'Laufband fortsetzen' : 'Laufband anhalten';
    k.setAttribute('aria-pressed', String(an));
  });
})();

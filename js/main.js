(function () {
  'use strict';
  var d = document, WA = '351932109565';

  /* topo */
  var topo = d.getElementById('topo');
  function rolou() { topo.classList.toggle('cheio', window.scrollY > 30); }
  window.addEventListener('scroll', rolou, { passive: true }); rolou();
  var burger = d.getElementById('burger'), gaveta = d.getElementById('gaveta');
  burger.addEventListener('click', function () {
    var ab = gaveta.hidden; gaveta.hidden = !ab; burger.setAttribute('aria-expanded', ab);
  });
  gaveta.addEventListener('click', function (e) { if (e.target.closest('a')) { gaveta.hidden = true; burger.setAttribute('aria-expanded', false); } });

  /* HERO: cada par de desenhos assenta na palma como tinta, ciclo de 5 s */
  var NOMES = ['Copo-de-leite e rosa', 'Flor e espiral', 'Forca e rosa', 'Cravo e narcisos', 'Borboleta e fumaça', 'Peônias e folha', 'Estrela de oito pontas', 'Escorpião e sol', 'Linha líquida'];
  var camadas = d.querySelectorAll('.q-d'), qNome = d.getElementById('qNome'), at = -1;
  function proximo() {
    if (at >= 0) { var v = camadas[at]; v.classList.remove('on'); v.classList.add('sai'); setTimeout(function () { v.classList.remove('sai'); }, 480); }
    at = (at + 1) % camadas.length;
    var n = camadas[at]; n.classList.remove('sai'); void n.offsetWidth; n.classList.add('on');
    qNome.style.opacity = 0;
    setTimeout(function () { qNome.textContent = NOMES[at]; qNome.style.opacity = 1; }, 220);
  }
  setTimeout(proximo, 350);
  var timer = setInterval(proximo, 5000);
  d.addEventListener('visibilitychange', function () { if (d.hidden) clearInterval(timer); else timer = setInterval(proximo, 5000); });

  /* cartelas de flash */
  var CORPO = ['Ondas da mão ao braço', 'Linhas no braço e no ombro', 'Listras nas pernas', 'Linha do braço ao quadril', 'Arco pela perna', 'Mármore nas costas'];
  function carta(img, grande, nome, estilo) {
    var a = d.createElement('article'); a.className = 'carta rev';
    a.innerHTML = '<div class="fr"><img src="' + img + '" alt="Flash disponível: ' + nome + '" width="720" height="900"></div>' +
      '<div class="carta-pe"><span>' + nome + '</span><a class="bt bt-cor bt-p" href="#form">Quero este</a></div>';
    a.querySelector('.fr').addEventListener('click', function () { abrirLista([[grande, nome, estilo]], 0); });
    a.querySelector('.bt').addEventListener('click', function (e) { e.preventDefault(); pedir(estilo, 'Flash disponível: ' + nome); });
    return a;
  }
  var cartela = d.getElementById('cartela'), cartelaCorpo = d.getElementById('cartelaCorpo');
  NOMES.forEach(function (n, i) { cartela.appendChild(carta('img/flash/p' + (i + 1) + '.webp', 'img/flash/p' + (i + 1) + 'g.webp', n, 'Flash disponível')); });
  CORPO.forEach(function (n, i) { cartelaCorpo.appendChild(carta('img/flash/c' + (i + 1) + '.webp', 'img/flash/c' + (i + 1) + 'g.webp', n, 'Flash disponível')); });

  /* portfólio */
  var CAT = { palmas: 'Palma da mão', abstrato: 'Abstrato / linhas', botanica: 'Botânica', fineline: 'Fine line' };
  var grade = d.getElementById('grade'), mais = d.getElementById('mais'), filtro = 'todos', lim = 24, lista = [];
  function montar() {
    lista = OBRAS.filter(function (o) { return filtro === 'todos' || o[1] === filtro; });
    grade.innerHTML = '';
    lista.slice(0, lim).forEach(function (o, i) {
      var f = d.createElement('figure'); f.className = 'peca';
      f.innerHTML = '<img src="img/p/' + o[0] + '.webp" alt="' + o[2] + '" width="720" height="900">';
      f.addEventListener('click', function () { abrirLista(lista.map(function (x) { return ['img/g/' + x[0] + '.webp', x[2], CAT[x[1]]]; }), i); });
      grade.appendChild(f);
    });
    mais.hidden = lista.length <= lim;
  }
  d.querySelectorAll('.filtros button').forEach(function (b) {
    b.addEventListener('click', function () {
      d.querySelectorAll('.filtros button').forEach(function (x) { x.classList.toggle('on', x === b); });
      filtro = b.dataset.f; lim = 24; montar();
      grade.animate && grade.animate([{ opacity: .2, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.16,.84,.32,1)' });
    });
  });
  mais.addEventListener('click', function () { lim += 24; montar(); });
  montar();

  /* lightbox */
  var lb = d.getElementById('lb'), lbImg = d.getElementById('lbImg'), lbCap = d.getElementById('lbCap'), LL = [], li = 0;
  function mostrar() { lbImg.src = LL[li][0]; lbImg.alt = LL[li][1]; lbCap.textContent = LL[li][1]; d.getElementById('lbP').hidden = d.getElementById('lbS').hidden = LL.length < 2; }
  function abrirLista(l, i) { LL = l; li = i; mostrar(); lb.hidden = false; d.body.style.overflow = 'hidden'; }
  function fechar() { lb.hidden = true; d.body.style.overflow = ''; }
  d.getElementById('lbX').addEventListener('click', fechar);
  d.getElementById('lbP').addEventListener('click', function () { li = (li - 1 + LL.length) % LL.length; mostrar(); });
  d.getElementById('lbS').addEventListener('click', function () { li = (li + 1) % LL.length; mostrar(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) fechar(); });
  d.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') fechar();
    if (e.key === 'ArrowLeft') d.getElementById('lbP').click();
    if (e.key === 'ArrowRight') d.getElementById('lbS').click();
  });
  d.getElementById('lbQuero').addEventListener('click', function () {
    var it = LL[li]; fechar(); pedir(it[2], 'Quero uma assim: ' + it[1]);
  });

  /* formulário → WhatsApp */
  var form = d.getElementById('form'), erro = d.getElementById('erro');
  function marcar(nome, valor) {
    var r = form.querySelector('input[name="' + nome + '"][value="' + valor + '"]'); if (r) r.checked = true;
  }
  function pedir(estilo, ideia) {
    if (estilo) marcar('estilo', estilo);
    if (ideia) form.ideia.value = ideia;
    d.getElementById('form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  d.querySelectorAll('[data-estilo]').forEach(function (a) { a.addEventListener('click', function () { marcar('estilo', a.dataset.estilo); }); });
  d.querySelectorAll('[data-cidade]').forEach(function (a) { a.addEventListener('click', function () { marcar('cidade', a.dataset.cidade); }); });
  form.nome.addEventListener('input', function () { if (form.nome.value.trim()) erro.hidden = true; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(form), nome = (f.get('nome') || '').trim();
    if (!nome) { erro.hidden = false; form.nome.focus(); return; }
    var l = ['Olá, Walan! Sou *' + nome + '* e quero um orçamento.', ''];
    l.push('*Estilo:* ' + f.get('estilo'));
    l.push('*Cidade:* ' + f.get('cidade'));
    l.push('*Por cima de outra tattoo:* ' + f.get('cob'));
    if ((f.get('local') || '').trim()) l.push('*Local:* ' + f.get('local').trim());
    l.push('*Tamanho:* ' + f.get('tamanho'));
    l.push('*Disponibilidade:* ' + f.get('quando'));
    if ((f.get('ideia') || '').trim()) l.push('*Ideia:* ' + f.get('ideia').trim());
    l.push('', '(pedido enviado pelo site)');
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(l.join('\n')), '_blank', 'noopener');
  });

  /* entrada ao rolar */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  d.querySelectorAll('.rev').forEach(function (el) { io ? io.observe(el) : el.classList.add('vis'); });
})();

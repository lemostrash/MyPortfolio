// Navegação entre seções
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const alvo = link.getAttribute('href').substring(1);

    document.querySelectorAll('.tela').forEach(secao => {
      secao.classList.remove('ativa');
    });

    document.getElementById(alvo).classList.add('ativa');

    if (alvo === 'projetos') {
      carregarRepositorios();
    }
  });
});

// GitHub API
let todosRepos = [];

async function carregarRepositorios() {
  const container = document.getElementById('repos-container');
  const usuario = 'lemostrash'; // Substituir pelo seu usuário

  try {
    const resposta = await fetch(`https://api.github.com/users/${usuario}/repos`);
    const repos = await resposta.json();

    todosRepos = repos.filter(r => !r.fork);
    exibirRepos(todosRepos);
  } catch (erro) {
    container.innerHTML = '<p>Erro ao carregar os projetos 😢</p>';
    console.error(erro);
  }
}

function exibirRepos(repos) {
  const container = document.getElementById('repos-container');
  container.innerHTML = '';

  repos.forEach(repo => {
    const card = document.createElement('div');
    card.className = 'repo-card';
    card.onclick = () => window.open(repo.html_url, '_blank');

    const topicos = (repo.topics || []).join(', ');

    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || 'Sem descrição'}</p>
      <span class="topicos">${topicos}</span>
    `;

    container.appendChild(card);
  });
}

function filtrarRepos(tag) {
  if (tag === 'todos') {
    exibirRepos(todosRepos);
  } else {
    const filtrados = todosRepos.filter(repo => repo.topics.includes(tag));
    exibirRepos(filtrados);
  }
}

function abrirModal(nome, descricao) {
  document.getElementById("modal-title").innerText = nome;
  document.getElementById("modal-desc").innerText = descricao;
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

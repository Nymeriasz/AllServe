document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('.menu-link');
    const paineis = document.querySelectorAll('.painel-conteudo');

    menuLinks.forEach(link => {
       
        if (!link.dataset.target) return;

        link.addEventListener('click', (event) => {
            event.preventDefault()

            const targetId = link.dataset.target;
            const targetPainel = document.getElementById(targetId);

            
            menuLinks.forEach(l => l.classList.remove('active'));
            paineis.forEach(p => p.classList.remove('active'));

            
            link.classList.add('active');
            if (targetPainel) {
                targetPainel.classList.add('active');
            }
        });
    });
});
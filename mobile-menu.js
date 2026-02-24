document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        const isOpened = navLinks.classList.contains('active');

        if (isOpened) {
            // Close menu
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
            document.body.style.overflow = ''; // Restore scrolling
            menuToggle.setAttribute('aria-label', 'Abrir menú');
        } else {
            // Open menu
            navLinks.classList.add('active');
            menuToggle.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            menuToggle.setAttribute('aria-label', 'Cerrar menú');
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
            document.body.style.overflow = '';
            menuToggle.setAttribute('aria-label', 'Abrir menú');
        });
    });
});

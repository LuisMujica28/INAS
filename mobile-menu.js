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
        link.addEventListener('click', (e) => {
            // Do not close nav globally if clicking on a dropdown header on mobile
            if (window.innerWidth <= 768 && e.target.classList.contains('cursor-pointer')) {
                return;
            }
            
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
            document.body.style.overflow = '';
            menuToggle.setAttribute('aria-label', 'Abrir menú');
        });
    });

    // Handle mobile dropdown toggles
    const dropdownToggles = document.querySelectorAll('.nav-dropdown .cursor-pointer');
    dropdownToggles.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault(); 
                btn.parentElement.classList.toggle('mobile-open');
            }
        });
    });
});

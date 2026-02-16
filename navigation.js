/**
 * Navigation Logic for INAS Homepage
 * Handles specific modal interactions like the Sports selection.
 */

// Inject Modal HTML into the body when the script loads
document.addEventListener('DOMContentLoaded', () => {
    injectSportsModal();
});

function injectSportsModal() {
    // Check if it already exists
    if (document.getElementById('sports-modal')) return;

    const modalHTML = `
    <div id="sports-modal" class="modal-overlay" onclick="closeSportsModal(event)">
        <div class="modal-content glass-card-nav">
            <button class="close-modal-btn" onclick="closeSportsModal(event)">&times;</button>
            <h2 class="modal-title">Selecciona una Sección</h2>
            <div class="modal-options">
                <div class="modal-option-card" onclick="window.location.href='deportes.html'">
                    <div class="option-icon">🏆</div>
                    <h3>Torneo INAS</h3>
                    <p>Campeonatos, tablas y resultados.</p>
                </div>
                <div class="modal-option-card" onclick="window.location.href='escuelas_deportivas.html'">
                    <div class="option-icon">⚽</div>
                    <h3>Escuelas Deportivas</h3>
                    <p>Formación y entrenamiento extracurricular.</p>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Global function to open the modal
window.openSportsModal = function (event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('sports-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
};

// Global function to close the modal
window.closeSportsModal = function (event) {
    // If clicked on overlay (event.target === this) or close button
    if (event.target.id === 'sports-modal' || event.target.classList.contains('close-modal-btn') || event.target.closest('.close-modal-btn')) {
        const modal = document.getElementById('sports-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
};

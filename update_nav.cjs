const fs = require('fs');
const path = require('path');

const directory = __dirname;
const htmlFiles = fs.readdirSync(directory).filter(file => file.endsWith('.html'));

const baseNav = `        <div class="nav-links">
            <a href="index.html" class="nav-item" data-id="inicio">Inicio</a>
            <div class="nav-dropdown">
                <span class="nav-item cursor-pointer" data-id="horizonte">Horizonte ▾</span>
                <div class="dropdown-content">
                    <a href="horizonte.html" data-subid="horizonte.html">Horizonte Institucional</a>
                    <a href="instalaciones.html" data-subid="instalaciones.html">Instalaciones</a>
                </div>
            </div>
            <div class="nav-dropdown">
                <span class="nav-item cursor-pointer" data-id="academico">Académico ▾</span>
                <div class="dropdown-content">
                    <a href="horarios.html" data-subid="horarios.html">Horarios</a>
                    <a href="calendario.html" data-subid="calendario.html">Calendario</a>
                    <a href="plataforma.html" data-subid="plataforma.html">Plataforma</a>
                    <a href="utiles.html" data-subid="utiles.html">Útiles</a>
                </div>
            </div>
            <a href="pagos.html" class="nav-item" data-id="pagos">Pagos</a>
            <a href="contacto.html" class="nav-item" data-id="contacto">Contáctenos</a>
        </div>`;

function getActiveNav(filename) {
    let result = baseNav;
    const mappings = {
        'index.html': 'data-id="inicio"',
        'pagos.html': 'data-id="pagos"',
        'contacto.html': 'data-id="contacto"',
        // Horizonte submenu
        'horizonte.html': 'data-id="horizonte"',
        'instalaciones.html': 'data-id="horizonte"',
        // Academico submenu
        'horarios.html': 'data-id="academico"',
        'calendario.html': 'data-id="academico"',
        'plataforma.html': 'data-id="academico"',
        'utiles.html': 'data-id="academico"',
        'preicfes.html': 'data-id="academico"',
    };
    
    // Set active parent class
    if(mappings[filename]) {
        result = result.replace(mappings[filename], mappings[filename] + ' class="nav-item active"');
    }
    
    // Set active class on item if submenu match
    result = result.replace(`data-subid="${filename}"`, `data-subid="${filename}" class="sub-active"`);

    // Clean up all data-ids
    result = result.replace(/ data-id="[^"]*"/g, '');
    result = result.replace(/ data-subid="[^"]*"/g, '');

    return result;
}

for (const file of htmlFiles) {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');
    // Match from <div class="nav-links"> until right before <div class="social-nav">
    const navLinksRegex = /<div class="nav-links">[\s\S]*?(?=\s*<div class="social-nav">)/;
    
    if (navLinksRegex.test(content)) {
        content = content.replace(navLinksRegex, getActiveNav(file));
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated nav in ${file}`);
    }
}

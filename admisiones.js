/**
 * ==========================================================================
 * SISTEMA EDITORIAL DE ADMISIONES Y MATRÍCULAS 2027 — INAS
 * - Controlador de la Regla Arquitectónica de 13 Grados (Jardín a 11°) en Hero,
 *   sincronizada con la estudiante 3D en Canvas (window.setHeroTargetRatio)
 * - Pliego lateral nativo <dialog id="admisiones-modal" closedby="any">
 * - Widgets editoriales sin cajas SaaS para requisitos y tabla de tarifas
 * ==========================================================================
 */

(function () {
    'use strict';

    const WHATSAPP_NUMBER = '573054301113';
    const SECRETARIA_EMAIL = 'secretaria@inas.edu.co';

    const GRADES_2027 = [
        {
            shortLabel: 'Jardín',
            fullName: 'Jardín',
            selectValue: 'Jardín (Preescolar)',
            cycle: 'Preescolar',
            summary: '<strong>Jardín:</strong> Desarrollo motriz, socialización y hábitos escolares · Requiere registro civil y carné de vacunas al día.'
        },
        {
            shortLabel: 'Trans.',
            fullName: 'Transición',
            selectValue: 'Transición (Preescolar)',
            cycle: 'Preescolar',
            summary: '<strong>Transición:</strong> Lectoescritura inicial, pensamiento lógico e inglés · Requiere carné de vacunación vigente.'
        },
        {
            shortLabel: '1°',
            fullName: 'Grado 1°',
            selectValue: 'Grado 1° (Primaria)',
            cycle: 'Básica Primaria',
            summary: '<strong>Grado 1°:</strong> Lectura comprensiva, cálculo base y formación artística en Jornada Única.'
        },
        {
            shortLabel: '2°',
            fullName: 'Grado 2°',
            selectValue: 'Grado 2° (Primaria)',
            cycle: 'Básica Primaria',
            summary: '<strong>Grado 2°:</strong> Afianzamiento lector, ciencias naturales, inglés y escuelas deportivas institucionales.'
        },
        {
            shortLabel: '3°',
            fullName: 'Grado 3°',
            selectValue: 'Grado 3° (Primaria)',
            cycle: 'Básica Primaria',
            summary: '<strong>Grado 3°:</strong> Resolución de problemas, expresión oral y seguimiento por competencias (Martes de Prueba).'
        },
        {
            shortLabel: '4°',
            fullName: 'Grado 4°',
            selectValue: 'Grado 4° (Primaria)',
            cycle: 'Básica Primaria',
            summary: '<strong>Grado 4°:</strong> Indagación científica, competencias ciudadanas, inglés y proyectos de aula.'
        },
        {
            shortLabel: '5°',
            fullName: 'Grado 5°',
            selectValue: 'Grado 5° (Primaria)',
            cycle: 'Básica Primaria',
            summary: '<strong>Grado 5°:</strong> Consolidación del ciclo de Primaria y empalme académico hacia Bachillerato.'
        },
        {
            shortLabel: '6°',
            fullName: 'Grado 6°',
            selectValue: 'Grado 6° (Bachillerato)',
            cycle: 'Básica Secundaria',
            summary: '<strong>Grado 6°:</strong> Transición acompañada a Bachillerato, hábitos de estudio autónomo y laboratorios.'
        },
        {
            shortLabel: '7°',
            fullName: 'Grado 7°',
            selectValue: 'Grado 7° (Bachillerato)',
            cycle: 'Básica Secundaria',
            summary: '<strong>Grado 7°:</strong> Pensamiento analítico, ciencias experimentales, emisora escolar y formación deportiva.'
        },
        {
            shortLabel: '8°',
            fullName: 'Grado 8°',
            selectValue: 'Grado 8° (Bachillerato)',
            cycle: 'Básica Secundaria',
            summary: '<strong>Grado 8°:</strong> Álgebra, argumentación escrita, inglés comunicativo y proyectos ambientales PRAE.'
        },
        {
            shortLabel: '9°',
            fullName: 'Grado 9°',
            selectValue: 'Grado 9° (Bachillerato)',
            cycle: 'Básica Secundaria',
            summary: '<strong>Grado 9°:</strong> Fundamentación pre-media, liderazgo estudiantil y simulacros periódicos por áreas.'
        },
        {
            shortLabel: '10°',
            fullName: 'Grado 10°',
            selectValue: 'Grado 10° (Media Académica)',
            cycle: 'Media Académica',
            summary: '<strong>Grado 10°:</strong> Física, química, lectura crítica e inicio del entrenamiento Pre-ICFES Saber 11°.'
        },
        {
            shortLabel: '11°',
            fullName: 'Grado 11°',
            selectValue: 'Grado 11° (Media Académica)',
            cycle: 'Media Académica',
            summary: '<strong>Grado 11°:</strong> Preparación intensiva Saber 11° (promedio reciente 317 pts) y orientación universitaria.'
        }
    ];

    const REQUISITOS_DATA = {
        nuevos: [
            { text: 'Registro civil de nacimiento legible.' },
            { text: 'Fotocopia de la tarjeta de identidad actualizada (de 7 años en adelante).' },
            { text: 'Certificado médico reciente expedido por la EPS.' },
            { text: 'Fotocopia del carné o certificado vigente de afiliación a EPS / ARS.' },
            { text: 'Carné de vacunación al día.', badge: 'Preescolar' },
            { text: 'Certificados originales y legalizados de calificaciones de grados anteriores.' },
            { text: 'Paz y salvo original del colegio de procedencia (año anterior).' },
            { text: 'Copia del observador del estudiante expedido por el colegio anterior.' },
            { text: 'Constancia de comportamiento del estudiante.' },
            { text: '1 fotografía reciente tamaño documento.' }
        ],
        antiguos: [
            { text: 'Fotocopia actualizada del documento de identidad del estudiante.' },
            { text: 'Certificado médico reciente.' },
            { text: 'Último boletín o informe final de calificaciones.' },
            { text: 'Paz y salvo institucional del año lectivo anterior.' }
        ]
    };

    const GRADOS_OPTIONS_HTML = `
        <option value="">Selecciona el grado...</option>
        <optgroup label="Preescolar">
            <option value="Jardín (Preescolar)">Jardín</option>
            <option value="Transición (Preescolar)">Transición</option>
        </optgroup>
        <optgroup label="Básica Primaria">
            <option value="Grado 1° (Primaria)">Grado 1°</option>
            <option value="Grado 2° (Primaria)">Grado 2°</option>
            <option value="Grado 3° (Primaria)">Grado 3°</option>
            <option value="Grado 4° (Primaria)">Grado 4°</option>
            <option value="Grado 5° (Primaria)">Grado 5°</option>
        </optgroup>
        <optgroup label="Básica Secundaria">
            <option value="Grado 6° (Bachillerato)">Grado 6°</option>
            <option value="Grado 7° (Bachillerato)">Grado 7°</option>
            <option value="Grado 8° (Bachillerato)">Grado 8°</option>
            <option value="Grado 9° (Bachillerato)">Grado 9°</option>
        </optgroup>
        <optgroup label="Media Académica">
            <option value="Grado 10° (Media Académica)">Grado 10°</option>
            <option value="Grado 11° (Media Académica)">Grado 11°</option>
        </optgroup>
    `;

    let selectedHeroGradeValue = GRADES_2027[0].selectValue;

    function buildFormHTML(prefix) {
        const autofocusAttr = prefix === 'modal' ? ' autofocus' : '';
        return `
            <form class="adm-pre-form" data-adm-form="${prefix}" novalidate>
                <div class="adm-type-toggle" role="radiogroup" aria-label="Tipo de aspirante">
                    <label class="adm-radio-line">
                        <input type="radio" name="${prefix}_tipo" value="Estudiante Nuevo" checked>
                        <span>Estudiante nuevo (primer ingreso)</span>
                    </label>
                    <label class="adm-radio-line">
                        <input type="radio" name="${prefix}_tipo" value="Renovación (Estudiante Antiguo)">
                        <span>Estudiante antiguo (renovación 2027)</span>
                    </label>
                </div>

                <div class="adm-form-grid">
                    <div class="adm-field">
                        <label for="${prefix}-grado">Grado para 2027 *</label>
                        <select id="${prefix}-grado" name="grado" required${autofocusAttr}>
                            ${GRADOS_OPTIONS_HTML}
                        </select>
                    </div>

                    <div class="adm-field">
                        <label for="${prefix}-modalidad">Atención solicitada</label>
                        <select id="${prefix}-modalidad" name="modalidad">
                            <option value="Recibir información y requisitos por WhatsApp">Orientación y requisitos por WhatsApp</option>
                            <option value="Agendar visita presencial en Secretaría">Agendar visita presencial al colegio</option>
                        </select>
                    </div>

                    <div class="adm-field">
                        <label for="${prefix}-acudiente">Nombre del acudiente *</label>
                        <input type="text" id="${prefix}-acudiente" name="acudiente" placeholder="Nombre y apellido" autocomplete="name" required>
                    </div>

                    <div class="adm-field">
                        <label for="${prefix}-telefono">Celular de contacto *</label>
                        <input type="tel" id="${prefix}-telefono" name="telefono" placeholder="Ej. 310 234 5678" autocomplete="tel" required>
                    </div>

                    <div class="adm-field full-span">
                        <label for="${prefix}-estudiante">Nombre del estudiante (opcional)</label>
                        <input type="text" id="${prefix}-estudiante" name="estudiante" placeholder="Nombre completo del aspirante">
                    </div>
                </div>

                <div class="adm-form-feedback" data-adm-feedback aria-live="polite"></div>

                <div class="adm-form-actions">
                    <button type="submit" class="adm-btn-whatsapp">
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 6.62C9.32 6.62 8.97 6.7 8.67 7.03C8.38 7.35 7.55 8.13 7.55 9.71C7.55 11.29 8.7 12.82 8.86 13.03C9.02 13.24 11.08 16.41 14.23 17.77C14.98 18.09 15.57 18.29 16.02 18.43C16.77 18.67 17.46 18.64 18 18.56C18.61 18.47 19.86 17.8 20.12 17.06C20.38 16.32 20.38 15.69 20.3 15.56C20.22 15.43 20.01 15.35 19.7 15.19C19.38 15.03 17.84 14.27 17.55 14.17C17.27 14.07 17.06 14.02 16.85 14.33C16.64 14.65 16.03 15.35 15.85 15.56C15.67 15.77 15.49 15.8 15.18 15.64C14.87 15.49 13.87 15.16 12.68 14.1C11.75 13.27 11.12 12.25 10.94 11.94C10.76 11.63 10.92 11.46 11.08 11.3C11.22 11.16 11.39 10.94 11.55 10.75C11.71 10.56 11.76 10.43 11.87 10.22C11.97 10.01 11.92 9.83 11.84 9.67C11.76 9.5 11.14 7.99 10.89 7.37C10.64 6.77 10.38 6.85 10.2 6.85C10.02 6.85 9.81 6.82 9.6 6.82L9.53 6.62Z"/>
                        </svg>
                        <span>Radicar y abrir WhatsApp</span>
                    </button>
                    <button type="button" class="adm-btn-email" data-adm-cloud-only-btn>
                        <span>Solo radicar datos aquí</span>
                    </button>
                    <button type="button" class="adm-btn-email" data-adm-email-btn>
                        <span>Enviar por correo</span>
                    </button>
                </div>
            </form>
        `;
    }

    function buildChecklistWidgetHTML() {
        return `
            <div class="adm-checklist-widget" data-adm-checklist-root>
                <div class="adm-req-toolbar">
                    <div class="adm-segmented" role="group" aria-label="Filtrar requisitos por tipo de estudiante">
                        <button type="button" class="adm-seg-btn active" data-req-type="nuevos">Estudiantes nuevos (10)</button>
                        <button type="button" class="adm-seg-btn" data-req-type="antiguos">Antiguos / Renovación (4)</button>
                    </div>
                    <span class="adm-req-counter" data-req-counter>0 de 10 verificados</span>
                </div>
                <ul class="adm-checklist" data-req-list></ul>
                <div class="adm-req-note">
                    <strong>Presentación a firma de matrícula (Art. 33 Manual de Convivencia):</strong>
                    El estudiante debe asistir portando el uniforme institucional en compañía de su padre, madre o acudiente legalmente autorizado.
                </div>
            </div>
        `;
    }

    function buildCostsWidgetHTML() {
        return `
            <div class="adm-subsidy-callout">
                <strong>Subsidio institucional directo superior al 50%</strong>
                <p>El INAS asume directamente más de la mitad del costo real anual de la educación privada en todos los grados desde Jardín hasta Grado 11° en Jornada Única.</p>
            </div>

            <table class="adm-fee-table" aria-label="Estructura institucional de costos y subsidio">
                <tbody>
                    <tr>
                        <td>
                            <span class="adm-fee-concept">Matrícula anual</span>
                            <span class="adm-fee-sub">Jardín a Grado 11° · Tarifa institucional autorizada</span>
                        </td>
                        <td class="adm-fee-value" style="font-size: 0.95rem; font-family: 'Poppins', sans-serif; font-weight: 700; color: #047857;">Subsidio &gt;50%</td>
                    </tr>
                    <tr>
                        <td>
                            <span class="adm-fee-concept">Pensión mensual</span>
                            <span class="adm-fee-sub">Jornada única continua · 10 mensualidades académicas</span>
                        </td>
                        <td class="adm-fee-value" style="font-size: 0.95rem; font-family: 'Poppins', sans-serif; font-weight: 700; color: #047857;">Tarifa subsidiada</td>
                    </tr>
                    <tr>
                        <td>
                            <span class="adm-fee-concept">Conceptos complementarios</span>
                            <span class="adm-fee-sub">Carné estudiantil, agenda institucional y Manual de Convivencia</span>
                        </td>
                        <td class="adm-fee-value" style="font-size: 0.88rem; font-family: 'Poppins', sans-serif; font-weight: 600; color: #0F1D4E;">Reglamentario</td>
                    </tr>
                    <tr>
                        <td>
                            <span class="adm-fee-concept">Derechos de grado</span>
                            <span class="adm-fee-sub">Exclusivo graduandos Media Académica (Grado 11°)</span>
                        </td>
                        <td class="adm-fee-value" style="font-size: 0.88rem; font-family: 'Poppins', sans-serif; font-weight: 600; color: #0F1D4E;">Grado 11°</td>
                    </tr>
                </tbody>
            </table>

            <div class="adm-bank-ledger">
                <strong>Información de costos y liquidación:</strong> Para conocer el valor neto y las facilidades de pago para el grado de tu interés, solicítalo directamente a Secretaría Académica por WhatsApp o presencialmente.
                <br><br>
                <strong>Recaudo bancario oficial:</strong> Davivienda Ahorros <strong>1089 0060 1783</strong> (Llave <strong>@DAVIINSTAMERSUBA</strong> · NIT 900.030.860) y Banco Caja Social Corriente <strong>2403 0000 0015</strong>.
                <br><br>
                <a href="https://wa.me/573054301113?text=Hola%20Secretar%C3%ADa%20INAS%2C%20deseo%20conocer%20el%20tarifario%20oficial%202027" target="_blank" rel="noopener" style="color: #1B4DFF; font-weight: 700; text-decoration: underline;">Solicitar tarifario detallado 2027 por WhatsApp →</a>
            </div>
        `;
    }

    function renderChecklistItems(root, type) {
        const listEl = root.querySelector('[data-req-list]');
        const counterEl = root.querySelector('[data-req-counter]');
        const items = REQUISITOS_DATA[type] || REQUISITOS_DATA.nuevos;
        if (!listEl) return;

        listEl.innerHTML = items.map((item) => `
            <li>
                <label class="adm-check-item">
                    <input type="checkbox" data-req-check>
                    <span class="adm-check-text">${item.text}</span>
                    ${item.badge ? `<span class="adm-check-badge">${item.badge}</span>` : ''}
                </label>
            </li>
        `).join('');

        const updateCounter = () => {
            if (!counterEl) return;
            const total = listEl.querySelectorAll('[data-req-check]').length;
            const checked = listEl.querySelectorAll('[data-req-check]:checked').length;
            counterEl.textContent = `${checked} de ${total} verificados`;
        };

        listEl.onchange = updateCounter;
        updateCounter();

        root.querySelectorAll('[data-req-type]').forEach((btn) => {
            btn.classList.toggle('active', btn.getAttribute('data-req-type') === type);
        });
    }

    function bindChecklistWidget(root) {
        if (!root || root.dataset.bound === 'true') return;
        root.dataset.bound = 'true';

        renderChecklistItems(root, 'nuevos');

        root.querySelectorAll('[data-req-type]').forEach((btn) => {
            btn.addEventListener('click', () => {
                renderChecklistItems(root, btn.getAttribute('data-req-type'));
            });
        });
    }

    function extractPayload(form) {
        const prefix = form.getAttribute('data-adm-form');
        const tipoInput = form.querySelector(`input[name="${prefix}_tipo"]:checked`);
        const grado = form.querySelector('[name="grado"]')?.value.trim() || '';
        const modalidad = form.querySelector('[name="modalidad"]')?.value.trim() || '';
        const acudiente = form.querySelector('[name="acudiente"]')?.value.trim() || '';
        const telefono = form.querySelector('[name="telefono"]')?.value.trim() || '';
        const estudiante = form.querySelector('[name="estudiante"]')?.value.trim() || '';
        const feedback = form.querySelector('[data-adm-feedback]');

        if (!grado) {
            if (feedback) {
                feedback.classList.remove('is-success');
                feedback.textContent = 'Selecciona el grado al que aspira el estudiante para 2027.';
            }
            form.querySelector('[name="grado"]')?.focus();
            return null;
        }
        if (!acudiente) {
            if (feedback) {
                feedback.classList.remove('is-success');
                feedback.textContent = 'Ingresa el nombre del padre, madre o acudiente.';
            }
            form.querySelector('[name="acudiente"]')?.focus();
            return null;
        }
        if (!telefono) {
            if (feedback) {
                feedback.classList.remove('is-success');
                feedback.textContent = 'Ingresa un número de celular de contacto.';
            }
            form.querySelector('[name="telefono"]')?.focus();
            return null;
        }

        if (feedback) {
            feedback.classList.remove('is-success');
            feedback.textContent = '';
        }

        const tipo = tipoInput ? tipoInput.value : 'Estudiante Nuevo';
        const lines = [
            'Hola Secretaría INAS, deseo iniciar el proceso de *Matrículas 2027*:',
            `• *Tipo:* ${tipo}`,
            `• *Grado 2027:* ${grado}`,
            `• *Acudiente:* ${acudiente}`,
            `• *Contacto:* ${telefono}`
        ];
        if (estudiante) {
            lines.push(`• *Estudiante:* ${estudiante}`);
        }
        lines.push(`• *Solicitud:* ${modalidad}`);

        return {
            grado,
            acudiente,
            telefono,
            estudiante,
            tipo,
            modalidad,
            whatsappText: lines.join('\n'),
            emailSubject: `Solicitud Matrículas 2027 - ${grado} (${acudiente})`,
            emailBody: lines.join('\n').replace(/\*/g, '')
        };
    }

    async function recordPreEnrollmentInCloud(payload, canal, origen) {
        try {
            const response = await fetch('/api/admisiones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                keepalive: true,
                body: JSON.stringify({
                    grado: payload.grado,
                    acudiente: payload.acudiente,
                    telefono: payload.telefono,
                    estudiante: payload.estudiante,
                    tipo: payload.tipo,
                    modalidad: payload.modalidad,
                    canal,
                    origen
                })
            });
            const data = await response.json().catch(() => ({}));
            return Boolean(response.ok && data.saved);
        } catch {
            return false;
        }
    }

    function setSuccessFeedback(form, message) {
        const feedback = form.querySelector('[data-adm-feedback]');
        if (!feedback) return;
        feedback.classList.add('is-success');
        feedback.textContent = message;
    }

    function bindFormWidget(form) {
        if (!form || form.dataset.bound === 'true') return;
        form.dataset.bound = 'true';
        const origen = form.getAttribute('data-adm-form') === 'page' ? 'admisiones.html' : 'pliego-portada';

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const payload = extractPayload(form);
            if (!payload) return;

            recordPreEnrollmentInCloud(payload, 'whatsapp', origen).then((saved) => {
                if (saved) {
                    setSuccessFeedback(form, '✓ Solicitud guardada en Secretaría Académica y lista en WhatsApp.');
                }
            });

            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(payload.whatsappText)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        });

        const cloudOnlyBtn = form.querySelector('[data-adm-cloud-only-btn]');
        if (cloudOnlyBtn) {
            cloudOnlyBtn.addEventListener('click', async () => {
                const payload = extractPayload(form);
                if (!payload) return;

                cloudOnlyBtn.disabled = true;
                const saved = await recordPreEnrollmentInCloud(payload, 'registro-web', origen);
                cloudOnlyBtn.disabled = false;

                if (saved) {
                    setSuccessFeedback(
                        form,
                        '✓ Solicitud radicada en la base oficial de Secretaría Académica. Nos comunicaremos al celular registrado.'
                    );
                    form.reset();
                } else {
                    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(payload.whatsappText)}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
            });
        }

        const emailBtn = form.querySelector('[data-adm-email-btn]');
        if (emailBtn) {
            emailBtn.addEventListener('click', () => {
                const payload = extractPayload(form);
                if (!payload) return;

                recordPreEnrollmentInCloud(payload, 'correo', origen);
                const mailto = `mailto:${SECRETARIA_EMAIL}?subject=${encodeURIComponent(payload.emailSubject)}&body=${encodeURIComponent(payload.emailBody)}`;
                window.location.href = mailto;
            });
        }
    }

    function applyDialogLightDismissFallback(dialog) {
        if ('closedBy' in HTMLDialogElement.prototype) return;

        const outside = (e, dlg) => {
            const r = dlg.getBoundingClientRect();
            return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
        };

        let pressedOutside = false;
        dialog.addEventListener('pointerdown', (e) => {
            pressedOutside = outside(e, dialog);
        });
        dialog.addEventListener('pointerup', (e) => {
            if (pressedOutside && outside(e, dialog)) {
                dialog.close();
            }
        });
    }

    function injectAdmisionesModal() {
        let dialog = document.getElementById('admisiones-modal');
        if (dialog) return dialog;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <dialog id="admisiones-modal" closedby="any" aria-labelledby="admisiones-modal-title">
                <div class="adm-modal-header">
                    <div class="adm-modal-brand">
                        <img src="assets/inas_shield.png" alt="Escudo INAS" class="adm-modal-shield" width="42" height="42">
                        <div>
                            <div class="adm-modal-kicker">Secretaría Académica · Año Lectivo 2027</div>
                            <h2 id="admisiones-modal-title" class="adm-modal-title">Ficha de Admisión 2027</h2>
                        </div>
                    </div>
                    <form method="dialog" class="adm-modal-close-form">
                        <button type="submit" value="close" class="adm-modal-close" aria-label="Cerrar pliego de admisiones">✕</button>
                    </form>
                </div>

                <div class="adm-tabs-bar" role="tablist" aria-label="Secciones de admisiones">
                    <button type="button" role="tab" class="adm-tab-btn" id="adm-tab-preinscripcion" aria-controls="adm-panel-preinscripcion" aria-selected="true" data-adm-tab="preinscripcion">
                        Solicitud
                    </button>
                    <button type="button" role="tab" class="adm-tab-btn" id="adm-tab-requisitos" aria-controls="adm-panel-requisitos" aria-selected="false" data-adm-tab="requisitos">
                        Documentos
                    </button>
                    <button type="button" role="tab" class="adm-tab-btn" id="adm-tab-costos" aria-controls="adm-panel-costos" aria-selected="false" data-adm-tab="costos">
                        Tarifas y subsidio
                    </button>
                </div>

                <div class="adm-modal-body">
                    <section id="adm-panel-preinscripcion" role="tabpanel" aria-labelledby="adm-tab-preinscripcion" class="adm-tab-panel" data-adm-panel="preinscripcion">
                        <p class="adm-form-intro">
                            Diligencia los datos del aspirante para comunicarte directamente con Secretaría Académica o agendar tu visita presencial en nuestra sede de Villa Elisa, Suba.
                        </p>
                        ${buildFormHTML('modal')}
                    </section>

                    <section id="adm-panel-requisitos" role="tabpanel" aria-labelledby="adm-tab-requisitos" class="adm-tab-panel" data-adm-panel="requisitos" hidden>
                        <p class="adm-form-intro">
                            Verifica los soportes requeridos según los Artículos 31 y 32 del Manual de Convivencia Escolar:
                        </p>
                        ${buildChecklistWidgetHTML()}
                    </section>

                    <section id="adm-panel-costos" role="tabpanel" aria-labelledby="adm-tab-costos" class="adm-tab-panel" data-adm-panel="costos" hidden>
                        ${buildCostsWidgetHTML()}
                    </section>
                </div>

                <div class="adm-modal-footer">
                    <span>Calle 136 # 95B - 85, Suba · L–V 6:00 a.m. a 2:30 p.m.</span>
                    <a href="admisiones.html" class="adm-footer-page-link">Ver prospecto completo</a>
                </div>
            </dialog>
        `;

        dialog = wrapper.firstElementChild;
        document.body.appendChild(dialog);

        applyDialogLightDismissFallback(dialog);

        const tabButtons = dialog.querySelectorAll('[data-adm-tab]');
        tabButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                switchModalTab(dialog, btn.getAttribute('data-adm-tab'));
            });
        });

        dialog.addEventListener('close', () => {
            dialog.returnValue = '';
        });

        dialog.querySelectorAll('[data-adm-form]').forEach(bindFormWidget);
        dialog.querySelectorAll('[data-adm-checklist-root]').forEach(bindChecklistWidget);

        return dialog;
    }

    function switchModalTab(dialog, tabName) {
        const target = tabName || 'preinscripcion';
        dialog.querySelectorAll('[data-adm-tab]').forEach((btn) => {
            const active = btn.getAttribute('data-adm-tab') === target;
            btn.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        dialog.querySelectorAll('[data-adm-panel]').forEach((panel) => {
            const active = panel.getAttribute('data-adm-panel') === target;
            panel.hidden = !active;
        });
    }

    function applyPresetGrade(container, presetGrade) {
        if (!presetGrade || !container) return;
        const select = container.querySelector('select[name="grado"]');
        if (!select) return;

        const map = {
            preescolar: 'Jardín (Preescolar)',
            primaria: 'Grado 1° (Primaria)',
            bachillerato: 'Grado 6° (Bachillerato)',
            secundaria: 'Grado 6° (Bachillerato)',
            media: 'Grado 10° (Media Académica)'
        };
        const targetValue = map[presetGrade.toLowerCase()] || presetGrade;
        for (const opt of select.options) {
            if (opt.value === targetValue) {
                select.value = targetValue;
                break;
            }
        }
    }

    window.openAdmisionesModal = function (tabName = 'preinscripcion', presetGrade = '') {
        const dialog = injectAdmisionesModal();
        switchModalTab(dialog, tabName);
        if (presetGrade) {
            applyPresetGrade(dialog, presetGrade);
        }
        if (!dialog.open) {
            dialog.showModal();
        }
    };

    function initHeroGradeRuler() {
        const ruler = document.getElementById('hero-grade-ruler');
        const cycleEl = document.querySelector('[data-hero-cycle]');
        const readoutEl = document.querySelector('[data-hero-readout]');
        const ctaLabelEl = document.querySelector('[data-hero-cta-label]');
        const primaryBtn = document.getElementById('hero-primary-enroll-btn');

        if (!ruler) return;

        // Si el HTML aún no contiene las 13 paradas, generarlas dinámicamente
        if (ruler.children.length !== GRADES_2027.length) {
            ruler.innerHTML = GRADES_2027.map((g, idx) => `
                <button type="button"
                    class="hero-grade-stop"
                    role="radio"
                    aria-checked="${idx === 0 ? 'true' : 'false'}"
                    tabindex="${idx === 0 ? '0' : '-1'}"
                    data-grade-index="${idx}">
                    ${g.shortLabel}
                </button>
            `).join('');
        }

        const stops = Array.from(ruler.querySelectorAll('.hero-grade-stop'));

        function selectGradeByIndex(index, options = {}) {
            const safeIdx = Math.max(0, Math.min(GRADES_2027.length - 1, index));
            const grade = GRADES_2027[safeIdx];
            selectedHeroGradeValue = grade.selectValue;

            stops.forEach((btn, i) => {
                const isSelected = i === safeIdx;
                btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
                btn.setAttribute('tabindex', isSelected ? '0' : '-1');
                if (isSelected && options.focusButton) {
                    btn.focus();
                }
                if (isSelected && typeof btn.scrollIntoView === 'function') {
                    btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            });

            if (cycleEl) cycleEl.textContent = grade.cycle;
            if (readoutEl) readoutEl.innerHTML = grade.summary;
            if (ctaLabelEl) ctaLabelEl.textContent = `Solicitar cupo para ${grade.fullName}`;

            if (options.syncCanvas && typeof window.setHeroTargetRatio === 'function') {
                const ratio = safeIdx / (GRADES_2027.length - 1);
                window.setHeroTargetRatio(ratio);
            }
        }

        stops.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                selectGradeByIndex(idx, { syncCanvas: true, focusButton: false });
            });

            btn.addEventListener('keydown', (e) => {
                let nextIdx = null;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    nextIdx = (idx + 1) % GRADES_2027.length;
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    nextIdx = (idx - 1 + GRADES_2027.length) % GRADES_2027.length;
                } else if (e.key === 'Home') {
                    nextIdx = 0;
                } else if (e.key === 'End') {
                    nextIdx = GRADES_2027.length - 1;
                }

                if (nextIdx !== null) {
                    e.preventDefault();
                    selectGradeByIndex(nextIdx, { syncCanvas: true, focusButton: true });
                }
            });
        });

        if (primaryBtn) {
            primaryBtn.addEventListener('click', () => {
                window.openAdmisionesModal('preinscripcion', selectedHeroGradeValue);
            });
        }

        selectGradeByIndex(0, { syncCanvas: false, focusButton: false });
    }

    document.addEventListener('DOMContentLoaded', () => {
        injectAdmisionesModal();
        initHeroGradeRuler();

        const pageFormSlot = document.getElementById('adm-page-form-slot');
        if (pageFormSlot) {
            pageFormSlot.innerHTML = buildFormHTML('page');
            pageFormSlot.querySelectorAll('[data-adm-form]').forEach(bindFormWidget);
        }

        const pageChecklistSlot = document.getElementById('adm-page-checklist-slot');
        if (pageChecklistSlot) {
            pageChecklistSlot.innerHTML = buildChecklistWidgetHTML();
            pageChecklistSlot.querySelectorAll('[data-adm-checklist-root]').forEach(bindChecklistWidget);
        }

        const pageCostsSlot = document.getElementById('adm-page-costs-slot');
        if (pageCostsSlot) {
            pageCostsSlot.innerHTML = buildCostsWidgetHTML();
        }

        document.querySelectorAll('[data-open-admisiones]').forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = trigger.getAttribute('data-open-admisiones') || 'preinscripcion';
                const grade = trigger.getAttribute('data-preset-grade') || selectedHeroGradeValue || '';
                window.openAdmisionesModal(tab, grade);
            });
        });

        document.querySelectorAll('[data-scroll-enroll]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const preset = btn.getAttribute('data-scroll-enroll');
                const formSection = document.getElementById('formulario-preinscripcion');
                if (pageFormSlot && preset) {
                    applyPresetGrade(pageFormSlot, preset);
                }
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => {
                        pageFormSlot?.querySelector('[name="acudiente"]')?.focus();
                    }, 450);
                }
            });
        });
    });
})();

// intro-animation.js

const words = ["LIDERAZGO CON PROPÓSITO", "VALORES HUMANOS", "FUTURO BRILLANTE", "EXCELENCIA ACADÉMICA"];
let currentWordIndex = 0;
const titleElement = document.querySelector('.intro-animated-text');

function splitText(element) {
    const text = element.textContent;
    element.innerHTML = '';
    text.split(' ').forEach((word, index, array) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'slot-word';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        word.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'slot-char';
            wordSpan.appendChild(span);
        });

        element.appendChild(wordSpan);

        if (index < array.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.innerHTML = '&nbsp;';
            spaceSpan.style.display = 'inline-block';
            element.appendChild(spaceSpan);
        }
    });
}

async function animateText(newText) {
    const oldChars = Array.from(titleElement.querySelectorAll('.slot-char'));

    // 1. Animate OUT
    oldChars.forEach(char => {
        const randomDir = Math.random() > 0.5 ? 'out-up' : 'out-down';
        char.classList.add(randomDir);
    });

    // Wait for exit animation
    await new Promise(r => setTimeout(r, 600));

    // 2. Prepare NEW text
    titleElement.innerHTML = '';
    newText.split(' ').forEach((word, index, array) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'slot-word';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        word.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'slot-char prepare-in';
            wordSpan.appendChild(span);
        });

        titleElement.appendChild(wordSpan);

        if (index < array.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.innerHTML = '&nbsp;';
            spaceSpan.style.display = 'inline-block';
            titleElement.appendChild(spaceSpan);
        }
    });

    await new Promise(r => requestAnimationFrame(r));

    // 3. Animate IN
    const newChars = Array.from(titleElement.querySelectorAll('.slot-char'));
    newChars.forEach((char, i) => {
        setTimeout(() => {
            const randomDir = Math.random() > 0.5 ? 'in-up' : 'in-down';
            char.classList.remove('prepare-in');
            char.classList.add(randomDir);
        }, Math.random() * 200); // Random stagger for realistic slot effect
    });
}

function startAnimationLoop() {
    splitText(titleElement);

    setInterval(() => {
        const nextWord = words[currentWordIndex];
        animateText(nextWord);
        currentWordIndex = (currentWordIndex + 1) % words.length;
    }, 3500);
}

// Start if present
if (document.querySelector('.intro-animated-text')) {
    startAnimationLoop();
}

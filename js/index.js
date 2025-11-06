document.addEventListener('DOMContentLoaded', () => {
    // Animazione del Titolo (Apparizione dal basso)
    anime({
        targets: '[data-anime="title"]',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1200,
        easing: 'easeOutQuad'
    });

    // Animazione del Sottotitolo e pulsante
    anime({
        targets: '[data-anime="subtitle"], [data-anime="button"]',
        opacity: [0, 1],
        delay: anime.stagger(200, {start: 800}), // Inizia dopo 800ms
        duration: 800,
        easing: 'easeOutQuad'
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const starField = document.getElementById('star-field');
    const numStars = 150; // Numero di "stelle"

    // --- Generazione delle Stelle ---
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Posizionamento casuale su tutto lo schermo
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        
        // Dimensione casuale
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        starField.appendChild(star);
    }

    // Animazione delle Stelle
    anime({
        targets: '.star',
        // Animazione di "pulsazione" e movimento leggero
        opacity: [
            { value: 1, duration: 100, easing: 'linear' },
            { value: 0.2, duration: 1000, easing: 'easeInOutQuad' }
        ],
        scale: [
            { value: 1.5, duration: 500 },
            { value: 1, duration: 500 }
        ],
        translateX: function() { return anime.random(-100, 100); }, // Spostamento laterale casuale
        translateY: function() { return anime.random(-100, 100); }, // Spostamento verticale casuale
        delay: anime.stagger(100), // Inizio a cascata
        duration: function() { return anime.random(2000, 5000); }, // Durata variabile
        loop: true, // Animazione infinita
        direction: 'alternate', // Alterna andata e ritorno
        easing: 'easeInOutSine'
    });
    
    // Animazione d'Ingresso del Contenuto
    anime({
        targets: '[data-anime="title"]',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1200,
        easing: 'easeOutQuad'
    });

    anime({
        targets: '[data-anime="subtitle"], [data-anime="button"]',
        opacity: [0, 1],
        delay: anime.stagger(200, {start: 800}),
        duration: 800,
        easing: 'easeOutQuad'
    });
});
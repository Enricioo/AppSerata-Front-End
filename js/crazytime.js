document.addEventListener('DOMContentLoaded', () => {
        const spinButton = document.getElementById('spin-button');
        const wheel = document.getElementById('crazy-time-wheel');
        const resultDisplay = document.getElementById('current-result');
        const balanceDisplay = document.getElementById('user-balance');
        const topslotDisplay = document.getElementById('topslot-result');
        const topslotAnimationContainer = document.getElementById('topslot-animation-container');
        const chipButtons = document.querySelectorAll('.chip-button');
        const betTargetButtons = document.querySelectorAll('.bet-target-button');
        const betsSummary = document.getElementById('bets-summary');
        const defaultBetLabels = {
            '1': '1 (x1)', 
            '2': '2 (x2)', 
            '5': '5 (x5)', 
            '10': '10 (x10)',
            'CashHunt': 'Cash Hunt', 
            'Pachinko': 'Pachinko', 
            'CoinFlip': 'Coin Flip', 
            'CrazyTime': 'Crazy Time'
        };
        
        let userBalance = 5000; // Valore iniziale
        let isSpinning = false;
        let currentChipAmount = 1; // Chip predefinito
        let placedBets = {};
        let topslotTarget = '';
        let topslotMultiplier = 1;
        
        // --- 🚨 MAPPATURA DEI SEGMENTI DELLA RUOTA ---
        // La ruota ha 54 segmenti totali.
        // I gradi per segmento sono 360 / 54 = 6.666... gradi
        // Ogni elemento dell'array rappresenta 6.666 gradi.
        
        // NOTA: Devi mappare i risultati ESATTI della ruota
        // Dalla tua immagine, la sequenza è (partendo dall'alto e andando in senso orario):
        // 1, 2, 5, 10, CoinFlip, 1, 2, 5, 10, CashHunt, 1, 2, 5, 10, Pachinko, ecc.
        
        // Questo è un esempio semplificato di come si mappano i 54 segmenti
        const segments = [
            'CrazyTime', '1', '2', '5', '1', '2', 'Pachinko', '1', '5', '1', 
            '2', '1', 'CoinFlip', '1', '2', '1', '10', '2', 'CashHunt', '1', 
            '2', '1', '5', '1', 'CoinFlip', '1', '5', '2', '10', '1', 
            'Pachinko', '1', '2', '5', '1', '2', 'CoinFlip', '1', '10', '1',
            '5', '1', 'CashHunt', '1', '2', '5', '1', '2', 'CoinFlip', '2',
            '1', '10', '2', '1' // Totale 54 segmenti
        ];

        // Mappa il risultato della scommessa al moltiplicatore (solo per i numeri)
        const multipliers = {
            '1': 1, '2': 2, '5': 5, '10': 10, 
            'CoinFlip': 2, 'CashHunt': 5, 'Pachinko': 10, 'CrazyTime': 20 
            // I bonus avrebbero logica di gioco più profonda, qui usiamo un valore base
        };

        const segmentAngle = 360 / segments.length; // 6.666... gradi per segmento
        
        chipButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentChipAmount = parseFloat(button.dataset.chip);
                chipButtons.forEach(btn => btn.classList.remove('border-4', 'border-white'));
                button.classList.add('border-4', 'border-white');
            });
            // Imposta l'aspetto iniziale della chip da 1€
            if (parseFloat(button.dataset.chip) === currentChipAmount) {
                button.classList.add('border-4', 'border-white');
            }
        });

        betTargetButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (isSpinning) return;
                
                const target = button.dataset.target;
                
                // Controlla il saldo
                if (userBalance < currentChipAmount) {
                    alert("Saldo insufficiente!");
                    return;
                }

                // Sottrai dal saldo e aggiorna la puntata
                updateBalance(-currentChipAmount);
                placedBets[target] = (placedBets[target] || 0) + currentChipAmount;
                
                // Aggiorna l'aspetto del pulsante puntato
                button.textContent = `${target} (€${placedBets[target]})`;
                updateSummary();
            });
        });

        function updateBalance(amount) {
            userBalance += amount;
            balanceDisplay.textContent = `€ ${userBalance.toFixed(2)}`;
            // 🚨 Qui andrebbe l'invio al database per salvare il saldo
        }

        // Funzione di utilità: invia il risultato al database
        function sendResultToDatabase(result, finalBalance) {
            console.log(`[DB] Risultato: ${result}, Nuovo Saldo: ${finalBalance}`);
            // 🚨 QUI VA IL TUO CODICE DI INVIO AL SERVER/DATABASE
            // Esempio: fetch('/api/update-balance', { method: 'POST', body: JSON.stringify({ result, balance: finalBalance }) })
        }

        function updateSummary() {
            let totalBet = 0;
            let summaryText = '';
            
            for (const target in placedBets) {
                if (placedBets[target] > 0) {
                    totalBet += placedBets[target];
                    summaryText += `${target}: €${placedBets[target]} | `;
                }
            }
            
            if (totalBet === 0) {
                betsSummary.textContent = 'Puntate Attuali: Nessuna';
                spinButton.disabled = false;
            } else {
                betsSummary.textContent = `Puntate Totali: €${totalBet} | ${summaryText.slice(0, -3)}`;
                spinButton.disabled = false;
            }
        }

        // Funzione per gestire il Top Slot
        function spinTopSlot() {
            return new Promise(resolve => {
                topslotDisplay.textContent = 'Top Slot: Girando...';
                
                // 1. Scegli un Moltiplicatore Casuale
                const possibleMultipliers = [2, 3, 4, 5, 7, 10, 20, 30, 40, 50, 100];
                const chosenMultiplier = possibleMultipliers[Math.floor(Math.random() * possibleMultipliers.length)];
                const bettableSegments = ['1', '2', '5', '10', 'CoinFlip', 'CashHunt', 'Pachinko', 'CrazyTime'];
                const chosenTarget = bettableSegments[Math.floor(Math.random() * bettableSegments.length)];
                // 2. Simula l'animazione Top Slot con un timeout (es. 2 secondi)
                setTimeout(() => {
                    // 3. Simula la "sezione" scelta dal Top Slot (dovrebbe essere un risultato della ruota, es. '2' o 'Pachinko')
                    // Qui usiamo 'CrazyTime' come placeholder per la sezione Top Slot 
                    
                    topslotTarget = chosenTarget;
                    topslotMultiplier = chosenMultiplier;

                    const topslotResult = `${chosenTarget} X${chosenMultiplier}`;
                    topslotDisplay.textContent = `Top Slot: ${topslotResult}`;
                    
                    // Risolvi la Promise passando il moltiplicatore Top Slot
                    resolve(true);
                }, 2000);
            });
        }

        function spinMainWheel(topslotOutcome) {
            console.log('Topslot Outcome ricevuto:', topslotOutcome);
            // ... (La logica per scegliere il segmento è la stessa) ...
            console.log("3. Funzione spinMainWheel avviata.");
            const chosenSegmentIndex = Math.floor(Math.random() * segments.length);
            const chosenResult = segments[chosenSegmentIndex];
            // Calcola l'angolo di arrivo
            let targetAngle = (chosenSegmentIndex * segmentAngle) + (segmentAngle / 2);
            const fullRotations = 5; 
            const finalAngle = (fullRotations * 360) + targetAngle;
            
            console.log(`[DEBUG] Moltiplicatore Top Slot: ${topslotMultiplier}`);
            // Avvia la rotazione
            anime({
                targets: wheel,
                rotate: [0, -finalAngle], 
                duration: 5000, 
                easing: 'easeOutQuart',
                
                complete: function() {
                isSpinning = false;
                spinButton.disabled = false;

                // Calcola la vincita
                let winningTarget = chosenResult;
                let finalWinnings = 0;
                let finalMultiplier = 1;
                let winText = '';

                if (placedBets[chosenResult] > 0) {
                    const betAmount = placedBets[chosenResult];
                    const baseMultiplier = multipliers[winningTarget] || 1;

                    if (chosenResult === topslotTarget) {
                        finalMultiplier = baseMultiplier * topslotMultiplier;
                    } else {
                        finalMultiplier = baseMultiplier;
                    }

                    finalWinnings = betAmount * finalMultiplier;
                    
                    winText = `HAI VINTO €${finalWinnings.toFixed(2)}!`;
                    updateBalance(finalWinnings);
                    resultDisplay.textContent = `Risultato: ${chosenResult}! Hai Vinto €${finalWinnings.toFixed(2)}.`;
                } else {
                    winText = `Hai Perso. È uscito ${chosenResult}.`;
                    resultDisplay.textContent = `Risultato: ${chosenResult}! ${winText}`;
                }

                betTargetButtons.forEach(button => {
                    const target = button.dataset.target;
                    
                    // Ripristina il testo del pulsante usando la mappa predefinita
                    button.textContent = defaultBetLabels[target];
                    
                    // Opzionale: Rimuovi lo stile "pieno" se lo avevi aggiunto con CSS (es. un bordo)
                    // button.classList.remove('bg-green-700'); 
                });

                resultDisplay.textContent = `Risultato: ${chosenResult}! ${winText}`;
                topslotDisplay.textContent = `Top Slot: ${topslotTarget} X${topslotMultiplier}`;
                
                // 3. Resetta le puntate per il prossimo giro
                placedBets = {};
                updateSummary();
                
                // ... (sendResultToDatabase) ...
            }
            });
            
        }

        async function spinWheel() {
            
            if (isSpinning) return;
            isSpinning = true;
            resultDisplay.textContent = 'Risultato: In attesa...';
            spinButton.disabled = true;
            await spinTopSlot();
            // 1. Gira il Top Slot e aspetta il moltiplicatore
            console.log("1. In attesa del Top Slot...");
            const topslotOutcome = await spinTopSlot();
            console.log(`2. Top Slot risolto. Moltiplicatore: ${topslotMultiplier}. Avvio Ruota...`);

            // 2. Gira la Ruota Principale con il moltiplicatore ricevuto
            spinMainWheel();
        }
        
        spinButton.addEventListener('click', spinWheel);
    });
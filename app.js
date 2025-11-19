// Spinner Wheel Application
class SpinnerWheel {
    constructor() {
        this.canvas = document.getElementById('spinnerCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.options = [];
        this.currentRotation = 0;
        this.isSpinning = false;
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
            '#F8B739', '#52B788', '#E76F51', '#2A9D8F'
        ];
        
        this.settings = {
            soundEnabled: true,
            confettiEnabled: true,
            spinDuration: 3
        };

        this.init();
    }

    init() {
        // Load data from localStorage
        this.loadFromStorage();
        this.loadSettings();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial draw
        this.drawWheel();
        
        // Render options list
        this.renderOptionsList();
    }

    setupEventListeners() {
        // Add option button
        document.getElementById('addButton').addEventListener('click', () => this.addOption());
        document.getElementById('newOption').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addOption();
        });

        // Spin button
        document.getElementById('spinButton').addEventListener('click', () => this.spin());

        // Clear all button
        document.getElementById('clearAllButton').addEventListener('click', () => this.clearAll());

        // Export button
        document.getElementById('exportButton').addEventListener('click', () => this.exportData());

        // Import button and file input
        document.getElementById('importButton').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e));

        // Settings
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            this.settings.soundEnabled = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('confettiToggle').addEventListener('change', (e) => {
            this.settings.confettiEnabled = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('spinDuration').addEventListener('change', (e) => {
            this.settings.spinDuration = parseInt(e.target.value);
            this.saveSettings();
        });
    }

    addOption() {
        const input = document.getElementById('newOption');
        const value = input.value.trim();
        
        if (value) {
            this.options.push(value);
            input.value = '';
            this.saveToStorage();
            this.drawWheel();
            this.renderOptionsList();
        }
    }

    removeOption(index) {
        this.options.splice(index, 1);
        this.saveToStorage();
        this.drawWheel();
        this.renderOptionsList();
    }

    updateOption(index, newValue) {
        this.options[index] = newValue;
        this.saveToStorage();
        this.drawWheel();
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all options?')) {
            this.options = [];
            this.saveToStorage();
            this.drawWheel();
            this.renderOptionsList();
            document.getElementById('resultDisplay').textContent = '';
        }
    }

    renderOptionsList() {
        const list = document.getElementById('optionsList');
        list.innerHTML = '';

        if (this.options.length === 0) {
            list.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 20px;">No options yet. Add some above!</p>';
            return;
        }

        this.options.forEach((option, index) => {
            const item = document.createElement('div');
            item.className = 'option-item';
            item.innerHTML = `
                <input type="text" value="${option}" 
                    onchange="wheel.updateOption(${index}, this.value)" />
                <button class="btn btn-danger" onclick="wheel.removeOption(${index})">Remove</button>
            `;
            list.appendChild(item);
        });
    }

    drawWheel() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.options.length === 0) {
            // Draw empty wheel
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = '#1e293b';
            ctx.fill();
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Draw text
            ctx.fillStyle = '#94a3b8';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Add options to start', centerX, centerY);
            return;
        }

        const anglePerOption = (2 * Math.PI) / this.options.length;

        // Draw segments
        this.options.forEach((option, index) => {
            const startAngle = this.currentRotation + index * anglePerOption;
            const endAngle = startAngle + anglePerOption;

            // Draw segment
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = this.colors[index % this.colors.length];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + anglePerOption / 2);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Arial';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 3;
            
            // Truncate long text
            let displayText = option;
            if (displayText.length > 20) {
                displayText = displayText.substring(0, 17) + '...';
            }
            
            ctx.fillText(displayText, radius - 20, 0);
            ctx.restore();
        });

        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    spin() {
        if (this.isSpinning || this.options.length === 0) return;

        this.isSpinning = true;
        document.getElementById('spinButton').disabled = true;
        document.getElementById('resultDisplay').textContent = 'Spinning...';
        document.getElementById('resultDisplay').classList.remove('winner');

        // Random spin
        const minSpins = 5;
        const maxSpins = 8;
        const spins = minSpins + Math.random() * (maxSpins - minSpins);
        const totalRotation = spins * 2 * Math.PI + Math.random() * 2 * Math.PI;
        
        const duration = this.settings.spinDuration * 1000; // Convert to milliseconds
        const startTime = Date.now();
        const startRotation = this.currentRotation;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            this.currentRotation = startRotation + totalRotation * easeOut;
            this.drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.finishSpin();
            }
        };

        animate();
    }

    finishSpin() {
        // Normalize rotation
        this.currentRotation = this.currentRotation % (2 * Math.PI);
        
        // Calculate winner (pointer is at top, so we check which segment is at top)
        const anglePerOption = (2 * Math.PI) / this.options.length;
        // Adjust for pointer at top (3π/2 or 270 degrees)
        const adjustedRotation = (this.currentRotation + Math.PI / 2) % (2 * Math.PI);
        const winnerIndex = Math.floor((2 * Math.PI - adjustedRotation) / anglePerOption) % this.options.length;
        const winner = this.options[winnerIndex];

        // Display result
        const resultDisplay = document.getElementById('resultDisplay');
        resultDisplay.textContent = `🎉 Winner: ${winner}`;
        resultDisplay.classList.add('winner');

        // Show confetti effect (simple text-based for now)
        if (this.settings.confettiEnabled) {
            this.showConfetti();
        }

        // Play sound (simple beep using Web Audio API if enabled)
        if (this.settings.soundEnabled) {
            this.playSound();
        }

        this.isSpinning = false;
        document.getElementById('spinButton').disabled = false;
    }

    showConfetti() {
        // Simple confetti effect using emoji
        const confettiEmojis = ['🎉', '🎊', '✨', '🎈', '🎆', '🎇'];
        const container = document.querySelector('.container');
        
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-50px';
            confetti.style.fontSize = '2rem';
            confetti.style.zIndex = '1000';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `fall ${2 + Math.random() * 2}s linear`;
            
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }

        // Add fall animation if not exists
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    playSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Sound not available:', e);
        }
    }

    // LocalStorage operations
    saveToStorage() {
        localStorage.setItem('spinnerOptions', JSON.stringify(this.options));
    }

    loadFromStorage() {
        const stored = localStorage.getItem('spinnerOptions');
        if (stored) {
            try {
                this.options = JSON.parse(stored);
            } catch (e) {
                console.error('Error loading from storage:', e);
                this.options = [];
            }
        }

        // Add default options if empty
        if (this.options.length === 0) {
            this.options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
            this.saveToStorage();
        }
    }

    saveSettings() {
        localStorage.setItem('spinnerSettings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const stored = localStorage.getItem('spinnerSettings');
        if (stored) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(stored) };
                // Update UI
                document.getElementById('soundToggle').checked = this.settings.soundEnabled;
                document.getElementById('confettiToggle').checked = this.settings.confettiEnabled;
                document.getElementById('spinDuration').value = this.settings.spinDuration;
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
    }

    // Export/Import functionality
    exportData() {
        const data = {
            options: this.options,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `spinner-config-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.options && Array.isArray(data.options)) {
                    this.options = data.options;
                    this.saveToStorage();
                }
                
                if (data.settings) {
                    this.settings = { ...this.settings, ...data.settings };
                    this.saveSettings();
                    this.loadSettings(); // Update UI
                }
                
                this.drawWheel();
                this.renderOptionsList();
                
                alert('Configuration imported successfully!');
            } catch (error) {
                alert('Error importing file: ' + error.message);
            }
        };
        
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }
}

// Initialize the wheel when DOM is ready
let wheel;
document.addEventListener('DOMContentLoaded', () => {
    wheel = new SpinnerWheel();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (wheel) {
        wheel.drawWheel();
    }
});

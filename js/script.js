document.addEventListener('DOMContentLoaded', () => {
    // 1. Update Last Login Time
    const loginTimeElement = document.getElementById('last-login');
    if (loginTimeElement) {
        const now = new Date();
        loginTimeElement.textContent = `Last login: ${now.toString().split(' (')[0]}`;
    }

    // 2. Draggable Modules
    const modules = document.querySelectorAll('.module');
    let isDragging = false;
    let currentModule = null;
    let offset = { x: 0, y: 0 };

    modules.forEach(module => {
        module.addEventListener('mousedown', dragStart);
        module.addEventListener('touchstart', dragStart, { passive: false });
    });

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (window.innerWidth <= 768) return;

        currentModule = e.target.closest('.module');
        if (!currentModule) return;

        isDragging = true;

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        const rect = currentModule.getBoundingClientRect();

        // Calculate where inside the element we clicked relative to its top-left
        offset.x = clientX - rect.left;
        offset.y = clientY - rect.top;

        currentModule.classList.add('dragging');
        currentModule.style.animation = 'none';
    }

    function drag(e) {
        if (!isDragging || !currentModule) return;
        e.preventDefault();

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const container = document.getElementById('container');
        const containerRect = container.getBoundingClientRect();

        // Calculate new top/left relative to the container
        let newX = clientX - containerRect.left - offset.x;
        let newY = clientY - containerRect.top - offset.y;

        // Boundary checks (optional, but good for keeping sticky notes inside)
        // newX = Math.max(0, Math.min(newX, containerRect.width - currentModule.offsetWidth));
        // newY = Math.max(0, Math.min(newY, containerRect.height - currentModule.offsetHeight));

        currentModule.style.left = `${newX}px`;
        currentModule.style.top = `${newY}px`;

        // Clear conflicting positioning styles
        currentModule.style.right = 'auto';
        currentModule.style.bottom = 'auto';

        // Reset transform during drag to avoid compounding offsets
        currentModule.style.transform = 'none';
    }

    function dragEnd(e) {
        if (!isDragging || !currentModule) return;

        // Add a slight random rotation back on drop for style
        const randomRot = Math.random() * 6 - 3;
        currentModule.style.transform = `rotate(${randomRot}deg)`;

        currentModule.classList.remove('dragging');
        isDragging = false;
        currentModule = null;
    }

    // 3. Typing Effect for Terminal
    const typeTargets = document.querySelectorAll('.type-text');
    typeTargets.forEach(target => {
        const text = target.getAttribute('data-text') || target.innerText;
        target.innerText = ''; // Clear text

        let i = 0;
        const speed = 30; // ms per char

        function typeWriter() {
            if (i < text.length) {
                target.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed + (Math.random() * 20)); // Subtle variance
            }
        }

        // Add delay based on index if execution is sequential desired
        // For now, start immediately
        typeWriter();
    });

    // 4. Real-time Clock
    function updateClock() {
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            const now = new Date();
            clockElement.textContent = now.toLocaleTimeString();
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 5. Music Visualizer (Fake)
    const visualizer = document.getElementById('visualizer');
    if (visualizer) {
        const bars = 20;
        for (let i = 0; i < bars; i++) {
            const bar = document.createElement('div');
            bar.className = 'vis-bar';
            bar.style.height = '10%';
            visualizer.appendChild(bar);
        }

        function animateVisualizer() {
            const barElements = visualizer.children;
            for (let bar of barElements) {
                // Random height between 10% and 100%
                const h = Math.floor(Math.random() * 90 + 10);
                bar.style.height = `${h}%`;
            }
        }
        setInterval(animateVisualizer, 100);
    }

    // 6. Time-Aware Status & "Now Playing"
    function setHumanStatus() {
        const now = new Date();
        const hour = now.getHours();
        const statusText = document.querySelector('#dynamic-status .type-text');
        const playingText = document.getElementById('now-playing');

        let status = "Online.";
        let track = "Lofi Hip Hop - beats to relax/study to";

        if (hour >= 0 && hour < 6) {
            status = "awake late, quiet background, not doing much";
            track = "Jack Lander – Honey Boy";
        } else if (hour >= 6 && hour < 10) {
            status = "starting slowly, basic routine, low urgency";
            track = "George Moir – Flowers";
        } else if (hour >= 10 && hour < 14) {
            status = "working with decent focus, steady pace";
            track = "HOAX – Drew";
        } else if (hour >= 14 && hour < 18) {
            status = "still working, attention fading slightly";
            track = "OSO OSO – that's what time does";
        } else if (hour >= 18 && hour < 22) {
            status = "lighter tasks, thinking, no pressure";
            track = "OSO OSO – basking in the glow";
        } else {
            status = "done for the day, minimal stimulation";
            track = "Jack Lander – Slow Fade";
        }

        // Only update if it hasn't been typed yet or on refresh
        // For simplicity, we just set it here if we wanted to replace the hardcoded one
        // But since we have the typing effect, let's just update the "Now Playing"

        if (playingText) playingText.innerText = `>>> ${track}`;

        // Use a different attribute for time-aware status to avoid conflict with typing effect initial load?
        // Actually, let's just let the typing effect handle the initial "Building stuff..."
        // And update it dynamically? 
        // For now, let's just set the mood icon.
        if (moodIcon) moodIcon.innerText = icon;
    }
    setHumanStatus();
    // Update status every hour? Or just run once on load.
});

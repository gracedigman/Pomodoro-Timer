document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const pomodoroBtn = document.getElementById('pomodoro-btn');
    const shortBreakBtn = document.getElementById('short-break-btn');
    const longBreakBtn = document.getElementById('long-break-btn');
    const quoteContainer = document.getElementById('quote-container');
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const closeQuoteBtn = document.getElementById('close-quote');
    const sessionsCount = document.getElementById('sessions-count');
    
    // Settings elements
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsContainer = document.getElementById('settings-container');
    const pomodoroTimeInput = document.getElementById('pomodoro-time');
    const shortBreakTimeInput = document.getElementById('short-break-time');
    const longBreakTimeInput = document.getElementById('long-break-time');
    const saveSettingsBtn = document.getElementById('save-settings');
  
    // Timer variables
    let timer;
    let isRunning = false;
    let minutes = 25;
    let seconds = 0;
    let sessionsCompleted = 0;
    
    // Timer durations in minutes (defaults)
    let POMODORO_TIME = 25;
    let SHORT_BREAK_TIME = 5;
    let LONG_BREAK_TIME = 15;
    
    // Current timer mode
    let currentMode = 'pomodoro';
    
    // Load saved settings from localStorage if available
    function loadSettings() {
      const savedSettings = JSON.parse(localStorage.getItem('pomodoroSettings'));
      if (savedSettings) {
        POMODORO_TIME = savedSettings.pomodoro;
        SHORT_BREAK_TIME = savedSettings.shortBreak;
        LONG_BREAK_TIME = savedSettings.longBreak;
        
        // Update input fields
        pomodoroTimeInput.value = POMODORO_TIME;
        shortBreakTimeInput.value = SHORT_BREAK_TIME;
        longBreakTimeInput.value = LONG_BREAK_TIME;
      }
      
      // Set initial timer based on loaded settings
      setTimerMode(currentMode);
    }
  
    // Save settings to localStorage
    function saveSettings() {
      // Get values from inputs
      POMODORO_TIME = parseInt(pomodoroTimeInput.value) || 25;
      SHORT_BREAK_TIME = parseInt(shortBreakTimeInput.value) || 5;
      LONG_BREAK_TIME = parseInt(longBreakTimeInput.value) || 15;
      
      // Enforce minimum values
      POMODORO_TIME = Math.max(1, POMODORO_TIME);
      SHORT_BREAK_TIME = Math.max(1, SHORT_BREAK_TIME);
      LONG_BREAK_TIME = Math.max(1, LONG_BREAK_TIME);
      
      // Save to localStorage
      const settings = {
        pomodoro: POMODORO_TIME,
        shortBreak: SHORT_BREAK_TIME,
        longBreak: LONG_BREAK_TIME
      };
      localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
      
      // Apply settings
      setTimerMode(currentMode);
      
      // Hide settings panel
      settingsContainer.classList.add('hidden');
      
      // Show confirmation
      alert("Settings saved successfully!");
    }
  
    // Update timer display
    function updateDisplay() {
      minutesDisplay.textContent = String(minutes).padStart(2, '0');
      secondsDisplay.textContent = String(seconds).padStart(2, '0');
    }
  
    // Set timer duration based on mode
    function setTimerMode(mode) {
      currentMode = mode;
      
      // Remove active class from all buttons
      pomodoroBtn.classList.remove('active');
      shortBreakBtn.classList.remove('active');
      longBreakBtn.classList.remove('active');
      
      // Add active class to selected button and set time
      switch(mode) {
        case 'pomodoro':
          minutes = POMODORO_TIME;
          pomodoroBtn.classList.add('active');
          break;
        case 'shortBreak':
          minutes = SHORT_BREAK_TIME;
          shortBreakBtn.classList.add('active');
          break;
        case 'longBreak':
          minutes = LONG_BREAK_TIME;
          longBreakBtn.classList.add('active');
          break;
      }
      
      seconds = 0;
      updateDisplay();
      
      // Reset timer if it's running
      if (isRunning) {
        clearInterval(timer);
        startTimer();
      }
    }
  
    // Start the timer
    function startTimer() {
      if (isRunning) return;
      
      isRunning = true;
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      
      timer = setInterval(() => {
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else {
          // Timer completed
          clearInterval(timer);
          isRunning = false;
          startBtn.disabled = false;
          pauseBtn.disabled = true;
          
          // Play a sound to notify timer completion
          playTimerCompleteSound();
          
          // Handle timer completion based on mode
          if (currentMode === 'pomodoro') {
            sessionsCompleted++;
            sessionsCount.textContent = sessionsCompleted;
            fetchMotivationalQuote();
          } else {
            // Play sound or notification for break completion
            alert("Break time is over! Ready to focus again?");
            setTimerMode('pomodoro');
          }
        }
        updateDisplay();
      }, 1000);
    }
  
    // Play a sound when timer completes
    function playTimerCompleteSound() {
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj2a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnMpBSl+ye/gk0MLFluy6OyrWBIIPJPY88p8LwUhc8Xu4pVGDRFTqebwtWAaBjiP1fPNfC4IJXnH7uCRQAwWXbPo66lWEwpBmt/yv28hBjOJ0fPRgTIFHW/A7uKYRw0PVqzm765dGQc8lNryynsuBSd8ye/ikUILF2+06OurVxIKPpPY8sp7MAUidMXu4pVGDBBTqebxtmAaBjiQ1vLMeC0HJHnH7uKWRQ0UXLP/ACH/E/8h/wAhALutUwkAAAAA/wDt+dYpGmjR4rapTgQAAP8A+PvhMh1lxuK0pkkCAAD/APr85jQbZMLksadOBAAAAAD7/OUyHGbH4rOmTQQAAAAAAP7+6jEaaMbkuapLBAAAAAD///4A6uQrHHPL3bilQwMAAP8AAAAA7OcuG3DH3L2oRgMAAP8AAAAA7uouGm7D3cCrSAMAAAAAAAAA8OwuGW/E3sGsRwMAAAAAAAAA8e8xGm7F38GrRwIAAAAAAAAA8vEzGW7F4MKsRgIAAAAAAAAA9PQzGW3G4cOtRQIAAAAAAAAA9vYyGW7H4MOtRQIAAAAAAAAA+fk1GW3H48SuRQEAAAAAAAAA+/s2GGzH48WwRQEAAAAAAAAA/f03GGzH5MawRQEAAAAAAAAA/v44GGvH5caxRAAAAAAAAAAA//85GGrH5cexRAAAAAAAAAAA//85GGrI5sixQwAAAAAAAAAA//86F2nI58mzQwAAAAAAAAAA//87F2jI58q0QgAAAAAAAAAAAAA7FmjI6Mq0QgAAAAAAAAAAAAA8FmfI6Mu2QQAAAAAAAAAAAAA9FmbJ6My3QQAAAAAAAAAAAAA+FmbJ6My3QAAAAAAAAAAAAAA/FmbJ6c24QAAAAAAAAAAAAAA/FWXJ6c65PwAAAAAAAAAAAABaFWXK6s+6PwAAAAAAAAAAAABbFGTK6tC7PgAAAAAAAAAAAABcFGPK69G8PQAAAAAAAAAAAAB01mPL69G9PAAAAAAAAAAAAABhFGPL7NK9OwAAAAAAAAAAAABiFGLL7NO/OwAAAAAAAAAAAABjE2HL7dTAOgAAAAAAAAAAAABkE2DL7dXBOQAAAAAAAAAAAABlE2DM7tbCOQAAAAAAAAAAAABnEmDM7tfDOAAAAAAAAAAAAAD/E1/M79fEOAAAAAAAAAAAAAD/ElzM79nFNwAAAAAAAAAAAAD/ElzN8NrGNgAAAAAAAAAAAAD/89ZN8NvHNQAAAAAAAAAAAAAAABJN8dvINQAAAAAAAAAAAAAAABJN8dzJNAAAAAAAAAAAAAAAABFN8t3KMAAAAAAAAAAAAAAAARFM8t7MMwAAAAAAAAAAAAAAABBL897NMgAAAAAAAAAAAAAAABBL89/PMQAAAAAAAAAAAAAAABLfS/Pg0DAAAAAAAAAAAAAAAAAAT/TheTAAAAAAAAAAAAAAAAAAAE/14noVAAAAAAAAAAAAAAAAAABP9uN7FQAAAAAAAAAAAAAAAAAAAOXkQAAAAAAAAAAAAAAAAAAAAOblQwAAAAAAAAAAAAAAAAAAAADn5kIAAAAAAAAAAAAAAAAAAAAA6OdBAAAAAAAAAAAAAAAAAAAA6ulAAAAAAAAAAAAAAAAAAAAA6+tBAAAAAAAAAAAAAAAAAAAA7OxCAAAAAAAAAAAAAAAAAAAA7e1EAAAAAAAAAAAAAAAAAAD//gAAAAAAAAAAAA==';
      audio.play();
    }
  
    // Pause the timer
    function pauseTimer() {
      if (!isRunning) return;
      
      clearInterval(timer);
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  
    // Reset the timer
    function resetTimer() {
      clearInterval(timer);
      isRunning = false;
      setTimerMode(currentMode);
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  
    // Toggle settings panel
    function toggleSettings() {
      settingsContainer.classList.toggle('hidden');
    }
  
    // Fetch a motivational quote from the API
    async function fetchMotivationalQuote() {
      try {
        const response = await fetch('/api/quote');
        const data = await response.json();
        
        if (data.error) {
          quoteText.textContent = "Keep pushing forward. Progress is progress, no matter how small.";
          quoteAuthor.textContent = "Your Pomodoro Timer";
        } else {
          quoteText.textContent = data.content;
          quoteAuthor.textContent = `- ${data.author}`;
        }
        
        quoteContainer.classList.remove('hidden');
      } catch (error) {
        console.error('Error fetching quote:', error);
        quoteText.textContent = "Every small step takes you closer to your goals!";
        quoteAuthor.textContent = "Your Pomodoro Timer";
        quoteContainer.classList.remove('hidden');
      }
    }
  
    // Close the quote modal
    function closeQuote() {
      quoteContainer.classList.add('hidden');
    }
  
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    pomodoroBtn.addEventListener('click', () => setTimerMode('pomodoro'));
    shortBreakBtn.addEventListener('click', () => setTimerMode('shortBreak'));
    longBreakBtn.addEventListener('click', () => setTimerMode('longBreak'));
    closeQuoteBtn.addEventListener('click', closeQuote);
    
    // Settings event listeners
    settingsToggle.addEventListener('click', toggleSettings);
    saveSettingsBtn.addEventListener('click', saveSettings);
  
    // Initialize settings and display
    loadSettings();
    updateDisplay();
  });
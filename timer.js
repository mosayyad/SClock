class TimerManager {
  constructor() {
    this.hoursInput = document.getElementById('timer-hours');
    this.minutesInput = document.getElementById('timer-minutes');
    this.secondsInput = document.getElementById('timer-seconds');
    
    this.startBtn = document.getElementById('timer-start');
    this.pauseBtn = document.getElementById('timer-pause');
    this.resetBtn = document.getElementById('timer-reset');
    
    this.hours1 = new DigitDisplay('timer-hours1');
    this.hours2 = new DigitDisplay('timer-hours2');
    this.minutes1 = new DigitDisplay('timer-minutes1');
    this.minutes2 = new DigitDisplay('timer-minutes2');
    this.seconds1 = new DigitDisplay('timer-seconds1');
    this.seconds2 = new DigitDisplay('timer-seconds2');
    
    this.totalSeconds = 0;
    this.remainingSeconds = 0;
    this.timerInterval = null;
    this.isRunning = false;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.startBtn.addEventListener('click', () => this.start());
    this.pauseBtn.addEventListener('click', () => this.pause());
    this.resetBtn.addEventListener('click', () => this.reset());
  }
  
  start() {
    if (!this.isRunning) {
      if (this.remainingSeconds === 0) {
        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        
        this.totalSeconds = hours * 3600 + minutes * 60 + seconds;
        this.remainingSeconds = this.totalSeconds;
      }
      
      this.timerInterval = setInterval(() => this.update(), 1000);
      this.isRunning = true;
    }
  }
  
  pause() {
    if (this.isRunning) {
      clearInterval(this.timerInterval);
      this.isRunning = false;
    }
  }
  
  reset() {
    clearInterval(this.timerInterval);
    this.remainingSeconds = 0;
    this.isRunning = false;
    this.updateDisplay(0);
    
    this.hoursInput.value = '';
    this.minutesInput.value = '';
    this.secondsInput.value = '';
  }
  
  update() {
    if (this.remainingSeconds > 0) {
      this.remainingSeconds--;
      this.updateDisplay(this.remainingSeconds);
      
      if (this.remainingSeconds === 0) {
        this.timerComplete();
      }
    }
  }
  
  updateDisplay(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.hours1.display(Math.floor(hours / 10));
    this.hours2.display(hours % 10);
    this.minutes1.display(Math.floor(minutes / 10));
    this.minutes2.display(minutes % 10);
    this.seconds1.display(Math.floor(seconds / 10));
    this.seconds2.display(seconds % 10);
  }
  
  timerComplete() {
    clearInterval(this.timerInterval);
    this.isRunning = false;
    document.body.classList.add('alarm-active');
    
    setTimeout(() => {
      document.body.classList.remove('alarm-active');
      this.reset();
    }, 3000);

    // Updated confetti with float effect
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { y: 0.6 },
      colors: ['#00ff00', '#00cc00', '#009900'],
      gravity: 0,
      drift: () => Math.random() * 0.5 - 0.25
    });
  }
}

export { TimerManager };
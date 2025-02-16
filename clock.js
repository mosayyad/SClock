import { ThemeManager } from './theme-manager.js';
import { AlarmManager } from './alarm-manager.js';

const DIGIT_SEGMENTS = {
  0: ['top', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'bottom'],
  1: ['top-right', 'bottom-right'],
  2: ['top', 'top-right', 'middle', 'bottom-left', 'bottom'],
  3: ['top', 'top-right', 'middle', 'bottom-right', 'bottom'],
  4: ['top-left', 'top-right', 'middle', 'bottom-right'],
  5: ['top', 'top-left', 'middle', 'bottom-right', 'bottom'],
  6: ['top', 'top-left', 'middle', 'bottom-left', 'bottom-right', 'bottom'],
  7: ['top', 'top-right', 'bottom-right'],
  8: ['top', 'top-left', 'top-right', 'middle', 'bottom-left', 'bottom-right', 'bottom'],
  9: ['top', 'top-left', 'top-right', 'middle', 'bottom-right', 'bottom']
};

class DigitDisplay {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
    this.currentValue = -1;
    this.createSegments();
  }

  createSegments() {
    const segments = [
      'top', 'top-left', 'top-right', 
      'middle', 
      'bottom-left', 'bottom-right', 'bottom'
    ];

    segments.forEach(type => {
      const segment = document.createElement('div');
      segment.classList.add('segment', type);
      
      if (type === 'top' || type === 'middle' || type === 'bottom') {
        segment.classList.add('horizontal');
      } else {
        segment.classList.add('vertical');
      }
      
      this.element.appendChild(segment);
    });
  }

  display(digit) {
    if (digit === this.currentValue) return;

    const activeSegments = new Set(DIGIT_SEGMENTS[digit]);
    Array.from(this.element.children).forEach(segment => {
      const segmentType = segment.classList[1];
      const isActive = activeSegments.has(segmentType);
      
      segment.style.opacity = isActive ? '1' : '0';
      
      if (segment.classList.contains('horizontal')) {
        segment.style.transform = isActive ? 'scaleX(1)' : 'scaleX(0)';
      } else {
        segment.style.transform = isActive ? 'scaleY(1)' : 'scaleY(0)';
      }
    });

    this.currentValue = digit;
  }
}

class MorphingClock {
  constructor() {
    this.hours1 = new DigitDisplay('hours1');
    this.hours2 = new DigitDisplay('hours2');
    this.minutes1 = new DigitDisplay('minutes1');
    this.minutes2 = new DigitDisplay('minutes2');
    this.seconds1 = new DigitDisplay('seconds1');
    this.seconds2 = new DigitDisplay('seconds2');
    
    this.lastSeconds = -1;
    this.lastMinutes = -1;
    this.lastHours = -1;

    this.timeFormatSelect = document.getElementById('time-format');
    this.gravityModeCheckbox = document.getElementById('gravity-mode');

    this.setupEventListeners();
    this.themeManager = new ThemeManager();
    this.alarmManager = new AlarmManager();
  }

  setupEventListeners() {
    this.timeFormatSelect.addEventListener('change', () => this.updateTime());
    this.gravityModeCheckbox.addEventListener('change', () => this.updateConfettiSettings());
  }

  updateConfettiSettings() {
    const mode = document.getElementById('gravity-mode').value;
    this.gravityMode = mode === 'gravity';
    this.confettiEnabled = mode !== 'disabled';
  }

  triggerConfetti(container) {
    const rect = container.getBoundingClientRect();
    const x = (rect.left + rect.width/2) / window.innerWidth;
    const y = (rect.top + rect.height/2) / window.innerHeight;

    const config = {
      particleCount: Math.floor(Math.random() * 100 + 50),
      spread: 360,
      angle: Math.random() * 360,
      origin: { x, y },
      colors: ['#002080', '#0044CC', '#0066FF'],
      shapes: ['circle', 'square'],
      scalar: Math.random() * 2 + 1,
      gravity: 0,
      drift: Math.random() - 0.5,
      ticks: 300,
      decay: 0.95
    };

    confetti(config);
  }

  updateTime() {
    const now = new Date();
    const timeFormat = this.timeFormatSelect.value;
    
    let hours = now.getHours();
    if (timeFormat === '12') {
      hours = hours % 12 || 12;
    }
    
    const formattedHours = hours.toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    if (parseInt(seconds) % 10 === 0 && parseInt(seconds) !== this.lastSeconds) {
      this.triggerConfetti(document.getElementById('seconds1'));  
    }

    if (parseInt(minutes) !== this.lastMinutes) {
      this.triggerConfetti(document.getElementById('minutes1'));
    }

    if (parseInt(hours) !== this.lastHours) {
      this.triggerConfetti(document.getElementById('hours1'));
    }

    this.hours1.display(parseInt(formattedHours[0]));
    this.hours2.display(parseInt(formattedHours[1]));
    this.minutes1.display(parseInt(minutes[0]));
    this.minutes2.display(parseInt(minutes[1]));
    this.seconds1.display(parseInt(seconds[0]));
    this.seconds2.display(parseInt(seconds[1]));

    this.lastSeconds = parseInt(seconds);
    this.lastMinutes = parseInt(minutes);
    this.lastHours = parseInt(hours);
  }

  start() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }
}

const clock = new MorphingClock();
clock.start();

export { MorphingClock };
import { MorphingClock } from './clock.js';
import { ThemeManager } from './theme-manager.js';
import { AlarmManager } from './alarm-manager.js';

// Since StopwatchManager and TimerManager are not defined in the provided current code,
// we will assume they are defined in stopwatch.js and timer.js respectively.
// If not, they need to be created according to their expected functionality.

class App {
  constructor() {
    this.initTabs();
    this.initFullscreen();

    this.clock = new MorphingClock();
    this.clock.start();

    this.themeManager = new ThemeManager();
    this.alarmManager = new AlarmManager();

    // Add hover tilt effect
    document.addEventListener('mousemove', (e) => {
      const container = document.querySelector('.container');
      const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 30;
      
      if (!document.getElementById('gravity-mode').checked) {
        container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
      }
    });
  }

  initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.dataset.tab;

        // Remove active class from all
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab
        button.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
      });
    });
  }

  initFullscreen() {
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    
    fullscreenToggle.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }
}

const app = new App();
export { App };
class AlarmManager {
  constructor() {
    this.addAlarmBtn = document.getElementById('add-alarm');
    this.alarmsContainer = document.getElementById('alarms-container');
    this.alarms = [];

    this.setupEventListeners();
    this.loadAlarms();
  }

  setupEventListeners() {
    this.addAlarmBtn.addEventListener('click', () => this.addAlarmRow());
  }

  addAlarmRow() {
    const alarmItem = document.createElement('div');
    alarmItem.classList.add('alarm-item');

    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.classList.add('alarm-time');

    const soundInput = document.createElement('input');
    soundInput.type = 'file';
    soundInput.accept = 'audio/*';
    soundInput.classList.add('alarm-sound');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => this.deleteAlarm(alarmItem));

    const enableCheckbox = document.createElement('input');
    enableCheckbox.type = 'checkbox';
    enableCheckbox.checked = true;

    alarmItem.append(timeInput, soundInput, enableCheckbox, deleteBtn);
    this.alarmsContainer.insertBefore(alarmItem, this.addAlarmBtn);

    this.startAlarmCheck();
    return alarmItem;
  }

  deleteAlarm(alarmElement) {
    alarmElement.remove();
    this.saveAlarms();
  }

  startAlarmCheck() {
    setInterval(() => {
      const now = new Date();
      const alarmRows = document.querySelectorAll('.alarm-item');

      alarmRows.forEach(row => {
        const timeInput = row.querySelector('.alarm-time');
        const soundInput = row.querySelector('.alarm-sound');
        const enableCheckbox = row.querySelector('input[type="checkbox"]');

        if (timeInput.value && enableCheckbox.checked) {
          const [alarmHours, alarmMinutes] = timeInput.value.split(':');
          
          if (
            now.getHours() === parseInt(alarmHours) && 
            now.getMinutes() === parseInt(alarmMinutes)
          ) {
            this.triggerAlarm(soundInput);
          }
        }
      });
    }, 1000);
  }

  triggerAlarm(soundInput) {
    const file = soundInput.files[0];
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
    
    if (file) {
      const audio = new Audio(URL.createObjectURL(file));
      audio.loop = true;
      audio.play();
      
      setTimeout(() => {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      }, 5000);
    }

    setTimeout(() => {
      oscillator.stop();
      gainNode.disconnect();
    }, 1000);
  }

  saveAlarms() {
    const alarms = [];
    document.querySelectorAll('.alarm-item').forEach(row => {
      alarms.push({
        time: row.querySelector('.alarm-time').value,
        sound: row.querySelector('.alarm-sound').files[0]?.name || '',
        enabled: row.querySelector('input[type="checkbox"]').checked
      });
    });
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }

  loadAlarms() {
    const savedAlarms = JSON.parse(localStorage.getItem('alarms') || '[]');
    savedAlarms.forEach(alarm => {
      const newAlarm = this.addAlarmRow();
      newAlarm.querySelector('.alarm-time').value = alarm.time;
      newAlarm.querySelector('input[type="checkbox"]').checked = alarm.enabled;
    });
  }
}

export { AlarmManager };
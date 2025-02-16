class ThemeManager {
  constructor() {
    this.themeSelect = document.getElementById('theme');
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.themeSelect.addEventListener('change', () => this.applyTheme());
  }

  applyTheme() {
    const theme = this.themeSelect.value;
    const root = document.documentElement;

    switch(theme) {
      case 'dark':
        root.style.setProperty('--bg-color', '#111');
        root.style.setProperty('--digit-color', '#002080');
        break;
      case 'light':
        root.style.setProperty('--bg-color', '#f0f0f0');
        root.style.setProperty('--digit-color', '#333');
        break;
      case 'neon':
        root.style.setProperty('--bg-color', '#000');
        root.style.setProperty('--digit-color', '#00ffff');
        break;
    }
  }
}

export { ThemeManager };
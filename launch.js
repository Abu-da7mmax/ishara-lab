const appScript = document.createElement('script');
appScript.src = document.documentElement.lang === 'ar' ? 'app.js?v=about-1' : 'app.en.js?v=about-1';
appScript.onload = () => window.dispatchEvent(new Event('ishara-ready'));
document.body.append(appScript);

const root = document.documentElement;
function getPreference(name) {
  try { return localStorage.getItem(name); } catch { return null; }
}
function setPreference(name, value) {
  try { localStorage.setItem(name, value); } catch { }
}
const isArabic = getPreference('ishara-language') === 'ar';
root.lang = isArabic ? 'ar' : 'en';
root.dir = isArabic ? 'rtl' : 'ltr';
const languageButton = document.getElementById('language');
languageButton.textContent = isArabic ? 'English' : 'العربية';
languageButton.lang = isArabic ? 'en' : 'ar';
languageButton.onclick = () => {
  setPreference('ishara-language', isArabic ? 'en' : 'ar');
  location.reload();
};
const themeButton = document.getElementById('theme');
function applyTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === 'dark';
  themeButton.textContent = isArabic ? (dark ? '☀ فاتح' : '☾ داكن') : (dark ? '☀ Light' : '☾ Dark');
  themeButton.setAttribute('aria-pressed', String(dark));
}
applyTheme(getPreference('ishara-theme') === 'dark' ? 'dark' : 'light');
themeButton.onclick = () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setPreference('ishara-theme', theme);
  applyTheme(theme);
};
if (!isArabic) {
  document.title = 'Ishara — Digital Communications Lab';
  document.querySelector('meta[name=description]').content = 'Learn digital communications with interactive labs, quizzes and Python exercises.';
  document.querySelector('.brand span').innerHTML = 'Ishara<small>SIGNAL LAB</small>';
  const navLabels = ['◉ Learning path', '∿ Signal lab', '▦ My progress', '⌘ About the project'];
  document.querySelectorAll('nav button').forEach((button, index) => {
    button.textContent = navLabels[index];
  });
  const labels = document.querySelectorAll('.side-label');
  labels[0].textContent = 'Learning space';
  labels[1].firstChild.textContent = 'Course outline ';
  document.querySelector('.local').innerHTML = '● Saved on this device<small>Export a backup to move your progress.</small>';
  document.querySelector('header > span').textContent = 'Ishara / Digital communications';
  document.querySelector('footer').firstChild.textContent = 'Digital Communications Lab ';
}

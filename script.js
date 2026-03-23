// Navbar scroll effect
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// Count-up animation
const counters = [
  { id: 'c1', target: 50, duration: 1800 },
  { id: 'c2', target: 5, duration: 1200 },
  { id: 'c3', target: 94, duration: 2000 },
  { id: 'c4', target: 1, duration: 800 },
];
let counted = false;
const statsSection = document.querySelector('.stats-section');
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    counters.forEach(({ id, target, duration }) => {
      const el = document.getElementById(id);
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current);
        if (current >= target) clearInterval(timer);
      }, 16);
    });
  }
}, { threshold: 0.3 });
statsObserver.observe(statsSection);

// Modal
function openModal(type) {
  document.getElementById('authModal').classList.add('open');
  switchTab(type);
}
function closeModal(e) {
  if (e.target === document.getElementById('authModal')) {
    document.getElementById('authModal').classList.remove('open');
  }
}
function switchTab(type) {
  const isLogin = type === 'login';
  document.getElementById('loginForm').style.display = isLogin ? 'block' : 'none';
  document.getElementById('signupForm').style.display = isLogin ? 'none' : 'block';
  document.getElementById('tabLogin').classList.toggle('active', isLogin);
  document.getElementById('tabSignup').classList.toggle('active', !isLogin);
  document.getElementById('modalTitle').textContent = isLogin ? 'Welcome Back 👋' : 'Get Started Free 🚀';
  document.getElementById('modalSub').textContent = isLogin
    ? 'Sign in to continue building your resume'
    : 'Join 50,000+ job seekers. No credit card needed.';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.getElementById('authModal').classList.remove('open');
});

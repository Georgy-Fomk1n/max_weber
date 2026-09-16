// === Переключение темы ===
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Проверка сохранённой темы
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  html.setAttribute('data-theme', 'dark');
}

// Обработчик переключения темы
themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// === Интерактивные схемы ===
// Добавляем плавную анимацию при наведении на элементы схем
const schemeElements = document.querySelectorAll('.scheme-element, .hierarchy-level, .type-card, .feature-card');

schemeElements.forEach(element => {
  element.addEventListener('mouseenter', () => {
    element.style.transform = 'translateY(-4px)';
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'translateY(0)';
  });
});

// === Плавная прокрутка для навигации ===
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80; // Учитываем высоту навигации
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// === Активная навигация при скролле ===
const sections = document.querySelectorAll('.section');
const navLinksArray = Array.from(navLinks);

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.scrollY >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });
  
  navLinksArray.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// === Анимация появления секций ===
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Применяем анимацию к секциям
sections.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// === Интерактивная схема власти ===
const powerScheme = document.getElementById('powerScheme');
if (powerScheme) {
  const elements = powerScheme.querySelectorAll('.scheme-element');
  
  elements.forEach((element, index) => {
    element.addEventListener('click', () => {
      // Убираем активный класс у всех элементов
      elements.forEach(el => el.classList.remove('active'));
      // Добавляем активный класс текущему элементу
      element.classList.add('active');
      
      // Добавляем визуальный эффект
      element.style.borderColor = 'var(--accent-color)';
      element.style.backgroundColor = 'var(--bg-secondary)';
      
      // Сбрасываем стили других элементов
      elements.forEach((el, i) => {
        if (i !== index) {
          el.style.borderColor = 'var(--border-color)';
          el.style.backgroundColor = 'var(--bg-primary)';
        }
      });
    });
  });
}

// === Добавляем стили для активного состояния схем ===
const style = document.createElement('style');
style.textContent = `
  .scheme-element.active {
    border-color: var(--accent-color) !important;
    background-color: var(--bg-secondary) !important;
    transform: scale(1.05);
  }
  
  .hierarchy-level:hover {
    transform: scale(1.02);
  }
  
  .type-card:hover {
    transform: translateY(-4px);
  }
  
  .feature-card:hover {
    transform: translateY(-2px);
  }
`;
document.head.appendChild(style);

console.log('Сайт успешно загружен. Интерактивные элементы активированы.');
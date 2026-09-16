// === Управление сторис ===
class StoriesManager {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.story-slide');
    this.totalSlides = this.slides.length;
    this.progressDotsContainer = document.getElementById('progressDots');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.container = document.getElementById('storiesContainer');
    
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.autoProgressInterval = null;
    this.autoProgressDelay = 8000; // 8 секунд на слайд
    
    this.init();
  }
  
  init() {
    this.createProgressDots();
    this.updateSlide();
    this.addEventListeners();
    this.startAutoProgress();
    this.hideSwipeIndicator();
  }
  
  createProgressDots() {
    this.progressDotsContainer.innerHTML = '';
    
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      dot.dataset.index = i;
      dot.addEventListener('click', () => this.goToSlide(i));
      this.progressDotsContainer.appendChild(dot);
    }
    
    this.progressDots = document.querySelectorAll('.progress-dot');
  }
  
  updateSlide() {
    // Обновляем слайды
    this.slides.forEach((slide, index) => {
      slide.classList.remove('active');
      if (index === this.currentSlide) {
        slide.classList.add('active');
      }
    });
    
    // Обновляем прогресс-точки
    this.progressDots.forEach((dot, index) => {
      dot.classList.remove('active', 'completed');
      if (index === this.currentSlide) {
        dot.classList.add('active');
      } else if (index < this.currentSlide) {
        dot.classList.add('completed');
      }
    });
    
    // Обновляем кнопки навигации
    this.prevBtn.disabled = this.currentSlide === 0;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    
    // Перезапускаем автопрогресс
    this.resetAutoProgress();
  }
  
  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.currentSlide = index;
      this.updateSlide();
      this.scrollToSlide();
    }
  }
  
  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
      this.updateSlide();
      this.scrollToSlide();
    }
  }
  
  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSlide();
      this.scrollToSlide();
    }
  }
  
  scrollToSlide() {
    const slide = this.slides[this.currentSlide];
    slide.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start'
    });
  }
  
  addEventListeners() {
    // Кнопки навигации
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Клавиатура
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevSlide();
      }
    });
    
    // Touch события для свайпа
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.resetAutoProgress();
    }, { passive: true });
    
    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
    
    // Mouse события для десктопа
    this.container.addEventListener('mousedown', (e) => {
      this.touchStartX = e.clientX;
      this.resetAutoProgress();
    });
    
    this.container.addEventListener('mouseup', (e) => {
      this.touchEndX = e.clientX;
      this.handleSwipe();
    });
    
    // Wheel события для мышки
    this.container.addEventListener('wheel', (e) => {
      this.resetAutoProgress();
      
      if (e.deltaY > 0) {
        this.nextSlide();
      } else if (e.deltaY < 0) {
        this.prevSlide();
      }
    }, { passive: true });
    
    // Отслеживание видимости для паузы автопрогресса
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoProgress();
      } else {
        this.startAutoProgress();
      }
    });
  }
  
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Свайп влево - следующий слайд
        this.nextSlide();
      } else {
        // Свайп вправо - предыдущий слайд
        this.prevSlide();
      }
    }
  }
  
  startAutoProgress() {
    this.stopAutoProgress();
    this.autoProgressInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoProgressDelay);
  }
  
  stopAutoProgress() {
    if (this.autoProgressInterval) {
      clearInterval(this.autoProgressInterval);
      this.autoProgressInterval = null;
    }
  }
  
  resetAutoProgress() {
    this.stopAutoProgress();
    this.startAutoProgress();
  }
  
  hideSwipeIndicator() {
    // Скрываем индикатор свайпа после первого взаимодействия
    const hideHandler = () => {
      const indicator = document.querySelector('.swipe-indicator');
      if (indicator) {
        indicator.style.opacity = '0';
        setTimeout(() => {
          indicator.style.display = 'none';
        }, 300);
      }
      
      // Убираем обработчики после первого срабатывания
      this.container.removeEventListener('touchstart', hideHandler);
      this.container.removeEventListener('mousedown', hideHandler);
      this.container.removeEventListener('wheel', hideHandler);
    };
    
    this.container.addEventListener('touchstart', hideHandler, { once: true });
    this.container.addEventListener('mousedown', hideHandler, { once: true });
    this.container.addEventListener('wheel', hideHandler, { once: true });
  }
}

// === Переключение темы ===
function initThemeToggle() {
  const savedTheme = localStorage.getItem('theme');
  const html = document.documentElement;
  
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }
}

// === Инициализация ===
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  new StoriesManager();
  
  console.log('Сторис успешно загружены. Управление: свайп, стрелки, клик по точкам.');
});
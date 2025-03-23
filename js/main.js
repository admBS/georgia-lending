// Дожидаемся полной загрузки DOM перед выполнением JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initNavigation();
    initAnimations();
    initModals();
    initAccordion();
    initGallery();
    initCalculator();
    initForms();
    initScrollToTop();
    
    // Инициализация превью для видео
    initVideoThumbnails();
});

// Навигация
function initNavigation() {
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Обработка прокрутки страницы - добавление/удаление класса для шапки
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
    
    // Мобильное меню
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('nav__menu--active');
            mobileMenuBtn.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Прокрутка к секциям при клике на ссылки навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Закрываем мобильное меню при клике на ссылку
            navMenu.classList.remove('nav__menu--active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Анимации
function initAnimations() {
    // Анимации при скролле
    const animatedElements = document.querySelectorAll('.animated');
    
    const checkScroll = function() {
        const triggerPoint = window.innerHeight * 0.8;
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerPoint) {
                element.classList.add('animated--visible');
            }
        });
    };
    
    // Проверяем при загрузке и скролле
    checkScroll();
    window.addEventListener('scroll', checkScroll);
}

// Модальные окна
function initModals() {
    const callBtns = document.querySelectorAll('.call-btn');
    const modalCall = document.querySelector('.modal--call');
    const modalSuccess = document.querySelector('.modal--success');
    const modalCloseButtons = document.querySelectorAll('.modal__close, .modal__close-btn');
    
    // Открытие модального окна заказа звонка
    callBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modalCall.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Закрытие модальных окон
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        });
    });
    
    // Закрытие по клику на затемненный фон
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Закрытие по клавише Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    });
}

// Аккордеон для FAQ
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion__header');
        
        header.addEventListener('click', function() {
            // Закрываем все остальные аккордеоны
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем состояние текущего аккордеона
            item.classList.toggle('active');
        });
    });
}

// Галерея и лайтбокс
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Фильтрация элементов галереи
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Удаляем класс active у всех кнопок и добавляем текущей
            filterButtons.forEach(otherBtn => {
                otherBtn.classList.remove('active');
            });
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                } else if (item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Лайтбокс для просмотра изображений
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.innerHTML = `
        <div class="lightbox__content">
            <span class="lightbox__close">&times;</span>
            <img class="lightbox__image" src="" alt="Изображение в полном размере">
            <span class="lightbox__prev"><i class="fas fa-chevron-left"></i></span>
            <span class="lightbox__next"><i class="fas fa-chevron-right"></i></span>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImage = lightbox.querySelector('.lightbox__image');
    const lightboxClose = lightbox.querySelector('.lightbox__close');
    const lightboxPrev = lightbox.querySelector('.lightbox__prev');
    const lightboxNext = lightbox.querySelector('.lightbox__next');
    
    let currentImageIndex = 0;
    let visibleGalleryItems = [];
    
    // Открытие лайтбокса
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Получаем и устанавливаем изображение
            const imageSrc = item.querySelector('img').getAttribute('src');
            lightboxImage.setAttribute('src', imageSrc);
            
            // Получаем видимые элементы галереи для навигации
            visibleGalleryItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
            currentImageIndex = visibleGalleryItems.indexOf(item);
        });
    });
    
    // Закрытие лайтбокса
    lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Закрытие по клику на затемненный фон
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Кнопки навигации
    lightboxPrev.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
        const imageSrc = visibleGalleryItems[currentImageIndex].querySelector('img').getAttribute('src');
        lightboxImage.setAttribute('src', imageSrc);
    });
    
    lightboxNext.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % visibleGalleryItems.length;
        const imageSrc = visibleGalleryItems[currentImageIndex].querySelector('img').getAttribute('src');
        lightboxImage.setAttribute('src', imageSrc);
    });
    
    // Клавиши для навигации
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight') {
            lightboxNext.click();
        } else if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Калькулятор стоимости
function initCalculator() {
    const calculator = document.querySelector('.calculator-form');
    const resultPrice = document.querySelector('.calculator__result-price');
    const yearSlider = document.getElementById('year-slider');
    const yearValue = document.querySelector('.year-value');
    
    if (!calculator || !resultPrice) return;
    
    // Обновление отображаемого года при перемещении ползунка
    if (yearSlider && yearValue) {
        yearSlider.addEventListener('input', function() {
            yearValue.textContent = this.value;
            calculatePrice();
        });
    }
    
    // Расчет стоимости при изменении любого параметра
    const radioInputs = calculator.querySelectorAll('input[type="radio"]');
    const selectInputs = calculator.querySelectorAll('select');
    
    radioInputs.forEach(input => {
        input.addEventListener('change', calculatePrice);
    });
    
    selectInputs.forEach(select => {
        select.addEventListener('change', calculatePrice);
    });
    
    // Обработка отправки формы (расчет)
    calculator.addEventListener('submit', function(e) {
        e.preventDefault();
        calculatePrice();
    });
    
    // Функция расчета стоимости
    function calculatePrice() {
        // Получаем значения всех полей
        const carType = document.querySelector('input[name="car_type"]:checked').value;
        const year = parseInt(yearSlider.value);
        const engine = document.getElementById('engine').value;
        const condition = document.querySelector('input[name="condition"]:checked').value;
        
        // Базовая стоимость в зависимости от типа автомобиля
        let basePrice = 0;
        if (carType === 'sedan') {
            basePrice = 1800;
        } else if (carType === 'suv') {
            basePrice = 2300;
        } else if (carType === 'truck') {
            basePrice = 2500;
        }
        
        // Наценки/скидки в зависимости от года выпуска
        let yearMultiplier = 1;
        if (year >= 2020) {
            yearMultiplier = 1.1;
        } else if (year <= 2010) {
            yearMultiplier = 0.9;
        }
        
        // Наценка за объем двигателя
        let engineMultiplier = 1;
        if (engine === '3.0') {
            engineMultiplier = 1.1;
        } else if (engine === '4.0') {
            engineMultiplier = 1.2;
        } else if (engine === '5.0') {
            engineMultiplier = 1.3;
        }
        
        // Скидка для автомобилей с повреждениями
        let conditionMultiplier = 1;
        if (condition === 'salvage') {
            conditionMultiplier = 0.9;
        }
        
        // Итоговый расчет
        const finalPrice = Math.round(basePrice * yearMultiplier * engineMultiplier * conditionMultiplier);
        
        // Обновляем отображаемую цену с анимацией
        animateValue(resultPrice, parseInt(resultPrice.textContent), finalPrice, 500);
    }
    
    // Анимация изменения числового значения
    function animateValue(element, start, end, duration) {
        let startTime = null;
        
        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = end;
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Инициализируем расчет при загрузке страницы
    calculatePrice();
}

// Обработка форм обратной связи
function initForms() {
    const contactForm = document.querySelector('.contact-form');
    const modalForm = document.querySelector('.modal-form');
    const modalSuccess = document.querySelector('.modal--success');
    
    // Валидация и отправка контактной формы
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверка honeypot поля для защиты от ботов
            const honeypot = contactForm.querySelector('.honeypot');
            if (honeypot && honeypot.value) {
                return; // Если поле заполнено, это бот
            }
            
            // Проверка валидности формы
            if (validateForm(contactForm)) {
                // Имитация отправки данных
                const formData = new FormData(contactForm);
                simulateFormSubmission(formData)
                    .then(() => {
                        showSuccessMessage(contactForm);
                        contactForm.reset();
                        
                        // Показываем модальное окно успешной отправки
                        setTimeout(() => {
                            modalSuccess.classList.add('active');
                            document.body.style.overflow = 'hidden';
                        }, 1000);
                    })
                    .catch(error => {
                        showErrorMessage(contactForm, 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
                    });
            }
        });
    }
    
    // Валидация и отправка модальной формы заказа звонка
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверка валидности формы
            if (validateForm(modalForm)) {
                // Имитация отправки данных
                const formData = new FormData(modalForm);
                simulateFormSubmission(formData)
                    .then(() => {
                        showSuccessMessage(modalForm);
                        modalForm.reset();
                        
                        // Закрываем текущее модальное окно и показываем окно успеха
                        setTimeout(() => {
                            document.querySelector('.modal--call').classList.remove('active');
                            modalSuccess.classList.add('active');
                        }, 1000);
                    })
                    .catch(error => {
                        showErrorMessage(modalForm, 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
                    });
            }
        });
    }
    
    // Валидация формы
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Удаляем класс ошибки при вводе данных
                field.addEventListener('input', function() {
                    this.classList.remove('error');
                }, { once: true });
            } else {
                field.classList.remove('error');
            }
        });
        
        // Проверка формата телефона
        const phoneField = form.querySelector('input[type="tel"]');
        if (phoneField && phoneField.value.trim()) {
            const phonePattern = /^[0-9+()-\s]+$/;
            if (!phonePattern.test(phoneField.value)) {
                isValid = false;
                phoneField.classList.add('error');
                
                phoneField.addEventListener('input', function() {
                    this.classList.remove('error');
                }, { once: true });
            }
        }
        
        return isValid;
    }
    
    // Имитация отправки формы
    function simulateFormSubmission(formData) {
        return new Promise((resolve, reject) => {
            // В реальном проекте здесь будет fetch-запрос к серверу
            // Пример:
            // fetch('https://api.example.com/submit-form', {
            //     method: 'POST',
            //     body: formData
            // })
            
            // Имитируем задержку сервера
            setTimeout(() => {
                // Для демонстрации успешной отправки
                const success = true;
                if (success) {
                    resolve();
                } else {
                    reject('Error submitting form');
                }
            }, 1500);
        });
    }
    
    // Отображение сообщения об успешной отправке
    function showSuccessMessage(form) {
        const messageContainer = form.querySelector('.form-message');
        if (messageContainer) {
            messageContainer.textContent = 'Сообщение успешно отправлено!';
            messageContainer.classList.add('success');
            messageContainer.classList.remove('error');
            messageContainer.style.display = 'block';
        }
    }
    
    // Отображение сообщения об ошибке
    function showErrorMessage(form, message) {
        const messageContainer = form.querySelector('.form-message');
        if (messageContainer) {
            messageContainer.textContent = message;
            messageContainer.classList.add('error');
            messageContainer.classList.remove('success');
            messageContainer.style.display = 'block';
        }
    }
}

// Кнопка прокрутки наверх
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.classList.add('scroll-top-btn');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollBtn);
    
    // Показывать кнопку только при прокрутке вниз
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Прокрутка наверх при клике
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Функция для воспроизведения видео при клике
function playVideo(containerId) {
    const videoContainer = document.getElementById(containerId);
    if (!videoContainer) return;
    
    const videoOverlay = videoContainer.querySelector('.video-overlay');
    const iframe = videoContainer.querySelector('iframe');
    
    if (iframe && iframe.getAttribute('data-src')) {
        // Устанавливаем настоящий src из data-src
        iframe.setAttribute('src', iframe.getAttribute('data-src') + '?autoplay=1');
        iframe.removeAttribute('data-src');
        
        // Скрываем оверлей
        if (videoOverlay) {
            videoOverlay.style.display = 'none';
        }
        
        // Добавляем класс playing для стилей
        videoContainer.classList.add('playing');
    }
}

// Инициализация превью для видео
function initVideoThumbnails() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const iframe = container.querySelector('iframe');
        const overlay = container.querySelector('.video-overlay');
        
        if (iframe && iframe.getAttribute('data-src')) {
            // Извлекаем ID видео из data-src
            const videoSrc = iframe.getAttribute('data-src');
            const videoId = videoSrc.split('/').pop();
            
            if (videoId) {
                // Создаем элемент с превью
                const thumbnail = document.createElement('div');
                thumbnail.classList.add('video-thumbnail');
                
                // Используем несколько вариантов качества превью
                // YouTube предоставляет разные размеры превью:
                // maxresdefault.jpg (высокое качество)
                // sddefault.jpg (стандартное качество)
                // hqdefault.jpg (немного хуже качество)
                // mqdefault.jpg (среднее качество)
                // default.jpg (низкое качество)
                
                // Проверяем доступность высококачественного превью
                checkImageExists(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
                    .then(exists => {
                        if (exists) {
                           // thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;
                            thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/0.jpg)`;
                        } else {
                            // Если недоступно, используем превью стандартного качества
                          //  thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/sddefault.jpg)`;
                          thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/0.jpg)`;
                        }
                    })
                    .catch(() => {
                        // При ошибке используем гарантированно доступное превью
                        // thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`;
                        thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/0.jpg)`;
                    });
                
                // Добавляем в контейнер перед оверлеем
                if (overlay) {
                    container.insertBefore(thumbnail, overlay);
                } else {
                    container.appendChild(thumbnail);
                }
                
                // Создаем более красивую кнопку воспроизведения
                if (overlay) {
                    const playButton = document.createElement('div');
                    playButton.classList.add('custom-play-button');
                    overlay.appendChild(playButton);
                }
            }
        }
    });
}

// Функция для проверки существования изображения
function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

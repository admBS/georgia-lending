// Дожидаемся полной загрузки DOM перед выполнением JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех функций при загрузке DOM
    initAnimations();
    initModals();
    initFAQ();
    initGallery();
    initCalculator();
    initCounter();
    initVideoThumbnails();
    initScrollToButtons();
    initVideoButtons();
    initScrollToTop();
    initForms();
});

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
    // Создаем модальные окна, если они отсутствуют
    createModalsIfNotExist();
    
    const callBtns = document.querySelectorAll('.call-btn');
    const modalCall = document.querySelector('.modal--call');
    const modalSuccess = document.querySelector('.modal--success');
    const modalCloseButtons = document.querySelectorAll('.modal__close, .modal__close-btn');
    
    // Открытие модального окна заказа звонка
    if (callBtns.length) {
        callBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (modalCall) {
                    modalCall.classList.add('active');
                    document.body.style.overflow = 'hidden';
                } else {
                    console.error('Modal call element not found');
                }
            });
        });
    }
    
    // Закрытие модальных окон
    if (modalCloseButtons.length) {
        modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.style.overflow = '';
            });
        });
    }
    
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

// Создаем модальные окна, если они отсутствуют в HTML
function createModalsIfNotExist() {
    if (!document.querySelector('.modal--call')) {
        const modalCall = document.createElement('div');
        modalCall.className = 'modal modal--call';
        modalCall.innerHTML = `
            <div class="modal__content">
                <div class="modal__header">
                    <h3>Заказать звонок</h3>
                    <button class="modal__close">&times;</button>
                </div>
                <div class="modal__body">
                    <form class="callback-form">
                        <div class="form-group">
                            <input type="text" name="name" placeholder="Ваше имя" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" name="phone" placeholder="Ваш телефон" required>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn--primary">Отправить</button>
                        </div>
                        <div class="form-message"></div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modalCall);
    }
    
    if (!document.querySelector('.modal--success')) {
        const modalSuccess = document.createElement('div');
        modalSuccess.className = 'modal modal--success';
        modalSuccess.innerHTML = `
            <div class="modal__content">
                <div class="modal__header">
                    <h3>Спасибо за заявку!</h3>
                    <button class="modal__close">&times;</button>
                </div>
                <div class="modal__body">
                    <p>Ваша заявка успешно отправлена. Наш менеджер свяжется с вами в ближайшее время.</p>
                    <div class="modal__footer">
                        <button class="btn btn--primary modal__close-btn">Закрыть</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalSuccess);
    }
}

// FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Закрываем все остальные элементы FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем состояние текущего элемента
            item.classList.toggle('active');
        });
    });
}

// Галерея и лайтбокс
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery__item');
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
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox__img');
    const lightboxClose = document.querySelector('.lightbox__close');
    const lightboxPrev = document.querySelector('.lightbox__prev');
    const lightboxNext = document.querySelector('.lightbox__next');
    
    // Массив для хранения путей к изображениям
    let galleryImages = [];
    let currentImageIndex = 0;
    
    // Заполняем массив изображениями из галереи
    galleryItems.forEach(item => {
        const img = item.querySelector('.gallery__image img');
        if (img) {
            galleryImages.push(img.getAttribute('src'));
        }
        
        // Добавляем обработчик клика на элементы галереи
        item.addEventListener('click', function() {
            const img = this.querySelector('.gallery__image img');
            if (img) {
                const imgSrc = img.getAttribute('src');
                lightboxImg.setAttribute('src', imgSrc);
                
                // Находим индекс текущего изображения
                currentImageIndex = galleryImages.indexOf(imgSrc);
                
                // Открываем лайтбокс
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Закрытие лайтбокса
    lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Закрытие по клику на фон
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Переключение на предыдущее изображение
    lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.setAttribute('src', galleryImages[currentImageIndex]);
    });
    
    // Переключение на следующее изображение
    lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        lightboxImg.setAttribute('src', galleryImages[currentImageIndex]);
    });
    
    // Навигация с клавиатуры
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            lightboxImg.setAttribute('src', galleryImages[currentImageIndex]);
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            lightboxImg.setAttribute('src', galleryImages[currentImageIndex]);
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
    calculator.addEventListener('submit', async function(e) {
        e.preventDefault();
        calculatePrice();
        
        // Добавляем обработку отправки формы в Telegram, если указан телефон
        const phoneInput = calculator.querySelector('input[name="phone"]');
        const nameInput = calculator.querySelector('input[name="name"]');
        if (phoneInput && phoneInput.value) {
            // Показываем индикатор загрузки
            const submitBtn = calculator.querySelector('[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            // Собираем данные формы
            const data = {
                carType: document.querySelector('input[name="car_type"]:checked').value,
                year: document.querySelector('#year-slider').value,
                volume: document.querySelector('#engine').value,
                condition: document.querySelector('input[name="condition"]:checked').value,
                price: resultPrice.textContent,
                phone: phoneInput.value,
                name: nameInput ? nameInput.value : ''
            };
            
            // Отправляем данные на сервер
            fetch('http://localhost:3000/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Показываем сообщение об успехе
                    const modalSuccess = document.querySelector('.modal--success');
                    if (modalSuccess) {
                        modalSuccess.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                    
                    // Сбрасываем поля формы
                    phoneInput.value = '';
                    if (nameInput) nameInput.value = '';
                } else {
                    // Показываем сообщение об ошибке
                    const messageEl = calculator.querySelector('.form-message');
                    if (messageEl) {
                        messageEl.innerHTML = `<div class="error-message">${result.error || 'Произошла ошибка при отправке данных'}</div>`;
                    }
                }
            })
            .catch(error => {
                console.error('Ошибка отправки формы:', error);
                const messageEl = calculator.querySelector('.form-message');
                if (messageEl) {
                    messageEl.innerHTML = '<div class="error-message">Произошла ошибка при отправке данных</div>';
                }
            })
            .finally(() => {
                // Восстанавливаем кнопку
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        }
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

// Счетчик
function initCounter() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const targetValue = parseInt(counter.getAttribute('data-target'));
        let currentValue = 0;
        
        function updateCounter() {
            if (currentValue < targetValue) {
                currentValue++;
                counter.textContent = currentValue;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = targetValue;
            }
        }
        
        updateCounter();
    });
}

// Кнопка прокрутки наверх
function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;
    
    // Показывать кнопку только при прокрутке вниз
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
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

// Инициализация кнопок прокрутки
function initScrollToButtons() {
    const scrollButtons = document.querySelectorAll('[data-scroll-to]');
    
    scrollButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-scroll-to');
            scrollToElement(targetId);
        });
    });
}

// Функция для плавного скролла к элементу
function scrollToElement(elementId) {
    const targetElement = document.getElementById(elementId);
    
    if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
        });
    } else {
        console.error(`Element with id ${elementId} not found`);
    }
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
                checkImageExists(`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`)
                    .then(exists => {
                        if (exists) {
                           // thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;
                            thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/mqdefault.jpg)`;
                        } else {
                            // Если недоступно, используем превью стандартного качества
                          //  thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/sddefault.jpg)`;
                          thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/mqdefault.jpg)`;
                        }
                    })
                    .catch(() => {
                        // При ошибке используем гарантированно доступное превью
                        // thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`;
                        thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/mqdefault.jpg)`;
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

// Инициализация кнопок видео
function initVideoButtons() {
    const videoOverlays = document.querySelectorAll('.video-overlay[data-video-id]');
    
    videoOverlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            playVideo(videoId);
        });
    });
}

// Инициализация обработки форм отправки
function initForms() {
    // Форма обратной связи
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Показываем индикатор загрузки
            const submitBtn = this.querySelector('[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            // Собираем данные формы
            const formData = new FormData(this);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            try {
                // Отправляем данные на сервер
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataObj)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Показываем сообщение об успехе
                    const modalSuccess = document.querySelector('.modal--success');
                    if (modalSuccess) {
                        document.querySelectorAll('.modal').forEach(modal => {
                            modal.classList.remove('active');
                        });
                        modalSuccess.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                    
                    // Сбрасываем форму
                    this.reset();
                } else {
                    // Показываем сообщение об ошибке
                    const messageEl = this.querySelector('.form-message');
                    if (messageEl) {
                        messageEl.innerHTML = `<div class="error-message">${result.error || 'Произошла ошибка при отправке формы'}</div>`;
                    }
                }
            } catch (error) {
                console.error('Ошибка отправки формы:', error);
                const messageEl = this.querySelector('.form-message');
                if (messageEl) {
                    messageEl.innerHTML = '<div class="error-message">Произошла ошибка при отправке формы</div>';
                }
            } finally {
                // Восстанавливаем кнопку
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Форма заказа обратного звонка
    const callbackForms = document.querySelectorAll('.callback-form');
    if (callbackForms.length) {
        callbackForms.forEach(form => {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Показываем индикатор загрузки
                const submitBtn = this.querySelector('[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                submitBtn.disabled = true;
                
                // Собираем данные формы
                const formData = new FormData(this);
                const formDataObj = {};
                formData.forEach((value, key) => {
                    formDataObj[key] = value;
                });
                
                try {
                    // Отправляем данные на сервер
                    const response = await fetch('http://localhost:3000/api/callback', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formDataObj)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        // Показываем сообщение об успехе
                        const modalSuccess = document.querySelector('.modal--success');
                        const modalCall = document.querySelector('.modal--call');
                        
                        if (modalSuccess) {
                            if (modalCall) {
                                modalCall.classList.remove('active');
                            }
                            modalSuccess.classList.add('active');
                        }
                        
                        // Сбрасываем форму
                        this.reset();
                    } else {
                        // Показываем сообщение об ошибке
                        const messageEl = this.querySelector('.form-message');
                        if (messageEl) {
                            messageEl.innerHTML = `<div class="error-message">${result.error || 'Произошла ошибка при отправке формы'}</div>`;
                        }
                    }
                } catch (error) {
                    console.error('Ошибка отправки формы:', error);
                    const messageEl = this.querySelector('.form-message');
                    if (messageEl) {
                        messageEl.innerHTML = '<div class="error-message">Произошла ошибка при отправке формы</div>';
                    }
                } finally {
                    // Восстанавливаем кнопку
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            });
        });
    }
}

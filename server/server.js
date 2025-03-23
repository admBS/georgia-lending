const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Функция отправки сообщений в Telegram
async function sendTelegramMessage(message) {
    const { token, chatId } = config.telegram;
    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    
    try {
        const response = await axios.post(telegramUrl, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Ошибка при отправке сообщения в Telegram:', error);
        return { success: false, error: error.message };
    }
}

// Обработка формы обратной связи
app.post('/api/contact', async (req, res) => {
    try {
        const { name, phone, email, service, message } = req.body;
        
        // Проверка на спам (honeypot)
        if (req.body.website) {
            return res.status(200).json({ success: true });
        }
        
        // Базовая валидация
        if (!name || !phone) {
            return res.status(400).json({ success: false, error: 'Необходимо указать имя и телефон' });
        }
        
        // Формирование сообщения для Telegram
        const telegramMessage = `
<b>Новая заявка с сайта:</b>

<b>Имя:</b> ${name}
<b>Телефон:</b> ${phone}
${email ? `<b>Email:</b> ${email}\n` : ''}
${service ? `<b>Услуга:</b> ${service}\n` : ''}
${message ? `<b>Сообщение:</b> ${message}` : ''}
        `;
        
        // Отправка в Telegram
        const result = await sendTelegramMessage(telegramMessage);
        
        if (result.success) {
            res.status(200).json({ success: true });
        } else {
            res.status(500).json({ success: false, error: 'Ошибка при отправке сообщения' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
    }
});

// Обработка запроса на обратный звонок
app.post('/api/callback', async (req, res) => {
    try {
        const { phone, name } = req.body;
        
        // Проверка на спам (honeypot)
        if (req.body.website) {
            return res.status(200).json({ success: true });
        }
        
        // Базовая валидация
        if (!phone) {
            return res.status(400).json({ success: false, error: 'Необходимо указать телефон' });
        }
        
        // Формирование сообщения для Telegram
        const telegramMessage = `
<b>Запрос на обратный звонок:</b>

<b>Телефон:</b> ${phone}
${name ? `<b>Имя:</b> ${name}` : ''}
        `;
        
        // Отправка в Telegram
        const result = await sendTelegramMessage(telegramMessage);
        
        if (result.success) {
            res.status(200).json({ success: true });
        } else {
            res.status(500).json({ success: false, error: 'Ошибка при отправке сообщения' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
    }
});

// Обработка запроса расчета из калькулятора
app.post('/api/calculate', async (req, res) => {
    try {
        const { carType, year, volume, condition, price, phone, name } = req.body;
        
        // Проверка на спам (honeypot)
        if (req.body.website) {
            return res.status(200).json({ success: true });
        }
        
        // Базовая валидация
        if (!phone || !price) {
            return res.status(400).json({ success: false, error: 'Необходимо указать телефон и данные для расчета' });
        }
        
        // Формирование сообщения для Telegram
        const telegramMessage = `
<b>Запрос расчета из калькулятора:</b>

<b>Тип авто:</b> ${carType}
<b>Год выпуска:</b> ${year}
<b>Объем двигателя:</b> ${volume}
<b>Состояние:</b> ${condition}
<b>Расчетная стоимость:</b> ${price}

<b>Контактные данные:</b>
<b>Телефон:</b> ${phone}
${name ? `<b>Имя:</b> ${name}` : ''}
        `;
        
        // Отправка в Telegram
        const result = await sendTelegramMessage(telegramMessage);
        
        if (result.success) {
            res.status(200).json({ success: true });
        } else {
            res.status(500).json({ success: false, error: 'Ошибка при отправке сообщения' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

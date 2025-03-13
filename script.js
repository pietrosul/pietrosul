// Configurare
const TELEGRAM_BOT_TOKEN = '7618241698:AAHHE3cd5y73fINIlzsMwTKak50BgB5VQc4'; // Înlocuiți cu token-ul botului dvs
const TELEGRAM_CHAT_ID = '7070473485';     // Înlocuiți cu chat ID-ul dvs
const WEBHOOK_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;

async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Eroare la preluarea IP-ului:', error);
        return null;
    }
}

async function sendToTelegram(ip) {
    const message = `🔔 Nou acces detectat!\nIP: ${ip}\nTimestamp: ${new Date().toLocaleString()}`;
    
    try {
        // Folosim un webhook pentru a evita CORS
        const img = new Image();
        img.src = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;
        return true;
    } catch (error) {
        console.error('Eroare la trimiterea către Telegram:', error);
        return false;
    }
}

async function init() {
    const statusElement = document.getElementById('status');
    
    const ip = await getIP();
    if (!ip) {
        statusElement.textContent = 'Eroare la preluarea IP-ului';
        return;
    }

    const sent = await sendToTelegram(ip);
    if (sent) {
        statusElement.textContent = 'IP detectat și trimis cu succes!';
    } else {
        statusElement.textContent = 'Eroare la trimiterea notificării';
    }
}

// Pornește procesul când pagina se încarcă
window.addEventListener('load', init); 
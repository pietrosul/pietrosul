// Configurare
const TELEGRAM_BOT_TOKEN = '7618241698:AAHHE3cd5y73fINIlzsMwTKak50BgB5VQc4'; // Înlocuiți cu token-ul botului dvs
const TELEGRAM_CHAT_ID = '7070473485';     // Înlocuiți cu chat ID-ul dvs

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
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            throw new Error('Eroare la trimiterea mesajului către Telegram');
        }

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
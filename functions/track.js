const fetch = require("node-fetch");

exports.handler = async function (event) {
    const params = new URLSearchParams(event.queryStringParameters);
    const trackingNumber = params.get("number");

    if (!trackingNumber) {
        return {
            statusCode: 400,
            headers: { 
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ error: "Takip numarası girilmedi!" })
        };
    }

    try {
        // 17Track'e gerçek bir tarayıcı gibi istekte bulun
        const response = await fetch(`https://www.17track.net/en/track?nums=${trackingNumber}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
            }
        });

        const text = await response.text();

        // 17Track HTML'ini analiz ederek kargo durumunu bul
        const match = text.match(/<span[^>]*class="state-text"[^>]*>([^<]+)<\/span>/);
        const status = match ? match[1].trim() : "Durum Bulunamadı";

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ status })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ error: "Kargo bilgisi alınamadı." })
        };
    }
};

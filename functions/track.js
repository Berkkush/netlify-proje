const fetch = require("node-fetch");

exports.handler = async function (event) {
    const params = new URLSearchParams(event.queryStringParameters);
    const trackingNumber = params.get("number");

    if (!trackingNumber) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Takip numarası girilmedi!" })
        };
    }

    try {
        // 17Track External Call API'sine istek gönder
        const response = await fetch(`https://www.17track.net/externalcall?nums=${trackingNumber}`);
        
        const htmlText = await response.text(); // Sayfanın HTML çıktısını al
        
        // 17Track verisini temizle ve HTML'den kargo durumunu çıkar
        const regex = /"latest_status":"(.*?)"/;
        const match = regex.exec(htmlText);

        if (match && match[1]) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    latest_status: match[1]
                })
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Takip numarası bulunamadı." })
            };
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Sunucu hatası, tekrar deneyin." })
        };
    }
};

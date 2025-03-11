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
        // 17Track’in external call sayfasını yükle
        const response = await fetch(`https://www.17track.net/en/track?nums=${trackingNumber}`);
        const text = await response.text();

        // 17Track HTML çıktısından kargo durumunu çek
        const match = text.match(/<span class="state-text">([^<]+)<\/span>/);
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

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
        const response = await fetch(`https://api.17track.net/track?number=${trackingNumber}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Kargo bilgisi alınamadı." })
        };
    }
};

const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");

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
        // Puppeteer ile headless browser başlat
        const browser = await chromium.puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath,
            headless: true
        });

        const page = await browser.newPage();
        
        // Netlify üzerindeki sayfayı aç ve takip numarasını input et
        await page.goto("https://harmonious-meerkat-6d4a74.netlify.app/");
        await page.type("#YQNum", trackingNumber);
        await page.click("input[value='TRACK']");

        // 17Track verilerinin yüklenmesini bekle
        await page.waitForSelector("#YQContainer", { timeout: 10000 });

        // Verileri çek
        const trackingData = await page.evaluate(() => {
            let result = [];
            let elements = document.querySelectorAll("#YQContainer .yq-activity-item");
            elements.forEach(el => {
                result.push(el.innerText.trim());
            });
            return result;
        });

        await browser.close();

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ status: trackingData.join("\n") })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ error: "Kargo bilgisi alınamadı.", details: error.message })
        };
    }
};

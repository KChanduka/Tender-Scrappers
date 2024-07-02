const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
// const reArrangeTheOldAndNewData = require("./util_functions");

puppeteer.use(pluginStealth());

const url = 'https://www.sorell.tas.gov.au/tenders/#accordion';

async function TAS_Sorell(){
    
    const browser = await puppeteer.launch({
        headless: false,
        // args: ["--no-sandbox"]

    });
try{    

    const page1 = await browser.newPage();
    await page1.setDefaultNavigationTimeout(2*60000); 


    await page1.goto(url);
    await page1.waitForSelector('#main > div.page-content.container > div > div');
    //taking a count of numnber of tenders and a array for scraped data
    let scrapedData = await page1.evaluate(()=>Array.from(document.querySelectorAll('.accordion-item'),(e)=>{
        let titleElement = document.querySelector('h2> a > span').innerText;
        if (titleElement) {
            // Adjust the regex to match the ID part correctly
            const match = titleElement.match(/\s*-\s*[^\s]*\s*-\s*/);
        
            if (match) {
                const [matchedText] = match;
                const index = titleElement.indexOf(matchedText);
        
                // Extract the part after the matched text (removing the ID part)
                titleElement = titleElement.substring(index + matchedText.length).trim();
            }
        } else {
            titleElement = '';
        }

        return {
            title: titleElement,
            agency: "",
            atmId: "",
            category: "not specified",
            location: ["TAS"],
            region: ["Sorell Council"],
            idNumber: "",
            publishedDate: "no date found",
            closingDate: "",
            description: "",
            link: "",
            updatedDateTime: ""
        };
        
    }))
        
        //adding remainng data for each element inside scrapedData
       for(let i =0;i<scrapedData.length;i++ ){ 
            //await page1.click(`.accordion-item:nth-child(${i+1}) > h2> a`);
            await page1.evaluate(()=>document.querySelector())
            }
            console.log(scrapedData);
            await browser.close();
            
}catch(error){
        console.log(error);
        await browser.close();
    }

}

TAS_Sorell();
module.exports = TAS_Sorell;
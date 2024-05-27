const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
// const reArrangeTheOldAndNewData = require("./util_functions");

puppeteer.use(pluginStealth());

const url = 'https://www.randwick.nsw.gov.au/about-us/business/tenders-and-quotations';

async function QLD_Brisbane(){
    
    const browser = await puppeteer.launch({
        headless: false,
        // args: ["--no-sandbox"]

    });
try{    

    const page1 = await browser.newPage();
    await page1.setDefaultNavigationTimeout(2*60000); 


    await page1.goto(url);
    await page1.waitForSelector('#main > article > a');
    await page1.click('#current_tenders_27836 > button'); 
        //extracting idNumbers
        let idNUmbers = await page1.evaluate(()=>Array.from(document.querySelectorAll('#current_tenders_27836 > div > p > strong:nth-child(1)'),(e)=>{
        let contents = e.innerHTML.split('<br>');
        return contents[0];
        }));
            //remove labels from the idNumbers eg=> RFT Number:
            idNUmbers = idNUmbers.map((elm)=>{
                let elements = elm.split(':');
                return elements[elements.length -1];
            })
            //removing gibberish infront of the idNumbers
            idNUmbers = idNUmbers.map((elm)=>{
                let elements = elm.split(';');
                return elements[elements.length -1];
            })



        //array for scraped data
        let scrapedData = [];


        //only pushing the current tenders inside the scrped data array from dataItems
       for(let i =0;i<idNUmbers.length;i++ ){ //last 3 components are not current tenders
                
                console.log(idNUmbers[i]);
                // reArrangeTheOldAndNewData(scrapedData, "qld-bbn-");
                
            }
            console.log(scrapedData);
            await browser.close();
            
}catch(error){
        console.log(error);
        await browser.close();
    }

}

QLD_Brisbane();

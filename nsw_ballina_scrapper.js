const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(pluginStealth());

async function Ballina(){
    const browser  = await puppeteer.launch({headless:false});
    try{
        const page1 = await browser.newPage();
        await page1.goto("https://ballina.etenderbox.com.au/ListCurrentTenders.aspx");
        await page1.waitForSelector('body');

        //array for scraped data
        let scrapedData = [];

        //finding the number of tenders needed to scrape
            const tempItems = await page1.evaluate(()=>Array.from(document.querySelectorAll('#ctl00_cphMain_rprTenders_pgvTenders > tbody:nth-child(1) > .data-grid-row')));
            var count = 10;
            await page1.click(`#ctl00_cphMain_rprTenders_pgvTenders > tbody:nth-child(1) > .data-grid-row:nth-child(${count})`);
            await page1.waitForTimeout(3000);


            //extracting title
                try{
                    await page1.evaluate()

                }catch(error){
                    console.log('extracting title ',error)
                }

            //extracting agency 
                

            //extracting atmId

            //extracting category

            //extracting location

            //extracting region

            //extracting idNumber

            //extracting publishedDate

            //extracting closingDate

            //extracting description

            //extracting link
                try{
                    const link = await page1.url();
                }catch(error){
                    console.log("extracting link", error);
                }


            //updated Date Time
                let updatedDateTime = "no date found";
                try{
                        //updatedDateTime formattter
                        function formatDate(inputDate) {
                            const dateObj = new Date(inputDate);
                            
                            // Create a new Intl.DateTimeFormat instance for the desired format
                            const formatter = new Intl.DateTimeFormat('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            });
                            
                            return formatter.format(dateObj);
                            }

                    updatedDateTime = new Date().toLocaleDateString();
                    updatedDateTime = formatDate(updatedDateTime);

                }catch(error){
                    console.log('updatedDateTime',error);
                }


            await page1.goBack();
            await page1.waitForTimeout(3000);
            // for(const item of tempItems){
            //     await page1.click(`#ctl00_cphMain_rprTenders_pgvTenders > tbody:nth-child(1) > tr:nth-child(${count})`);
            //     await page1.waitForTimeout(1000);



            //     await page1.goBack();
            //     await page1.waitForTimeout(1000);
            //     count++
            // }
            // tempItems.forEach(element => {
                

            // });


        browser.close();

    }
    catch(error){
        console.log(error);
        browser.close();
    }

}

Ballina();
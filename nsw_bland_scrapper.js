const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(pluginStealth());

async function NSW_Bland(){
    const browser = await puppeteer.launch({
        headless:true,
        args: ["--no-sandbox"]
    });
try {
        const page1 = await browser.newPage();
        await page1.goto('https://www.blandshire.nsw.gov.au/Your-Council/Tenders-and-EOIs');
        await page1.waitForSelector('#main-content');
    
        //checking how many links are there to be scraped
            const linkArr = await page1.evaluate(()=>Array.from(document.querySelectorAll('div.list-item-container'),(e)=>e.querySelector('article:nth-child(1) > a:nth-child(1)').href));
            console.log(linkArr)
        //creating an array to hold the tender data
            let tenderData = [];

        //looping inside each link to scrape data
        for (let i = 0; i <linkArr.length-1; i++) {
            const elm = linkArr[i];
            const page2 = await browser.newPage();
            await page2.goto(elm);
            
            await page2.waitForSelector('body');
            // const element = await page2.$('.dhtmlwindow[style*="display: none"]')   
            //extracting data

                //title
                let title = '';
                title =  await page2.evaluate(()=>{
                        let titleELement = document.querySelector('.oc-page-title');
                        titleELement = titleELement? titleELement.innerText : "";
                        return titleELement;
                    })   

                //agency ""
                    let agency = "";

                //atmID ""
                    let atmId = "";

                        atmId = await page2.evaluate(()=>{
                            let atmIdELement = document.querySelector('.content-details-list > li:nth-child(1) > span:nth-child(2)');
                                atmIdELement = atmIdELement? atmIdELement.innerText : "";
                            return atmIdELement;
                        })

                //category 
                    let category = "not specified";

                //location
                    let location = ["NSW"];

                        // const tempLocations = await page2.evaluate(()=>{
                        //     let locationElement = document.querySelector('#mstrlayoutcontainerPopUp tbody tr:nth-child(6) div:nth-child(3) .opportunityPreviewContent ');

                        //     if(locationElement){

                        //         locationElement = locationElement.innerHTML.split("<br>");
                        //     }
                        //     return locationElement
                        // });
                        // location = location.concat(tempLocations);

                //region

                    const region = ["Bland Shire Council"];


                //idNumber

                    let idNumber = "";
                        idNumber = await page2.evaluate(()=>{
                            let idNumberELement = document.querySelector('.content-details-list > li:nth-child(1) > span:nth-child(2)');
                            idNumberELement? idNumberELement = idNumberELement.innerText : idNumberELement='';
                            return idNumberELement;
                        })

                        //format date function
                        function formatCustomDate(inputDate) {

                            if(inputDate == "no date found"){
                                return inputDate;
                            }else{
                                const dateObj = new Date(inputDate);
                        
                                // Get the day, month, and year
                                const day = dateObj.getDate().toString().padStart(2, '0');
                                const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);
                                const year = dateObj.getFullYear();
                            
                                // Combine the formatted parts
                                const formattedDate = `${day} ${month} ${year}`;
                            
                                return formattedDate;
                            }
                        }

                        //date verifier
                        function isDateValid(dateString) {
                            const date = new Date(dateString);
                            return !isNaN(date) && dateString.trim() !== '';
                            }
                        

                //publishedDate
                    let publishedDate = "no date found";   

                //closingDate
                    let closingDate = "no date found";
                        closingDate = await page2.evaluate(()=>{
                            let closingDateElement  = document.querySelector('.applications-closing');
                            closingDateElement? closingDateElement = closingDateElement.innerText : closingDateElement = "not specified";
                            return closingDateElement;
                        })
                        //formatting the date
                        closingDate = formatCustomDate(closingDate);

                        //varifiying the  date is a valid date
                        if (isDateValid(closingDate)) {
                            closingDate;
                            } else {
                            closingDate = "no date found";
                            }

                //description
                    let description ='';
                        description = await page2.evaluate(()=>{
                            let descriptionElement = document.querySelector('.content-details-list > li:nth-child(3) > span:nth-child(2)');
                            descriptionElement? descriptionElement = descriptionElement.innerText.replace(/\n+/g," ") : descriptionElement='';
                            return descriptionElement;
                        });


                //link
                    const link = await page2.url();

                //updateDateTime
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


                    

                //pushing the scraped data
                tenderData.push({
                    title,
                    agency,
                    atmId,
                    category,
                    location,
                    region,
                    idNumber,
                    publishedDate,
                    closingDate,
                    description,
                    link,
                    updatedDateTime,
                });
                               
            await page2.close();
            console.log("scraped links: ", i);
            i++;
        }
        console.log(tenderData)

    await browser.close()
} catch (error) {
    await browser.close();
    console.log(error);
    
}
    
} 

NSW_Bland();
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(pluginStealth());

async function NSW_Warren(){
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"]

    });
try{    
    const page1 = await browser.newPage();

    await page1.goto('https://www.vendorpanel.com.au/PublicTenders.aspx?profileGroupId=6004');

        //extracting tender links 
        const links = await page1.evaluate(()=>Array.from(document.querySelectorAll('#tList > tbody:nth-child(1) > tr > td:nth-child(2) > div:nth-child(2) > a:nth-child(2)'),(e)=>{
            const link = e.href;
            return link;
        }))

       console.log("total links : ",links.length); 

        //array for scraped data
        let scrapedData = [];


        //extracting date from each tender link
        let i = 1;
       for(const elm of links ){

            const page2 = await browser.newPage();
            await page2.goto(elm);
            
            await page2.waitForSelector('body');
            // const element = await page2.$('.dhtmlwindow[style*="display: none"]');




            //pressing the preview button
            //waiting for the popup
            await Promise.all([
                page2.click('#tenderInfotbl > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > a:nth-child(1)'),
                page2.waitForSelector('#mstrlayoutcontainerPopUp')
            ])


            //extracting data

                //title
                let title = '';

                title =  await page2.evaluate(()=>{
                        let titleELement = document.querySelector('#mstrlayoutcontainerPopUp tbody .OpportunityPreviewNameRowTenderPublic td');

                        if(titleELement){

                            titleELement = titleELement.innerText;

                            //removing the idNUmber
                            const match = titleELement.match(/^[A-Za-z]+\d+\/\d+\s+-\s+/);
        
                            if (match) {
                            const [matchedText] = match;
                            const index = titleELement.indexOf(matchedText);
                        
                            // Extract the first part (before the numbers) and the second part (after the numbers)
                            const firstPart = titleELement.substring(0, index).trim();
                            const secondPart = titleELement.substring(index + matchedText.length).trim();
                            
                            titleELement = secondPart;
                            
                            }

                        }else{
                            titleELement ='';
                        }
                        
                        return titleELement;
                    })

                    //if there is Buyer's Reference in the site. the code inside if will be executed.Else
                    const isBuyersReference = await page2.evaluate(()=>document.querySelector('#mstrlayoutcontainerPopUp tbody tr:nth-child(4) .opportunityPreviewMinHeading').innerText);
                    let childValIncrease = 0; 
                    let childValDecrease =0;
                    if(isBuyersReference == "Buyers Reference #"){
                        //no chhange to childVal;
                    }else{
                        childValIncrease =1;
                        childValDecrease =-1;
                    }


                //agency ""
                    let agency = "";


                //atmID ""
                    let atmId = "";


                        atmId = await page2.evaluate((val)=>{
                            let atmIdELement = document.querySelector(`#mstrlayoutcontainerPopUp tbody tr:nth-child(${4+val}) .opportunityPreviewContent`);

                            atmIdELement? atmIdELement = atmIdELement.innerText : atmIdELement;

                            return atmIdELement;
                        },childValDecrease)


                    

                //category 
                    let category = "not specified";

                //location
                    let location = ["NSW"];

                        const tempLocations = await page2.evaluate((val)=>{
                            let locationElement = document.querySelector(`#mstrlayoutcontainerPopUp tbody tr:nth-child(${6+val}) div:nth-child(3) .opportunityPreviewContent `);

                            if(locationElement){

                                locationElement = locationElement.innerHTML.split("<br>");
                            }
                            return locationElement
                        },childValDecrease);
                        location = location.concat(tempLocations);

         

                    

                //region

                    const region = ["Warren Shire Council"];

                    // try{
                    //     const tempRegion = await page2.evaluate(()=>{
                    //         let regionELement = document.querySelector('#mstrlayoutcontainerPopUp tbody tr:nth-child(3) div:nth-child(2) .opportunityPreviewContent ul li');

                    //         if(regionELement){

                    //             regionELement = regionELement.innerHTML.split("<br>");
                    //         }else{
                    //             regionELement = 'not specified';
                    //         }
                    //         return regionELement
                    //     });
                    //     region = region.concat(tempRegion);

                    // }catch(error){
                    //     console.log('region extraction',error);

                    // }

                //idNumber

                    let idNumber = "";

                        idNumber = await page2.evaluate((val)=>{
                            let idNumberELement = document.querySelector(`#mstrlayoutcontainerPopUp tbody tr:nth-child(${4+val}) .opportunityPreviewContent`);

                            idNumberELement? idNumberELement = idNumberELement.innerText : idNumberELement=''

                            return idNumberELement;
                        },childValDecrease)





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
                            publishedDate = await page2.evaluate((val)=>{
                                let publishedDateElement  = document.querySelector(`#mstrlayoutcontainerPopUp tbody tr:nth-child(${5+val}) .opportunityPreviewInnerRow:nth-child(1) .opportunityPreviewContent`);
    
                                publishedDateElement? publishedDateElement = publishedDateElement.innerText : publishedDateElement = "no date found";
    
                                return publishedDateElement;
                            },childValDecrease)
                            // formatting the date
                            publishedDate = formatCustomDate(publishedDate);
    
                            if (isDateValid(publishedDate)) {
                               publishedDate;
                              } else {
                               publishedDate = "no date found";
                              }


                    

                //closingDate
                let closingDate = "no date found";

                            closingDate = await page2.evaluate((val)=>{
                                let closingDateElement  = document.querySelector(`#mstrlayoutcontainerPopUp tbody tr:nth-child(${5+val}) .opportunityPreviewInnerRow:nth-child(2) .opportunityPreviewContent`);
    
                                closingDateElement? closingDateElement = closingDateElement.innerText : closingDateElement = "no date found";
    
                                return closingDateElement;
                            },childValDecrease)
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
                        description = await page2.evaluate((val)=>{
                            let descriptionElement = document.querySelector(`#mstrlayoutcontainerPopUp tbody tr:nth-child(${7+val}) .opportunityPreviewContent`);

                            descriptionElement? descriptionElement = descriptionElement.innerText.replace(/\n+/g," ") : descriptionElement='';
                            return descriptionElement;
                        },childValDecrease)


                //link
                    const link = await page2.url();

                //updateDateTime
                    let updatedDateTime = "no date found";
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

   

                //pushing the scraped data
                scrapedData.push({
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
                
                //counter for scraped links logged to the console
                await page2.close();
                console.log("scraped links: ", i);
                i++;
                
            }
            
            console.log(scrapedData);
            await browser.close();
            
}catch(error){
        console.log(error);
        await browser.close();
    }

}

NSW_Warren();
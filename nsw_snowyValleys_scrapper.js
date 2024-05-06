const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(pluginStealth());

//login credentials
const {pwd,email }= require("./login.js"); 

async function NSW_SnowyValley(){
    const browser = await puppeteer.launch({
        headless:false,
        args: ["--no-sandbox"]
    })
    tenderData = [];
    try {
        const page1 = await browser.newPage();
    
        //goto the registration page
            await page1.goto('https://portal.tenderlink.com/snowyvalleys/login?ReturnUrl=%2Fsnowyvalleys%2F');
            await page1.waitForTimeout(2000);
            await page1.waitForSelector('#loginPasswordPane');
    
        //insert the credentials
            await page1.type('#Email',email.main1,{delay:130});
            await page1.type('#Password',pwd.tenderlink_pwd_nsw_1,{delay:150});
            
        //click the login button
            await page1.click('#btnLogin')
            await page1.waitForNavigation({waitUntil:'load'});
            await page1.waitForTimeout(2000);



            
        //click the "All current tenders" in the dashboard
            // await page1.click('#menuAllOpenTenders');
            await page1.click('#firefoxscrolllayer > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(1)');
            await page1.waitForTimeout(2000);
            await page1.waitForSelector('#divscrolling');




        //checking how many links are there to be scraped
        const linkArr = await page1.evaluate(()=>Array.from(document.querySelectorAll('#firefoxscrolllayer > div:nth-child(1) > .table > tbody > tr')));
        const numOfLinks = linkArr.length-1;

        //creating an array to hold scraped data
        // tenderData = [];

        //looping inside each link to scrape data
        for(let i = 0; i<numOfLinks ; i++){



                //title
                let titleElement = "";
                    titleElement = await page1.evaluate((i)=>{titleElement= document.querySelector(`#firefoxscrolllayer > div:nth-child(1)> .table > tbody:nth-child(1) > tr:nth-child(${2+i}) > td:nth-child(2)`);
                    titleElement = titleElement? titleElement.innerText : ""
                    return titleElement;},i);
                //agency
                //atmId
                let atmIdElement = "";
                atmIdElement = await page1.evaluate((i)=>{
                atmIdElement = document.querySelector(`#firefoxscrolllayer > div:nth-child(1)> .table > tbody:nth-child(1) > tr:nth-child(${2+i}) > td:nth-child(1)`);
                atmIdElement = atmIdElement? atmIdElement.innerText: "";
                    return atmIdElement;
                },i);

                //category
                //location
                //region
                //idNumber
                let  idNumberElement = "";
                idNumberElement = await page1.evaluate((i)=>{
                    idNumberElement = document.querySelector(`#firefoxscrolllayer > div:nth-child(1)> .table > tbody:nth-child(1) > tr:nth-child(${2+i}) > td:nth-child(1)`);
                    idNumberElement = idNumberElement? idNumberElement.innerText:"";
                    return idNumberElement;
                },i);


                //publishedDate
                //closingDate
                let closingDateElemnt = "no date found";
                closingDateElemnt = await page1.evaluate((i)=>{
                    closingDateElemnt = document.querySelector(`#firefoxscrolllayer > div:nth-child(1)> .table > tbody:nth-child(1) > tr:nth-child(${2+i}) > td:nth-child(5)`);
                    closingDateElemnt = closingDateElemnt? closingDateElemnt.innerText : "no date found";
                    return closingDateElemnt;
                },i);


                //description-extracted insid the next evaluate function
                //link-extracted out of this evaluate function
                //updatedDateTime -extracted out of this evaulate function

                tempObj =  {
                    title: titleElement,
                    agency: "",
                    atmId: atmIdElement,
                    category: "not specified",
                    location: ["NSW"],
                    region: ["Snowy Valley Council"],
                    idNumber: idNumberElement,
                    publishedDate: "no date found",
                    closingDate: closingDateElemnt,
                    description: "",
                    link: "",
                    updatedDateTime: ""
                };


            //format date function
                function formatCustomDate(inputDate) {
                    if (inputDate == "not specified") {
                        return inputDate;
                    } else {
                        // Split the input date string to separate date and time parts
                        const [datePart] = inputDate.split(' ');
                
                        // Extract day, month, and year from the date part
                        const [day, monthNum, year] = datePart.split('/').map(part => parseInt(part, 10));
                        
                        // Convert month number to short month name
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        const month = monthNames[monthNum - 1]; // months are zero-based in JavaScript Date objects
                        
                        // Combine the formatted parts
                        const formattedDate = `${day} ${month} ${year}`;
                
                        return formattedDate;
                    }
                }


            //fromatting closingDate
                tempObj.closingDate = formatCustomDate(tempObj.closingDate);
                
                await page1.waitForTimeout(2000);
            //extracting description
                //go inside the link-click on the tenderID
                    await page1.click(`.table > tbody:nth-child(1) > tr:nth-child(${2+i}) > td:nth-child(1) > a:nth-child(1)`);
                    // await page1.waitForNavigation({waitUntil:'networkidle2'});
                    await page1.waitForTimeout(2000);

                //extracting descrption
                let description = "";
try {
                     description = await page1.evaluate(()=>{
                        let descriptionElement = document.querySelector('.tendertabletext');
                        descriptionElement = descriptionElement? descriptionElement.innerText : "";
                        return descriptionElement.replace(/\n+/g," ");
                    });
} catch (error) {
    console.log("description",error);
    throw error;
}
                
                tempObj.description = description;

            //extracting link
                 tempObj.link = await page1.url();

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
                tempObj.updatedDateTime = formatDate(updatedDateTime);

            
            //pushing tempObj into tenderData array
                tenderData.push(tempObj);
        //goback to the all tender page
        await page1.goBack();
        console.log(i);
        }//loop end
            
        await page1.waitForTimeout(3000);
        await browser.close()
        console.log(tenderData);
    } catch (error) {
        console.log(tenderData);
        console.log(error);
        await browser.close();
        
    }

}

NSW_SnowyValley(); 


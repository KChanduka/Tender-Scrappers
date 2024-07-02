const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const {pwd,email, apiKey} = require("./login.js");
const { executablePath } = require('puppeteer'); 
const Captcha = require("@2captcha/captcha-solver")
const solver = new Captcha.Solver(apiKey);
// const reArrangeTheOldAndNewData = require("./util_functions"); 

const pathToExtension = require('path').join(__dirname, '2captcha-solver');
puppeteer.use(pluginStealth());

async function WA_SouthPerth(){
    const browser = await puppeteer.launch({
        headless:false,
        args: ["--no-sandbox",    
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,],
        executablePath: executablePath()
    })
    scrapedData = [];
    try {
        const page1 = await browser.newPage();
        await page1.setDefaultNavigationTimeout(0); 
        const url ='https://portal.tenderlink.com/southperth/login?ReturnUrl=%2Fsouthperth%2F';
        //goto the registration page
            await page1.goto(url);
            await page1.waitForSelector('#loginPasswordPane');
            await page1.waitForTimeout(3000);
    
//if there is an captcha solve it
try{
    const sitekey = await page1.evaluate(()=>{
        const captchaElemnt = document.querySelector('#btnLogin[class="g-recaptcha btn btn-default button"]');
        if(captchaElemnt){
            return captchaElemnt.getAttribute('data-sitekey')
        }
    });
    if(sitekey != null){
        console.log('solving captcha.....');
        console.log('siteKey :',sitekey);
        console.log('waiting for token...')
        let captchaData;
        let captchaId;
        await solver.recaptcha({
            pageurl: url,
            googlekey: sitekey,
            sitekey:sitekey
        })
        .then((res) => {
            console.log('token received');
            captchaData = res.data;
            captchaId = res.id;
        })
        .catch((err) => {
            console.log(err);
        })
        
        
        const captchaInjection =await page1.evaluate((captchaData)=>{
            const textAreaElement = document.getElementById('g-recaptcha-response')
            if(textAreaElement !=null){
                textAreaElement.innerHTML = captchaData;
                return true;
            }else{
                return false;
            }
        },captchaData);
        
        if(captchaInjection){
            console.log('token injection success');
                    //insert the credentials
                    await page1.type('#Email',email.main1,{delay:130});
                    await page1.type('#Password',pwd.tenderlink_pwd_1,{delay:150});  
                        const reuslt = await page1.evaluate((captchaData)=>{
                            if(typeof onSubmit === 'function'){
                                onSubmit(captchaData);
                                return 'callback execution success';
                            }else{
                                return 'callback execution failed';
                            }
                        },captchaData);
                        console.log(reuslt);
                        await page1.waitForTimeout(3000);
            // await page1.click('div[class ="captcha-solver captcha-solver_inner"]');
        }else{
            console.log("couldn't findd 'g-recaptcha-response' ")
        }
    }else{    
        //if there is no captcha to solve:
        //write email and password
        await page1.type('#Email',email.main1,{delay:130});
        await page1.type('#Password',pwd.tenderlink_pwd_1,{delay:150});               
        //click the login button
        await page1.click('#btnLogin')
        await page1.waitForTimeout(3000);
    }
    
}catch(error){
    console.log(error);
}

            
        //click the "All current tenders" in the dashboard
            // await page1.click('#menuAllOpenTenders');
            await page1.waitForNavigation({waitUntil:'load'});
            await page1.waitForTimeout(3000);
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
                    location: ["WA"],
                    region: ["City of South Perth"],
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
                    await page1.waitForSelector('#backbutton');
                    
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
                scrapedData.push(tempObj);
        //goback to the all tender page
        await page1.goBack();
        }//loop end
            // reArrangeTheOldAndNewData(scrapedData, "wa-pth-");
        await browser.close()
        console.log(scrapedData);
    } catch (error) {
        console.log(error);
        await browser.close();
        
    }

}

WA_SouthPerth(); 
module.exports = WA_SouthPerth;

// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = 'Dispatch-Order-464521.pdf';
// var url = 'all/2 UNITS FOR MONTWAY.pdf';
// var url = 'HONDA ODESSY (FL-ID).pdf';
// var url = "TransportOrder_6396607 (1).pdf";

var dispatchData = {};
  var pickupDetails = {};
  var deliveryDetails = {};
  var paymentDetails = {};
  var billingDetails = {};
  let condition;



// The workerSrc property shall be specified.
PDFJS.workerSrc = 'pdf.worker.js';

PDFJS.getDocument(url).then(function (pdf) {
    var pdfDocument = pdf;
    var pagesPromises = [];

    for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
        // Required to prevent that i is always the total of pages
        (function (pageNumber) {
            pagesPromises.push(getPageText(pageNumber, pdfDocument));
        })(i + 1);
    }

    Promise.all(pagesPromises).then(function (pagesText) {
    		// Remove loading
        $("#loading-info").remove();
        
        // Render text
        for(var i = 0;i < pagesText.length;i++){
        	$("#pdf-text").append("<div><h3>Page "+ (i + 1) +"</h3><p>"+pagesText[i]+"</p><br></div>")
        }
        // scrapeDataMontwayAutoTransport(pagesText[0]);
    });

}, function (reason) {
    // PDF loading error
    console.error(reason);
});


/**
 * Retrieves the text of a specif page within a PDF Document obtained through pdf.js 
 * 
 * @param {Integer} pageNum Specifies the number of the page 
 * @param {PDFDocument} PDFDocumentInstance The PDF document obtained 
 **/
function getPageText(pageNum, PDFDocumentInstance) {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise(function (resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
            // The main trick to obtain the text of the PDF page, use the getTextContent method
            pdfPage.getTextContent().then(function (textContent) {
                console.log(pageNum);
                
                if(pageNum === 1){    
                    let arr = trimArray(textContent.items);           
                    makeArrayFieldsForMontway(arr);
                }
                var textItems = textContent.items;
                var finalString = "";

                // Concatenate the string of the item to the final string
                for (var i = 0; i < textItems.length; i++) {
                    var item = textItems[i];

                    finalString += item.str + " ";
                }

                // Solve promise with the text retrieven from the page
                resolve(finalString);
            });
        });
    });
}


function scrapeDataMontwayAutoTransport(pageText){
        // Delivery Details
        // {
        //     let addressLine1 = /(.*Street :\s+)(.*)(\s+City, State :.*)/;
        //     let cityStateRe = /(.*City, State :\s+)(.*)(\s+Zip Code :.*)/;
        //     let cityState = pageText.replace(cityStateRe, "$2");
        //     let cityStateArray = cityState.split(',');
        //     let nameRe = /(.*Name :\s+)(.*)(\s+Street :.*)/;
        //     let nameContact = pageText.replace(nameRe, "$2");
        //     let nameContactArray = nameContact.split('/');
        //     let postalCode = /(.*Zip Code :\s+)(.*)(\s+Country :.*)/;
        //     let phoneNumber = /(.*Phone :\s+)(.*)(\s+Dispatch Instructions.*)/;        
    
        //     deliveryDetails.addressLine1 = pageText.replace(addressLine1, "$2");
        //     deliveryDetails.contactName = nameContactArray[0];
        //     deliveryDetails.customerName = nameContactArray[1];
        //     deliveryDetails.city = cityStateArray[0];
        //     deliveryDetails.state = cityStateArray[1];
        //     deliveryDetails.postalCode = pageText.replace(postalCode, "$2");        
        //     deliveryDetails.phoneNumber = pageText.replace(phoneNumber, "$2");
        //     //Remove the added field from the string
        //     pageText = pageText.replace('Street :  '+deliveryDetails.addressLine1, '');
        //     pageText = pageText.replace('City, State :  '+cityState, '');
        //     pageText = pageText.replace('Name :  '+nameContact, '');
        //     pageText = pageText.replace('Zip Code :  '+deliveryDetails.postalCode, '');
        //     pageText = pageText.replace('Phone :  '+deliveryDetails.phoneNumber, '');
        //     alert("Delivery Details are "+JSON.stringify(deliveryDetails));
        //     console.log("Delivery Details are "+JSON.stringify(deliveryDetails));
        // }
    // Pickup Details
    // {
    //     let addressLine1 = /(.*Street :\s+)(.*)(\s+City, State :.*)/;
    //     let cityStateRe = /(.*City, State :\s+)(.*)(\s+Zip Code :.*)/;
    //     let cityState = pageText.replace(cityStateRe, "$2");
    //     let cityStateArray = cityState.split(',');
    //     let nameRe = /(.*Name :\s+)(.*)(\s+Street :.*)/;
    //     let nameContact = pageText.replace(nameRe, "$2");
    //     let nameContactArray = nameContact.split('/');
    //     let postalCode = /(.*Zip Code :\s+)(.*)(\s+Country :.*)/;
    //     let phoneNumber = /(.*Phone :\s+)(.*)(\s+Dispatch Instructions.*)/;        

    //     pickupDetails.addressLine1 = pageText.replace(addressLine1, "$2");
    //     pickupDetails.contactName = nameContactArray[0];
    //     pickupDetails.customerName = nameContactArray[1];
    //     pickupDetails.city = cityStateArray[0];
    //     pickupDetails.state = cityStateArray[1];
    //     pickupDetails.postalCode = pageText.replace(postalCode, "$2");        
    //     pickupDetails.phoneNumber = pageText.replace(phoneNumber, "$2");
    //     //Remove the added field from the string
    //     pageText = pageText.replace('Street :  '+pickupDetails.addressLine1, '');
    //     pageText = pageText.replace('City, State :  '+cityState, '');
    //     pageText = pageText.replace('Name :  '+nameContact, '');
    //     pageText = pageText.replace('Zip Code :  '+pickupDetails.postalCode, '');
    //     pageText = pageText.replace('Phone :  '+pickupDetails.phoneNumber, '');

    //     alert(JSON.stringify(pickupDetails));
    // }

}

  var vehicles = [];
  var orderInformationInstructionArray = [];
  var pickupDetailsArray = [];
  var deliveryDetailsArray = [];
  var paymentDetailsArray = [];
  var billingDetailsArray = [];
  var dispatchInstructions = [];

function makeArrayFieldsForMontway(pageArray){
    //Order information instructions
{   let start = pageArray.indexOf("order information");
    let end = pageArray.indexOf("pickup from");
    orderInformationInstructionArray = pageArray.splice(start, end-start);
}
    //pickup
{   let start = pageArray.indexOf("pickup from");
    let end = pageArray.indexOf("deliver to");
    pickupDetailsArray = pageArray.splice(start, end-start);
}
    //Delivery
{   let start = pageArray.indexOf("deliver to");
    let end = pageArray.indexOf("dispatch instructions");
    deliveryDetailsArray = pageArray.splice(start, end-start);
}
    //paymentDetails
{   let start = pageArray.indexOf("first avail. date");
    let end = pageArray.indexOf("ship via") +2;
    paymentDetailsArray = pageArray.splice(start, end-start);
}

    //dispatch instructions
{   let start = pageArray.indexOf("dispatch instructions");
    let end = pageArray.indexOf("vehicle information");
    dispatchInstructions = pageArray.splice(start, end-start);
}

    //vehicle information
{   let start = pageArray.indexOf("vehicle information");
    let end = pageArray.indexOf("vehicle information");
    vehicles = pageArray.splice(start, pageArray.length);
}

    console.log(orderInformationInstructionArray);
    console.log(pickupDetailsArray);
    console.log(deliveryDetailsArray);
    console.log(dispatchInstructions);
    console.log(paymentDetailsArray);
    console.log(vehicles);
    console.log(pageArray);
}


function trimArray(pageArray){
    const temp = pageArray.map(function(d) { 
        return d.str.toLowerCase().replace(":", "").trim();        
      });
      return temp.filter(Boolean);
}
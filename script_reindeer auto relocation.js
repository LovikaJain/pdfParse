    // If absolute URL from the remote server is provided, configure the CORS
// header on that server.
 var url = 'JEEP GRAND CHEROKEE (VA-WA).pdf';

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

  var vehicles = [];
  var orderInformationInstructionArray = [];
  var pickupDetailsArray = [];
  var deliveryDetailsArray = [];
  var paymentDetailsArray = [];
  var billingDetailsArray = [];
  var dispatchInstructions = [];
  var invoiceDetailArray = [];
  var vehicleDetailArray = [];
function makeArrayFieldsForMontway(pageArray){
    // pickup Details
    {
        let start = pageArray.indexOf("rate");
        let end = pageArray.indexOf("carrier");
        paymentDetailsArray = pageArray.splice(start, end-start);
    }
    {
        let start = pageArray.indexOf("address");
        let end = pageArray.indexOf("within daylight hours");
        pickupDetails = pageArray.splice(start, end-start);
    }
    {
        let start = pageArray.indexOf("vehicle informa");
        let end = pageArray.indexOf("special vehicle instructions");
        vehicleDetailArray = pageArray.splice(start, end-start);
    }
    {
        let start = pageArray.indexOf("contact information");
        let end = pageArray.indexOf("p") +2;
        orderInformationInstructionArray = pageArray.splice(start, end-start);
    }

console.log(paymentDetailsArray);
console.log(pickupDetails);
console.log(vehicleDetailArray);
console.log(orderInformationInstructionArray);
}



function trimArray(pageArray){
    const temp = pageArray.map(function(d) { 
        return d.str.toLowerCase().replace(":", "").trim();        
      });
      return temp.filter(Boolean);
}
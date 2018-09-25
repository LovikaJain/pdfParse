    // If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var IMPORT_URL = "http://dev-api.dieseldispatch.com/api/plugin/imports";
var DASHBOARD_URL = "http://dev-crm.dieseldispatch.com/#/order/";
var LOCAL_URL = "http://127.0.0.1:8080/#/newDispatch/"

 var url = 'caddilac ats (tecch transport).pdf';

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
                let arr = trimArray(textContent.items);           
                console.log(arr);
                if((arr.indexOf('should the vehicle be driven other than unload or loading, auto and boat relocation will') > -1) || arr.indexOf('auto and boat relocation services') > -1) {
                    makeArrayFieldsForautoAndBoat(pageNum,arr);
                }
    
                if(pageNum === 1){  
                    if((arr.indexOf('www.1dispatch.com') > -1)){
                        makeArrayFieldsFor1Dispatch(arr);
                    }
                    // else if((arr.indexOf('should the vehicle be driven other than unload or loading, auto and boat relocation will') > -1) || arr.indexOf('auto and boat relocation services') > -1) {
                    //     makeArrayFieldsForautoAndBoat(arr);
                    // } 
                    else if((arr.indexOf('reindeer auto r') > -1)){
                        makeArrayFieldsForreindeerautorelocation(arr);
                    }
                    else if((arr.indexOf('united road nsc - business') > -1)){
                        makeArrayFieldsForunitedroad(arr);
                    }
                    
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
  function makeArrayFieldsFor1Dispatch(pageArray){
    // pickup Details
    {
        let start = pageArray.indexOf("carrier information");
        let end = pageArray.indexOf("payment terms quickpay");
        vehicleDetailArray = pageArray.splice(start,end-start);
    }
    {
        let start = pageArray.indexOf("payment terms quickpay");
        let end = pageArray.indexOf("pre-dispatch notes to carrier");
        invoiceDetailArray = pageArray.splice(start,end-start);
    }
    {
        let start = pageArray.indexOf("pick-up");
        let end = pageArray.indexOf("drop-off");
        pickupDetailsArray = pageArray.splice(start, end-start);
    }
    {
        let start = pageArray.indexOf("drop-off");
        let end = pageArray.indexOf("vin(s)");
        deliveryDetailsArray = pageArray.splice(start,end-start);
    }
    {
        let start = pageArray.indexOf("vin(s)");
        let end = pageArray.indexOf("shipper requirements");
        orderInformationInstructionArray = pageArray.splice(start,end-start);
    }
    console.log(pickupDetailsArray);
    console.log(deliveryDetailsArray);
    console.log(orderInformationInstructionArray);
    console.log(invoiceDetailArray);
    console.log(vehicleDetailArray);

  }
  function makeArrayFieldsForreindeerautorelocation(pageArray){
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
  function makeArrayFieldsForautoAndBoat(pagenum,pageArray){
    // payment details 
    if(pagenum === 1){
        {
            let start = pageArray.indexOf("total price");
            let end = pageArray.indexOf("order current status");
            paymentDetailsArray = pageArray.splice(start, end-start);
            makeJsonForPaymentsautoAndBoat(paymentDetailsArray);
        }
        {
            let start = pageArray.indexOf("dates");
            let end = pageArray.indexOf("pick up information");
            orderInformationInstructionArray = pageArray.splice(start, end-start);
            // makeJsonForPickupDeliveryDateautoAndBoat(orderInformationInstructionArray,pickupDetails,'pickupDetails');
        }
        // pickup Details    
        {
            let start = pageArray.indexOf("pick up information");
            let end = pageArray.indexOf("delivery information");
            pickupDetailsArray = pageArray.splice(start, end-start);
            makeJsonForPickupDeliveryautoAndBoat(pickupDetailsArray,pickupDetails,'pickupDetails')
        }
        //Delivery Details
        {
            let start = pageArray.indexOf("delivery information");
            let end = pageArray.indexOf("special instructions");
            deliveryDetailsArray = pageArray.splice(start,end-start);
            makeJsonForPickupDeliveryautoAndBoat(deliveryDetailsArray,deliveryDetails,'deliveryDetails')
        }
    }
    else if(pagenum === 2){
        // Vehicle details
        {
            let start = pageArray.indexOf("make");
            let end = pageArray.indexOf("broker information");
            vehicleDetailArray = pageArray.splice(start, end-start);
            makeJsonForVehicleautoAndBoat(vehicleDetailArray);
        }        
    }
    
console.log(paymentDetailsArray);
console.log(orderInformationInstructionArray);
console.log(pickupDetailsArray);
console.log(deliveryDetailsArray);
console.log(vehicleDetailArray);
}

function makeArrayFieldsForunitedroad(pageArray){

    // pickup Details
    {
        let start = pageArray.indexOf("origin");
        let end = pageArray.indexOf("earliest pu");
        pickupDetailsArray = pageArray.splice(start, end-start);
        makeJsonForPickupUnitedRoad(pickupDetailsArray,pickupDetails,'pickupDetails');
    }
    // delivery Details
    {
        let start = pageArray.indexOf("earliest pu");
        let end = pageArray.indexOf("special instructions");
        deliveryDetailsArray = pageArray.splice(start, end-start);
        makeJsonForDeliveryUnitedRoad(deliveryDetailsArray,deliveryDetails,'deliveryDetails');
    }
    //Vehicle Details
    {
        let start = pageArray.indexOf("unit");
        let end = pageArray.indexOf("keys");
        vehicleDetailArray = pageArray.splice(start, end-start);
        makeJsonForVehicleUnitedRoad(vehicleDetailArray);
    }

console.log(pickupDetailsArray);
console.log(deliveryDetailsArray);
console.log(vehicleDetailArray);
}



function trimArray(pageArray){
    const temp = pageArray.map(function(d) { 
        return d.str.toLowerCase().replace(":", "").trim();        
      });
      return temp.filter(Boolean);
}

function makeJsonForPickupUnitedRoad(arr,object,objectName){
    object.contactNumber = arr[4];
    let address = arr[5] + arr[6];
    object.addressLine1 = address;
    let city = arr[7];
    if (city.indexOf(',') > -1)  { city = city.split(',') }
    object.city = city[0];
    let state = city[1];
    if(state.indexOf(' ') > -1){ state = state.split(' ') }
    object.state = state[1];
    object.postalCode = state[2];
    dispatchData[objectName] = object;
    console.log(dispatchData);
}

 function makeJsonForDeliveryUnitedRoad(arr,object,objectName){
    object.contactName = arr[2];
    object.contactNumber = arr[3];
    let address = arr[4] + ' ' + arr[5];
    object.addressLine1 = address;
    let city = arr[7];
    if(city.indexOf(',') > -1) { city =city.split(',') }
    object.city = city[0];
    let state = city[1];
    if(state.indexOf(' ') > -1) { state = state.split(' ') }
    object.state = state[1];
    object.postalCode = state[2];
    dispatchData[objectName] = object;
    console.log(dispatchData);
 }

 function makeJsonForVehicleUnitedRoad(arr){
    let vehicles = [];
    let details = [];
    details = arr[5];
   if(details.indexOf('.') > -1) { details = details.split('.') } 
   let vehicledetails = details[1];
    if(vehicledetails.indexOf(' ') > -1) { vehicledetails = vehicledetails.split(' ') }
    vehicles.year = vehicledetails[1];
    vehicles.make = vehicledetails[2];
    vehicles.vin = arr[6]
    dispatchData.vehicles = vehicles;
 }


function makeJsonForPaymentsautoAndBoat(arr){
    let totalAmount = arr.slice(1,3);
    dispatchData.totalAmount = totalAmount[0];
    console.log(dispatchData);
}
function makeJsonForPickupDeliveryautoAndBoat(arr,object,objectName){
    if(arr.indexOf("address") > -1){
        object.addressLine1 = arr[arr.indexOf("address")+2];
    }
    else {
        object.addressLine1 = arr[arr.indexOf("address 1") +1] ;
    }
    if(arr.indexOf("person") > -1){
        object.ContactName = arr[arr.indexOf("person") +1];
        object.phoneNumber = arr[arr.indexOf("phone") +1];
    }
    else{
        object.ContactName = arr[arr.indexOf("contact person") +1];
        object.phoneNumber = arr[arr.indexOf("contact phone") +1]
    }
object.city = arr[arr.indexOf("city")+1] ;
object.state = arr[arr.indexOf("state")+1] ;
object.postalCode = arr[arr.indexOf("zip") +1] ;
dispatchData[objectName] = object;
console.log(dispatchData);
}

function makeJsonForVehicleautoAndBoat(array){
    var vehicles = [];
    let operational;
    vehicles.make = array[array.indexOf("make") +1];
    vehicles.model = array[array.indexOf("model") +1];
    vehicles.year = array[array.indexOf("year") +1];
    operational = array[array.indexOf("operational")+1];
    if(operational === 'yes'){
        vehicles.isOperable = true;
    }
    else {  
        vehicles.isOperable = false;
    }
    dispatchData.vehicles = vehicles;
}

function newDispatchRequest(request) {
    
    //Uncomment below code to push the data to server. 
        $.ajax({
          url: IMPORT_URL,
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(request),
          success: function(data, textStatus, jqXHR) {
            var editUrl = DASHBOARD_URL + data.data.uniqueId ;
            // window.open(data.edit_url, "_blank");
            window.open(editUrl, "_blank");
          },
          error: function(err, textStatus, errorThrown) {
            alert(err.responseJSON.message);
            console.log(textStatus);
          }
        });
      }
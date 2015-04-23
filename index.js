var PriceFinder = require("./lib/price-finder");
 
var priceFinder = new PriceFinder();
 
// Rayman Legends sur PS3  (from Priceminister)
var uri = "http://www.priceminister.com/mfp/2003443/rayman-legends-jeu-video#pid=206756671";
priceFinder.findItemPrice(uri, function(err, price) {
    console.log(price); // should log something like 17.5
});
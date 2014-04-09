var wishlist = require('../src/script.js');
var options = {
    id:'QN69ONAX1SGR'
}

wishlist.getWishlist(options, function(items){
    console.log(items);
});




/* Author: YOUR NAME HERE
*/

var http = require('http');
var cheerio = require('cheerio');

var ripThroughResults = function(fullResponse){
    var $ = cheerio.load(fullResponse);
    var items = $('.g-items-section div[id^="item_"]');
    var wishlistItems = [];

    console.log('length: ' + items.length);

    for(var i = 0; i <= items.length; i++){
        var item = items[i];
        var name = $(item).find('a[id^="itemName_"]').html();
        var link = $(item).find('a[id^="itemName_"]').attr('href');
        if(name && link){
            var wishlistItem = {
                name: name,
                link: link
            };
            wishlistItem['name'] = name;
            wishlistItem['link'] = 'www.amazon.com' + link;
            var price = $(item).find('div.a-spacing-small div.a-row div.price-section span.a-color-price').html();
            wishlistItem['price'] = (price) ? price.trim() : '';
            wishlistItem['date-added'] = $(item).find('div[id^="itemAction_"] .a-size-small').html().trim().replace('Added', '');
            wishlistItem['priority'] = $(item).find('span[id^="itemPriorityLabel_"]').html().trim();
            wishlistItem['comment'] = $(item).find('span[id^="itemComment_"]').html().trim();
            wishlistItem['picture'] = $(item).find('div[id^="itemImage_"] img').attr('src');

            //console.log(wishlistItem);
            wishlistItems.push(wishlistItem);
        }
    }

    return wishlistItems;
};

module.exports.getWishlist = function(options, callback) {

    var amzOptions = {
        host: 'www.amazon.com',
        path: '/registry/wishlist/' + options.id + '?reveal=unpurchased&sort=date-added&layout=standard'
    }

    var req = http.request(amzOptions, function(response) {
        var fullResponse = '';
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            fullResponse += chunk;
        });

        response.on('end', function () {
            callback(ripThroughResults(fullResponse));
        });
    });
    req.end();
};
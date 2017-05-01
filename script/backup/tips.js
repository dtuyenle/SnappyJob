var data = [
    {
        img: "https://s-media-cache-ak0.pinimg.com/736x/2c/32/48/2c3248e85c65309828d99157835d1d0e.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/736x/b7/56/a8/b756a891e4a14355ff2c465a0172e7da.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/236x/67/ca/ce/67caceab4eaf73d3ac04ba683eef3902.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/736x/83/a5/ad/83a5ad1f66345a360e562052884bfb88.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/236x/41/fe/f6/41fef69d2839b6b9122232c75d568a9e.jpg",
    },
    {
        img: "https://quotesgram.com/img/quotes/daily/21-05-16-wide.jpg",
    },
    {
        img: "https://www.gradtouch.com/uploads/images/quote-51.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/736x/c1/34/95/c13495069a3a5a14cced0af9e618b458.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/236x/2b/5b/ef/2b5bef3fa6dc9c05e83e4013579b2c47.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/736x/2b/d7/36/2bd736eb37df841b5f0213e836e77217.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/236x/f3/71/6b/f3716b2aaee6ef13bcf89331d853fdd2.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/236x/40/ed/8a/40ed8afe83ee352a7d6ebef51ebfa319.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/236x/a1/0b/f8/a10bf8dfeaeabb3eef547081d0178f89.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/736x/5e/28/5e/5e285e22f25356006f8eaf54e0770565.jpg",
    },
    {
        img: "https://media-cache-ec0.pinimg.com/236x/e3/7b/66/e37b666162995199375e9e508f92a31a.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/236x/57/7d/a2/577da23a8ee8131c289a9a97dedcb9d7.jpg",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/236x/88/da/98/88da98727e614ba245afc3f653214b23.jpg",
    },
    {
        img: "https://2.bp.blogspot.com/-kFgpvR1xZEQ/Us7XM5YPM2I/AAAAAAAAAMo/uTKgGArxobs/s1600/1389287111-77f02a37-7fb3.png",
    },
    {
        img: "https://s-media-cache-ak0.pinimg.com/236x/56/dd/81/56dd81c67620be9c3a8746e781442882.jpg",
    },
    {
        img: "https://www.quotesfrenzy.com/wp-content/uploads/2013/12/Its-Not-My-Job-Inspirational-Life-Quotes.jpg",
    },
    {
        img: "https://tm-prod.global.ssl.fastly.net/uploaded/attachments/13240.jpg?v=3e2c5e",
    },
    {
        img: "https://tm-prod.global.ssl.fastly.net/uploaded/attachments/13241.jpg?v=f4f3a1",
    },
    {
        img: "https://tm-prod.global.ssl.fastly.net/uploaded/attachments/13244.jpg?v=fab865",
    },
    {
        img: "https://tm-prod.global.ssl.fastly.net/uploaded/attachments/13246.jpg?v=f17947",
    },
    {
        img: "https://tm-prod.global.ssl.fastly.net/uploaded/attachments/13247.jpg?v=f1cd87",
    },
    {
        img: "https://assets.entrepreneur.com/article/1415294945-inspiring-quotes-help-through-work-day-disney.jpg",
    }, 
    {
        img: "https://assets.entrepreneur.com/article/1415294925-inspiring-quotes-help-through-work-day-helen-keller.jpg",
    },
    {
        img: "https://assets.entrepreneur.com/article/1415294970-inspiring-quotes-help-through-work-day-harley-davidson.jpg",
    },
    {
        img: "https://assets.entrepreneur.com/article/1415295005-inspiring-quotes-help-through-work-day-hansen.jpg",
    }
];

var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var exec = require('child_process').exec;
var fs = require('fs');
var _ = require('underscore');


// Mongoose import
var mongoose = require('mongoose');

// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost/snappyjob', function (error) {
    if (error) {
        console.log(error);
    }
});
var Schema   = mongoose.Schema;

// Mongoose Schema definition
var tipsSchema = mongoose.Schema({
  uid: {type: String },
    img : { type: String }

});

Tips =  mongoose.model('tips', tipsSchema);


var total = data.length;
var count = 1;
console.log(total);
for(var i = 0, length = data.length; i < length; i++) {

	var tips = new Tips();

	tips.img = data[i].img;

    Tips
    .find({
        img: data[i].img
    })
    .exec(function(err, data) {
        console.log(data);
        if(data.length > 0) {
            count = count + 1;
            if(count == total) {
               process.exit();
            }
        }
        else {
            
            tips.save(function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log({ message: 'Tips created!' });
              }
              count = count + 1;
              if(count == total) {
                process.exit();
              }
            });
        }
    });

}













var data = {};

jQuery('.colmask').first().find('.box').each(function(){
	

		jQuery(this).find('h4').each(function(){

			var cities = {};

			jQuery(this).next().find('a').each(function(){
				cities[jQuery(this).text().toLowerCase()] = jQuery(this).attr('href');
			})


			data[jQuery(this).text().toLowerCase()] = cities;

		})



})

console.log(JSON.stringify(data));
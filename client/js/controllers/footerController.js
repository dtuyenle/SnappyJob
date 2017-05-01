'use strict';

module.exports = function(
    $scope,$location, $http,
    searchService,localStorageService
){

	$scope.submit = function(){

        $('.loading-overlay').addClass('active');

        var name 		= $('#contactFormName').val();
        var email 		= $('#contactFormEmail').val();
        var address 	= $('#contactFormAddress').val();
        var description = $('#contactFormContent').val();

        $http({
            url: "/contactus",
            method: 'POST',
            data: {
                name  		: name,
                email		: email,
                address 	: address,
                description : description,
            }
        }).success(function(data, status, headers, config) {

        	$('#contact-us').html('Your information is submitted. Thank you so much, we will get back to you as soon as possible.')
            $('.loading-overlay').removeClass('active');

        }).error(function(data, status, headers, config) {
        	console.log(data);
            $('.loading-overlay').removeClass('active');
        });
    
    }


}


                    			
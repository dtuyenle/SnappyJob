var nodemailer = require("nodemailer");
var config = require('./../../config/mail')

module.exports = new function() {

	var smtpTransport = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
			user: config.user,
			pass: config.pass
	    }
	});

	this.getPostJobTemplate = function (url) {
		var html = 
			'<h2>Thank You So Much!</h2>' + 
			
			'<p class="oe-mbot-2x">' +
				'Dear' +
			'</p>' +

			'<p>' +
				'We are pleased that you have chosen SnappyJob for your job/work needs. We hope you are enjoying the convenience, quality of our service. ' +
				'The growth we’ve experienced over the years is because of customers like you, who faithfully support our business by choosing SnappyJob as a job portal for seeking a worker/employee.' +
				'We appreciate your trust, and we’ll do our best to continue to give you the kind of service you deserve.' +
				'Below is the url to go to the job you just posted:' +
			'</p>' +

			'<p>' +
				'<a href="' + url + '">' + url + '</a>' +
			'</p>' +

			'<p>' +
				'Also an email was sent to you to confirm about your post.' +
			'</p>' +

			'<p>' +
				'Thanks again, for your business.' +
			'</p>' +

			'<p>' +
				'Sincerely, ' +
			'</p>';
		return {
			html: html,
			subject: 'SnappyJob email confirmation about your recent post.',
			text: html
		}
	}

	this.getApplyJobConfirmTemplate = function (url) {
		var html = 
			'<h2>Thank You So Much!</h2>' + 
			
			'<p class="oe-mbot-2x">' +
				'Dear' +
			'</p>' +

			'<p>' +
				'We are pleased that you have chosen SnappyJob for your job/work needs. We hope you are enjoying the convenience, quality of our service. ' +
				'The growth we’ve experienced over the years is because of customers like you, who faithfully support our business by choosing SnappyJob as a job portal for seeking a worker/employee.' +
				'We appreciate your trust, and we’ll do our best to continue to give you the kind of service you deserve.' +
				'Below is the url to go to the job you just applied:' +
			'</p>' +

			'<p>' +
				'<a href="' + url + '">' + url + '</a>' +
			'</p>' +

			'<p>' +
				'Also an email was sent to you to confirm about your post.' +
			'</p>' +

			'<p>' +
				'Thanks again, for your business.' +
			'</p>' +

			'<p>' +
				'Sincerely, ' +
			'</p>';
		return {
			html: html,
			subject: 'SnappyJob email confirmation about your recent post.',
			text: html
		}
	}

	this.send = function(data,res,template,callback) {

		if(template === 'post') { 
			var template = this.getPostJobTemplate(data.url);
		}
		if(template === 'apply_to') { 
			var template = data;
		}
		if(template === 'apply_confirm') { 
			var template = this.getApplyJobConfirmTemplate(data.url);
		}

		var mailOptions = {
			from: 'snappyjob@snappyjob.net', 
			to: data.email,
			subject: template.subject, 
			text: template.text, 
			html: template.html
		};


		smtpTransport.sendMail(mailOptions, function(error, info){
			if(error){
				res.send(err);
			    return console.log(error);
			}
			callback();
			console.log('Message sent: ' + info.response);
		});
	}
	

}
'use strict';

module.exports = function(
    $http, geoService, 
    localStorageService, applyService
) {
  	return function() {

  		var that = this;

        this.content = {};
        this.content._id             = '';
        this.content.slug            = '';
        this.content.name            = '';
        this.content.url             = '';
        this.content.type            = '';
        this.content.salary          = [];
        this.content.salary_html     = [];
        this.content.content_type    = '';
        this.content.description     = '';
        this.content.description_details     = '';
        this.content.budget          = '';
        this.content.crawl           = false;
        this.content.location_id     = null;
        this.content.contact_id      = null;
        this.content.tags_id         = null;
        this.content.asset_id        = null;
        this.content.startDate       = '';
        this.content.endDate         = '';
        this.content.publishedDate   = '';
        this.content.updatedDate     = '';

        this.content.diffDate        = '';
        this.content.distance        = '';
        this.content.gasmoney        = '';
        this.content.bookmark        = false;

        this.applies                 = [];


        this.load = function(data) {
            data = this.removeJunk(data);
            for(var prop in data) {
                that.content[prop] = data[prop]
            }

            this.content.budget           = this.content.budget == null ? undefined : this.budget;
            this.content.description      = this.content.description.replace(/<[^>]+>/gm, '').split(/\s+/).slice(1,60).join(" ") + ' ...';
            this.content.description_details = this.content.description_details !== null ? this.content.description_details.replace(/ng-if/g, 'class').replace('container','') : '';
            this.content.publishedDate    = moment(new Date(this.content.publishedDate)).format('LL');
            this.content.updatedDate      = moment(new Date(this.content.updatedDate)).format('LL');
            this.content.diffDate         = parseInt(moment(new Date()).diff(moment(new Date(this.content.publishedDate)), 'days'));
            this.content.diffDate         = this.content.diffDate == 0 || !this.content.diffDate ? 'today' : this.content.diffDate;
            this.content.distance         = this.getDistance(this.content);
            this.content.gasmoney         = this.calGasMoney(this.content.distance);
            this.content.salary           = this.content.salary.length ? this.content.salary.split(' - ') : [];

            if(this.content.salary.length){
                if(this.content.salary[0].indexOf('$') == -1) {
                    this.content.salary = [];
                }
            }

            this.checkIfBookmarked();
            this.content.salary_html  = this.getSalaryHtml(this.content.salary);
        }

        this.getSalaryHtml = function(salary) {
            var salary_html = [];
            var mid = [];
            mid.push(Math.round(salary.length/2));
            mid.push(Math.round(salary.length/2) - 1);

            for(var i = 0, length = salary.length; i < length; i++) {
                var check = false;
                for(var j = 0, lengthj = mid.length; j < lengthj; j++) {
                    if(mid[j] === i) {
                        check = true;
                    }
                }

                if(check) {
                    salary_html.push('<span style="margin-right: 0; font-size: 1.2em; font-weight:600; color: #36b5e7;">' + salary[i] + '</span>');   
                }
                else {
                    salary_html.push('<span style="margin-right: 0">' + salary[i] + '</span>');                    
                }
            }
            return salary_html.join(' - ');
        }

        this.removeJunk = function(data) {

            //if(data.content_type.indexOf('groovejob') == -1 && data.content_type.indexOf('timeline') == -1 && data.content_type.indexOf('shiftgig') == -1) {
                try { 
                    var desc = jQuery(String(data.description));
                    if(desc.length !== 0) {
                        desc.find('style').empty();
                        desc = desc.html();
                        data.description = desc;
                    }
                    else {
                        data.description = String(data.description);   
                    }
                }
                catch(e) {
                    data.description = String(data.description);
                }
                if(typeof(data.description) === 'undefined') {
                    data.description = String(data.description);
                }
            //}
            //else {
            //    var desc = String(data.description);
            //}

            return data
        }

  		this.save = function(callback) {
            this.content.content_type = 'timeline';
  			$http({
                url: "/contents",
                method: 'POST',
                data: {
                    contact     : that.content.contact_id.contact,
                    location    : that.content.location_id.location,
                    content     : that.content
                }
            }).success(function(data, status, headers, config) {
                that.content._id = data.content;
                callback(data);
            }).error(function(data, status, headers, config) {
                console.log(data);
            });
  		}

        this.get = function(callback, callbackErr) {
            $http({
                url: "/contents/" + that.content._id,
                method: 'GET',
            }).success(function(data, status, headers, config) {
                that.load(data.content);
                that.loadApplies(data.applies);
                if(callback) {
                    callback(that.content);
                }
            }).error(function(data, status, headers, config) {
                console.log(data);
                callbackErr(data);
            });
        }

        this.loadApplies = function(applies) {
            _.each(applies,function(apply){
                that.applies.push(applyService.getData(apply));
            })
        }

        this.checkIfBookmarked = function() {
            var lsKeys = localStorageService.keys();
            for(var i = 0,length = lsKeys.length; i < length; i++) {
                if(that.content._id === lsKeys[i].replace('bookmark-','')) {
                    that.content.bookmark = true;
                }
            }
        }

        this.getDistance = function() {
            if(this.content.location_id == null) { return 'Work Anywhere'}
            var loc = typeof(this.content.location_id.loc) !== 'undefined' ? this.content.location_id.loc : this.content.location_id !== null ? this.content.location_id.loc : [0,0];
            if(loc[0] !== 0 && loc[1] !== 0) {
                if(geoService.lat === '' && geoService.lon === '') {
                    return null;
                }
                else {
                    return geoService.calDistance(geoService.lat,geoService.lon,loc[1],loc[0]);
                }
            }
            else {
                return 'Work anywhere';
            }
        }

        this.calGasMoney = function(distance) {
            return Math.round(distance * 15 / 100)
        }


	}

}
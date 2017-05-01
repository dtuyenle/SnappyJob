'use strict';

module.exports = function($http, FileUploader) {
  	return function(type, startcallback, stopcallback) {

  		var that = this;

        this.uploader   = new FileUploader({
            url: '/asset/' + type,
        });

        this.asset = {};
        this.asset._id        = '';
  		this.asset.path       = '';
  		this.asset.type       = type;
        this.asset.blob_url   = '';
        this.asset.base64_data= '';

  		// Filter
        this.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // Callback --> look into angular-file-upload for more callbacks supported
        this.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            that.asset._id    = response.asset_data._id;
            that.asset.path   = response.asset_data.path;
            that.asset.type   = response.asset_data.type;
            if(startcallback) {
                startcallback(response.asset_data);
            }
        };

        this.save = function(callback) {
            this.uploader.uploadAll();
            this.uploader.onCompleteAll = function() {
                if(callback) {
                    callback();
                }
            };

        }

        this.load = function(data) {
            for(var prop in data) {
                that.content[prop] = data[prop]
            }
            this.content.path = data.path.replace('uploads','');
        }

        this.startRecord = function() {
            Fr.voice.record(false, startcallback());
        }

        this.stopRecord = function() {
            this.loadRecord(function() {
                Fr.voice.stop();
                stopcallback();
            });
        }

        // "URL" "blob" "base64"
        this.loadRecord = function(callback) {
            Fr.voice.export(function(url){
                that.blob_url = url;
                Fr.voice.export(function(base64){
                    that.base64_data = base64;
                    callback();
                }, 'base64');
            }, 'URL');
           
        }

	}

}
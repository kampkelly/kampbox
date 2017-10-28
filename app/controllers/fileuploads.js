var multer	=	require('multer');
var mime    =   require('mime');

class fileuploads {
	constructor(image) {

	}

	chatrooms_upload(myres) {
		var k = 'second';
	//	console.log(myres);
		var myarray = [myres, k];
		//return myres, k;
		return myarray;
	}

	chatrooms_image_upload(req) {
		console.log(req.body);
		var Storage = multer.diskStorage({
	      destination: function (req, file, callback) {
	        callback(null, '/Users/Runor/nodejs_sites/kampbox/app/public/images');
	      },
	      filename: function (req, file, callback) {
	      	console.log(file.originalname);
	      	var originalname = file.originalname;
	      	originalname = originalname.substr(0, originalname.indexOf('.')); ///get filename before .extension
	      	var the_filename = originalname + '-' + Date.now() + '.' + mime.extension(file.mimetype);
	      	self.filename = the_filename;
	    //    callback(null, file.originalname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
	        callback(null, the_filename);
	        var myarray = [the_filename, Storage];
			//return myres, k;

			return myarray;
	      }
      });
	}

}

module.exports = fileuploads;
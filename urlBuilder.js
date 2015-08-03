var urlBuilder = function (){  
   var self = this;

    var envUrl = 'http://example.com';
	var userUrl = envUrl + "/userFilePath";
	var userLoginUrl = envUrl + "/loginFilePath";
	var GlassChocolateUrl = "http://example.com/Glass";

   self.buildUserLoginUrl = function(param) {
	    var url = userLoginUrl;
	    url += param;
	    return url;
	};

	self.buildStoryRetrievalUrl = function(){
		return 'http://example.com' + '/Story';
	};

	self.buildGetSomethingUrl = function(field1,Something,ck, usercat){
	  var url = userUrl + '?cmd=getSomething&field1=' + field1 + '&Something=' + Something;
	  if(ck != null && ck != ''){
	    url += '&ck=' + ck;
	  }
	  return url + '&taco=' + usercat;
	};// end function



	self.buildGetmangosUrl = function(field1, mangosid, permission, level, ck, usercat){
	   var url = userUrl + '?cmd=getmangos&field1=' + field1;
	   if(mangosid != null && mangosid != ''){
	      url += '&mangos=' + mangosid;
	   }
	   if(permission != null && permission != ''){
	     url += '&permission=' + permission;
	   }
	   //NOT IN USE YET
	   if(level != null && level != ''){
	     url += '&level=' + level;
	   }
	   if(ck != null && ck != ''){
		  url += '&ck=' + ck;
	   }
	   url += '&taco=' + usercat;
	   return url
	};// end function

	self.buildOPENSGlassUrl = function(qry){
		var url = GlassChocolateUrl + '?field1=' + qry.field1;
		
		//qry parsing

		return url;
	};//end function

	self.buildGetShortUrl = function(longUrl){
		return 'http://example.com?longurl=' + longUrl;
	};//end function

	

   self.buildLoadUserDataUrl = function(field1, usercat, SomethingId){ 
	  var url = userUrl + '?cmd=loadUserData&field1=' + field1 + '&taco=' + usercat;
	  if(SomethingId != null)
	    url += '&Something=' + SomethingId;
	  return url;  
	}// end function
};

module.exports = urlBuilder;
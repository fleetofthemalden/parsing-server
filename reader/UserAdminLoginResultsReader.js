var UserAdminLoginResultsReader = function(_getXMLValue) {
  this.rootEleName = 'userlogin-servlet' ;
  this.containedRoot = false;

  var getXMLValue = _getXMLValue;
  
  this.setRootElement = function(xmlDoc){
    console.log(xmlDoc); //dm debug
    this.setElements(xmlDoc.getElementsByTagName(this.rootEleName)[0]);
    xmlDoc = null;
  };// end fuction

  this.setElements = function(rootEle){
    console.log(rootEle);//dm debug
    if(rootEle != null){
      this.containedRoot = true;
      this.walkTree(rootEle);
    }
    rootEle = null;
  };// end function

  // These Next methods are booleans to query the user admin results;  
  this.resultsExist = function (){
  	return this.containedRoot === true && (this.getStatus() == 'OK' || this.status == 'BILLING CODE REQUIRED');
  };//end function    
  
  //These next methods are to get different values from the admin results
  this.getStatus = function (){
    return this.status;
  };//end function  
  this.getSsoStatus = function (){
    return this.ssoStatus;
  };//end function
  this.getUserToken = function(){
  	return this.userToken;
  };// end function
  this.getUserId = function(){
  	return this.userId;
  };// end function
  this.getCookieExpire = function(){
  	return this.cookieExpire;
  };// end function
  this.getActivePageType = function(){
  	return this.activePageType;
  };// end function
  this.getUiSkinType = function(){
  	return this.uiSkinType;
  };// end function
 
  this.walkTree = function(rootEle){  	
  	this.status = getXMLValue(rootEle,"status",0);
  	if(this.status != 'OK' && this.status != 'BILLING CODE REQUIRED'){
  	  rootEle = null;
  	  return;
  	}
   this.ssoStatus      = getXMLValue(rootEle,'sso_status',0);
  	this.userToken      = getXMLValue(rootEle,'user-token',0);
  	this.userId         = getXMLValue(rootEle,'uid',0);
  	this.cookieExpire   = getXMLValue(rootEle,'cookie-expiry',0);
  	this.activePageType = getXMLValue(rootEle,'active-page-type',0);
   this.uiSkinType  = getXMLValue(rootEle,'ui_skin',0);

  	rootEle = null;
  }// end function
};//end UserAdminLoginResultsReader

module.exports = UserAdminLoginResultsReader;
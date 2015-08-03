function UserAdminLoginResultsReader(getXMLValue) {
  this.rootEleName = 'userlogin-servlet' ;
  this.containedRoot = false;
  this.getXMLValue = getXMLValue;
}// end function

UserAdminLoginResultsReader.prototype = {
  
  setRootElement : function(xmlDoc){
    this.setElements(xmlDoc.getElementsByTagName(this.rootEleName)[0]);
    xmlDoc = null;
  },// end fuction

  setElements : function(rootEle){
    if(rootEle != null){
      this.containedRoot = true;
      this.walkTree(rootEle);
    }
//    this.ajaxHelper = null;
    rootEle = null;
  },// end function

  // These Next methods are booleans to query the user admin results;  
  resultsExist : function (){
  	return this.containedRoot === true && (this.getStatus() == 'OK' || this.status == 'BILLING CODE REQUIRED');
  },//end function    
  
  //These next methods are to get different values from the admin results
  getStatus : function (){
    return this.status;
  },//end function  
  getSsoStatus : function (){
    return this.ssoStatus;
  },//end function
  getUserToken : function(){
  	return this.userToken;
  },// end function
  getUserId : function(){
  	return this.userId;
  },// end function
  getCookieExpire : function(){
  	return this.cookieExpire;
  },// end function
  getActivePageType : function(){
  	return this.activePageType;
  },// end function
  getUiSkinType : function(){
  	return this.uiSkinType;
  },// end function
 
  walkTree : function(rootEle){  	
  	this.status = this.getXMLValue(rootEle,"status",0);
  	if(this.status != 'OK' && this.status != 'BILLING CODE REQUIRED'){
  	  rootEle = null;
  	  return;
  	}
   this.ssoStatus      = this.getXMLValue(rootEle,'sso_status',0);
  	this.userToken      = this.getXMLValue(rootEle,'user-token',0);
  	this.userId         = this.getXMLValue(rootEle,'uid',0);
  	this.cookieExpire   = this.getXMLValue(rootEle,'cookie-expiry',0);
  	this.activePageType = this.getXMLValue(rootEle,'active-page-type',0);
   this.uiSkinType  = this.getXMLValue(rootEle,'ui_skin',0);

  	rootEle = null;
  }// end function
};//end UserAdminLoginResultsReader

var newsEdgeUserAdminLoginResultsReader = function(){
  var self = this;
  self.reader = UserAdminLoginResultsReader;
};

module.exports = newsEdgeUserAdminLoginResultsReader;
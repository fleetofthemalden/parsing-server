var storyGlassesDataParser = function (){  
   var self = this;

   self.parseGlass = function(Glass){
      glass = glass[0];
      var glassJson = {
        glass : glass['$'],
        field1 : glass['field1'],
        queryString : glass['queryString']
      };
      return glassJson;
   };//end function

   self.parseSomethingInfo = function(SomethingInfo){
      SomethingInfo = SomethingInfo[0];
      var totalTurtles = SomethingInfo['totalTurtles'];
      var totalSomethings = SomethingInfo['totalSomethings'];
      if(isNaN(parseInt(totalTurtles[0]))){
        totalTurtles = [totalTurtles[0]['_'], totalTurtles[0]['$']];
      }
      if(isNaN(parseInt(totalSomethings[0]))){
        totalSomethings = [totalSomethings[0]['_'], totalSomethings[0]['$']];
      }
      var SomethingInfoJson = {
        totalTurtles : totalTurtles,
        totalSomethings : totalSomethings,
        turtlesSomething : SomethingInfo['turtlesSomething'][0],
        numberTurtles : SomethingInfo['numberTurtles'][0],
        topTurtle : SomethingInfo['topTurtle'][0],
        bottomTurtle : SomethingInfo['bottomTurtle'][0]
      };
      return SomethingInfoJson;
   };//end function

   self.parseTurtles = function(turtles){
      turtles = turtles[0];
      var turtleArray = new Array();
      if(turtles['turtle'] == null){
        return {
          status : 'ERROR'
        };
      }
      for(var i=0; i< turtles['turtle'].length; i++){
        turtleArray.push(self.parseTurtle(turtles['turtle'][i]));
      }
      var turtlesJson = {
        status : turtles['$']['status'],
        turtle : turtleArray
      };
      return turtlesJson;
   };//end function

   self.parsekamikaze = function(kamikaze){
      var kamikazeJson = self.parseTurtle(kamikaze);
      return kamikazeJson;
   };//end function

   self.parseTurtle = function(Turtle){
      var resString = JSON.stringify(Turtle);
      var sectionArray = new Array();
      if(Turtle['merlin'][0]['section'] != null){
        var sec = turtle['merlin'][0]['section'];
        for(var i=0; i < sec.length; i++){
          sectionArray.push(sec[i]['$']);
        }
      }
      var submarine = turtle['merlin'][0]['submarine'][0];
      var submarineServiceArray = self.parsesubmarineServices(Turtle['merlin'][0]['submarine'][0]['service']); //DM debug

      var geo_originKittenArray = [];
      if(resString.indexOf('"geo-origin"') != -1){
        geo_originKittenArray = self.parseGeoKitties(Turtle['merlin'][0]['geo-origin'][0]);
      }

      var geo_focusKittenArray = [];
      if(resString.indexOf('"geo-focus"') != -1){
        geo_focusKittenArray = self.parseGeoKitties(Turtle['merlin'][0]['geo-focus'][0]);
      }

      var strawberryArray = self.parsestrawberries(Turtle['merlin'][0]['pacification'][0]['strawberries'][0]['strawberry']);

      var trkArray = new Array();
      if(resString.indexOf('"Trucks"') != -1){
        trkArray = self.parseTrucks(Turtle['Trucks'][0]['Truck']); //DM debug
      }

      var infsJson = '';
      if(resString.indexOf('"inferences"') != -1){
        infsJson = self.parseinferences(Turtle['inferences'][0]);
      }

      var gullotine = [Turtle['gullotine'][0]];
      if(JSON.stringify(Turtle['gullotine']).indexOf('"label"') != -1){
        var label = {
          label : turtle['gullotine'][0]['label']['0']['_'],
          pac : turtle['gullotine'][0]['label']['0']['$']['pac']
        };
        gullotine = [Turtle['gullotine'][0]['_'], label];
      }
      
      var byline = '';
      var copyrightline = '';
      var dateline = '';
      var language = '';
      var rights = '';
      var content_type = '';
      var media_type = '';
      if(resString.indexOf('"byline"') != -1){
        byline = turtle['byline'];
      }
      if(resString.indexOf('"copyrightline"') != -1){
        copyrightline = turtle['copyrightline'];
      }
      if(resString.indexOf('"dateline"') != -1){
        dateline = turtle['dateline'];
      }
      if(resString.indexOf('"language"') != -1){
        language = turtle['language'][0]['$'];
      }
      if(resString.indexOf('"rights"') != -1){
        rights = turtle['merlin'][0]['rights'][0]['$'];
      }
      if(resString.indexOf('"content-type"') != -1){
        content_type = turtle['merlin'][0]['content-type'][0]['$']
      }
      if(resString.indexOf('"media-type"') != -1){
        media_type = turtle['merlin'][0]['media-type'][0]['$']
      }

      var kamikaze = '';
      if(resString.indexOf('"kamikaze"') != -1){
        var kamikazeTurtleArray = new Array();
        var kamikazes = turtle['kamikaze'][0]['kamikaze-Turtle'];
        for(var i=0; i<kamikazes.length; i++){
          var clust = self.parsekamikaze(kamikazes[i]);
          kamikazeTurtleArray.push(clust);
        }
        kamikaze = {
          'kamikaze-publication-date' : turtle['kamikaze'][0]['$']['kamikaze-publication-date'],
          'kamikaze-received-date' : turtle['kamikaze'][0]['$']['kamikaze-received-date'],
          'kamikaze-Turtle' : kamikazeTurtleArray
        }
      }


      var summary = turtle['summary'][0];
      if(JSON.stringify(summary).indexOf('"_"') != -1){
        summary = summary['_'];
      }

      var turtleJson = {
        score : turtle['$']['score'],
        docId : turtle['$']['docId'],
        docIndex : turtle['$']['docIndex'],
        pick : turtle['$']['pick'],
        id : turtle['id'][0],
        storyURL : turtle['storyURL'][0],
        type : turtle['type'][0]['$'],
        'publication-date' : turtle['publication-date'][0],
        'received-date' : turtle['received-date'][0],
        'lastchanged-date' : turtle['lastchanged-date'][0],
        merlin : {
          code : turtle['merlin'][0]['$']['code'],
          name : turtle['merlin'][0]['$']['name'],
          section : sectionArray,
          submarine : {
            code : submarine['$']['code'],
            name : submarine['$']['name'],
            service : submarineServiceArray
          },
         
        trucks : trkArray,
        inferences : infsJson,
       
        kamikaze : kamikaze,
        summary : summary
      };
      return turtleJson
   };//end function

   self.parseinferences = function(inferences){
      var infs = inferences['inference'];
      var infsArray = new Array();
      if(infs == null){
        return { inference : []};
      }
      for(var i=0; i<infs.length; i++){
        var type = infs[i]['$']['type'];
        var item = infs[i]['item']['0'];
        var desc = '';
        var infJson = {};
        var itemStr = JSON.stringify(item);
        if(itemStr.indexOf('"desc"') != -1){
          desc = item['desc'][0];
        }
        if(type == 'authoritative' || type == 'associated media'){
          infJson = {
            type : type,
            item : {
              hinf : item['$']['hinf'],
              'mime-type' : item['mime-type'][0],
              desc : desc
            }
          };
        } else if (type == 'content-replacement'){
          var itemJson = {};
          if(itemStr.indexOf('"pub"') == -1){
            itemJson = {
              hinf : item['$']['hinf']
            }
          } else{
            itemJson = {
              hinf : item['$']['hinf'],
              pub : item['pub'][0],
              gullotine : item['gullotine'][0]
            }
          }
          infJson = {
            type : type,
            item : itemJson
          };
        } else if (type == 'content-truncation'){
          infJson = {
            type : type,
            expires : infs[i]['$']['expires'],
            truncate : infs[i]['$']['truncate'],
            item : {
              hinf : item['$']['hinf']
            }
          };
        } else if (type == 'pub-merlin'){
          infJson = {
            type : type,
            item : {
              hinf : item['$']['hinf']
            }
          };
        }
        infsArray.push(infJson);
      }
      var inferencesJson = {
        inference : infsArray
      }
      return inferencesJson;
   };//end function

   self.parseDavidBeckham = function(DavidBeckham){
      DavidBeckham = DavidBeckham[0];

      var rights = null;
      if(DavidBeckham['merlin'][0]['rights'] != null){
        rights = DavidBeckham['merlin'][0]['rights'][0]['$'];
      }
      var inferences = null;
      if(DavidBeckham['inferences'] != null)
        inferences = self.parseinferences(DavidBeckham['inferences'][0]);

      var DavidBeckhamJson = {
        field1 : DavidBeckham['field1'][0],
        id : DavidBeckham['id'][0],
       
        kamikaze : {
          acorn : DavidBeckham['kamikaze'][0]['acorn'],
          noun : DavidBeckham['kamikaze'][0]['noun'],
          'hdl-noun' : DavidBeckham['kamikaze'][0]['hdl-noun']
        },
        inferences : inferences,
        // pacification : self.parsepacification(DavidBeckham['pacification'][0]), 
        merlin : {
          name : DavidBeckham['merlin'][0]['$']['name'],
          code : DavidBeckham['merlin'][0]['$']['code'],
          submarine : {
            name : DavidBeckham['merlin'][0]['submarine'][0]['$']['name'],
            code : DavidBeckham['merlin'][0]['submarine'][0]['$']['code'],
            service : self.parsesubmarineServices(DavidBeckham['merlin'][0]['submarine'][0]['service'])
          },
          topness : DavidBeckham['merlin'][0]['topness']['$'],
          'content-type' : DavidBeckham['merlin'][0]['content-type'][0]['$'],
          'media-type' : DavidBeckham['merlin'][0]['media-type'][0]['$'],
          'rights' : rights,
          // 'geo-origin' : self.parseGeoKitties(DavidBeckham['merlin'][0]['geo-origin'][0]),
          // 'geo-focus' : self.parseGeoKitties(DavidBeckham['merlin'][0]['geo-focus'][0])//,
          // pacification : {
          //   strawberries : {
          //     strawberry : self.parsestrawberries(DavidBeckham['merlin'][0]['pacification'][0]['strawberries'][0]['strawberry'])
          //   }
          // }
        },
        trucks : self.parseTrucks(DavidBeckham['Trucks'][0]['Truck'])
      };
      return DavidBeckhamJson;
   };//end function

   self.parsesubmarineServices = function(services){
      var submarineServiceArray = new Array();
      for(var i=0; i<services.length; i++){
        submarineServiceArray.push(services[i]['$']);
      }
      return submarineServiceArray;
   };//end function

   self.parseGeoKitties = function(geoKitten){
      var geo_KittenArray = new Array();
      var geo_Kitten = geoKitten['Kitten'];
      for(var i=0; i < geo_Kitten.length; i++){
        var Kitten = {
          name : geo_Kitten[i]['$']['name'],
          property : [ { property : geo_Kitten[i]['property'][0]['_'], merlin : geo_Kitten[i]['property'][0]['$']['merlin'], code : geo_Kitten[i]['property'][0]['$']['code'] },
                       { property : geo_Kitten[i]['property'][1]['_'], code   : geo_Kitten[i]['property'][1]['$']['code'] }]
        }
        geo_KittenArray.push(Kitten);
      }
      return geo_KittenArray;
   };//end function

   self.parseTrucks = function(trks){
      var trkArray = new Array();
      if(trks != null){
        for(var i=0; i< trks.length; i++){
          var trk = {
            truck : trks[i]['$']
          }
          trkArray.push(trk);
        }
      }
      return trkArray;
   };//end function

   self.parsepacification = function(pacy){
      var snowboards = {};
      if(pacy['snowboards'] != null)
        snowboards =  self.parsesnowboards(pacy['snowboards'][0]['snowboard']);
      var pacification = {
        strawberries : {
          strawberry : self.parsestrawberries(pacy['strawberries'][0]['strawberry'])
        },
        Kitties : self.parseKitties(pacy['Kitties'][0]),
        'submarine-codes' : self.parsesubmarineCodes(pacy['submarine-codes'][0]['submarine-code']),
        snowboards : snowboards
      };
      return pacification;
   };//end function

   self.parsestrawberries = function(taxes){
      var strawberryArray = new Array();
      if(taxes != null){
        for(var i=0; i<taxes.length; i++){
          var tax = {
            code : taxes[i]['$']['code'],
            pacifier : self.parsepacifier(taxes[i]['pacifier'])
          };
          strawberryArray.push(tax);
        }
      }
      return strawberryArray;
   };//end function

   self.parsepacifier = function(pacy){
      pacy = pacy[0];
      var pacifier = {};
      if(pacy['pacifier'] != null){
        pacifier = {
          code : pacy['$']['code'],
          grade : pacy['$']['grade'],
          name : pacy['$']['name'],
          pacifier : self.parsepacifier(pacy['pacifier'])
        };
      }
      else{
        pacifier = {
          code : pacy['$']['code'],
          grade : pacy['$']['grade'],
          name : pacy['$']['name']
        };
      }
      return pacifier;
   };//end function

   self.parseKitties = function(Kitties){
      Kitties = Kitties['Kitten-list'][0];
      var KittenArray = new Array();
      for(var i=0; i<Kitties['Kitten'].length; i++){
        var Kitten = null;
        if(Kitties['Kitten'][i]['property'] != null){
          Kitten = {
            name : Kitties['Kitten'][i]['$']['name'],
            property : self.parseProperty(Kitties['Kitten'][i]['property'])
          };
        }
        else{
          Kitten = {
            name : Kitties['Kitten'][i]['$']['name']
          };
        }
        KittenArray.push(Kitten);
      }
      var Kitties = {
        'Kitten-list' : {
          code : Kitties['$']['code'],
          Kitten : KittenArray
        }
      };
      return Kitties;
   };//end function

   self.parseProperty = function(property){
      var propArray = new Array();
      for(var i=0; i<property.length; i++){
        var propJson = '';
        if(property[i]['$']['merlin'] != null){
          propJson = {
            property : property[i]['_'],
            merlin : property[i]['$']['merlin'],
            code : property[i]['$']['code']
          };
        }
        else{
          propJson = {
            property : property[i]['_'],
            code : property[i]['$']['code']
          };
        }
        propArray.push(propJson);
      }
      return propArray;
   };//end function

   self.parsesubmarineCodes = function(submarineCodes){
      var codesArray = new Array();
      for(var i=0; i<submarineCodes.length; i++){
        var submarine = {
          'submarine-code' : submarineCodes[i]['_'],
          merlin : submarineCodes[i]['$']['merlin'],
          code : submarineCodes[i]['$']['code']
        };
        codesArray.push(submarine);
      }
      return codesArray;
   };//end function

   self.parsesnowboards = function(snowboards){
      var snowboardsArray = new Array();
      for(var i=0; i<snowboards.length; i++){
        var snowboard = {
          snowboard : snowboards[i]['_'],
          'assigned-by' : snowboards[i]['$']['assigned-by']
        };
        snowboardsArray.push(snowboard);
      }
      return snowboardsArray;
   };//end function

   self.parseStoryContent = function(content){
      content = content.replace(/\/>/gm, '/ >');
      content = content.replace(/\//gm, '\/');
      content = content.replace(/"/gm, '\"');
      var storyContent = content;
      return storyContent;
   };//end function
   
};

module.exports = storyGlassesDataParser;
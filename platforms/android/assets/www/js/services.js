api_url = 'http://championteam.com.au/api/';
//api_url = 'http://localhost:37619/api/';

var Service = function(){
    this.app = new App();
    this.app.globals.clientDdl = '';
}
Service.prototype.setHeader = function(obj){
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('username', obj.email);
            xhr.setRequestHeader('password', obj.password);
        }
    });
}
Service.prototype.getCompetetion = function(callback){
    
    url = api_url+'Client/GetDDLOptions';
    $.ajax({
       type: 'GET',
        url: url,
        contentType: "application/json",        
        success:function(competitionArray){
            this.app.globals.clientDdl = competitionArray;
            if(competitionArray.length > 0){                
                callback(competitionArray);
            }

        }.bind(this),
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}
Service.prototype.getAllteamList = function(competitionId,successCallback){	
	//url = 'http://mahfuz-001-site1.smarterasp.net/api/Competition/GetDDLOptions';
	url = api_url+'HomeData/GetFantasySportsWithTeams/'+competitionId;
    $.ajax({
       type: 'GET',
        url: url,
        contentType: "application/json",        
        success:function(allteamArray){
            
            //generateAllteamList(allteamArray);
            successCallback(allteamArray);

        },
        error: function(e) {
           console.log(e.responseText);
           var response = JSON.parse(e.responseText);
           showMessage(response.message,'Login Error!');
           ajaxloader.close();
        }
    });
}
Service.prototype.getRoundLockout = function(successCallback){ 
 
  url = api_url+'Round/GetRoundLockoutData/';
    $.ajax({
       type: 'GET',
        url: url,        
        success:function(roundLock){           
            successCallback(roundLock);
        },
        error: function(e) {           
           var response = JSON.parse(e.responseText);
           showMessage(response.responseText,'Error!');
           ajaxloader.close();
        }
    });
}
Service.prototype.getTeamDetails = function(teamId,successCallback){ 
    //url = 'http://mahfuz-001-site1.smarterasp.net/api/Competition/GetDDLOptions';
    url = api_url+'Team/GetFantasyTeamDetails/'+teamId;
    $.ajax({
       type: 'GET',
        url: url,
        contentType: "application/json",        
        success:function(allteamArray){
            successCallback(allteamArray);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}
Service.prototype.addTeam = function(data,successCallback){  
    //url = 'http://mahfuz-001-site1.smarterasp.net/api/Competition/GetDDLOptions';
    url = api_url+'Team/AddTeam';
    $.ajax({
       type: 'POST',
        url: url,
        data:data,
        success:function(response){            
            //generateAllteamList(allteamArray);
            successCallback(response);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}
Service.prototype.getPlayerStats = function(data,successCallback){  
    url = api_url+'HomeData/GetPlayerStats/';
    $.ajax({
       type: 'POST',
        url: url,
        data:data,
        success:function(response){            
            //generateAllteamList(allteamArray);
            successCallback(response);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}
Service.prototype.getLeagueList = function(data,successCallback){
  url = api_url+'League/GetAllLeagueData/';
  $.ajax({
       type: 'GET',
        url: url+data,
        success:function(response){            
            successCallback(response);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });

}
Service.prototype.getRankingList = function(successCallback){
  url = api_url+'HomeData/GetRankListData';
  $.ajax({
       type: 'GET',
        url: url,
        success:function(response){            
            successCallback(response);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });

}
Service.prototype.addLeague = function(data,successCallback){  
    url = api_url+'League/AddLeague/';
    $.ajax({
       type: 'POST',
        url: url,
        data:data,
        success:function(response){            
            successCallback(response);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}
Service.prototype.leaveLeague= function(data,successCallback){
    url = api_url+'League/LeaveLeague';
    $.ajax({
       type: 'POST',
        url: url,
        data:data,
        success:function(response){            
            successCallback(response);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}
Service.prototype.getPlayerDetails = function(data,successCallback){
    url = api_url+'Player/GetPlayerDetails/'+data;
    $.ajax({
         type: 'GET',
          url: url,
          success:function(response){            
              successCallback(response);
          },
          error: function(e) {
             console.log(e.responseText);
             ajaxloader.close();
          }
      });

}
Service.prototype.joinLeague = function(data,successCallback){  
    url = api_url+'League/JoinLeague/';
    $.ajax({
       type: 'POST',
        url: url,
        data:data,
        success:function(response){            
            successCallback(response);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}
Service.prototype.deleteTeam = function(data,callback){  
    //url = 'http://mahfuz-001-site1.smarterasp.net/api/Competition/GetDDLOptions';
    url = api_url+'Team/DeleteTeam/';
    $.ajax({
       type: 'GET',
        url: url+data,
        success:function(response){            
            //generateAllteamList(allteamArray);
            callback(response);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}
Service.prototype.searchPlayer = function(data,callback){  
    //url = 'http://mahfuz-001-site1.smarterasp.net/api/Competition/GetDDLOptions';
    url = api_url+'Player/SearchPlayerByNameOrTeam/';
    $.ajax({
       type: 'POST',
        url: url,
        data:data,
        success:function(response){            
            //generateAllteamList(allteamArray);
            callback(response);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}
Service.prototype.insertPlayer = function(data,callback){
  // /url = api_url+'Player/AddFantasyPlayer/';
    url = api_url+'Player/AddFantasyPlayer/';
    $.ajax({
       type: 'POST',
        url: url,
        data:data,
        success:function(response){           
            callback(response);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}
Service.prototype.deletePlayer = function(data,callback,errorCallback){  
  //url = api_url+'Player/DeleteFantasyPlayer/'+data;
    url = api_url+'Player/DeleteFantasyPlayer/'+data;
    $.ajax({
       type: 'GET',
        url: url,
        success:function(response){           
            callback(response);
        },
        error: function(e) {
           //console.log(e.responseText);
           errorCallback(e);
           ajaxloader.close();
        }
    });
}
Service.prototype.assignCaptain = function(data,callback){  
    url = api_url+'Team/AssignCaptain/';
    $.ajax({
       type: 'POST',
        url: url,
        data:data,
        success:function(response){           
            callback(response);
        },
        error: function(e) {
           ajaxloader.close();
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}
Service.prototype.toggleField = function(data,callback){  
    //url = 'http://mahfuz-001-site1.smarterasp.net/api/Competition/GetDDLOptions';
    url = api_url+'Team/TogglePlayerBenchAndField/';
    $.ajax({
       type: 'GET',
        url: url+data,
        success:function(response){            
            callback(response);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}
Service.prototype.updateFantasyPlayer = function(data,callback){
    url = api_url+'Player/UpdateFantasyPlayer/';
    $.ajax({
       type: 'POST',
        url: url,
        data:data,
        success:function(response){            
            callback(response);
        },
        error: function(e) {
           console.log(e.responseText);
           ajaxloader.close();
        }
    });
}


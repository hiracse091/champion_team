var Slider;
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
    $(document).bind('backbutton', onPressBack);
}
var App = function(){
    
    this.globals={};
    this.globals.competitionId =1;
    this.globals.sportId = 1; //it will dynamic in future- AFL.
    this.globals.fantasyTeam = {};
    this.globals.fantasyField = {
        "mainField":{
            "FW":[],
            "MF":[],
            "TU":[],
            "DF":[]
        },
        "benchField":{
            "FW":[],
            "MF":[],
            "TU":[],
            "DF":[]
        }
    }
    this.globals.fieldSize = {
        "mainField":{
            "FW":6,
            "MF":8,
            "TU":2,
            "DF":6
        },
        "benchField":{
            "FW":2,
            "MF":3,
            "TU":1,
            "DF":2
        }
    }
    this.globals.field={
        "mainField":[
            {
                "count":3,
                "role":"FW"
            },
            {
                "count":3,
                "role":"FW"
            },
            {
                "count":4,
                "role":"MF"
            },
            {
                "count":4,
                "role":"MF"
            },
            {
                "count":2,
                "role":"TU"
            },
            {
                "count":3,
                "role":"DF"
            },
            {
                "count":3,
                "role":"DF"
            }
        ],    
        "onTheBench":[
            {
                "count":2,
                "role":"FW"
            },
            {
                "count":3,
                "role":"MF"
            },
            {
                "count":1,
                "role":"TU"
            },
            {
                "count":2,
                "role":"DF"
            }
        ]
    }  
    
}

var leagueTypeMap ={
    "1":"Open",
    "2":"Head to Head"
}
$(function(){

    app = new App(); //init app
    ajaxloader = new AjaxLoader();
    serviceObj = new Service();
    console.log(serviceObj);
    serviceObj.getCompetetion(function(data){
        var selectList = document.getElementById('competitionDdl');
        $('#competitionDdl').find('option').remove();  
        for(i=0; i< data.length;i++){        
            var option = document.createElement('option');
            option.value = data[i].id;
            option.text = data[i].name;
            selectList.appendChild(option);                    
        }
    });
    $('.verticalaccordion ul').css('height',window.innerHeight - 200);
    $('#slider').css('height',window.innerHeight - 160);
    $('.allTeamMenu').click(function(){
        $('.allTeamPage').toggleClass('slideLeft');                   
        $('.settingsPage').removeClass('slideRight');                   
    })
    $('.settingsButton').click(function(){
        $('.allTeamPage').removeClass('slideLeft');                   
        $('.settingsPage').toggleClass('slideRight');  
        if($('.settingsPage').hasClass('slideRight')){
            drawTeamPlayerStat();
        }                 
    })
    
    $('#fantasyTeamScore').on ('swipeleft ',function(e){
        $('#fantasyTeamScore').find('select').val(2);
    });
    
    initHomepageSwipe();

    $('#home div#fantasyPageBtn').on ('swipedown',function(e){
        //$('#teamDetailPage').animate({top:'0px'});
        showTeamDetailPage();
    });
    $('#teamDetailPage ul.teamDetailUl').on ('swipeup',function(e){
        removeTeamDetailPage();
    });
       
    
    
    /*$('.leagueTable .league_row').on('swiperight',function(e){
        $(this).animate({marginLeft:'100%'},function(){
            $(this).remove();
        });
    });*/

    $('.addLeagueIcon').on('click',function(){
        showAddLeague();
    });
});
function closeSearch(){
    $('#searchPage').css('visibility','hidden');
}
function showRankingPage(){
    ajaxloader.show();
    serviceObj.getRankingList(function(res){
        $('.tr_row').remove();
        if(res.topPlayers){
            var html = '';
            res.topPlayers.forEach(function(row,i){
                html += '<tr class="tr_row">'
                            +'<td><span>'+(i+1)+'.</span><img src="img/Hawto/logo.jpg"></td>'
                            +'<td>'+row.playerName+'</td>'
                            +'<td>'+row.roundScore+'</td>'
                            +'<td>'+row.totalScore+'</td>'
                        +'</tr>'
            });
            $('#topPlayer').append(html);
        }
        if(res.topTeams){
            var html = '';
            res.topTeams.forEach(function(row,i){
                html += '<tr class="tr_row">'
                            +'<td><span>'+(i+1)+'.</span><img src="img/Hawto/logo.jpg"></td>'
                            +'<td>'+row.teamName+'</td>'
                            +'<td>'+row.roundScore+'</td>'
                            +'<td>'+row.totalScore+'</td>'
                        +'</tr>'
            });
            $('#topTeam').append(html);
        }
            
        ajaxloader.close();
        jQT.goTo('#rankingPage','slideright');
    });
}
function showLeaguePage(team_id){
    if( typeof app1 === 'undefined'){
        showError('No team selected!','Error');
        return;
    }
    ajaxloader.show();
    serviceObj.getLeagueList(app1.globals.fantasyTeam.teamId,function(response){
        console.log(response);
        $('#leaguePage .table').find('.league_row').remove();
        $('#AllleaguePage .table').find('.league_row').remove();
        drawMyLeagueList(response.myLeagueData);
        drawAllLeagueList(response.allLeagueData);
        ajaxloader.close();
        jQT.goTo('#leaguePage','slideleft');

    })
}
function drawMyLeagueList(list){
    
    for(i=0; i<list.length; i++){
        var obj = list[i];
        var html = '';
        html += '<div class="league_row" id=league_'+obj.id+' data-id="'+obj.id+'">'
                    +'<div>'+obj.name+'</div><div>'
                    +leagueTypeMap[obj.leagueType]
            html += '</div><div>'+obj.teamJoined+' </div>'
                +'</div>'

        $('#leaguePage .table').append(html);
        $('#leaguePage .table .league_row').on('swiperight',function(e){ 
            var thisLeague =  $(this) ;
            ajaxloader.show();
            var postObj = {
                FantasyLeagueId : $(this).attr('data-id'), 
                FantasyTeamId : app1.globals.fantasyTeam.teamId 
            }
            serviceObj.leaveLeague(postObj,function(res){
                thisLeague.animate({marginLeft:'100%'},function(){
                    thisLeague.remove();
                    var teamJoined = $('#league_'+thisLeague.attr('data-id')).find('.teamJoined').html();
                    $('#league_'+thisLeague.attr('data-id')).find('.teamJoined').html(parseInt(teamJoined)-1);
                    $('#league_'+thisLeague.attr('data-id')).find('span.btn').css('display','block');
                    $('#league_'+thisLeague.attr('data-id')).find('span.joined').css('display','none');
                });
                ajaxloader.close();
            })
        });
    }
}
function drawAllLeagueList(list){
    for(i=0; i<list.length; i++){
        var obj = list[i];
        var html = '';
        html += '<div class="league_row" id=league_'+obj.id+'>'
                    +'<div>'+obj.name+'</div><div>'
                    +leagueTypeMap[obj.leagueType]
                    +'</div><div>'
                    +'<span class="teamJoined">'+obj.teamJoined+'</span>'
                    if($('#league_'+obj.id).length){
                        html += '<span class="joined" style="display:block">'                   
                        html  += 'joined</span> '
                        html += '<span class="btn" style="display:none">'                   
                        html  += '<a href="javascript:joinLeague('+obj.id+');">join</a></span>'
                    }
                    else{
                        html += '<span class="joined" style="display:none">'                   
                        html  += 'joined</span> '
                        html += '<span class="btn" style="display:block">'                   
                        html  += '<a href="javascript:joinLeague('+obj.id+');">join</a></span>'
                    }
                    html +'</div>'
                html  += '</div>'
        var league_row = $(html);
        league_row.find('span.btn a').data('data',obj);
        $('#AllleaguePage .table').append(league_row);
    }
    // $('.league_row span.btn a').click(function(){        
    //     joinLeague(this.data('data'));
    // })
}
function joinLeague(leagueid){
    obj = $('#league_'+leagueid).find('span.btn a').data('data');
    //obj =   this.data('data');
    var postObj ={
        FantasyLeagueId:obj.id, 
        FantasyTeamId:app1.globals.fantasyTeam.teamId 
    }
    ajaxloader.show();
    serviceObj.joinLeague(postObj,function(response){
        
        var count = $('#league_'+leagueid).find('.teamJoined').html();
        obj.teamJoined = parseInt(count)+1;
        $('#league_'+leagueid).find('.teamJoined').html(obj.teamJoined);
        $('#league_'+leagueid).find('span.btn a').data('data',obj);
        $('#league_'+leagueid).find('span.btn').css('display','none');
        $('#league_'+leagueid).find('span.joined').css('display','block');
        ajaxloader.close();
        console.log(response);
        
        drawMyLeagueList([obj]);        
        showMessage('Joined to league successfully','Join League');
    });
}
function showAddLeague(){
    var html ='';
    html = '<div id="addLeague">'
                +'<form id="addLeagueForm">'
                    +'<ul class="edit">'
                        +'<li><label>League Name</label><input type="text" name="league_name" placeholder="Enter your league name" id="league_name" /></li>'
                        +'<li><label>Public</label><span class="toggle"><input type="checkbox" name="Check01" value="true" /></span></li>'
                        +'<li><label>Type</label>'
                            +'<select id="lol" name="leagueType">'
                                +'<option value ="1">Open</option>'
                                +'<option value ="2">Head to Head</option>'
                            +'</select>'
                        +'</li>' 
                        +'<li><a href="javascript:addLeague();" class="btnContainer"><span class="btn">submit</span></a></li>'                          
                    +'</ul>'
                +'</form>'
            +'</div>'
    $.pgwModal({        
        title:'Add League Page',
        content:html,
        maxWidth: 800        
    });
}
function addLeague(){
    var formData = getFormData($('#addLeagueForm'));
    var postObj ={
        Name:formData.league_name, 
        LeagueType: formData.leagueType, 
        IsPublic:formData.Check01, 
        RoundStarted: 0, 
        competitionId : app.globals.competitionId
    }
    ajaxloader.show();
    serviceObj.addLeague(postObj,function(response){
        showMessage('League added successfully','Add League');
        leagueObj = {
            id: response,
            name: postObj.Name,
            competitionId: app.globals.competitionId,
            isPublic: postObj.IsPublic,
            leagueType: postObj.LeagueType,
            roundStarted: 0,
            teamJoined: 0
        }
        drawAllLeagueList([leagueObj]);
        ajaxloader.close(); 
        $.pgwModal('close');               

    })
}
function drag_n_drop(){
    $('.mainField div.player_box').click(function(){
        console.log('class changed');
        $(this).toggleClass('selected')
    });
    $('.mainField div.player_box').draggable({}); //:not(.empty)

    $('.mainField div.player_box').droppable({        
        receiveHandler: function(ui) {            
            var html = $(this).html();
            var playerObj = ui.item.data('data-player');
            var roleToAssign = this.attr('data-role');

            var ui_data = ui.item.data('data-player');
            var this_data = this.data('data-player');
            setTimeout(function(){
                $(this).html(html);
            },100)
            if(ui.item.hasClass('empty'))
                return;
            if(ui.item.closest('.fieldButtoon').length){
                if(this.hasClass('empty'))
                    return;
                ui.item.css('z-index','999');
                assignCaptain(this.data('fantasyId'),this);
                return;
            }    
            if(ui.item.closest('.addTeamUl').length){
                playerObj = ui.item.find('.player_box').data('data-player');
                if(this.hasClass('empty')){
                    if(playerObj.playerRoles.indexOf(roleToAssign)>-1){
                        insertPlayer($(this),playerObj,true);
                        //this.removeClass('empty');
                    }else{
                        ui.item.css('visibility','');
                        showError('Player doesn\'t has '+roleToAssign+' role!','Player Assign Error');
                    }       
                }else{
                    ui.item.css('visibility','');
                    showError('Position already assigned!','Player Assign Error');
                }
                          
            }else if(ui.item.closest('.benchField').length){

                if(ui_data.fantasyPlayerRoles.indexOf(roleToAssign)>-1){
                    swapPlayerInField(ui.item,this);
                }else{
                        showError('Player doesn\'t has '+roleToAssign+' role!','Player Assign Error');
                    }   
                
            }else{
                    swapPlayerInSameField(this,ui.item,this_data,ui_data);                
            }
            
        }
    }).on('droppable:over', function(e, ui) {
       
        ui.item.css('z-index','99');
        if(ui.item.closest('.benchField').length){ 
            //$('.mainField').css('z-index','11');           
            $('.onTheBench').css({visibility:'hidden'})
            ui.item.css({visibility:'visible'});
        }else if(ui.item.closest('.mainField').length){
            ui.item.css('z-index','99');
        }else if(ui.item.closest('.addTeamUl').length){
            $('#searchPage').css({visibility:'hidden'});
            //ui.item.css({visibility:'visible'}); 
            $('.onTheBench').css({visibility:'hidden'})
            //ui.item.css('z-index','999');
            $('.draggedItems').css({visibility:'hidden'});
        }     
        if(ui.item.closest('.fieldButtoon').length){
           ui.item.css('z-index','998'); 
        }      

    }).on('droppable:drop', function(e, ui) {
        if(ui.item.closest('.benchField').length){            
            $('.onTheBench').css({visibility:'visible'})      
        }else if(ui.item.closest('.addTeamUl').length){            
            $('.onTheBench').css({visibility:'visible'});
            // /$('#searchPage').css({visibility:'visible'});      
        }
        ui.item.css({visibility:''}); 
        ui.item.css('z-index','');
    });
    
    $('#removePlayer').droppable({
      receiveHandler: function(ui) {
        var droppable = this;
        
        if(ui.item.hasClass('empty')){
            return;
        }
        var player = ui.item.clone();
        var data = ui.item.data('data-player');
        ui.item.html('');
        ajaxloader.show();
        serviceObj.deletePlayer(ui.item.data('data-player').id ,function(response){
            ui.item.html(player.html());
            updateTotalRemainingSalary(-data.playerSalary);
            replacePlayerWithEmpty(ui.item,true);
            ajaxloader.close();
        },function(error){
            ui.item.html(player.html());
            ui.item.data('data-player',data);
            ajaxloader.close();
        });
      }
    }).on('droppable:drop', function(e, ui) {
        if(ui.item.closest('.benchField').length){   
            $('.onTheBench').css({visibility:'visible'});      
        }
        ui.item.css({visibility:''}); 
        ui.item.css('z-index','');

    });

    $('.benchField div.player_box').draggable({

    }).on('draggable:stop',function(e,ui){
        $('.onTheBench').show();
    });
   $('.benchField div.player_box').droppable({        
        receiveHandler: function(ui) {            
            var html = $(this).html();
            
            var roleToAssign = this.attr('data-role');

            var ui_data = ui.item.data('data-player');
            var this_data = this.data('data-player');


            setTimeout(function(){
                $(this).html(html);
            },100)
            if(ui.item.hasClass('empty'))
                return;   
            if(ui.item.closest('.fieldButtoon').length){
                if(this.hasClass('empty'))
                    return;
                ui.item.css('z-index','999');
                assignCaptain(this.data('fantasyId'),this);
                return;
            }         
            if(ui.item.closest('.searchPage').length){       
                var playerObj = ui.item.find('.player_box').data('data-player');               
                if(this.hasClass('empty')){
                    if( playerObj.playerRoles.indexOf(roleToAssign)>-1){
                        insertPlayer($(this),playerObj,false);
                        //this.removeClass('empty');
                    }else{
                        showError('Player doesn\'t has '+roleToAssign+' role!','Player Assign Error');
                    }   
                }else{
                    showError('Position already assigned!','Player Assign Error');
                }    
            }else if(ui.item.closest('.mainField').length){
                if( ui_data.fantasyPlayerRoles.indexOf(roleToAssign)>-1){
                    swapPlayerInField(this,ui.item);
                }else{
                        showError('Player doesn\'t has '+roleToAssign+' role!','Player Assign Error');
                    }   
            }else{               
                    swapPlayerInSameField(this,ui.item,this_data,ui_data);               
            }
            
           
            
        }
    }).on('droppable:over', function(e, ui) {
       
        if(ui.item.closest('.addTeamUl').length){           
            ui.item.css('z-index','99');
        } 
        if(ui.item.closest('.mainField').length){
            $('.mainField').css('z-index','');
            ui.item.css('z-index','99');
        }  
        if(ui.item.closest('.fieldButtoon').length){
           ui.item.css('z-index','999'); 
        }    

    }).on('droppable:drop', function(e, ui) {
        if(ui.item.closest('.benchField').length){            
            //$('.onTheBench').css({visibility:'visible'})      
        }else if(ui.item.closest('.addTeamUl').length){
            /*$('#searchPage').css({visibility:'visible'});
            $('#searchPage').toggle();*/
        }
        ui.item.css({visibility:''}); 
        ui.item.css('z-index','');

    });
    $('#assignCaptain').draggable({
      /*receiveHandler: function(ui) {
        var droppable = this;        
        assignCaptain(ui.item.data('fantasyId'),ui.item);
      }*/
    })

}
function disable_drag(){
    $('.mainField div.player_box').draggable({disabled: true});
    $('.mainField div.player_box').droppable({disabled: true});
    $('.benchField div.player_box').draggable({disabled: true});
    $('.benchField div.player_box').droppable({disabled: true});
    $('#assignCaptain').draggable({disabled: true});
    $('#removePlayer').droppable({disabled: true});
}
function swapPlayerInSameField(player1,player2,data1,data2){
    
    var roleToAssign1 = player1.attr('data-role');  
    var roleToAssign2 = player2.attr('data-role');     
    if(player1.hasClass('empty') && player2.hasClass('empty')){
        //doo nothing
    }else if(player1.hasClass('empty')){                
        if(checkPlayerRole(data2.fantasyPlayerRoles,roleToAssign1)){
            player1.removeClass('empty')
            swapPlayerData(player1,data2);   
            replacePlayerWithEmpty(player2);
        }else{ 
            showError('Player doesn\'t has '+roleToAssign1+' role!','Player Assign Error'); 
        }                           
    }else if(player2.hasClass('empty')){             
        if(checkPlayerRole(data1.fantasyPlayerRoles,roleToAssign2)){
            player2.removeClass('empty')
            swapPlayerData(player2,data1);   
            replacePlayerWithEmpty(player1);
        }else{ 
            showError('Player doesn\'t has '+roleToAssign2+' role!','Player Assign Error'); 
        }    
    }else{ 

        if(checkPlayerRole(data1.fantasyPlayerRoles,roleToAssign2) && checkPlayerRole(data2.fantasyPlayerRoles,roleToAssign1)){
            if($('.player_tag').find('span.captainIcon').length>0){
                var prevCaptainObj = $('.player_tag').find('span.captainIcon')[0];
                $('.player_tag').find('span.captainIcon').remove();
            }
            swapPlayerData(player1,data2);
            
            var ui_html = player2.html();
            player2.html('');
            setTimeout(function(){
                player2.html(ui_html);
                swapPlayerData(player2,data1);
            },200)
        }else{
            showError('Player role doesn\'t match!','Player Assign Error'); 
        }
             
    }
}

function checkPlayerRole(roleArr, role){
    if(roleArr.indexOf(role)>-1)return true;
    else return false;
}
function swapPlayerInField(playerOnBench,PlayerOnField){
    var playerBench = playerOnBench.data('data-player');
    var playerField = PlayerOnField.data('data-player');
    

    if(playerOnBench.hasClass('empty')){ 

        playerOnBench.removeClass('empty'); 
        playerField.isPrimary = false;
        swapPlayerData(playerOnBench,playerField);
        replacePlayerWithEmpty(PlayerOnField);

    }else if(PlayerOnField.hasClass('empty')){
        ///updatePlayerPosition(playerBench.id,playerBench);

        PlayerOnField.removeClass('empty'); 
        playerBench.isPrimary = true;
        swapPlayerData(PlayerOnField,playerBench);
        replacePlayerWithEmpty(playerOnBench);
      
    }else{    
        //updatePlayerPosition(playerBench.id,playerBench);
        //updatePlayerPosition(playerField.id,playerField);        
       
        playerField.isPrimary = false;
        swapPlayerData(playerOnBench,playerField);
        
        playerBench.isPrimary = true;
        swapPlayerData(PlayerOnField,playerBench);

    }
  
}
function swapPlayerData(player,data){
    player.find('.playerImg').html('<img src="playerImg/afl/compitition_1/player2.png">');
    player.find('.name').html(data.lastName+' '+data.firstName);
   
    if(player.data('data-role') != data.fantasyRoleName){
        data.fantasyRoleName = player.attr('data-role');        
    }
    if(data.isCaptain){
        player.find('.player_tag').append('<span class="captainIcon"></span>');
    }
    player.data('data-player',data);    
    player.data('fantasyId',data.id);
    updateFantasyPlayer(data);    
}
/*function updatePlayerPosition(player_id){
   
    serviceObj.toggleField(player_id,function(res){
        console.log(res +"  "+player_id);
    })    
  
}*/
function updateFantasyPlayer(data){
    var postObj = {
        Id:data.id,
        FantasyTeamId:app.globals.team_id,
        IsCaptain:data.isCaptain, 
        IsPrimary: data.isPrimary , 
        FantasyRoleName:data.fantasyRoleName
    }
    serviceObj.updateFantasyPlayer(postObj,function(res){
        console.log(res);
        console.log(data.firstName+' '+data.lastName +' added');
        console.log(data);
    }) 
}
function insertPlayer(player_in_field,player_to_insert,IsPrimary){

    if(app1.globals.fantasyTeam.fantasyPlayers.length > 0 ){
        if(checkIfPlayerAlreadyAdded(player_to_insert.id)){            
            showMessage('Player already exists!','Error');
            return;//player already exist
        }
    }

    var player = '';
    player_in_field.find('.playerImg').html('<img src="playerImg/afl/compitition_1/player2.png">');
    player_in_field.find('.player_name').find('.name').html(player_to_insert.lastName+' '+player_to_insert.firstName);
    player_in_field.removeClass('empty');

    postObj = {
        FantasyTeamId:app.globals.team_id, 
        PlayerId : player_to_insert.id, 
        FantasyRoleName: player_in_field.attr('data-role'), 
        IsPrimary:IsPrimary
    };

    serviceObj.insertPlayer(postObj,function(response){
        console.log(response);
        response.fantasyPlayerRoles = player_to_insert.playerRoles;
        response.lastName = player_to_insert.lastName;
        response.firstName = player_to_insert.firstName;
        player_in_field.data('data-player',response);        
        player_in_field.data('fantasyId',response.id);
        var is_injured = checkDate(response.maximumEstimatedReturnDate);
        if(is_injured == 1 || is_injured == 0){
            player_in_field.find('.player_tag').append('<span class="injuryIcon"></span>');
        }
        app1.globals.fantasyTeam.fantasyPlayers.push(response);
        updateTotalRemainingSalary(response.playerSalary);
    });
    
}
function updateTotalRemainingSalary(playerSalary){
    if(!playerSalary){
        playerSalary = 0;
    }
    var TeamValue = 0;
    var RemainingSalary = 0;
    if(typeof app1 != "undefined"){
        TeamValue = app1.globals.fantasyTeam.TeamValue + playerSalary;
        RemainingSalary = app1.globals.fantasyTeam.RemainingSalary - playerSalary;
        app1.globals.fantasyTeam.RemainingSalary = RemainingSalary;    
    }

    $('.topHeader span.remaining_salary label').html(RemainingSalary);
    $('.topHeader span.team_value label').html(TeamValue);
}
function checkIfPlayerAlreadyAdded(playerId){
    var result = $.grep(app1.globals.fantasyTeam.fantasyPlayers, function(e){ return e.playerId == playerId; });
    if(result.length > 0)return true;//player found
    return false;
}
  
function assignCaptain(fantasyPlayerId,player){
    var obj = player.data('data-player');
    var postObj = {
        Id:obj.id,
        FantasyTeamId:app.globals.team_id,
        IsCaptain:true, 
        IsPrimary: obj.isPrimary , 
        FantasyRoleName:obj.fantasyRoleName
    }
    ajaxloader.show();
    serviceObj.updateFantasyPlayer(postObj,function(response){
        console.log(response);
        if($('.player_tag').find('span.captainIcon').length>0){
            var prevCaptainObj = $('.player_tag').find('span.captainIcon')[0];
            
            playerObj = $( prevCaptainObj)
              .closest( ".player_box" )
            $('.player_tag').find('span.captainIcon').remove();
            prevPlayerData = playerObj.data('data-player');
            prevPlayerData.isCaptain = false;
            playerObj.data('data-player',prevPlayerData);
        }
        player.find('.player_tag').append('<span class="captainIcon"></span>');
        obj.isCaptain = true;
        player.data('data-player',obj);
        console.log(player.data('data-player'));
        ajaxloader.close();
    });
}
function initHomepageSwipe(){
    $('#home .footerBar').on('swipeup',function(e){
        $('#onTheBench').animate({bottom:'0px'});
    });
    $('#onTheBench .benchback').on ('swipedown',function(e){
        $('#onTheBench').animate({bottom:'-60%'});
    });
    $('#onTheBench .benchback').on ('swipeleft',function(e){
        $('#onTheBench').animate({bottom:'-60%'});
    });
    $('#onTheBench .benchback').on ('swiperight',function(e){
        $('#onTheBench').animate({bottom:'-60%'});
    });
}
function replacePlayerWithEmpty(player,is_removed){
    $(player).addClass('empty');
    $(player).find('.playerImg').html('<img src="img/player-blank.jpg">');
    $(player).find('span.name').text('');
    $(player).find('span.captainIcon').remove();
    $(player).removeData('data-player');
    $(player).removeData('fantasyId');
    if(is_removed){
        app1.globals.fantasyTeam.fantasyPlayers = $.grep(app1.globals.fantasyTeam.fantasyPlayers,
                   function(o,i) { return o.id === player.data('fantasyId'); },
                   true);
    }
    
}
function getRoundVal($this){
   // Slider.slide(parseInt($this.value),700);
   var selectedRound = parseInt($this.value);
    getPlayerStats(selectedRound);
    var slideNo = $this.data('index');
    Slider.slide(slideNo,700);
}
function drawTeamPlayerStat(){
    var roundWiseDetails = app1.globals.fantasyTeam.roundWiseDetails;
    var selectedRound ;
    var selectList = $('.contentPlayerStats #roundDdl'); 
    var ul = '';
    $('.contentPlayerStats #roundDdl').find('option').remove();        
    roundWiseDetails.forEach(function(row,index) {
        if(index==0){
            selectedRound = row.roundId; 
            ul += '<li class="active"></li>';      
        }else{
            ul += '<li></li>';
        }
        $('<option/>', {
            text: row.roundName,
            value: row.roundId,
            data: {
              index:index
            }
        }).appendTo(selectList);
    });
    $('#team_n_payerStats .pagination ul').append(ul);
    $('.swipe-wrap').html('');
        var html  = '';
    for (var slide =0; slide<roundWiseDetails.length; slide++) {
        roundObj = roundWiseDetails[slide];
        html += '<div data-id="'+roundObj.roundId+'">';
        html += '<div id="accordion_'+slide+'" class="verticalaccordion">' ;
        //html += '<p>We hope that this tool will prove useful for people who are not very familiar with the HTML and CSS. So if you need a table for your website or blog (Wordpress, Drupal or any platform which allows to put html code inside posts) it should work just fine. Our HTML table generato</p>';
        html += '<ul id="acul_'+roundObj.roundId+'">';
        html += '</ul>';
        html +='</div>'
        html +='</div>'
    }
    $('.swipe-wrap').css('opacity','0');
    $('.swipe-wrap').html(html);
}
function showTeamPlayerStat(){    
    getPlayerStats($('.contentPlayerStats #roundDdl').val(),0);
    setTimeout(function(){
        Slider = $('#slider').Swipe({
            continuous: false,
            callback: function(index, elem) {},
            transitionEnd: function(index, elem) {
                var roundid = parseInt($(elem).attr('data-id'));
                $('#roundDdl').val(roundid);
                console.log('transitionEnd=========='); 
                var ul  = $('#accordion_'+index).html();
                if(!$('#accordion_'+index +' li').length)
                    getPlayerStats(roundid);

                $('#accordion_'+index).html('');
                $('#accordion_'+index).html(ul);
                var li = $('#team_n_payerStats .pagination ul li').removeClass('active');
                $(li[index]).addClass('active');
                setTimeout(function(){
                    callAcordion('#accordion_'+index);  
                },200)       
            }
        }).data('Swipe');        
     $('.swipe-wrap').css('opacity','1');  
     
    },300)    

    jQT.goTo('#team_n_payerStats','slideleft');
    

    $(".contentPlayerStats #roundDdl").change(function () {
        var selectedRound = parseInt($('#roundDdl').val());
        var slideNo = $(this).find('option:selected').data('index');
        getPlayerStats(selectedRound,slideNo);
        Slider.slide(slideNo,700);
    });
    
}
function getPlayerStats(roundId,slideNo){
    if(!roundId)
        roundId = app1.roundLock.currentRoundId;
    var date = new Date();
    var postObj = {
        year:date.getFullYear(),
        SeasonRoundId:roundId
    }
    ajaxloader.show();
    serviceObj.getPlayerStats(postObj,function(res){
        if(res.teamListWithPlayerStats && res.teamListWithPlayerStats!= null)
            gotoTeam_n_payerStats(res.teamListWithPlayerStats,roundId,slideNo);
        else
            showMessage('No data found!','Player Stat');
        ajaxloader.close();
    });
}
function gotoTeam_n_payerStats(teamListWithPlayerStats,roundId,slideNo){    
   var html = '';
    for (var i = 0; i < teamListWithPlayerStats.length; i++) {
        var obj = teamListWithPlayerStats[i];
        html += '<li class="ac_item">';
        html += '<h3>'+obj.teamName+'</h3>';
        html += '<span></span>';
        html += '<div>'
        html += '<table cellpadding="0" cellspacing="0">'
            for(k=0;k<obj.playerStatList.length; k++){
                player = obj.playerStatList[k];
                html += '<tr><td>'+player.firstName+', '+player.lastName+'</td><td>'+player.gm+'</td><td>'+player.ki+'</td><td>'+player.hb+'</td><td>'+player.mk+'</td><td>'+player.tk+'</td><td>'+player.ff+'</td><td>'+player.fa+'</td><td>'+player.ho+'</td><td>'+player.gl+'</td><td>'+player.bh+'</td></tr>';
            }
                    
        html += '</table>';
        html += '</div>';
        html += '</li>';
    }  
    $('ul#acul_'+roundId).html(html);
    callAcordion('#accordion_'+slideNo);  
    ajaxloader.close();
}
function callAcordion(accordionClass){
    $(accordionClass+' li.ac_item').click(function(){
        $this = $(this)
        if($(this).hasClass('hoverItem')){
            $(this).removeClass('hoverItem');
        }
        else{
            $(this).addClass('hoverItem');
        }
        $.each( $(accordionClass+' li.ac_item'), function( key, value ) {
            /*alert( key + ": " + value );*/
            if(key!= $this.index()){
                console.log('doesnt match');
                $(this).removeClass('hoverItem');
            }
        });
    })
}   
function showTeamDetailPage(){
    if(typeof app1 != "undefined"){

    }else{
        showMessage('No team selected! Select a team first.','Team Detail Page');
        return;        
    }

    var roundWiseDetails = app1.globals.fantasyTeam.roundWiseDetails;
    var selectedRound ;
    var selectList = document.getElementById('roundDDL'); 
    $('#roundDDL').find('option').remove();        
    roundWiseDetails.forEach(function(row,index) {
        //var index = Object.keys(roundWiseDetails).indexOf(key);
        if(index==0)
            selectedRound = row.roundId;
        var option = document.createElement('option');
        option.value = row.roundId;
        option.text = row.roundName;
        selectList.appendChild(option); 
    });
   
    showTeamRoundDetails(selectedRound);
    $('#teamDetailPage').animate({top:'0px'});
    $("#roundDDL").change(function () {
        var selectedRound = parseInt($('#roundDDL').val());
        showTeamRoundDetails(selectedRound);
    });
}
function showTeamRoundDetails(roundId){
    $('.round_info').remove();
    var totalround = 0;
    var maxScore = -1;
    var minScore = 1000000000000000000000;
    var roundWiseDetails = app1.globals.fantasyTeam.roundWiseDetails;
    roundWiseDetails.TotalTeamScore = 0;
     
    for(i=0;i<roundWiseDetails.length;i++){
        var row = roundWiseDetails[i];
        if( row.roundPoints > maxScore)
            maxScore = row.roundPoints;
        if( row.roundPoints < minScore)
            minScore = row.roundPoints;

        totalround++;
        roundWiseDetails.TotalTeamScore += row.roundPoints;
        if(row.roundId == roundId){
            roundDetails = row;
            break;
        }
    }; 
    roundDetails.avgPoints = roundWiseDetails.TotalTeamScore/totalround;
    var html = '';    
    html += '<li class="round_info"><span>REMAINING SALARY</span> <span>$'+roundDetails.remainingSalary+'</span></li>'
            +'<li class="round_info"><span>TEAM VALUE</span><span>$'+roundDetails.teamValue+'</span></li>'
            +'<li class="round_info"><span>TOTAL TEAM POINTS</span><span>'+roundWiseDetails.TotalTeamScore+'</span></li>'
            +'<li class="round_info"><span>ROUND 12 POINTS</span><span>$'+roundDetails.roundPoints+'</span></li>'
            +' <li class="round_info"><span>AVG POINTS/ROUND</span><span>'+roundDetails.avgPoints.toFixed(2)+'</span></li>'
            +'<li class="round_info"> <span>HIGH SCORE</span><span>'+maxScore+'</span></li>'
            +'<li class="round_info"><span>LOW SCORE</span><span>'+minScore+'</span></li>'
    $('#fantasyTeamScore').append(html);
}
function removeTeamDetailPage(){
    $('#teamDetailPage').animate({top:'-65%'});   
}
function showBenchPage(){
    $('.onTheBench').css({visibility:'visible'});
    $('#onTheBench').animate({bottom:'0px'});
}
function removeBenchPage(){
    $('#onTheBench').animate({bottom:'-60%'});
}
function gotoInjury(){
    jQT.goTo('#injuryList','slideleft');
}
function goBack(){
    jQT.goBack();
}
function showAllLeaguePage(){
    jQT.goTo('#AllleaguePage','fade');
}
function showPlayerDetail(player_data){
    var html = '';
   /* html += '<ul>
                <li class="ac_item">
                    <div class="titleCont">
                        <div class="teamlogo">
                            <div><img src="img/Sydney/logo.jpg"></div>
                            <span>FW</span>
                        </div>
                        <div class="player_img"><img src="img/Sydney/ROSE James_t.png"></div>
                        <div class="player_name">
                            <div class="name">11.MITCHELL Sam</div>
                            <span><img src="img/US-dollar.png"><label>250,200</label></span>
                        </div>
                        <div class="round_no">
                            <div>82</div>
                            <div style="color:#ccc;">100.56</div>
                        </div>
                    </div>
                    <div class="titleOnOver">
                        REASON
                    </div>
                    <span class="arrow_icn"></span>
                    <div class="ac_content">
                        <div class="titleCont">
                            <div class="teamlogo">
                                <div><img src="img/Sydney/logo.jpg"></div>
                                <span>FW</span>
                            </div>
                            <div class="player_img"><img src="img/Sydney/ROSE James_t.png"></div>
                            <div class="player_name">
                                <div class="name">11.MITCHELL Sam</div>
                                <span><img src="img/US-dollar.png"><label>250,200</label></span>
                            </div>
                            <div class="round_no">
                                <div>82</div>
                                <div style="color:#ccc;">100.56</div>
                            </div>
                        </div>
                        
                        <ul class="teamDetailUl">
                            <li><span>round 11 price change</span> <span>$10,000</span></li>
                            <li><span>overall price change</span><span>$10,000</span></li>
                            <li><span>round 11 ranking</span><span>$10,000</span></li>
                            <li><span>round 11 score</span><span>$10,000</span></li>
                            <li><span>game played</span><span>$10,000</span></li>
                            <li><span>HIGH SCORE</span><span>$10,000</span></li>
                            <li><span>LOW SCORE</span><span>$10,000</span></li>
                        </ul>
                    </div>
                </li>                            
                        </ul>'*/
    ajaxloader.show();

    serviceObj.getPlayerDetails(player_data.playerId,function(result){
        console.log(result);
        $('#player_accordion ul').html('');
        if(result){
           // if(result.length){
               // result.forEach(function(player) {
                    player = result;
                    var player_name = player.lastName+' '+player.firstName
                    var player_roles = '';
                    /*if( player.playerRoles.length <= 0)
                        player.playerRoles = ["FW","MF"];
                    console.log(player.playerRoles);*/
                    player.playerRoles.forEach(function(role){
                       player_roles += '<span class="role_'+role+'">'+role+'</span>';
                    });
                    var titleCont = $('<div/>')
                                    .addClass('titleCont');
                    //'<div class="titleCont ">'
                    var html = '<div class="teamlogo">'
                                        +'<div><img src="img/Sydney/logo.jpg"></div>'
                                        +player_roles
                                    +'</div>'
                                    +'<div class="player_img"><img src="img/Sydney/ROSE James_t.png"></div>'
                                    +'<div class="player_name">'
                                        +'<div class="name">'+player.jerseyNo+'. '+player_name+'</div>'
                                        +'<span><img src="img/US-dollar.png"><label>'+player.totalValue+'</label></span>'
                                    +'</div>'
                                    +'<div class="round_no">'
                                        +'<div>'+player.avgPerRound+'</div>'
                                        +'<div style="color:#ccc;">'+player.totalScore+'</div>'
                                    +'</div>'                                    
                               // +'</div>'
                    titleCont.html(html);   
                    var html2 = '<div class="titleOnOver">'
                                    +'REASON</div>'
                                +'<span class="arrow_icn"></span>'
                                +'<div class="ac_content">' 
                                    +'<ul class="teamDetailUl">'
                                        +'<li><span>round 11 price change</span> <span>$10,000</span></li>'
                                        +'<li><span>overall price change</span><span>$10,000</span></li>'
                                        +'<li><span>round 11 ranking</span><span>$10,000</span></li>'
                                        +'<li><span>round 11 score</span><span>$10,000</span></li>'
                                        +'<li><span>game played</span><span>$10,000</span></li>'
                                        +'<li><span>HIGH SCORE</span><span>$10,000</span></li>'
                                        +'<li><span>LOW SCORE</span><span>$10,000</span></li>'
                                    +'</ul>'
                                +'</div>'

                    $('#player_accordion ul').append('<li class="ac_item"></li>');
                    $('#player_accordion ul li.ac_item').append(titleCont);
                    $('#player_accordion ul li.ac_item').append(html2);
                    $('#player_accordion ul li.ac_item div.ac_content').append(titleCont.clone());
               // });
                
           // }    
        }
        callAcordion('#player_accordion'); 
        ajaxloader.close();
    });
    
    jQT.goTo('#player_detail','pop');
}
function showHome(team){
    clearField();
    if(team)
        showPlayers(team.id,team.teamSalary,team.name);  


    jQT.goTo('#home','slideleft');
    var userinfo = JSON.parse(getStorage('userinfo'));
    $('#settings .namingHeader').find('.email').html(userinfo.email);

}
function clearField(){

    $('.mainField').find('.field_row').remove();
    $('.benchField').find('.field_row').remove();
    
}
function showPlayers(team_id,team_salary,team_name){
    $('.off-canvas-submenu-call').find('li.selected').removeClass('selected');
    app1 = new App(); //init new instance of class app;
    var team = $("li.team_li").find("[data-team-id="+team_id+"]");
    team.closest('li.team_li').addClass('selected');
    team.closest('.off-canvas-submenu-call').find(".off-canvas-submenu").slideToggle('fast');
    team.closest('.off-canvas-submenu-call').addClass('arrowUp');
    var sport_name = team.closest('.off-canvas-submenu-call').attr('data-sport-name');
   
    $('.mainField .navbar .clientName').html(sport_name+' &nbsp | &nbsp '+team_name);

    app.globals.team_id = team_id;
    clearField();
    ajaxloader.show();
    serviceObj.getTeamDetails(team_id,function(res){
        if(!res.roundWiseDetails.length)
            res.roundWiseDetails =  roundWiseDetails;
        res.teamSalary = team_salary;
        app1.globals.fantasyTeam = res;
        console.log(res);
        drawFantasyTeamField(res.fantasyPlayers);
        getRoundLockout();
        ajaxloader.close();
    });
    
    $('.allTeamPage').removeClass('slideLeft');                   
}
function getRoundLockout(){
    serviceObj.getRoundLockout(function(res){
        app1.roundLock = res;
        
        $('.roundInfo .round_no').html(res.currentRound);
        $('.roundInfo .date').html(new Date(res.start).format("h:i A, D d, M"));
        if(checkDate(res.start) == 1){
            console.log('countDown for coming round ');
            countDown(res.start);            
        }else if(checkDate(res.nextRoundDate) == 1){
            console.log('countDown for next round '+ new Date(res.nextRoundDate));
            countDown(res.nextRoundDate);
        }else{
            console.log('not valid round dates');
            var clock = document.getElementById("elapsed_time");
            clock.innerHTML = "No coming round!";
        }       
    });
}
function checkIfGameLock(rouncLockObj){
    var date = new Date();
    var stratLock = dateAdd(rouncLockObj.start, 'minute', -5);
    var endLock = dateAdd(rouncLockObj.start, 'day', 1)
    if(checkDate(date,stratLock) == 1 && checkDate(date,endLock) == -1){
        app1.lockgame = true;
    }else{
        app1.lockgame = false;
    }
}
function drawFantasyTeamField(fantasyPlayers){
    var totalPlayerSalary = 0;
    $('.mainField').append(drawField(app.globals.field.mainField));
    $('.benchField').append(drawField(app.globals.field.onTheBench));

    fantasyPlayers.forEach(function(player){
        totalPlayerSalary += player.playerSalary;
        if(player.isPrimary){
            pushInFantasyField('mainField',player);
        }else{//onthebench
            pushInFantasyField('benchField',player);
        }        
    });
    if( !app1.lockgame){
        drag_n_drop();
    }else{
        disable_drag();
    }
    var RemainingSalary = app1.globals.fantasyTeam.teamSalary - totalPlayerSalary;
    app1.globals.fantasyTeam.TeamValue = totalPlayerSalary;
    app1.globals.fantasyTeam.RemainingSalary = RemainingSalary;
    updateTotalRemainingSalary();

    $('.player_box').doubleTap(function(){
        $(this).removeClass('selected')
        showPlayerDetail($(this).data('data-player'));
    });
    function pushInFantasyField(field,player){
        var count = app1.globals.fieldSize[field][player.fantasyRoleName];
            var playerOnFieldByRole = app1.globals.fantasyField[field][player.fantasyRoleName];
            if(playerOnFieldByRole.length < count){
                playerOnFieldByRole.push(player);
                drawPlayer(field,player)
            }
    }
}
function submitLogin(){
    var formData = getFormData($('#loginForm'));
    console.log(formData);
    if(formData.competitionId && formData.email && formData.password){
        ajaxloader.show();
        setStorage('clientId',formData.competitionId);
        setStorage('userinfo',JSON.stringify(formData));
        serviceObj.setHeader(formData);
        serviceObj.getAllteamList(formData.competitionId,function(allteamArray){
            ajaxloader.close();
            generateAllteamList(allteamArray,formData.competitionId); 
        })    
    }else{
        showError('All fields are required.','Login');
    }
    
}
function generateAllteamList(teamList,clientId){
    var defaultTeamSelect = '';
    var html = '';
    if(clientId == 2){
        $('.clientInfo div.name').html("Default(CT)");
    }else{
        $('.clientInfo div.name').html("NAB");
    }
    for(i=0; i<teamList.length; i++){
        var sport = teamList[i];
        if(sport.shortName =="CT"){
            defaultTeamSelect = sport;
        }
        html += '<li class="off-canvas-submenu-call" data-sport-id="'+sport.id+'" data-sport-name="'+sport.name+'" >'+sport.name+'<span></span>';
        html += '<ul class="off-canvas-submenu">';
        html += '<li><a href="javascript:showAddTeam('+sport.id+');"><div class="addTeam"><img src="img/addIcon.png"></div></a></li>';
        for(j=0; j<sport.fantasyTeams.length; j++){ 
            var sportTeam = sport.fantasyTeams[j];
            html += '<li class="team_li"><a href="javascript:showPlayers('+sportTeam.id+','+sportTeam.teamSalary+',\''+sportTeam.name+'\');" data-team-id="'+sportTeam.id+'">'+sportTeam.name+'</a></li>';                
        }
        html += '</ul>';
        html += '</li>';
    }
    $('#allTeamPage ul.off-canvas-list').html(html);
    $(".off-canvas-submenu").hide();
    $(".off-canvas-submenu-call").click(function() {                  
        $(this).toggleClass('arrowUp');
        $(this).find(".off-canvas-submenu").slideToggle('fast');
    });
    $('ul.off-canvas-submenu li.team_li').on('swiperight',function(e){
        this.remove();
        team_id = $(this).find('a').attr('data-team-id');
        serviceObj.deleteTeam(team_id,function(res){
            console.log(res);
            if(typeof app1 != 'undefined' && app1.globals.fantasyTeam.teamId == team_id){
                clearField();
                $('.mainField .navbar .clientName').html('  ');
                updateTotalRemainingSalary();
                delete app1;
            }
        })
    }); 
    if(defaultTeamSelect.fantasyTeams && defaultTeamSelect.fantasyTeams.length){
        showHome(defaultTeamSelect.fantasyTeams[0]);     
    }else{
        showHome();
    }

}
function showAddTeam(sportId){
    var html ='';
    html = '<div id="addTeam">'
               +'<form id="addTemaForm">'
                    +'<ul class="edit">'
                        +'<li><label>Team Name</label>'
                            +'<input type="text" name="team_name" placeholder="Enter your team name" id="team_name" value="" />'
                        +'</li>'
                        +'<li><a href="javascript:addTeam();" class="btnContainer"><span class="btn">submit</span></a></li>'
                       +'</ul>'
                +'</form>'
            +'</div>'
    $.pgwModal({
        title: 'Add Team Page',
        content:html,
        maxWidth: 800,
        modalData : {
            sport_id : sportId
        }
    });
}
function addTeam(){
    var formData = getFormData($('#addTemaForm'));
    var postObj ={
        Name:formData.team_name,
        FantasySportId : $.pgwModal('getData').sport_id,
        competitionId : app.globals.competitionId
    }
    ajaxloader.show();
    serviceObj.addTeam(postObj,function(response){
        showMessage('Team added successfully','Add Team');
        var team = $("ul.off-canvas-list").find("[data-sport-id='" + response.fantasySportId + "']");
        team.find('ul').append('<li class="team_li"><a href="javascript:showPlayers('+response.id+','+response.teamSalary+',\''+response.name+'\');"'
            +' data-team-id="'+response.id+'">'+response.name+'</a></li>')
        ajaxloader.close(); 
        $.pgwModal('close');       
        $('ul.off-canvas-submenu li.team_li').on('swiperight',function(e){
            this.remove();
            team_id = $(this).find('a').attr('data-team-id');
            serviceObj.deleteTeam(team_id,function(res){
                console.log(res);
                if(typeof app1 != 'undefined' && app1.globals.fantasyTeam.teamId == team_id){
                    clearField();    
                    $('.mainField .navbar .clientName').html('  ');                
                    delete app1;
                    updateTotalRemainingSalary();
                }
            })
        });   
    })
   
}
function showSearchPage(){
    $('#searchPage').css('visibility','visible');
    //jQT.goTo('#searchPage','pop');

}
function searchPlayer(){
    ajaxloader.show();
    var formData = getFormData($('#searchPlayerForm'));
    var postObj ={
        TeamName:formData.team_name,
        PlayerName : formData.player_name,
        competitionId:app.globals.competitionId
    }
    serviceObj.searchPlayer(postObj,function(result){
        //console.log(result);
        $('ul.addTeamUl li.searchedResult').html('');
        if(result){
            if(result.length > 0){
                result.forEach(function(player) {
                    //console.log(entry);
                    var player_name = player.lastName+' '+player.firstName
                    var player_roles = '';
                    /*if( player.playerRoles.length <= 0)
                        player.playerRoles = ["FW","MF"];
                    console.log(player.playerRoles);*/
                    player.playerRoles.forEach(function(role){
                       player_roles += '<span class="role_'+role+'">'+role+'</span>';
                    });
                    var titleCont = $('<div/>')
                                    .addClass('titleCont');
                    //'<div class="titleCont ">'
                    var html = '<div class="teamlogo">'
                                        +'<div><img src="img/Sydney/logo.jpg"></div>'
                                        +player_roles
                                    +'</div>'
                                    +'<div class="player_img"><img src="img/Sydney/ROSE James_t.png"></div>'
                                    +'<div class="player_name">'
                                        +'<div class="name">'+player.jerseyNo+'. '+player_name+'</div>'
                                        +'<span><img src="img/US-dollar.png"><label>'+player.totalValue+'</label></span>'
                                    +'</div>'
                                    +'<div class="round_no">'
                                        +'<div>'+player.avgPerRound+'</div>'
                                        +'<div style="color:#ccc;">'+player.totalScore+'</div>'
                                    +'</div>'                                    
                               // +'</div>'
                    titleCont.html(html);
                    var player_box = $('<div/>')
                        .addClass('player_box')
                        .data('data-player',player)
                        .appendTo(titleCont);
                    $('<div class="playerImg"><img src="playerImg/afl/compitition_1/player2.png"></div>').appendTo(player_box);
                    var player_name = $('<div/>')
                                    .addClass('player_name')
                                    .appendTo(player_box)
                    $('<span class="role">FW</span>'
                        +'<span class="name">'+player_name+'</span>').appendTo(player_name);


                    //$('#myElement').data('key',jsonObject)
                    $('ul.addTeamUl li.searchedResult').append(titleCont);
                });
                $('ul.addTeamUl .titleCont').draggable({
                    clone: function() { 
                        var item = this.clone()/*.find('.player_box')*/ ;
                        item.addClass('cloneClass');
                        item.css({visibility:'visible'}); 
                       /* item.show();*/
                        return item;
                    }
                }).on('draggable:start',function(event, ui){
                    $('#searchPage').css({visibility:'hidden'});
                    //jQT.goTo('#home','fade');
                }).on('draggable:stop',function(event, ui){
                    $('.cloneClass').remove();
                });
            }    
        }
        
        ajaxloader.close();
    });
}

function drawField(field){
    var prevRole = ''
    var rows  = '';
    var className = '';
    field.forEach(function(row,i){
        if(i==0){
            prevRole = row.role;
        }else{
            if(row.role != prevRole){
                className = 'addMargin';
                prevRole = row.role;
            }
            else className = '';    
        }
        

        rows += '<div class="field_row '+className+'">';
        for(i=0; i<row.count; i++){
            rows += '<div class="player_box empty '+row.role+'" data-role="'+row.role+'">'
                        +'<div class="playerImg"><img src="img/player-blank.jpg"></div>'
                        +'<div class="player_name">'
                            +'<span class="role role_'+row.role+'">'+row.role+'</span>'
                            +'<span class="name"></span>'
                        +'</div>'
                        +'<div class="player_tag">'
                       /* +'<span class="injuryIcon"></span><span class="captainIcon"></span>'*/
                       +'</div>'
                    +'</div>'
        }
        rows += '</div>';
    });
    return rows;
    
}
function drawPlayer(field,player){
    if(player.fantasyPlayerRoles.length <= 0)
        player.fantasyPlayerRoles = ["FW","MF"];
    var playerObj = $('.'+field).find('.field_row').find('.player_box.empty.'+player.fantasyRoleName);
    if(playerObj.length>0){
        $(playerObj[0]).addClass(player.fantasyRoleName).removeClass('empty');
        $(playerObj[0]).find('span.name').html(player.lastName+' ' +player.firstName);
        $(playerObj[0]).find('.playerImg').html('<img src="playerImg/afl/compitition_1/player2.png">');
        $(playerObj[0]).data('fantasyId',player.id);
        $(playerObj[0]).data('data-player',player);
        var is_injured = checkDate(player.maximumEstimatedReturnDate);
        if(is_injured == 1 || is_injured == 0){
            $(playerObj[0]).find('.player_tag').append('<span class="injuryIcon"></span>');
        }
        if(player.isCaptain){
            $(playerObj[0]).find('.player_tag').append('<span class="captainIcon"></span>');
        }
    }

}

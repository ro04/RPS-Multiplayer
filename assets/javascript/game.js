$(document).ready(function () {
    gameRef = firebase.database().ref().child('Players');

    //Initialize Variables
    var numPlayers = 2;
    var playerName = "";
    var playerWins = 0;
    var playerLoses = 0;

    //Managers whose joining the game
    PlayingState = {
        Watching: 0,
        Joining: 1,
        Playing: 2
    };

    $("form").submit(function(e) {
        var playingState = PlayingState.Watching;
        e.preventDefault();
        playerName = $("#user").val();
        console.log(playerName);
        waitingToJoin(playingState);
    });
 

    //var controller = function() {
        //createPlayer();
        //waitingToJoin(playingState);  //>player is trying to join the game.
    //};

    var syncToFirebase = function(playerNum) {
        //for(var i = 0; i < numPlayers; i++) {
            gameRef.child('player' + playerNum + '/online').set({
                Name: playerName,
                Wins: playerWins,
                Loses: playerLoses
             });

            $("#player-one-text").remove();
            $("#user").remove();
            $("#submit-btn").remove();

            
        }
    //};

    var waitingToJoin = function(playingState) {
        // Listen on "online" location for player 0 
        gameRef.child("player0/online").on("value", function (snapshot){
            var value = snapshot.val();
            if(value === null && playingState === PlayingState.Watching) {
                console.log(snapshot.val());
                tryingToJoin(0);
            }
        });

        // Listen on "online" location for player 1
        this.gameRef.child("player1/online").on("value", function (snapshot){
            var value = snapshot.val();
            if(value === null && playingState === PlayingState.Watching) {
                console.log(snapshot.val());
                tryingToJoin(1);
            }
        });
    };

    var tryingToJoin = function(playerNum) {
        //Set player to join a slot in the game
        var playingState = PlayingState.Joining;
        gameRef.child("player" + playerNum + "/online").transaction(function(snapshot){
            if(snapshot === null) {
                return true;
            }else{
                return; //>abort! didn't get in.
            }
        },function(error, committed){
            if(committed){
                playingState = PlayingState.Playing;
                //startPlaying(playerNum);
                syncToFirebase(playerNum);
            }else{
                playState = PlayingState.Watching;
            }   
        }); 
    }; 

    var playingGame = function(playerNum) {
        

    }
  

}); //end .ready 

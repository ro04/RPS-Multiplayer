$(document).ready(function () {
    gameRef = firebase.database().ref().child('Players');

    //Initialize Variables
    var numPlayers = 2;
    var playerName = "";
    var playerWins = 0;
    var playerLoses = 0;
    var playingState = "";

    //Managers whose joining the game
    PlayingState = {
        Watching: 0,
        Joining: 1,
        Playing: 2
    };

    $("form").submit(function(e) {
        playingState = PlayingState.Watching;
        e.preventDefault();
        playerName = $("#user").val();
        console.log(playerName);
        waitingToJoin();
    });
 
    var waitingToJoin = function() {
        // Listen on "online" location for player 0 
        gameRef.child("player0/online").on("value", function (snapshot){
            var value = snapshot.val();
            if(value === null && playingState === PlayingState.Watching) {
                console.log(value);
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
        playingState = PlayingState.Joining;
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
                //startPlaying(playerNum);
            }else{
                playState = PlayingState.Watching;
            }   
        }); 
    }; 

    var syncToFirebase = function(playerNum) {
        gameRef.child('player' + playerNum + '/online').set({
            Name: playerName,
            Wins: playerWins,
            Loses: playerLoses
        });

         //Control the players
        playerOneRef = gameRef.child('player0/online');
        playerTwoRef = gameRef.child('player1/online');


        playerOneRef.on("value", function(playerOneSnapshot){
            if(playerOneSnapshot.val() !== null){
                 //Initializing Variables
                var player_one_name = playerOneSnapshot.val().Name;
                var player_one_wins =  playerOneSnapshot.val().Wins;
                var player_one_loses = playerOneSnapshot.val().Loses;
                //Remove submit button, text label, and replace "waiting for player one"
                //with the players name
                $("#submit-btn").remove();
                $("#user").remove();
                $("#player-one-text").empty();
                $("#player-one-text").append("Welcome " + player_one_name + " You Are Player 1");

                //*****Create a div to display info for Player One*****//
                //Create the div to display player one name
                var plNameText = $("<h4>");
                plNameText.text(player_one_name);
                $("#p1-name-text").append(plNameText );

                //Create the div to display rock text
                var plRockText = $("<a href='#'>");
                plRockText.text("ROCK");
                $("#p1-rock-text").append(plRockText);

                //Create the div to display paper text
                var p1PaperText = $("<a href='#'>");
                p1PaperText.text("PAPER");
                $("#p1-paper-text").append(p1PaperText);

                //Create the div to display scissor text
                var p1ScissorText = $("<a href='#'>");
                p1ScissorText.text("SCISSOR");
                $("#p1-scissor-text").append(p1ScissorText);

                //Create the div to display wins
                var p1NumWins = $("<h4>");
                //console.log(snapshot.child('Wins').val());
                p1NumWins.text("Wins: " + player_one_wins);
                $("#p1-wins-text").append(p1NumWins);
    
                //Create the div to display loses
                var p1NumLoses = $("<h4>");
                //console.log(snapshot.child('Loses').val());
                p1NumLoses.text("Loses: " + player_one_loses);
                $("#p1-loses-text").append(p1NumLoses);
            }
           
        })
           

        playerTwoRef.on("value", function(playerTwoSnapshot){
            if(playerTwoSnapshot.val() !== null){
                var player_two_name = playerTwoSnapshot.val().Name;
                var player_two_wins = playerTwoSnapshot.val().Wins;
                var player_two_loses = playerTwoSnapshot.val().Loses;
                $("#submit-btn").remove(); 
                $("#user").remove();  
                $("#player-two-text").empty(); 
                $("#player-two-text").append("Welcome " + player_two_name + " You Are Player 2"); 
                //*****Create the div to display info for Player One*****//
                //Player Two Name
                var p2NameText = $("<h4>");
                //console.log(snapshot.child('Name').val());
                p2NameText.text(player_two_name);
                $("#p2-name-text").append(p2NameText);
                //Rock Element
                var p2RockText = $("<a href='#'>");
                p2RockText.text("ROCK");
                $("#p2-rock-text").append(p2RockText);
                //Paper Element
                var p2PaperText = $("<a href='#'>");
                p2PaperText.text("PAPER");
                $("#p2-paper-text").append(p2PaperText);
                //Scissor Element
                var p2ScissorText = $("<a href='#'>");
                p2ScissorText.text("SCISSOR");
                $("#p2-scissor-text").append(p2ScissorText);
                //Number of Wins Element
                var p2NumWins = $("<h4>");
                p2NumWins.text("Wins: " + player_two_wins);
                $("#p2-wins-text").append(p2NumWins);
                //Number of Loses Element
                var p2NumLoses = $("<h4>");
                p2NumLoses.text("Loses: " + player_two_loses);
                $("#p2-loses-text").append(p2NumLoses);
            }
        })

        startPlaying(playerOneRef, playerTwoRef);

    };

    var startPlaying = function(playerOneRef, playerTwoRef) {
       this.playerOneRef = playerOneRef;
       this.playerTwoRef = playerTwoRef;

    }
  

}); //end .ready 

var init = function() { 
	
	game = new Chess(),
	  statusEl = $('#status'),
	  fenEl = $('#fen'),
	  pgnEl = $('#pgn');


	// opciones del tablero
		$("#moveranterior").click(function(){
			game.undo();
			board.position(game.fen());
			updateStatus();
		});
	// do not pick up pieces if the game is over
	// only pick up pieces for the side to move

	var onDragStart = function(source, piece, position, orientation) {
	  if (game.game_over() === true ||
	      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
	      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
	    return false;
	  }
	};

	var onDrop = function(source, target) {
	  // see if the move is legal
	  var move = game.move({
	    from: source,
	    to: target,
	    promotion: 'q' // NOTE: always promote to a queen for example simplicity
	  });

	  // illegal move
	  if (move === null) return 'snapback';

	  updateStatus();
	};

	// update the board position after the piece snap 
	// for castling, en passant, pawn promotion
	var onSnapEnd = function() {
	  board.position(game.fen());
	};

	var updateStatus = function() {
	  var status = '';

	  var moveColor = 'Blancas';
	  if (game.turn() === 'b') {
	    moveColor = 'Negras';
	  }

	  // checkmate?
	  if (game.in_checkmate() === true) {
	    status = 'Game over, ' + moveColor + ' está en jaquemate.';
	  }

	  // draw?
	  else if (game.in_draw() === true) {
	    status = 'Partida en tablas';
	  }

	  // game still on
	  else {
	   // status = moveColor + ' mueven';
		if(moveColor == 'Blancas') { $("#jueganblancas").css({"visibility":"visible"});$("#juegannegras").css({"visibility":"hidden"}); }
		else if (moveColor == 'Negras' ) { $("#juegannegras").css({"visibility":"visible"});$("#jueganblancas").css({"visibility":"hidden"}); }

	    // check?
	    if (game.in_check() === true) {
	      status += ', ' + moveColor + ' está en jaque';
	    }
	  }

	  statusEl.html(status);
	  fenEl.html(game.fen());
	  pgnEl.html(game.pgn());
	};

	var cfg = {
	  draggable: true,
	  position: 'start',
	  onDragStart: onDragStart,
	  onDrop: onDrop,
	  onSnapEnd: onSnapEnd,
      pieceTheme: 'js/chessboard/img/chesspieces/wikipedia/{piece}.png'
	};
	board = new ChessBoard('board', cfg);

	updateStatus();
	
	
	
	
	
	
	
	$("#cargarla").click(function() {
		console.log($("#laspartidas").val());
		var elpgn = $("#laspartidas").val();
		var blancas = $("#laspartidas:selected").attr("data-white");
		console.log(blancas);
		var negras = $("#laspartidas").data().black;
		game.load_pgn(elpgn);
		board.position(game.fen());
		$("#el-pgn").html(elpgn);
		$("#jugadornegro").val(negras);
		$("#jugadorblanco").val(blancas);

	});

	$("#archivopgn").change(function() {
	   // alert('changed!');
		var myFile = $('#archivopgn').val();
		$('filaname').load("myFile");

		var manejarArchivos = function(archivo) {
	        var reader = new FileReader();
	        reader.onload = function(event) {
	        var content = event.target.result;
	
					var datos2 = content;

					// spliteamos(separamos) los datos cuando acaban en ]
					datos = datos2.split(']');
					var zerito = 0;
					var empiezoContando = 0;
					var partidas = 1;
					var finalito = datos.length;
					var arrpartidas = new Array();
					arrpartidas[partidas] = {};
					while (zerito<=finalito) {
						var queEs = $.trim(datos[zerito]);
						var lastChar = queEs.charAt(0); // primerita letra
						// sino empieza por [ es que es la partida en pgn.
						if(lastChar != "[") { 
							if(zerito==(finalito)) { partidas--; }
							else { 
								var limpiandola = queEs.split('[');
								partidapgn = limpiandola[0];
								// una partida más en pgn
								var pgnname = 'pgn';
								arrpartidas[partidas][pgnname] = partidapgn;
								partidas++;
							}

						}
						else {
							var cadena = queEs.substring(1,queEs.length);
							var cadenaspliteada = cadena.split(' ');
							var cadenatitulo = $.trim(cadenaspliteada[0]);

							var cadenacontent = cadena.replace(cadenatitulo,"");
							if(!arrpartidas[partidas]) { arrpartidas[partidas] = {}; }
							arrpartidas[partidas][cadenatitulo] = cadenacontent;



						}
						zerito++;
					}
					// una vez acabado el while de carga de partida
					// gestionamos otro bucle para generar la <li>
					var partidas = 0;
					var finalito = arrpartidas.length-1;
					while(partidas<finalito) {
							partidas++;
							var blancas = arrpartidas[partidas]['White'];
							var negras = arrpartidas[partidas]['Black'];
							var elpgn = arrpartidas[partidas]['pgn'];
							var namingdiv = "partida-"+partidas;
								$('#laspartidas').append(
								    $('<div id="'+namingdiv+'" class="partidacargada">')
								);
								$('#'+namingdiv).append(
									$('<div class="jugadores">').append(blancas+" vs "+negras)
									);
								$('#'+namingdiv).append(
									$('<div class="partida-pgn">').append(elpgn)
									);

					}
	      };
	      reader.readAsText(archivo[0]);
	    }

		manejarArchivos(this.files);

	});
}

$(document).ready(init);


function isInt(n) { return n % 1 === 0; }
// generar partida y gameMoves en array. 
// cambiar el numero de jugada en ActualMove segun se mueva
// 
var gameMoves, jugadas, totalJugadas, actualJugada;
function conviertePGN(g) {
	pgn = $.trim(g).replace(/\n|\r/g, ' ').replace(/\s+/g, ' ');
    pgn = pgn.replace(/\{((\\})|([^}]))+}/g, '');
	pgn = pgn.replace(new RegExp("1-0|1/2-1/2|0-1"), '');
	pgn = pgn.replace(/^\d+\.+/, '');
	pgn = pgn.replace(/\s\d+\.+/g, '');  
	pgn = $.trim(pgn).split(" ");
	totalJugadas = Math.ceil((pgn.length)/2);
	actualJugada = pgn.length-1;
	jugadas = pgn;
}
// loading de file en pgn
$("document").ready(function(){
	$('#laspartidas').on('click', '.jugadores', function(e) { 
		if( $(this).siblings('.partida-pgn').is(":visible") ) { $(this).siblings('.partida-pgn').hide(); }
		else { $(this).siblings('.partida-pgn').show(); }
	}); 
	$('#laspartidas').on('click', '.partida-pgn', function(e) { 
		$("#laspartidas div").removeClass("partidaactiva");
		$(this).addClass('partidaactiva');
		board = new ChessBoard('board');
		game = new Chess();
		game.load_pgn($(this).text());
		board.position(game.fen());
		conviertePGN($(this).text());
		
		
		//cinnamonCommand = Module.cwrap('command', 'string', ['string','string'])
		// time to 1 sec
		//cinnamonCommand("setMaxTimeMillsec","1000")
		// set fen position rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
		//console.log("Calculando");
		//cinnamonCommand(game.fen())
		//var move=cinnamonCommand("go","")
		//console.log(move);
		
	});
	$("#iralPrincipio").click(function(e){
		actualJugada = "-1";
		game.reset();
		board.position(game.fen());
	});
	$("#moversiguienteCargada").click(function(e){
		actualJugada++;
		if(actualJugada<jugadas.length) { 
			game.move(jugadas[actualJugada]);
			board.position(game.fen());
		}
		else {
			actualJugada--;
		}
		
		
	});
	$("#moveranteriorCargada").click(function(e){
		game.undo();
		board.position(game.fen());
		actualJugada--;
	});
	
});
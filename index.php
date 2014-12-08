<html>
	<head>
		<meta charset="utf-8">
		<title>Visor de archivos PGN</title>
		<link rel="stylesheet" href="/css/master.css" type="text/css">
		
		<link rel="stylesheet" href="/js/chessboard/css/chessboard.css" type="text/css">
		<script type="text/javascript" src="/js/chessboard/js/jquery-1.10.1.min.js"></script>
		<script type="text/javascript" src="/js/chessboard/js/json3.min.js"></script>
		<script type="text/javascript" src="/js/chessboard/js/chessboard.js"></script>
		<script type="text/javascript" src="/js/chessboard/js/chess.js"></script>
		<script type="text/javascript" src="/js/init.js"></script>
	</head>
	<body>
		<h1>Visor de archivos PGN</h1>
		<div id="visor">
			<div id="board">
			</div>
			<div id='flechas'>
				<a id='iralPrincipio'><img src='/img/dist/control_double_left.png' alt='Ir al principio'></a>
				<a id='moveranteriorCargada'><img src='/img/dist/control_left.png' /></a>
				<a id='moversiguienteCargada'><img src='/img/dist/control_right.png' /></a>
				<a id='iralFinal'><img src='/img/dist/control_double_right.png' alt='Ir al final'></a>
			</div>
		</div>
		<div id='extraboard-cargarpartidas'>
			<div><input id='archivopgn' type='file' name='archivopgn'></div>

			<div class='filename'></div>
			<hr>
			<div><b>Partidas cargadas</b></div>
			<div id='laspartidas'>
			</div>
		</div>
	</body>
</html>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible"/>
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
    <link rel="stylesheet" type="text/css" href="./Style.css" />
    <title>AstroCrash</title>

    <script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
	<script src="./wade_1.0.2.js"></script>

    <script>
        $(document).ready(function()
        {
			$("#wade_main_div").hide();
			wade.init('Game.js');
        });

    </script>
</head>

<body background="./images/nasaBackgroundLogo.png">

<div id="container" style="border:1; width:800px; height:600px;">
	<div id="loading_div" width="800" height="600">
		<div id="loading_text_block">
			<h2>Planet Earth, just a little of the atmosphere, year 2160.</h2>
			<p>
			Planet Earths destiny lies in your hands.<br>
			Brave NASA pilots dispatched to face off the UFO threat in order to defend Earth.<br>
			This is our last hope.<br>
			The battle is taken outside of Earths atmosphere.<br>
			Defend Planet Earth!!<br>
			<p>
			Use your mouse to move the ship.<br>
			To fire, use left click.
			<p>
			A lost battle is a battle one thinks one has lost.
			<p>
			Game is loading..
		</p>
		</div>
	</div>
    <div id="wade_main_div" width="800" height="600" tabindex="1">
    </div>
</div>

</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <title>Tek Sayılar</title>
    <style>
        body {
            background-color: #FFEFEA;
            font-family: 'Monaco', monospace;
            text-align: center;
            margin: 0;
            padding: 0;
        }

        h1 {
            color: #8B1C2F;
            margin-top: 40px;
            font-size: 2rem;
            letter-spacing: 2px;
        }

        h2 {
            color: #8B1C2F;
            margin-top: 40px;
            font-size: 1rem;
            letter-spacing: 2px;
        }

        .kutu { 
            color: #520e19ff;
            display: inline-block; 
            background: linear-gradient(135deg, #fff0f0, #fee2e0);
            padding: 10px; 
            text-align: center; 
            font-family: 'Monaco', monospace;
            border-radius: 7px;
            border: 2px solid #d79292;
            margin: 6px; 
            min-width: 35px;
        }
    </style>
</head>

<body>

    <h1>Nurbanu Polat</h1>
    <h2>PHP Tek Sayılar</h2>

  
        <?php
            echo "<h2>1-100 Arası Tek Sayılar</h2>";

            for ($i = 1; $i <= 100; $i++) { 
                if ($i % 2 != 0) { 
                    echo "<div class='kutu'>$i</div>";
                }
            }
        ?>
   

</body>
</html>

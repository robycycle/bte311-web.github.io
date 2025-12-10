<!DOCTYPE html>
<html>
<head>
    <title>Dinamik Tablo Oluşturma</title>
    <style>
        table {
            width: 50%;
            border-collapse: collapse; 
            margin-top: 20px;
            margin: 0 auto;
        }
        th, td { 
            border: 2px solid #d79292;
            background-color: #fff0f0;
            padding: 10px; 
            text-align: center; 
            font-family: Arial, sans-serif;
        }
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
        form {
            padding: 25px;
            border: 1px solid #d79292;
            width: 300px; 
            background-color: #fff0f0;
            margin: 0 auto;
        }

        label {
            color: #8B1C2F;
            font-weight: bold;
            display: inline-block;
            width: 120px;
            margin-bottom: 10px;
        }
        input[type="number"] {
            padding: 8px;
            border: 1px solid #d79292;
            border-radius: 4px; 
            width: 150px;
            box-sizing: border-box; 
        }
        button[type="submit"] {
            margin-top: 15px;
            padding: 10px 15px;
            color: #8B1C2F;
            border: 1px #8B1C2F;
            background: linear-gradient(135deg, #fff0f0, #fee2e0);
            border-radius: 5px;
            cursor: pointer;
        }
        .kutu {
            display: flex;
            flex-direction: column;
            align-items: center;
       
            font-size: 1.1rem;
            
            padding: 12px 24px;
            border-radius: 14px;
            border: 1px solid #d79292;
        }

    </style>
</head>
<body>
  <h1>Nurbanu Polat</h1>
  <h2>PHP Tablo Oluşturucu</h2>
    <form method="post" action="">
        <label for="rows">Satır Sayısı:</label>
        <input type="number" id="rows" name="rows" required min="1"><br><br>
        
        <label for="cols">Sütun Sayısı:</label>
        <input type="number" id="cols" name="cols" required min="1"><br><br>
        
        <button type="submit">Tabloyu Oluştur</button>
    </form>

<?php 

if (isset($_POST['rows'], $_POST['cols'])) {
    
    $rows = (int)$_POST['rows']; 
    $cols = (int)$_POST['cols'];
    
    echo "<h2>Oluşturulan Tablo: $rows Satır x $cols Sütundan oluşmaktadır.</h2>";
    echo "<table>";
    
 
    for ($r = 0; $r < $rows; $r++) {
        echo "<tr>";
        
        
        for ($c = 0; $c < $cols; $c++) {
            
            $random_nmb = rand(1, 100); 
            echo "<td>$random_nmb</td>";;
        }
        
        echo "</tr>";
    }
    
    echo "</table>";
    
} else {
    echo '<h2>Lütfen satır ve sütun sayılarını girin.</h2>';
}

?>

</body>
</html>
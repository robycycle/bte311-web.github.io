
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>Veri Tabanı Kişi Ekleme</title>
<style>

.kutu{
    width:300px;
    margin:80px auto;
    padding:20px;
    background:#fff8f6;
    border-radius:8px;
    text-align: center;
}
input{
    padding:8px;
    margin:6px 0;
    text-align: center;
    border: white;
    border-radius:8px;
    padding: 12px 24px;
    border: 1px solid #d79292;
}
button{
    width:100%;
    padding:10px;
    background:#8B1C2F;
    color:white;
    border: none;
    border-radius:8px;
}
.ok{
    color:green;
    text-align:center;
    font-family: 'Monaco', monospace;
}
.hata{
    color:red;
    text-align:center;
    font-family: 'Monaco', monospace;
}
</style>
</head>

<body style="background:#FFEFEA;">
<?php

$conn = new mysqli("127.0.0.1", "root", "", "yenivt");
if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}


$mesaj = "";
if (isset($_POST["kaydet"])) 
{
    $ad    = $_POST["ad"];
    $soyad = $_POST["soyad"];
    $email = $_POST["email"];

    $sql = "INSERT INTO myguests (firstname, lastname, email)
            VALUES ('$ad', '$soyad', '$email')";

    if ($conn->query($sql)) {
        $mesaj = "<p class='ok'>Kayıt başarıyla eklendi</p>";
    } else {
        $mesaj = "<p class='hata'>Hata: {$conn->error}</p>";
    }
}
?>
<div class="kutu">
    <h2 style= "text-align:center; font-family: 'Monaco', monospace; color: #8B1C2F" >Veri Tabanıma Kişi Ekleyin</h2>

    <?= $mesaj ?>

    <form method="post">
        <input type="text" name="ad" placeholder="Adınız" required>
        <input type="text" name="soyad" placeholder="Soyadınız" required>
        <input type="email" name="email" placeholder="E-postanız" required>
        <button type="submit" name="kaydet">Kaydet</button>
    </form>
    <p style="font-family: 'Monaco', monospace; color: #c2afb2ff" >made by nurbanu polat</p>
</div>

</body>
</html>

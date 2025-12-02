// indexn.js - düzeltilmiş, güvenli versiyon

// DOM hazır olunca çalıştırmak için sar
window.addEventListener("load", () => {
  // canvas seçimi
  const canvas = document.querySelector("canvas");
  if (!canvas) {
    console.error("Canvas bulunamadı! HTML içinde <canvas></canvas> olduğundan emin ol.");
    return;
  }
  const c = canvas.getContext("2d");

  // pencere genisligi ve yuksekligi
  canvas.width = 1024;
  canvas.height = 576;

  const gravity = 1.5; // yer cekimi degeri
  const GROUND_Y = 480; // platformların y değeri (kodunla eşleşiyor)

  // resim kaynakları (liste halinde)
  const ASSETS = {
    platform: "./img/platform.png",
    platformsmall: "./img/platformsmall.png",
    cactus: "./img/cactus.png",
    poisonmushroom: "./img/poisonmushroom.png",
    mushroom: "./img/mushroom.png",
    background: "./img/background.png",
    trees: "./img/trees.png",
    idle: "./img/idle.png"
  };

  // yüklenecek Image nesneleri burada saklanacak
  const IMAGES = {};

  // görselleri yükle ve callback çağır
  function loadImages(assetMap, callback) {
    const keys = Object.keys(assetMap);
    let remaining = keys.length;
    if (remaining === 0) {
      callback();
      return;
    }
    keys.forEach((k) => {
      const img = new Image();
      img.src = assetMap[k];
      img.onload = () => {
        IMAGES[k] = img;
        remaining--;
        if (remaining <= 0) callback();
      };
      img.onerror = () => {
        console.warn("Görsel yüklenemedi:", assetMap[k], "(fallback ile devam ediyor)");
        // Yüklenemese de boş Image koy (width/height 0 olabilir)
        IMAGES[k] = img;
        remaining--;
        if (remaining <= 0) callback();
      };
    });
  }

  // oyuncu sinifi
  class Player {
    constructor() {
      this.speed = 5;
      this.position = { x: 100, y: 100 };
      this.velocity = { x: 0, y: 0 };
      this.width = 91;
      this.height = 90;
      this.image = IMAGES.idle || new Image();
      this.facing = "right";
    }

    draw(ctx) {
      if (this.facing === "left") {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(this.image, -this.position.x - this.width, this.position.y, this.width, this.height);
        ctx.restore();
      } else {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
      }
    }
  }

  // basit nesil siniflari
  class Platform {
    constructor({ x, y, image }) {
      this.position = { x, y };
      this.image = image || IMAGES.platform;
      this.width = (this.image && this.image.width) || 500;
      this.height = (this.image && this.image.height) || 100;
    }
    draw(ctx) {
      if (this.image) ctx.drawImage(this.image, this.position.x, this.position.y);
      else {
        // fallback görsel yoksa düz kutu çiz
        ctx.fillStyle = "saddlebrown";
        ctx.fillRect(this.position.x, this.position.y, this.width, 20);
      }
    }
  }

  class SmallPlatform {
    constructor({ x, y, image }) {
      this.position = { x, y };
      this.image = image || IMAGES.platformsmall;
      this.width = (this.image && this.image.width) || 200;
      this.height = (this.image && this.image.height) || 50;
    }
    draw(ctx) {
      if (this.image) ctx.drawImage(this.image, this.position.x, this.position.y);
      else {
        ctx.fillStyle = "sienna";
        ctx.fillRect(this.position.x, this.position.y, this.width, 16);
      }
    }
  }

  class GenericObject {
    constructor({ x, y, image }) {
      this.position = { x, y };
      this.image = image;
      this.width = (image && image.width) || 0;
      this.height = (image && image.height) || 0;
    }
    draw(ctx) {
      if (this.image) ctx.drawImage(this.image, this.position.x, this.position.y);
    }
  }

  class Cactus { constructor({ x, y, image }) { this.position = {x,y}; this.image = image || IMAGES.cactus; this.width = (this.image && this.image.width) || 50; this.height = (this.image && this.image.height) || 50; } draw(ctx){ if(this.image) ctx.drawImage(this.image, this.position.x, this.position.y); else { ctx.fillStyle="green"; ctx.fillRect(this.position.x,this.position.y,40,40);} } }
  class PoisonMushroom { constructor({ x, y, image }) { this.position = {x,y}; this.image = image || IMAGES.poisonmushroom; this.width = (this.image && this.image.width) || 40; this.height = (this.image && this.image.height) || 40; } draw(ctx){ if(this.image) ctx.drawImage(this.image, this.position.x, this.position.y); else { ctx.fillStyle="purple"; ctx.fillRect(this.position.x,this.position.y,32,32);} } }
  class Mushroom { constructor({ x, y, image }) { this.position = {x,y}; this.image = image || IMAGES.mushroom; this.width = (this.image && this.image.width) || 40; this.height = (this.image && this.image.height) || 40; } draw(ctx){ if(this.image) ctx.drawImage(this.image, this.position.x, this.position.y); else { ctx.fillStyle="orange"; ctx.fillRect(this.position.x,this.position.y,32,32);} } }

  // oyun durumları
  let player = null;
  let platforms = [];
  let smallplatforms = [];
  let cactuses = [];
  let poisonmushrooms = [];
  let mushrooms = [];
  let genericObjects = [];

  let keys = { right: { pressed: false }, left: { pressed: false }, up: { pressed: false } };
  let scrollOffset = 0;
  let gameOver = false; // alert döngüsünü engellemek için

  // init fonksiyonu
  function init() {
    // UI metinleri
    const gw = document.getElementById("gamewelcome"); if (gw) gw.innerHTML = "OYUNA HOŞGELDİNİZ";
    const gr = document.getElementById("gamerules"); if (gr) gr.innerHTML = "Sağ: D | Sol: A | Yukarı: W";
    const ge = document.getElementById("gameend"); if (ge) ge.innerHTML = "";

    // sıfırla
    scrollOffset = 0;
    keys.right.pressed = false;
    keys.left.pressed = false;
    keys.up.pressed = false;
    gameOver = false;

    // oyuncuyu oluştur
    player = new Player();
    // kesin başlangıç: platform Y'sinin üstüne koy
    player.position.x = 100;
    player.position.y = GROUND_Y - player.height;
    player.velocity.x = 0;
    player.velocity.y = 0;

    // platformları ve objeleri oluştur (görsel yüklenmeden width 0 ise fallback kullanıldı)
    const pW = (IMAGES.platform && IMAGES.platform.width) || 500;
    platforms = [
      new Platform({ x: -1, y: GROUND_Y }),
      new Platform({ x: pW - 3, y: GROUND_Y }),
      new Platform({ x: pW * 2 + 100, y: GROUND_Y }),
      new Platform({ x: pW * 3 + 300, y: GROUND_Y }),
      new Platform({ x: pW * 4 + 300 - 2, y: GROUND_Y }),
      new Platform({ x: pW * 5 + 700 - 2, y: GROUND_Y })
    ];

    smallplatforms = [
      new SmallPlatform({ x: 1300, y: 360 }),
      new SmallPlatform({ x: 1300 + ((IMAGES.platformsmall && IMAGES.platformsmall.width) || 200), y: 360 }),
      new SmallPlatform({ x: 2100, y: 370 }),
      new SmallPlatform({ x: 2100 + ((IMAGES.platformsmall && IMAGES.platformsmall.width) || 200), y: 370 }),
      new SmallPlatform({ x: 3687, y: 410 }),
      new SmallPlatform({ x: 3800, y: 370 }),
      new SmallPlatform({ x: 3800 + ((IMAGES.platformsmall && IMAGES.platformsmall.width) || 200), y: 330 })
    ];

    cactuses = [
      new Cactus({ x: 480, y: 348.6 }),
      new Cactus({ x: ((IMAGES.cactus && IMAGES.cactus.width) || 50) + 2500, y: 342.6 })
    ];

    poisonmushrooms = [
      new PoisonMushroom({ x: 210, y: 440 })
    ];

    mushrooms = [
      new Mushroom({ x: 1100, y: 442 }),
      new Mushroom({ x: ((IMAGES.mushroom && IMAGES.mushroom.width) || 40) + 4500, y: 442 })
    ];

    genericObjects = [
      new GenericObject({ x: -1, y: -1, image: IMAGES.background }),
      new GenericObject({ x: -1, y: -1, image: IMAGES.trees })
    ];
  }

  // collision kontrol yardımcıları
  function willLandOnPlatform(player, nextY, platform) {
    const playerBottom = player.position.y + player.height;
    const nextBottom = nextY + player.height;
    const willIntersect = playerBottom <= platform.position.y && nextBottom >= platform.position.y;
    const withinX = player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width;
    return willIntersect && withinX;
  }

  // ana döngü
  function animate() {
    if (gameOver) return; // güvenlik, gameOver set edildi mi döngüyü durdur
    requestAnimationFrame(animate);

    // temizle
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);

    // arkaplan ve objeler
    genericObjects.forEach(g => g.draw(c));
    platforms.forEach(p => p.draw(c));
    smallplatforms.forEach(sp => sp.draw(c));
    cactuses.forEach(cx => cx.draw(c));
    poisonmushrooms.forEach(pm => pm.draw(c));
    mushrooms.forEach(m => m.draw(c));

    // yatay hareket mantığı ve kaydırma
    if (keys.right.pressed && player.position.x < 400) {
      player.velocity.x = player.speed;
    } else if ((keys.left.pressed && player.position.x > 100) ||
               (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
      player.velocity.x = -player.speed;
    } else {
      player.velocity.x = 0;

      if (keys.right.pressed) {
        scrollOffset += player.speed;
        platforms.forEach(p => p.position.x -= player.speed);
        smallplatforms.forEach(sp => sp.position.x -= player.speed);
        cactuses.forEach(cx => cx.position.x -= player.speed);
        poisonmushrooms.forEach(pm => pm.position.x -= player.speed);
        mushrooms.forEach(m => m.position.x -= player.speed);
        genericObjects.forEach(go => go.position.x -= player.speed * 0.66);
      } else if (keys.left.pressed && scrollOffset > 0) {
        scrollOffset -= player.speed;
        platforms.forEach(p => p.position.x += player.speed);
        smallplatforms.forEach(sp => sp.position.x += player.speed);
        cactuses.forEach(cx => cx.position.x += player.speed);
        poisonmushrooms.forEach(pm => pm.position.x += player.speed);
        mushrooms.forEach(m => m.position.x += player.speed);
        genericObjects.forEach(go => go.position.x += player.speed * 0.66);
      }
    }

    // VERTICAL physics - güvenli sıra
    // 1) gravity uygula (velocity'yi arttır)
    player.velocity.y += gravity;

    // 2) nextY hesapla
    const nextY = player.position.y + player.velocity.y;

    // 3) platformlara iniş kontrolü
    let landed = false;

    for (const p of platforms) {
      if (willLandOnPlatform(player, nextY, p)) {
        landed = true;
        player.velocity.y = 0;
        player.position.y = p.position.y - player.height;
        break;
      }
    }

    // smallplatform'lar için kontrol
    if (!landed) {
      for (const sp of smallplatforms) {
        if (willLandOnPlatform(player, nextY, sp)) {
          landed = true;
          player.velocity.y = 0;
          player.position.y = sp.position.y - player.height;
          break;
        }
      }
    }

    // 4) eğer platforma inmediyse pozisyonu nextY'ye taşı
    if (!landed) {
      player.position.y = nextY;
    }

    // 5) x pozisyonunu güncelle
    player.position.x += player.velocity.x;

    // 6) çiz
    player.draw(c);

    // KAZANMA SARTI
    const winThreshold = (IMAGES.platform && IMAGES.platform.width || 500) * 5 + 300 - 2;
    
    if (scrollOffset > winThreshold + 150) {
      gameOver = true;
      // tuşları sıfırla
      keys.right.pressed = false;
      keys.left.pressed = false;
      keys.up.pressed = false;
      // gösterim
      alert("Tebrikler! Oyunu kazandınız!");
      init();
      return;
    }

    // KAYBETME SARTI (yere düşme)
    if (player.position.y >= canvas.height) {
      gameOver = true; // böylece döngü durabilir
      // tuşları sıfırla
      keys.right.pressed = false;
      keys.left.pressed = false;
      keys.up.pressed = false;
      // uyarı
      alert("Kaybettiniz!");
      init();
      return;
    }
  }

  // klavye eventleri
  window.addEventListener("keydown", (e) => {
    if (gameOver) return;
    switch (e.code) {
      case "KeyA":
      case "ArrowLeft":
        keys.left.pressed = true;
        player && (player.facing = "left");
        break;
      case "KeyD":
      case "ArrowRight":
        keys.right.pressed = true;
        player && (player.facing = "right");
        break;
      case "KeyW":
      case "ArrowUp":
      case "Space":
        // sadece yerdeyse zıpla
        // yerde olma kontrolleri: toleranslı platform kontrolü
const tolerance = 5;

const onGround =
  // ana zemin
  Math.abs((player.position.y + player.height) - GROUND_Y) < tolerance ||

  // büyük platformlar
  platforms.some(p =>
    Math.abs((player.position.y + player.height) - p.position.y) < tolerance &&
    player.position.x + player.width > p.position.x &&
    player.position.x < p.position.x + p.width
  ) ||

  // küçük platformlar için (saman balyaları)
  smallplatforms.some(sp =>
    Math.abs((player.position.y + player.height) - sp.position.y) < tolerance &&
    player.position.x + player.width > sp.position.x &&
    player.position.x < sp.position.x + sp.width
  );
        if (onGround) {
          player.velocity.y = -20;
        }
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.code) {
      case "KeyA":
      case "ArrowLeft":
        keys.left.pressed = false;
        break;
      case "KeyD":
      case "ArrowRight":
        keys.right.pressed = false;
        break;
    }
  });

  // yükle görselleri, sonra init + animate
  loadImages(ASSETS, () => {
    init();
    animate();
    // debug: başlangıç pozisyonunu konsola yaz
    console.log("Oyun başlatıldı. player pozisyon:", player.position);
  });
});

let canvas = document.getElementsByTagName("canvas");
const ctx = canvas[0].getContext("2d");
canvas[0].width = 1024;
canvas[0].height = 576;
const GRAVITY = 1.5;
let scrollOffset = 0; //checking win scenario if player reaches particular length

let platform_image = createImage("./image/platform.png");
let platform_image_small = createImage("./image/platformSmallTall.png");
let background_image = createImage("./image/background.png");
let hills = createImage("./image/hills.png");

let spriteRunLeft = createImage("./image/spriteRunLeft.png");
let spriteRunRight = createImage("./image/spriteRunRight.png");
let spriteStandLeft = createImage("./image/spriteStandLeft.png");
let spriteStandRight = createImage("./image/spriteStandRight.png");
let platforms = [];
let genericObjects = [];
let lastKey = "";


class Player {
  constructor() {
    (this.speed = 10),
      (this.position = {
        x: 100,
        y: 100,
      }),
      (this.velocity = {
        x: 0,
        y: 0,
      });
    (this.width = 66),
      (this.height = 150),
      (this.image = spriteStandRight),
      (this.frames = 0),
      (this.sprites = {
        stand: {
          right: spriteStandRight,
          left: spriteStandLeft,
          cropWidth: 177,
          width: 66,
        },
        run: {
          right: spriteRunRight,
          left: spriteRunLeft,
          //   cropWidth: 341.275,
          cropWidth: 341,
          width: 127.875,
        },
      }),
      (this.currentSprite = this.sprites.stand.right),
      (this.currentCropWidth = this.sprites.stand.cropWidth);
    this.width = this.sprites.stand.width;
  }
  draw() {
    // ctx.fillStyle = "red";
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames, //where from image to crop
      0, //y top
      this.currentCropWidth, // x till where to crop
      400, // y till where to crop
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update() {
    this.frames++;
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    ) {
      this.frames = 0;
    } else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    ) {
      this.frames = 0;
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.velocity.y + this.height < canvas[0].height) {
      this.velocity.y += GRAVITY;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    (this.position = {
      x, // x = x
      y, // y = y
    }),
      (this.image = image),
      (this.width = image.width),
      (this.height = image.height);
  }
  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
    // ctx.fillStyle = "green";
    // ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    (this.position = {
      x, // x = x
      y, // y = y
    }),
      (this.image = image),
      (this.width = image.width),
      (this.height = image.height);
  }
  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

// ! calling images Object
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

let player1 = new Player();

// ! keys <= observer
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
};

function init() {
  player1 = new Player();
  // !platform array

  platforms = [
    new Platform({
      x: -1,
      y: canvas[0].height - platform_image.height,
      image: platform_image,
    }),
    new Platform({
      x: platform_image.width - 3,
      y: canvas[0].height - platform_image.height,
      image: platform_image,
    }),
    new Platform({
      x: platform_image.width - 100,
      y: canvas[0].height / 3,
      image: platform_image,
    }),
    new Platform({
      x: platform_image.width * 2 + 200,
      y: canvas[0].height - platform_image.height,
      image: platform_image,
    }),
    new Platform({
      x: platform_image.width * 3 + 400,
      y: canvas[0].height - platform_image_small.height,
      image: platform_image_small,
    }),
    new Platform({
      x: platform_image.width * 4 + 400,
      y: canvas[0].height - platform_image_small.height,
      image: platform_image_small,
    }),
    new Platform({
      x: platform_image.width * 5 + 400,
      y: canvas[0].height - platform_image.height,
      image: platform_image,
    }),
    new Platform({
      x: platform_image.width * 6 + 720,
      y: canvas[0].height - platform_image.height,
      image: platform_image_small,
    }),
  ];

  // !generic Objects creation

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: background_image,
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: hills,
    }),
  ];
  scrollOffset = 0;
}

// ! Calling animation & init
init();
animate();

function animate() {
  requestAnimationFrame(animate);
  // ! clear each frame
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas[0].width, canvas[0].height);
  genericObjects.forEach((genericObject) => {
    genericObject.draw(); //drawing each generic objectsw
  });
  platforms.forEach((platform) => {
    platform.draw(); // drawing each platforms
  });

  player1.update();

  // ! player movement

  if (
    (keys.left.pressed && player1.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player1.position.x > 0)
  ) {
    player1.velocity.x = -player1.speed;
  } else if (keys.right.pressed && player1.position.x <= 400) {
    player1.velocity.x = player1.speed;
  } else {
    player1.velocity.x = 0;
    // !screenoffset
    if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player1.speed;
      platforms.forEach((platform) => {
        platform.position.x += player1.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player1.speed * 0.66;
      });
    } else if (keys.right.pressed) {
      scrollOffset += 5;
      platforms.forEach((platform) => {
        platform.position.x -= player1.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player1.speed * 0.66;
      });
    }
  }

  // ! win scenario
  if (scrollOffset >= 2000) {
    console.log("You win");
  }

  // ! lost scenario
  if (player1.position.y > canvas[0].height) {
    init();
  }

  //! sprite switching
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player1.currentSprite !== player1.sprites.run.right
  ) {
    player1.frames = 1;
    player1.currentSprite = player1.sprites.run.right;
    player1.currentCropWidth = player1.sprites.run.cropWidth;
    player1.width = player1.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player1.currentSprite !== player1.sprites.run.left
  ) {
    player1.currentSprite = player1.sprites.run.left;
    player1.currentCropWidth = player1.sprites.run.cropWidth;
    player1.width = player1.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player1.currentSprite !== player1.sprites.stand.left
  ) {
    player1.currentSprite = player1.sprites.stand.left;
    player1.currentCropWidth = player1.sprites.stand.cropWidth;
    player1.width = player1.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player1.currentSprite !== player1.sprites.stand.right
  ) {
    player1.currentSprite = player1.sprites.stand.right;
    player1.currentCropWidth = player1.sprites.stand.cropWidth;
    player1.width = player1.sprites.stand.width;
  }

  // ! collision code
  platforms.forEach((platform) => {
    if (
      player1.position.x + player1.width >= platform.position.x &&
      player1.position.x <= platform.position.x + platform.width &&
      player1.position.y + player1.height <= platform.position.y &&
      player1.position.y + player1.height + player1.velocity.y >=
        platform.position.y
    ) {
      player1.velocity.y = 0;
    }
  });
}
// single jump
// if(keys.up.pressed){
//     player1.velocity.y -= 25;
// }
addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
    case 37:
      //left
      console.log("left")
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case 40:
    case 83:
      console.log("down");
      break;
    case 39:
    case 68:
      //right
    console.log('right')
      keys.right.pressed = true;
      lastKey = "right";
      break;
    case 38:
    case 87:
      console.log(
          "up"
      )
      
      
      if(keys.up.pressed === false){
        player1.velocity.y -= 25
        keys.up.pressed = true;
      }
    
      break;
  }
});
addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
    case 37:
      //left
      keys.left.pressed = false;
      break;
    case 40:
    case 83:
      console.log("down");
      break;
    case 39:
    case 68:
      //right
      keys.right.pressed = false;

      break;
    case 38:
    case 87:
      //jump - up
        // player1.velocity.y = 0;
      keys.up.pressed = false;
      break;
  }
});

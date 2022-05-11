import { Application, filters, Loader } from 'pixi.js';
import { PhysicObject } from './src/classes/PhysicObject';
import { Player } from './src/classes/Player';
import { Duck } from './src/classes/Duck';
import { SpringCircle } from './src/classes/SpringCircle';
import { sound } from '@pixi/sound';

const app = new Application({ backgroundColor: 0x000000 });

document.body.appendChild(app.view);

app.renderer.resize(1200, 800);

const loader = new Loader();
loader.add('gameTune', './assets/audio/The-Lone-Wolf.mp3');
loader.load(function (loader, resources) {
  resources.gameTune.sound.play();
  console.log(sound);
});

// Sound.from({
//   url: './assets/audio/The-Lone-Wolf.mp3',
//   preload: true,
//   loaded: function (err, sound) {
//     // sound.resume();
//     sound.play();
//   },
// });

const physicsObjs: PhysicObject[] = [];

physicsObjs.push(
  new Player({ x: 100, y: 100 }, 50, './assets/images/Yrgonaut.png', 2)
);

physicsObjs.push(
  new Duck({ x: 900, y: 550 }, 30, './assets/images/Duck.png', 2)
);

for (let i = 0; i < 20; i++) {
  physicsObjs.push(
    new SpringCircle(
      { x: 600 + i, y: 400 + Math.random() * 2 },
      40,
      './assets/images/Bubble.png',
      0.2,
      0.001,
      0.99
    )
  );
}

for (let i = 0; i < 10; i++) {
  physicsObjs.push(
    new SpringCircle(
      { x: 100 + i, y: 100 + Math.random() * 2 },
      40,
      './assets/images/Bubble.png',
      0.2,
      0.001,
      0.99
    )
  );
}

for (let i = 0; i < 5; i++) {
  physicsObjs.push(
    new SpringCircle(
      { x: 800 + i, y: 600 + Math.random() * 2 },
      40,
      './assets/images/Bubble.png',
      0.2,
      0.001,
      0.99
    )
  );
}

physicsObjs.forEach((obj) => {
  app.stage.addChild(obj.sprite);
});

app.ticker.add(() => {
  physicsObjs.forEach((obj) => {
    obj.checkBorders(0.6);
    obj.updatePosition();
    if (obj.tintCounter > 0) {
      obj.tintCounter -= 0.02;
    } else {
      obj.tintCounter = 0;
    }
    obj.collisionTint();
  });
  checkCollisions();
});

function checkCollisions(): void {
  for (let i = 0; i < physicsObjs.length; i++) {
    for (let j = 0; j < physicsObjs.length; j++) {
      if (physicsObjs[i] === physicsObjs[j]) {
        continue;
      }
      const betweenVector = getBetweenVector(
        physicsObjs[i].position,
        physicsObjs[j].position
      );
      const m = magnitude(betweenVector);
      const collideDistance =
        m - (physicsObjs[i].radius + physicsObjs[j].radius);
      if (collideDistance < 0) {
        const dirV = normalizeM(betweenVector, m);
        const massInfluence = physicsObjs[j].mass / physicsObjs[i].mass;
        physicsObjs[i].addForce({
          x: dirV.x * collideDistance * massInfluence * 0.1,
          y: dirV.y * collideDistance * massInfluence * 0.1,
        });
        physicsObjs[i].moveVector.x *= 0.96;
        physicsObjs[i].moveVector.y *= 0.96;
        if (collideDistance < -16) {
          physicsObjs[i].tintCounter = 1;
        }
      }
    }
  }
}

function magnitude(v: Vector2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function getBetweenVector(fromV: Vector2, toV: Vector2) {
  return { x: toV.x - fromV.x, y: toV.y - fromV.y };
}

function normalizeM(v: Vector2, m: number): Vector2 {
  return { x: v.x / m, y: v.y / m };
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function lerp(from, to, value) {
  from * (1 - value) + to * value;
}

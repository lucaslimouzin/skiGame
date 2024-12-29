import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
 type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE, // Redimensionne automatiquement à la taille de l'écran
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centre le jeu sur l'écran
  },
  width: window.innerWidth, // Largeur dynamique
  height: window.innerHeight, // Hauteur dynamique
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, GameScene], // Ajout des scènes
};

new Phaser.Game(config);

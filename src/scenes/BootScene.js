export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Charger les assets si nécessaires (pas pour le moment)
  }

  create() {
    this.scene.start('GameScene'); // Lancer la scène principale
  }
}

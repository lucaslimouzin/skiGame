export default class StartButton {
  constructor(scene, x, y) {
    this.scene = scene;

    // Créer le bouton sous forme de sprite
    this.sprite = scene.add.text(x, y, 'Start', {
      fontSize: '32px',
      fill: '#ffffff',
      backgroundColor: '#000000',
    })
      .setOrigin(0.5) // Centrer le texte
      .setInteractive() // Rendre le texte interactif
      .setDepth(10);

    // Ajouter un événement "pointerdown" pour détecter le clic
    this.sprite.on('pointerdown', () => {
      if (this.onClickCallback) {
        this.onClickCallback(); // Appeler le callback s'il est défini
      }
    });
  }

  onClick(callback) {
    this.onClickCallback = callback; // Enregistrer le callback
  }

  destroy() {
    if (this.sprite) {
      this.sprite.destroy(); // Supprimer le sprite si défini
    }
  }
}

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // Ajouter un sprite pour le joueur
    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setScale(3); // Ajuster l'échelle si nécessaire

    // Activer la physique pour le joueur
    scene.physics.add.existing(this.sprite);
    this.sprite.setCollideWorldBounds(true); // Empêcher le joueur de sortir des limites

    // Définir une hitbox personnalisée
    this.sprite.body.setSize(7, 12); // Largeur et hauteur de la hitbox
    this.sprite.body.setOffset(5, 3); // Décaler la hitbox pour correspondre au centre ou à la base du sprite

    // Initialiser les contrôles clavier
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // Stocker la position pour les entrées tactiles ou de la souris
    this.pointerX = null;

    // Gérer les entrées tactiles et souris
    scene.input.on('pointerdown', (pointer) => {
      this.pointerX = pointer.x; // Enregistrer la position initiale du doigt ou de la souris
    });

    scene.input.on('pointermove', (pointer) => {
      this.pointerX = pointer.x; // Mettre à jour la position pendant le déplacement
    });

    scene.input.on('pointerup', () => {
      this.pointerX = null; // Réinitialiser la position lorsque le doigt ou la souris est levé
    });

    // Angle cible pour la rotation fluide
    this.targetAngle = 0;
  }

  update() {
    const movementSpeed = 5; // Vitesse de déplacement horizontal
    const rotationSpeed = 0.1; // Vitesse de rotation fluide (plus bas = plus lent)

    // Priorité : clavier > tactile/souris
    if (this.cursors.left.isDown) {
      // Contrôle clavier : déplacement à gauche
      this.sprite.x -= movementSpeed;
      this.targetAngle = 5; // Tourner vers la gauche
    } else if (this.cursors.right.isDown) {
      // Contrôle clavier : déplacement à droite
      this.sprite.x += movementSpeed;
      this.targetAngle = -5; // Tourner vers la droite
    } else if (this.pointerX !== null) {
      // Contrôle tactile/souris
      if (this.pointerX < this.sprite.x - 10) {
        this.sprite.x -= movementSpeed; // Déplacer à gauche
        this.targetAngle = 5; // Tourner vers la gauche
      } else if (this.pointerX > this.sprite.x + 10) {
        this.sprite.x += movementSpeed; // Déplacer à droite
        this.targetAngle = -5; // Tourner vers la droite
      }
    } else {
      // Revenir à l'angle neutre si aucune entrée
      this.targetAngle = 0;
    }

    // Appliquer une interpolation fluide vers l'angle cible
    this.sprite.angle = Phaser.Math.Linear(this.sprite.angle, this.targetAngle, rotationSpeed);
  }

  resize(width, height) {
    // Recentrer le joueur si nécessaire lors du redimensionnement
    this.sprite.x = width / 2;
    this.sprite.y = height * 0.2;
  }
}

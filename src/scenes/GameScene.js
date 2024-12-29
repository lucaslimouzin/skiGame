import Player from '../Player.js';
import Tree from '../Tree.js';
import StartButton from '../StartButton.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    this.score = 0; // Initialisation du score
    this.trees = []; // Initialisation des arbres
  }

  preload() {
    // Charger les assets nécessaires
    this.load.image('tree', 'assets/tree-snow-a.png');
    this.load.image('player', 'assets/player.png');
  }

  create() {
    console.log('GameScene créée !');

    // Créer un bouton Start au centre de l'écran
    this.startButton = new StartButton(this, this.scale.width / 2, this.scale.height / 2);

    // Ajouter un callback pour démarrer le défilement de la piste
    this.startButton.onClick(() => {
      this.startScrolling = true;
      this.startButton.destroy(); // Supprimer le bouton "Start" après clic
    });

    // Initialiser les éléments du jeu
    this.initGameElements();

    // Ajouter le texte pour afficher le score
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fill: '#ffffff',
    });

    this.startScrolling = false; // Désactiver le défilement initialement
    this.scrollSpeed = 2; // Vitesse de défilement vertical par défaut
    this.horizontalSpeed = 0; // Vitesse horizontale du monde
  }

  initGameElements() {
    // Créer le joueur
    this.player = new Player(this, this.scale.width / 2, this.scale.height * 0.2);

    // Générer les arbres
    this.generateForest();

    // Activer les collisions entre le joueur et les arbres
    this.trees.forEach(tree => {
      this.physics.add.collider(this.player.sprite, tree.sprite, this.handleCollision, null, this);
    });

    // Écouter les événements de redimensionnement
    this.scale.on('resize', this.handleResize, this);
  }

  update() {
    if (!this.startScrolling) return;

    if (this.player) {
      this.player.update();

      // Ajuster la courbure en fonction du déplacement gauche/droite
      if (this.player.cursors.left.isDown) {
        this.horizontalSpeed = Phaser.Math.Linear(this.horizontalSpeed, 2, 0.05); // Déplace le monde vers la droite
      } else if (this.player.cursors.right.isDown) {
        this.horizontalSpeed = Phaser.Math.Linear(this.horizontalSpeed, -2, 0.05); // Déplace le monde vers la gauche
      } else {
        this.horizontalSpeed = Phaser.Math.Linear(this.horizontalSpeed, 0, 0.05); // Revenir au centre
      }
    }

    // Incrémenter le score
    this.score += this.scrollSpeed / 10;
    this.scoreText.setText(`Score: ${Math.floor(this.score)}`);

    // Faire défiler les arbres
    this.trees.forEach(tree => {
      tree.sprite.y -= this.scrollSpeed;

      // Gestion de l'infini vertical
      if (tree.sprite.y < -60) {
        tree.sprite.y = this.scale.height;
      }
    });
  }

  handleCollision(player, tree) {
  console.log('Collision détectée !');
  this.startScrolling = false; // Arrêter le défilement
  this.physics.pause(); // Arrêter uniquement la physique

  // Afficher un message "Game Over"
  this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'Game Over', {
    fontSize: '48px',
    fill: '#ff0000',
  }).setOrigin(0.5);

  // Ajouter un bouton Restart sous forme de texte interactif
  const restartText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Restart', {
    fontSize: '32px',
    fill: '#ffffff',
    backgroundColor: '#000000', // Fond noir pour le texte
    padding: { x: 10, y: 5 }, // Marges autour du texte
  })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true }) // Rendre interactif avec un curseur "main"
    .setDepth(10); // Place le texte au premier plan

  // Vérifier si le bouton est cliqué
  restartText.on('pointerdown', () => {
    console.log('Bouton Restart cliqué !');
    this.scene.restart(); // Redémarrer la scène
  });

  // Écouteur général pour confirmer les clics sur les objets interactifs
  this.input.on('gameobjectdown', (pointer, gameObject) => {
    console.log('Interaction détectée avec :', gameObject);
  });
}


  generateForest() {
    // Supprimer les arbres existants
    this.trees.forEach(tree => tree.sprite.destroy());
    this.trees = [];

    const treeSpacing = 80; // Espacement vertical entre les arbres
    const trackWidth = 200; // Largeur de la piste
    const sideTreeProbability = 0.3; // Réduction des arbres sur les côtés
    const trackTreeProbability = 0.6; // Augmentation des arbres sur le tracé

    for (let y = 0; y < this.scale.height; y += treeSpacing) {
      if (Math.random() < sideTreeProbability) {
        const leftX = Phaser.Math.Between(10, (this.scale.width / 2) - trackWidth / 2 - 40);
        const leftTree = new Tree(this, leftX, y); // Utilise la classe Tree
        this.trees.push(leftTree);
      }

      if (Math.random() < sideTreeProbability) {
        const rightX = Phaser.Math.Between((this.scale.width / 2) + trackWidth / 2 + 40, this.scale.width - 10);
        const rightTree = new Tree(this, rightX, y); // Utilise la classe Tree
        this.trees.push(rightTree);
      }

      if (Math.random() < trackTreeProbability) {
        const trackX = Phaser.Math.Between((this.scale.width / 2) - trackWidth / 2, (this.scale.width / 2) + trackWidth / 2);
        const trackTree = new Tree(this, trackX, y); // Utilise la classe Tree
        this.trees.push(trackTree);
      }
    }
  }

  handleResize(gameSize) {
    const { width, height } = gameSize;

    if (this.player) {
      this.player.resize(width, height);
    }

    this.generateForest();
  }
}

export default class Tree {
  constructor(scene, x, y) {
    this.scene = scene;

    // Ajouter un arbre avec la physique
    this.sprite = scene.physics.add.image(x, y, 'tree');
    this.sprite.setScale(2); // Ajuster visuellement la taille de l'arbre
    this.sprite.setImmovable(true); // Rendre l'arbre immobile dans le système de physique

    // Attacher une hitbox correspondant exactement à la taille de l'arbre après mise à l'échelle
    this.sprite.body.setSize(12, 30); // Utiliser la taille réelle du sprite
    this.sprite.body.setOffset(25, 20); // Pas de décalage, la hitbox correspond exactement au sprite
  }

  update() {
    // Les arbres sont fixes, aucune mise à jour nécessaire
  }
}

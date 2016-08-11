export class UnwrappedIngredientsStore {
  constructor() {
    this.state = Immutable.List();

    this.bindActions(Actions);
    this.exportPublicMethods({getIngredientById: this.getIngredientById});
  }

  onSetIngredients(ingredients) {
    return this.setState(ingredients);
  }

  //debugger

  getIngredientById(id) {
    let ingredient =  this.getState().find(ingred => ingred.get('id') === id);

    return ingredient ? ingredient : null;
  }
}

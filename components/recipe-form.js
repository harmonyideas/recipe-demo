import IngredientList from './ingredient-list'

export default function RecipeForm({
  recipeTitle,
  onTitleChange,
  recipeDescription,
  onDescriptionChange,
  recipeIngredients,
  onIngredientsChange,
  recipeInstructions,
  onInstructionsChange,
  recipeRegion,
  onRegionChange,
  onRecipeImageChange,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit} className="card card-body shadow-sm">
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input
          id="title"
          name='title'
          className="form-control"
          value={recipeTitle}
          placeholder='Title'
          onChange={onTitleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name='description'
          className="form-control"
          rows={3}
          value={recipeDescription}
          placeholder='Description'
          onChange={onDescriptionChange}
        />
      </div>

      <div className="mb-3">
        <IngredientList value={recipeIngredients} onChange={onIngredientsChange} />
      </div>

      <div className="mb-3">
        <label htmlFor="instructions" className="form-label">Instructions</label>
        <textarea
          id="instructions"
          name='instructions'
          className="form-control"
          rows={6}
          value={recipeInstructions}
          placeholder='Instructions'
          onChange={onInstructionsChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="region" className="form-label">Recipe region</label>
        <input
          id="region"
          name='region'
          className="form-control"
          value={recipeRegion}
          placeholder='Region'
          onChange={onRegionChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="recipe-image" className="form-label">Recipe image</label>
        <input
          id="recipe-image"
          name='recipe image'
          type='file'
          accept="image/*"
          className="form-control"
          onChange={onRecipeImageChange}
        />
        <div className="form-text">Image up to 5 MB.</div>
      </div>

      <div>
        <button type='submit' className="btn btn-primary px-4">Save recipe</button>
      </div>
    </form>
  )
}

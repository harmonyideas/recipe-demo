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
    <form onSubmit={onSubmit}>
      <div>
      <label>Title
        <input
          name='title'
          value={recipeTitle}
          placeholder='Title'
          onChange={onTitleChange}
        />
      </label>
      </div>
      <div>
      <label>Description
        <textarea
          name='description'
          value={recipeDescription}
          placeholder='Description'
          onChange={onDescriptionChange}
        />
      </label>
      </div>
      <div>
      <label>Ingredients
        <textarea
          name='ingredients'
          value={recipeIngredients}
          placeholder='Ingredients'
          onChange={onIngredientsChange}
        />
      </label>
      </div>
      <div>
      <label>Instructions
        <textarea
          name='instructions'
          value={recipeInstructions}
          placeholder='Instructions'
          onChange={onInstructionsChange}
        />
      </label>
      </div>
      <div>
      <label>Recipe region
        <input
          name='region'
          value={recipeRegion}
          placeholder='Region'
          onChange={onRegionChange}
        />
      </label>
      </div>

      <label>Recipe image
        <input
          name='recipe image'
          type='file'
          onChange={onRecipeImageChange}
        />
      </label>

      <button type='submit'>Save recipe</button>
    </form>
  )
}

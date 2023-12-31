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
      <label>Title
        <input
          name='title'
          value={recipeTitle}
          placeholder='Title'
          onChange={onTitleChange}
        />
      </label>

      <label>Description
        <input
          name='description'
          value={recipeDescription}
          placeholder='Description'
          onChange={onDescriptionChange}
        />
      </label>

      <label>Ingredients
        <input
          name='ingredients'
          value={recipeIngredients}
          placeholder='Ingredients'
          onChange={onIngredientsChange}
        />
      </label>

      <label>Instructions
        <input
          name='instructions'
          value={recipeInstructions}
          placeholder='Instructions'
          onChange={onInstructionsChange}
        />
      </label>

      <label>Recipe region
        <input
          name='region'
          value={recipeRegion}
          placeholder='Region'
          onChange={onRegionChange}
        />
      </label>

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

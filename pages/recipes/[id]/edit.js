import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { supabase } from '../../../supabase-client';
import RecipeForm from '../../../components/recipe-form';

export default function EditRecipe({ recipe }) {
  const [recipeTitle, setRecipeTitle] = useState(recipe.title)
  const [recipeDescription, setRecipeDescription] = useState(recipe.description)
  const [recipeIngredients, setRecipeIngredients] = useState(recipe.ingredients)
  const [recipeInstructions, setRecipeInstructions] = useState(recipe.instructions)
  const [recipeRegion, setRecipeRegion] = useState(recipe.region)
  const [recipeImagePath, setRecipeImagePath] = useState(recipe.file_path)
  const router = useRouter();

  return (
    <>
      <h1>Edit recipe</h1>
      <RecipeForm
        recipeTitle={recipeTitle}
        onTitleChange={(evt) => setRecipeTitle(evt.target.value)}
        recipeDescription={recipeDescription}
        onDescriptionChange={(evt) => setRecipeDescription(evt.target.value)}
        recipeIngredients={recipeIngredients}
        onIngredientsChange={(evt) => setRecipeIngredients(evt.target.value)}
        recipeInstructions={recipeInstructions}
        onInstructionsChange={(evt) => setRecipeInstructions(evt.target.value)}
        recipeRegion={recipeRegion}
        onRegionChange={(evt) => setRecipeRegion(evt.target.value)}
        onRecipeImageChange={(evt) => {
          const imageFile = evt.target.files[0]
          const imagePath = `public/${imageFile.name}`
          supabase.storage
            .from('recipe_images')
            .upload(
              imagePath,
              imageFile,
              { upsert: true })
            .then(response => {
              setrecipeImagePath(imagePath)
            })
            .catch(error => {
              // TODO: show error message popup
            })
        }}
        onSubmit={async (evt) => {
          evt.preventDefault();
          await supabase
            .from('recipes')
            .update({
              title: recipeTitle,
              description: recipeDescription,
              region: recipeRegion,
              file_path: recipeImagePath,
            })
            .match({
              id: recipe.id,
            });

          router.push('/')
        }}
      />
    </>
  )
}

export const getServerSideProps = async (context) => {
  // get the user using the "sb:token" cookie
  const { user } = await supabase.auth.api.getUserByCookie(context.req)
  if (!user) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      }
    }
  }

  supabase.auth.setAuth(context.req.cookies["sb:token"])
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', context.query.id)
    .single()

  if (error) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      recipe
    }
  }
}

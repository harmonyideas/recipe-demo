import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import RecipeForm from '../../components/recipe-form';
import { supabase } from '../../supabase-client';

export default function NewRecipe() {
  const [recipeTitle, setRecipeTitle] = useState('')
  const [recipeDescription, setRecipeDescription] = useState('')
  const [recipeIngredients, setRecipeIngredients] = useState('')
  const [recipeInstructions, setRecipeInstructions] = useState('')
  const [recipeRegion, setRecipeRegion] = useState('')
  const [recipeImagePath, setRecipeImagePath] = useState('')
  const router = useRouter();
  const session = supabase.auth.session();

  return (
    <>
      <h1>Create new recipe</h1>
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
            .from('recipe_images') // bucket name
            .upload(
              imagePath,
              imageFile,
              { upsert: true })
            .then(response => {
              setRecipeImagePath(imagePath)
            })
            .catch(error => {
              // TODO: show error message popup
            })
        }}
        onSubmit={async (evt) => {
          evt.preventDefault();
          await supabase
            .from('recipes')
            .insert({
              title: recipeTitle,
              description: recipeDescription,
              ingredients: recipeIngredients,
              instructions: recipeInstructions,
              region: recipeRegion,
              file_path: recipeImagePath,
              user_id: session.user.id,
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

  return {
    props: {}
  }
}

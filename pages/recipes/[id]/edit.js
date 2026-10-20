import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { supabase } from '../../../supabase-client';
import RecipeForm from '../../../components/recipe-form';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

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
        onRecipeImageChange={async (evt) => {
          const imageFile = evt.target.files[0]
          if (!imageFile) return
          if (!imageFile.type.startsWith('image/')) {
            alert('Please choose an image file.')
            evt.target.value = ''
            return
          }
          if (imageFile.size > MAX_IMAGE_BYTES) {
            alert('Image must be 5 MB or smaller.')
            evt.target.value = ''
            return
          }
          const userId = supabase.auth.user()?.id
          if (!userId) {
            alert('Please sign in again before uploading an image.')
            return
          }
          // Per-user folder plus a random name, so uploads never overwrite each other
          const extension = imageFile.name.includes('.')
            ? imageFile.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '')
            : ''
          const imagePath = `${userId}/${crypto.randomUUID()}${extension ? `.${extension}` : ''}`
          const { error } = await supabase.storage
            .from('recipe_images')
            .upload(imagePath, imageFile)
          if (error) {
            alert(`Image upload failed: ${error.message}`)
            return
          }
          setRecipeImagePath(imagePath)
        }}
        onSubmit={async (evt) => {
          evt.preventDefault();
          await supabase
            .from('recipes')
            .update({
              title: recipeTitle,
              description: recipeDescription,
              ingredients: recipeIngredients,
              instructions: recipeInstructions,
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

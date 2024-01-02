import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../../supabase-client'


export default function ViewRecipe({ recipe }) {
  const router = useRouter()
  const [signedUrl, setSignedUrl] = useState('')
  useEffect(() => {
    if (recipe.file_path) {
      // Signed URL
      supabase
        .storage
        .from('recipe_images') // bucket name
        .createSignedUrl(
          recipe.file_path, // path to the image in the bucket
          36000, // time that the URL is valid in seconds
        )
        .then(data => {
          if (data.error) {
            console.log(error);
          }
          setSignedUrl(data.signedURL)
        })
    }
  }, [recipe])

  // Public URL
  const recipeImageUrl = recipe.file_path ?
    supabase
      .storage
      .from('recipe_images') // bucket name
      .getPublicUrl(recipe.file_path) // path to the image in the bucket
      .publicURL
    :
    ''
  return (
    <>
      <h1>Recipe details</h1>
      <div className="container">
        <div className="row">
          <div className="col-xs-1">
            <label>Title: {recipe.title}</label>

            <label>Description: {recipe.description}</label>

            <label>Ingredients: {recipe.ingredients}</label>

            <label>Instructions: {recipe.instructions}</label>

            <label>Region: {recipe.region}</label>
            {
              signedUrl &&
              <div>
                <img src={signedUrl} />
              </div>
            }
          </div>
        </div>
      </div>

      <div>
        <Link href={`/recipes/${recipe.id}/edit`}>
          <a className='button'>Edit recipe</a>
        </Link>
        <button onClick={async (evt) => {
          const error = await supabase
            .from('recipes')
            .delete()
            .eq('id', recipe.id)
          console.log(error);
          router.replace('/')
        }}>Delete recipe</button>
      </div>
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

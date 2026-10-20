import { getRequestUser, serverClientFor } from '../../../utils/server-client'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../../supabase-client'
import Header from '../../../components/header'


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
        .then(({ data, error }) => {
          if (error) {
            console.log(error);
          }
          setSignedUrl(data?.signedUrl ?? '')
        })
    }
  }, [recipe])

  return (
    <>
      <Header />
      <main className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card card-body shadow-sm">
              <h2 className="mb-3">{recipe.title}</h2>

              {
                signedUrl &&
                <img src={signedUrl} className="detail-image mb-4" alt={recipe.title} />
              }

              <dl className="row mb-0">
                <dt className="col-sm-3 text-muted">Description</dt>
                <dd className="col-sm-9 pre-line">{recipe.description}</dd>

                <dt className="col-sm-3 text-muted">Ingredients</dt>
                <dd className="col-sm-9 pre-line">{recipe.ingredients}</dd>

                <dt className="col-sm-3 text-muted">Instructions</dt>
                <dd className="col-sm-9 pre-line">{recipe.instructions}</dd>

                <dt className="col-sm-3 text-muted">Region</dt>
                <dd className="col-sm-9">{recipe.region}</dd>
              </dl>
            </div>

            <div className="d-flex gap-2 mt-3 no-print">
              <Link href={`/recipes/${recipe.id}/edit`}>
                <a className='btn btn-outline-primary'>Edit recipe</a>
              </Link>
              <button className="btn btn-outline-secondary" onClick={() => window.print()}>
                Print recipe
              </button>
              <button className="btn btn-outline-danger" onClick={async (evt) => {
                const { error } = await supabase
                  .from('recipes')
                  .delete()
                  .eq('id', recipe.id)
                if (error) {
                  alert(`Could not delete the recipe: ${error.message}`)
                  return
                }
                if (recipe.file_path) {
                  const { error: removeError } = await supabase.storage
                    .from('recipe_images')
                    .remove([recipe.file_path])
                  if (removeError) {
                    console.error('Could not remove the recipe image:', removeError.message)
                  }
                }
                router.replace('/')
              }}>Delete recipe</button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps = async (context) => {
  // get the user using the "sb:token" cookie
  const { user, token } = await getRequestUser(context.req)
  if (!user) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      }
    }
  }

  const { data: recipe, error } = await serverClientFor(token)
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

import { getRequestUser, serverClientFor } from '../utils/server-client'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { supabase } from '../supabase-client'
import { useEffect, useState } from 'react'
import { useSession } from '../utils/user-context'
import Header from '../components/header';
import { syncAuthCookie } from '../utils/auth-cookie'

function RecipeCard({ recipe }) {
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
  }, [recipe.file_path])

  return (
    <div className="col-sm-6 col-lg-4 col-xl-3">
      <a href={`/recipes/${recipe.id}`} className="text-decoration-none text-reset">
        <div className="card h-100 shadow-sm recipe-card">
          {signedUrl && <img src={signedUrl} className="card-img-top recipe-thumb" alt={recipe.title} />}
          <div className="card-body">
            <h5 className="card-title mb-1">{recipe.title}</h5>
            {recipe.region && <p className="card-text text-muted small mb-0">{recipe.region}</p>}
          </div>
        </div>
      </a>
    </div>
  )
}

export default function Home({ recipes }) {
  const { session } = useSession()
  const router = useRouter()

  return (
    <>
      <Header />
      <main className="container py-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <h2 className="mb-0">All recipes</h2>
          <Link href="/recipes/new">
            <a className="btn btn-primary">+ Add new recipe</a>
          </Link>
        </div>

        {recipes.length === 0 && <p className="text-muted">No recipes yet. Add your first one!</p>}

        <div className="row g-4">
          {recipes.map((recipe) => (
            // each card is its own component so its hooks run at the top level
            <RecipeCard key={`card-${recipe.id}`} recipe={recipe} />
          ))}
        </div>
      </main>

      <footer className="container pb-4 text-end">
        {
          session &&
          <button className="btn btn-outline-secondary btn-sm" onClick={async () => {
            // Clear the server cookie before going to /signin; otherwise its
            // getServerSideProps still sees the user and sends them back here.
            await supabase.auth.signOut().catch(() => {})
            await syncAuthCookie('SIGNED_OUT', null).catch(() => {})
            router.replace('/signin')
          }}>Sign out</button>
        }
      </footer>
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

  // Query all recipes
  const { data: recipes, error } = await serverClientFor(token).from('recipes').select();

  if (error) {
    // Return 404 response.
    // No recipes found or something went wrong with the query
    return {
      notFound: true,
    }
  }

  return {
    props: {
      recipes,
    }
  }
}

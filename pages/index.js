import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { supabase } from '../supabase-client'
import { useSession } from '../utils/user-context'
import Header from '../components/header';

export default function Home({ recipes }) {
  const { session } = useSession()
  const router = useRouter()
  return (
    <>
        <div>
      <Header />
      <h2>Recipes</h2>
      <a href={`/recipes/new`}>+ Add New Recipe</a>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}><a href={`/recipes/${recipe.id}`}>{recipe.title}</a></li>
        ))}
      </ul>
    </div>
      <div>
        {
          session &&
          <>
            <pre>Session data</pre>
            <pre>Access token: {session.access_token}</pre>
            <pre>Email: {session.user?.email}</pre>
            <button onClick={() => {
              supabase.auth.signOut()
              router.replace('/signin')
            }}>Sign out</button>
          </>
        }
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

  // Query all recipes
  supabase.auth.setAuth(context.req.cookies['sb:token'])
  const { data: recipes, error } = await supabase.from('recipes').select();

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

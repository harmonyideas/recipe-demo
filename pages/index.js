import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { supabase } from '../supabase-client'
import { useSession } from '../utils/user-context'
import Header from '../components/header';

export default function Home({ recipes }) {
  const { session } = useSession()
  const router = useRouter()

  let results = recipes.results;
  let renderRows = [];

  recipes.forEach ((result, i) => {

    // prepare the array for a 4 column layout
    renderRows.push(
      <div key ={i} className="col-md-3">
        <div result={result}><a href={`/recipes/${result.id}`}>{result.title}</a></div> 
      </div>
    );

    // after four items add a new row 
    if((i+1) % 4 === 0) {
      renderRows.push(<div className ="row mt-4"></div>);
    }
  });

  return (
    <>
    <div>
      <Header />
      <a href={`/recipes/new`}>+ Add New Recipe</a>
      <div className="container">
        <div className="row">
          {renderRows}
        </div>
      </div>
    </div>
      <div>
      <footer className="contrast-footer footer-dark footer-shadow-dark p-5">
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
        </footer>
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

import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { supabase } from '../supabase-client'
import { useEffect, useState } from 'react'
import { useSession } from '../utils/user-context'
import Header from '../components/header';

export default function Home({ recipes }) {
  const { session } = useSession()
  const router = useRouter()

  let renderRows = [];

  recipes.forEach((result, i) => {
    const [signedUrl, setSignedUrl] = useState('')

    useEffect(() => {
      if (result.file_path) {
        // Signed URL
        supabase
          .storage
          .from('recipe_images') // bucket name
          .createSignedUrl(
            result.file_path, // path to the image in the bucket
            36000, // time that the URL is valid in seconds
          )
          .then(data => {
            if (data.error) {
              console.log(error);
            }
            setSignedUrl(data.signedURL)
          })
      }
    }, [result])

    // prepare the array for a 4 column layout
    renderRows.push(
      <div key={i} className="col-md-3">
        <div result={result}><a href={`/recipes/${result.id}`}>{result.title} {
          signedUrl &&
          <div>
            <img className="thumbnail" src={signedUrl} />
          </div>
        }</a></div>
      </div>
    );

    // after four items add a new row 
    if ((i + 1) % 4 === 0) {
      renderRows.push(<div key={i + 1} className="row mt-3"></div>);
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
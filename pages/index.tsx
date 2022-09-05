import Link from 'next/link'
import Layout from '../components/Layout'
import { createClient } from '@supabase/supabase-js'


export async function getServerSideProps() {
  
  const supabaseUrl = 'https://sqfzisbtabgaxfabtaqm.supabase.co'
  const supabaseRestUrl = 'https://sqfzisbtabgaxfabtaqm.supabase.co/rest/v1'
  const supabaseKey = process.env.SUPABASE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)

  // const { data, error } = await supabase
  // .from('profiles')
  // .select(`
  //     id
  // `);

  const { data, error } = await supabase
  .from('todos')
  .insert([
    { task: 'maybeh?' },
  ])


  console.log('data', data, 'error', error);

  return {
    props: {}
  }
}

const IndexPage = ({props}) => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Giftable 🎄🎁 </h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </Layout>
)

export default IndexPage

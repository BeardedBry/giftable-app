import Link from 'next/link';
import Layout from '../components/Layout';
import { createClient } from '@supabase/supabase-js';
import { Button } from "reakit/Button";

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

  return {
    props: {}
  }
}

const IndexPage = ({props}) => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Giftable 🎄🎁 </h1>
    <div>
      <Button className="p-2 bg-purple-500 text-white rounded-md">Create List</Button>
    </div>
  </Layout>
)

export default IndexPage

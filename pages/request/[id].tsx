import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'

import { User } from '../../interfaces'
import Layout from '../../components/Layout'
import ListDetail from '../../components/ListDetail'
import axios from 'axios'
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { NextParsedUrlQuery } from 'next/dist/server/request-meta'
import getProfile from '../../utils/get-profile'
import getGroup from '../../utils/get-group'


type Props = {
  item?: User
  errors?: string
}
// export const getServerSideProps = async (req: NextApiRequest, res: NextApiResponse) => {
export const getServerSideProps: GetServerSideProps = async ({ req, res, resolvedUrl, query }:
  { req: NextApiRequest, res: NextApiResponse, resolvedUrl, query }) => {

  const supabase = createServerSupabaseClient({ req, res, resolvedUrl })
  const { id: requestId } = query

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const profile = await getProfile(supabase, user.id);
  const userGroup = await getGroup(supabase, profile.id);


  let { data: request, error } = await supabase
    .from('requests')
    .select('*').eq('group', userGroup.group).eq('id', requestId).single();

  if (error || !request) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const {
    id,
    name,
    url,
    notes,
    recipient,
    requested_by,
    group,
    purchased_by,
    purchased_date 
  } = request;


  console.log('profile', profile);


  return {
    props: { pid: requestId }
  }
}

const RequestedItemPage = ({ pid }) => {
  //   if (errors) {
  //     return (
  //       <Layout title="">
  //         <p>
  //           <span style={{ color: 'red' }}>Error:</span> {errors}
  //         </p>
  //       </Layout>
  //     )
  //   }

  return (
    <Layout title={'itemName | User Detail'}>
      <p>item {pid}</p>
      {/* {item && <ListDetail item={item} />} */}
    </Layout>
  )
}

export default RequestedItemPage

// export const getStaticPaths: GetStaticPaths = async () => {
//   // Get the paths we want to pre-render based on users
//   const paths = sampleUserData.map((user) => ({
//     params: { id: user.id.toString() },
//   }))

//   // We'll pre-render only these paths at build time.
//   // { fallback: false } means other routes should 404.
//   return { paths, fallback: false }
// }

// // This function gets called at build time on server-side.
// // It won't be called on client-side, so you can even do
// // direct database queries.
// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   try {
//     const id = params?.id
//     const item = sampleUserData.find((data) => data.id === Number(id))
//     // By returning { props: item }, the StaticPropsDetail component
//     // will receive `item` as a prop at build time
//     return { props: { item } }
//   } catch (err: any) {
//     return { props: { errors: err.message } }
//   }
// }

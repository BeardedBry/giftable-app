import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'

import Layout from '../../components/Layout'
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { getProfileFromAuid, getProfileFromId } from '../../utils/get-profile'
import getGroup from '../../utils/get-group'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'


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

  const profile = await getProfileFromAuid(supabase, user.id);
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


  const requester = await getProfileFromId(supabase, requested_by);
  const receiver = await getProfileFromId(supabase, recipient);


  console.log('requester', requester);
  console.log('receiver', receiver);


  return {
    props: {
      pid: requestId,
      name,
      url,
      notes,
      group,
      purchased_by,
      purchased_date,
      requester: JSON.stringify(requester),
      receiver: JSON.stringify(receiver),
    }
  }
}

const RequestedItemPage = ({
  pid,
  name,
  url,
  notes,
  requester,
  receiver,
  group,
  purchased_by,
  purchased_date
}) => {
  //   if (errors) {
  //     return (
  //       <Layout title="">
  //         <p>
  //           <span style={{ color: 'red' }}>Error:</span> {errors}
  //         </p>
  //       </Layout>
  //     )
  //   }

  // const urlMetaQuery = useQuery({
  //   queryKey: [pid, url],
  //   queryFn: async () => {

  //     const metaData = await axios.post('/api/get-meta-data', { url });
  //     // const profilesData = groupData.data.data.filter(profile => profile.id !== profileId);
  //     console.log('metaData', metaData);

  //     return metaData;
  //   },
  //   staleTime: 60000,
  //   // cacheTime: 25000,
  // });



  return (
    <Layout title={'itemName | User Detail'}>
      {/* {item && <ListDetail item={item} />} */}
      <div className="container mx-auto" style={{ padding: '20px 0 100px 0' }}>
        <div className="border p-3">
          <h2 className="text-2xl md:text-3xl pb-3">{name}</h2>
          <div>
            {purchased_by ? (
              <span className="text-lg">🎅🏼 Already Purchased</span>
            ) : (
              <span className="text-lg">😦 Not purchased yet</span>
            )}
            {" - "}
            {url ? (
              <a href={url} target="_blank" className="text-xl visited:text-purple-800 text-blue-600">
                External Link
              </a>
            ) : null}
          </div>
          <span className="text-xs text-gray-400">{url}</span>
        </div>
        <hr className="my-6" />
      </div>
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

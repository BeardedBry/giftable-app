import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'

import { User } from '../../interfaces'
import Layout from '../../components/Layout'
import ListDetail from '../../components/ListDetail'

type Props = {
  item?: User
  errors?: string
}

export const getServerSideProps = async (req: NextApiRequest, res: NextApiResponse) => {

    const { id } = req.query
    
    return {
        props: {pid: id}
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

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { AddRequest } from '../../components/AddRequest';
import Layout from '../../components/Layout';
import { Spinner } from '../../components/Spinner';
import { useProfileData } from '../../hooks/useProfileData';

export const getServerSideProps = async (ctx) => {

    // check for session here and redirect to login is none.
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    console.log(session)

    if (!session)
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }

    return {
        props: {}
    }
}

const ListPage = ({ }) => {

    const [loadingList, displayName, profileId] = useProfileData();

    return (
        <Layout title="Home">
            <div className="my-6">
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl text-center">Friends Lists</h2>
                </div>

                <hr className="my-6" />
                {loadingList ? (
                    <Spinner />
                ) : (
                    <div className="flex flex-col gap-3">
                        <h2 className="text-xl text-center">Your Wish List</h2>
                        <div>
                            <AddRequest id={profileId} />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )

}

export default ListPage;
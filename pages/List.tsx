import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { AddRequest } from '../components/AddRequest';
import Layout from '../components/Layout';
import { useProfileData } from '../hooks/useProfileData';

const ListPage = ({ }) => {

    const [loading, displayName, profileId] = useProfileData();

    return (
        <Layout title="Home">

            <div className="flex flex-col gap-3">
                <h2 className="text-xl text-center">{displayName}'s Wish List</h2>
                <div>
                    <AddRequest id={profileId} />
                </div>
            </div>
        </Layout>
    )

}

export default ListPage;

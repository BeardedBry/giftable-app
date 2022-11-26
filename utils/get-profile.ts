
export default async function getProfile(supabase, userId) {
    try {
        let { data, error, status } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_user', userId)
            .single()

        if (error && status !== 406) {
            console.log('status', status);
            throw error
        }

        if (data) {
            return data;
        }
    } catch (error) {
        // alert('Error loading user data!')
        console.error(error);
        // console.log(error)
    }
}
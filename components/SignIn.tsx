import { useSupabaseClient } from '@supabase/auth-helpers-react';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { Button } from "reakit/Button";
import { Input } from "reakit/Input";

const SignIn = () => {

    // const supabase = useSupabaseClient()

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const router = useRouter();

    // async function signInWithEmail() {
    //     const { data, error } = await supabase.auth.signInWithPassword({
    //         email: email,
    //         password: password,
    //     })
    //     // console.log('data', data);
    //     // console.log('error', error);
    // }

    async function signIn(e) {
        e.preventDefault();
        try {
            const res = await axios.post('/api/signin', {
                email, password
            });

            if (res.status == 200) {
                router.push(res.data);
            }
        } catch (error) {
            console.error(error);
        }
        // router.replace("/profile")
    }

    return (
        <form onSubmit={signIn} className="flex flex-col w-60 gap-2 m-auto mt-12">
            <label className="text-left" htmlFor="email">Email:</label>
            <Input required className="border py-1" placeholder="Email" id="email" name="email" onChange={(e => setEmail(e.target.value))} value={email} />
            <label className="text-left" htmlFor="password">Password:</label>
            <Input required className="border py-1" placeholder="Password" id="password" name="password" type="password" onChange={(e => setPassword(e.target.value))} value={password} />
            <Button
                className="p-2 bg-purple-500 text-white rounded-md"
                type="submit"
                value="Submit"
            // onClick={signInWithEmail}
            >
                Sign In
            </Button>
        </form>
    )
}

export default SignIn;
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React from 'react';
import { Button } from "reakit/Button";
import { Input } from "reakit/Input";

const SignIn = () => {

    const supabase = useSupabaseClient()

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    async function signInWithEmail() {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        console.log('data', data);
        console.log('error', error);
    }

    return (
        <div className="flex flex-col w-60 gap-2">
            <h2>User</h2>
            <Input placeholder="Email" onChange={(e => setEmail(e.target.value))} value={email} />
            <Input placeholder="Password" type="password" onChange={(e => setPassword(e.target.value))} />
            <Button
                className="p-2 bg-purple-500 text-white rounded-md"
                onClick={signInWithEmail}
            >
                Sign In
            </Button>
        </div>
    )
}

export default SignIn;
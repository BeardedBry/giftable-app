import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Button } from "reakit/Button";
import { Input } from "reakit/Input";


const NewUser = () => {

    const supabase = useSupabaseClient()
    const user = useUser()

    const [name, setName] = useState("");

    const addUser = async () => {
        if (!name) {
            return;
        }
        const { data, error } = await supabase
            .from('users')
            .insert([
                { display_name: name, auth_user: user.id },
            ])

        console.log(' data, error', data, error);
    }

    return (
        <div className="py-3 flex flex-wrap gap-2">
            <Input
                className="border border-slate-800 p-1"
                placeholder="username"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value) }}
            />
            <Button onClick={addUser}>Submit</Button>
        </div>
    )
}

export { NewUser }
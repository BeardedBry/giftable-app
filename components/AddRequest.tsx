import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Button } from "reakit/Button";
import { Input } from "reakit/Input";
import { useProfileData } from "../hooks/useProfileData";


const AddRequest = ({ id }) => {

    const supabase = useSupabaseClient()
    // const user = useUser()

    // console.log('user', user);

    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [notes, setNotes] = useState("");

    const addItem = async () => {

        if (!name) {
            return;
        }

        const { data, error } = await supabase
            .from('requests')
            .insert([
                {
                    name: name,
                    url: url,
                    notes: notes,
                    requested_by: id,
                    recipient: id,
                },
            ]);

        console.log(' data, error', data, error);

    }

    return (
        <div className="py-3 flex flex-wrap gap-2">
            <Input
                className="border border-slate-800 p-1"
                placeholder="name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value) }}
            />
            <Input
                className="border border-slate-800 p-1"
                placeholder="note"
                type="text"
                value={notes}
                onChange={(e) => { setNotes(e.target.value) }}
            />
            <Input
                className="border border-slate-800 p-1"
                placeholder="url?"
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value) }}
            />
            <Button onClick={addItem}>Add</Button>
        </div>
    )
}

export { AddRequest }
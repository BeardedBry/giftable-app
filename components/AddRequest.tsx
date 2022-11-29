import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "reakit/Button";
import { Input } from "reakit/Input";


type Request = {
    name: string,
    url: string,
    notes: string,
    requested_by: number,
    recipient: number,
}


const AddRequest = ({ id, requesterId }) => {

    const supabase = useSupabaseClient();
    const queryClient = useQueryClient();

    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [notes, setNotes] = useState("");

    const itemMutation = useMutation({
        mutationFn: async (props: Request) => {
            const { data, error } = await supabase
                .from('requests')
                .insert([
                    props,
                ])
            return error ?? data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [id] })
        },
        onError: (e) => {
            console.error('error', e)
        }
    });


    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault()
                itemMutation.mutate({
                    name: name,
                    url: url,
                    notes: notes,
                    requested_by: requesterId,
                    recipient: id,
                });
            }} className="py-3 flex flex-wrap gap-2">
                <Input
                    className="border border-slate-800 p-1"
                    placeholder="name"
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                    required
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
                <Button type="submit">Add To Wish List</Button>
            </form>
        </div>
    )
}

export { AddRequest }
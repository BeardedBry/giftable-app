import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "reakit/Button";
import { Input } from "reakit/Input";
import Modal from 'react-modal';

Modal.setAppElement('#__next');

type Request = {
    name: string,
    url: string,
    notes: string,
    requested_by: number,
    recipient: number,
}

type AddRequestProps = {
    listOwnerId: number;
    requesterId: number;
    listDisplayName: string;
}


const AddRequest = ({ listOwnerId, requesterId, listDisplayName }: AddRequestProps) => {

    const supabase = useSupabaseClient();
    const queryClient = useQueryClient();
    const isMyList = listOwnerId == requesterId;

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
            queryClient.invalidateQueries({ queryKey: [listOwnerId] })
            setName("");
            setUrl("");
            setNotes("");
        },
        onError: (e) => {
            console.error('error', e)
        }
    });

    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }


    return (
        <div>
            <button 
                className={`inline-block px-6 py-2.5 
                    ${isMyList ? 'bg-green-500 hover:bg-green-700 focus:bg-green-700 active:bg-green-800' : 'bg-purple-500 hover:bg-purple-700 focus:bg-purple-700 active:bg-purple-800'} 
                    text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out`}
                onClick={openModal}>
                    Add Gift
                </button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                // style={customStyles}
                contentLabel="Example Modal"
            >
                <form onSubmit={(e) => {
                    e.preventDefault()
                    itemMutation.mutate({
                        name: name,
                        url: url,
                        notes: notes,
                        requested_by: requesterId,
                        recipient: listOwnerId,
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
                    <Button className={`p-3 text-white rounded ${isMyList ? 'bg-green-500' : 'bg-purple-500'}`} type="submit">
                        {isMyList ? 'Add To My Wish List' : `Add to ${listDisplayName}'s List`}
                    </Button>
                    {!isMyList && <span className="text-slate-400 text-sm">Hidden from this User but everyone else can see it.</span>}
                </form>
            </Modal>
        </div>
    )
}

export { AddRequest }
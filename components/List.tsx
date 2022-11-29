import * as React from 'react'
import ListItem from './ListItem'
import { AddRequest } from './AddRequest'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Input, Button } from 'reakit';


type Props = {
  id: number;
  display_name: string;
  profileId: number;
}

export type Request = {
  id: number;
  name: string;
  notes: string;
  recipient: number;
  requested_by: number;
  url: string;
}

const List = ({ props }: { props: Props }) => {

  const { id, display_name, profileId } = props;
  const [items, setItems] = React.useState([]);
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient()

  // id, name, url, notes, recipient, requested_by 

  const query = useQuery({
    queryKey: [id],
    queryFn: async () => {

      let { data: requests, error } = await supabase
        .from('requests')
        .select('*').eq('recipient', id)

      return requests;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (requestId: number) => await supabase
      .from('requests')
      .delete()
      .eq('id', requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [id] })
    },
    onError: (e) => {
      console.error('error', e)
    }
  });

  // console.log('query', query.data)

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl text-center">{display_name}'s' Wish List</h2>
      <ul>
        {query.data?.map((request: Request, index) => (
          <li key={request.id} className="even:bg-slate-100 p-2 py-4">
            <ListItem data={request} />
            <button
              onClick={() => { deleteMutation.mutate(request.id) }}
              className="bg-slate-300 text-sm mt-4 p-2 rounded">
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div>
        <AddRequest id={id} requesterId={profileId} />
      </div>
    </div>
  )
}

// const List = ({ items }: Props) => (
// )

export default List

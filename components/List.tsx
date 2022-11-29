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

  const { id: listUserId, display_name: listDisplayName, profileId: userProfileId } = props;
  const [items, setItems] = React.useState([]);
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient()

  const isMyList = listUserId === userProfileId;

  // id, name, url, notes, recipient, requested_by 

  const query = useQuery({
    queryKey: [listUserId],
    queryFn: async () => {

      let { data: requests, error } = await supabase
        .from('requests')
        .select('*').eq('recipient', listUserId)

      return requests;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (requestId: number) => await supabase
      .from('requests')
      .delete()
      .eq('id', requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [listUserId] })
    },
    onError: (e) => {
      console.error('error', e)
    }
  });

  // console.log('query', query.data)

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl text-center">{listDisplayName}'s' Wish List</h2>
      <ul>
        {query.data?.map((request: Request, index) => {
          
          if (request.requested_by !== userProfileId && listUserId === userProfileId) {
            return;
          }

          const isRequestedByAnother = request.requested_by !== listUserId;

          return (
            <li key={request.id} className={`even:bg-slate-100 p-2 py-4`}>
              <ListItem data={request} isRequestedByAnother={isRequestedByAnother} />
              <button
                onClick={() => { deleteMutation.mutate(request.id) }}
                className="bg-slate-300 text-sm mt-4 p-2 rounded">
                Remove
              </button>
            </li>
          )
        })}
      </ul>
      <div>
        <AddRequest id={listUserId} requesterId={userProfileId} isMyList={isMyList} listDisplayName={listDisplayName} />
      </div>
    </div>
  )
}

// const List = ({ items }: Props) => (
// )

export default List

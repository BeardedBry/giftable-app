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
  group: number;
  name: string;
  notes: string;
  purchased_by: null | number;
  purchased_date: null | number;
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
      <ul className="flex flex-col gap-2">
        {query.data?.map((request: Request, index) => {

          if (request.requested_by !== userProfileId && listUserId === userProfileId) {
            return;
          }

          console.log('request', request);

          const isRequestedByAnother = request.requested_by !== listUserId;
          const isRemovable = request.requested_by == userProfileId;
          const isPurchased = request.purchased_by;
          const purchaseDate = request.purchased_date;

          return (
            <li key={request.id} className={`even:bg-slate-100 p-2 py-4 border-2 rounded`}>
              <ListItem data={request} isRequestedByAnother={isRequestedByAnother} />
              <hr className="my-1" />
              <div className="mt-2">
                {isRemovable ? (
                  <button
                    onClick={() => { deleteMutation.mutate(request.id) }}
                    className="bg-slate-300 text-sm mr-2 p-2 rounded">
                    Remove
                  </button>
                ) : null}

                {isPurchased ? (
                  <span className="p-2 bg-green-400">Purchased on {purchaseDate}</span>
                ) : (
                  <button
                    onClick={() => { }}
                    className="bg-gray-300 border text-sm p-2 rounded">
                    🎁 Mark as Purchased
                  </button>
                )}
              </div>
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

import * as React from 'react'
import ListItem from './ListItem'
import { AddRequest } from './AddRequest'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Input, Button } from 'reakit';
import dynamic from 'next/dynamic'
import PurchaseButton from '../components/PurchaseButton';
import RemoveButton from './RemoveButton'


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
  purchased_date: null | Date;
  recipient: number;
  requested_by: number;
  url: string;
}

// function Requests({requests}){

// }


const List = ({ props }: { props: Props }) => {

  const { id: listUserId, display_name: listDisplayName, profileId: userProfileId } = props;

  const [items, setItems] = React.useState([]);
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient()
  const isMyList = listUserId === userProfileId;

  const query = useQuery({
    queryKey: [listUserId],
    queryFn: async () => {

      let { data: requests, error } = await supabase
        .from('requests')
        .select('*').eq('recipient', listUserId)

      // console.log(requests)

      return requests;
    },
    refetchOnMount: "always",
  });

  // console.log('query data', query.data);


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


  const markAsPurchased = async (supabase, purchaserId, itemId) => {

    const { error } = await supabase
      .from('requests')
      .update({ purchased_by: purchaserId, purchased_date: new Date() })
      .eq('id', itemId)

    if (error) {
      console.error(error);
    } else {
      queryClient.invalidateQueries({ queryKey: [listUserId] })
    }
  }


  const sortedItems = () => {

    if(!query.data){
      return null;
    }

    let data;

    data = query.data;

    if (!isMyList) {
      // data.filter((request: Request) => (request.requested_by == userProfileId && listUserId === userProfileId))
      data.sort((a: Request, b: Request) => {
        return a.purchased_by ?? 0 - b.purchased_by ?? 0;
      })
    }

    return data;
  }
    

    sortedItems();

    // console.log('query', query.data)

    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-xl text-center">{listDisplayName}'s' Wish List</h2>
        <ul className="flex flex-col gap-2">
          {sortedItems()?.map((request: Request, index) => {

            if (request.requested_by !== userProfileId && listUserId === userProfileId) {
              return;
            }
            
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
                    <RemoveButton action={() => { deleteMutation.mutate(request.id) }}>
                      <p>Remove <span className="bg-green-400">{request.name}</span> from {listDisplayName}'s list?</p>
                    </RemoveButton>
                    // <button
                    //   onClick={}
                    //   className="bg-slate-300 text-sm mr-2 p-2 rounded">
                    // </button>
                  ) : null}

                  {isPurchased && !isMyList ? (
                    // <span className="p-2 bg-green-400">Purchased on {purchaseDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) }</span>
                    <span className="p-2 bg-green-400">Purchased on {purchaseDate} </span>
                  ) : !isMyList ? (
                    <PurchaseButton action={() => markAsPurchased(supabase, userProfileId, request.id)}>
                      <p>Have you purchased {request.name} for {listDisplayName}?</p>
                    </PurchaseButton>
                  ) : null}
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

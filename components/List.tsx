import * as React from 'react'
import ListItem from './ListItem'
import { AddRequest } from './AddRequest'
import { useQuery } from '@tanstack/react-query'
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

  // console.log('query', query.data)

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl text-center">{display_name}'s' Wish List</h2>
      <ul>
        {query.data?.map((request: Request, index) => (
          <li key={request.id} className="even:bg-slate-100 p-2 py-4">
            <ListItem data={request} />
            {/* <Button className="bg-slate-300 text-sm mt-4">Remove</Button> */}
          </li>
        ))}
      </ul>
      <div>
        <AddRequest id={id} />
      </div>
    </div>
  )
}

// const List = ({ items }: Props) => (
// )

export default List

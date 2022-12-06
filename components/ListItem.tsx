import React from 'react'
import Link from 'next/link'

import { Request } from './List'
import { useAppContext } from './context'

type ListItemProps = {
  data: Request,
  isRequestedByAnother: boolean
}

{/* <a href={request.url} target="_blank" className="text-xl visited:text-purple-800 text-blue-600">
External Link
</a> */}

const ListItem = ({ data, isRequestedByAnother }: ListItemProps) => {

  const {data: appData} = useAppContext();
  
  const requestedBy = appData.profiles.find((profile) => profile.id == data.requested_by)

  return (
    <div>
      <div className="flex justify-between">
        <a href={data?.url ?? null} target="_blank" className="border-r px-6 pl-0 w-full hover:text-sky-600">
          {/* <Link href="/request/[id]" as={`/request/${data.id}`} className="border"> */}
          {/* <div className=""> */}
          <p className="text-gray-500">Name</p>
          <p className="font-semibold">{data.name}</p>
          {/* <div className="border-r px-6 w-72">
          <p className="text-gray-500">Status</p>
          <p className={`font-semibold text-center text-white ${data.purchased_by ? 'bg-green-400' : 'bg-red-400'}`}>
            {data.purchased_by ? (
              <span className="">Purchased{data.purchased_by}</span>
            ) : (<span>Not Purchased</span>)
            }
          </p>
        </div> */}
          {/* <div className="border-r px-6">
          <p className="text-gray-500">URL</p>
          <p className="font-semibold">{data.url ?? "N/A"}</p>
        </div> */}
          {/* </div> */}
          <span className="text-xs text-gray-400">{data?.url}</span>
        </a>
        <div className="px-6">
          <p className="text-gray-500">Requested by</p>
          <p className={`font-semibold ${isRequestedByAnother ? 'text-violet-500' : 'text-green-400'}`}>{requestedBy.display_name}</p>
        </div>
      </div>
    </div>
  )
}

export default ListItem

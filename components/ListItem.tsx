import React from 'react'
import Link from 'next/link'

import { User } from '../interfaces'
import { Request } from './List'

const ListItem = ({ data }: { data: Request }) => (
  <Link href="/request/[id]" as={`/request/${data.id}`}>
    <a>
      <div className="flex justify-between">
        <div className="border-r px-6 pl-0 w-36">
          <p className="text-gray-500">Name</p>
          <p className="font-semibold">{data.name}</p>
        </div>
          <div className="border-r px-6 w-36">
            <p className="text-gray-500">Notes</p>
            <p className="font-semibold">{data.notes ?? "N/A"}</p>
          </div>
          <div className="px-6">
            <p className="text-gray-500">URL</p>
            <p className="font-semibold">{data.url ?? "N/A"}</p>
          </div>
      </div>
    </a>
  </Link>
)

export default ListItem

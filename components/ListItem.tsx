import React from 'react'
import Link from 'next/link'

import { User } from '../interfaces'
import { Request } from './List'

const ListItem = ({data}: {data: Request}) => (
  <Link href="/request/[id]" as={`/request/${data.id}`}>
    <a>
      <div>

      </div>
      {data.name} -  {data.notes} - {data.url}
    </a>
  </Link>
)

export default ListItem



import type { FC } from 'react'

const Scheduler: FC = () => {
  return (
    <div className="w-full px-4">
      <div className="w-full h-full flex items-center justify-center">
        <img
          src="/images/loading.gif"
          alt="loading"
          className="w-36 h-36 object-cover"
        />
      </div>
    </div>
  )
}

export default Scheduler

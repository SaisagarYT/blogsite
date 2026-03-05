import React from 'react'
import HomepageButton from '../reusableComponents/HomepageButton'
import Webassets from '../assets/Assets'

const HomepageBlog = ({image,name,tag,date,title,description,likes,comments,shares,onClick}) => {
  return (
    <section onClick={onClick} className='w-full border border-(--bg-primary) p-4 md:p-5 lg:p-6 flex flex-col items-start gap-3 md:gap-4 h-full cursor-pointer'>
        <div className='w-full flex gap-3 items-center'>
          <img src={image} alt={name} className='w-10 md:w-12 h-10 md:h-12 rounded-full object-cover' />
          <div className=''>
            <p className='text-xs md:text-sm font-semibold'>{name}</p>
            <p className='text-(--text-secondary) text-xs md:text-sm'>{tag}</p>
          </div>
        </div>
        <div className='w-full flex flex-col gap-1 md:gap-2'>
          <p className='text-xs md:text-sm text-(--text-secondary)'>{date}</p>
          <h1 className='text-lg md:text-xl lg:text-2xl font-semibold line-clamp-2'>{title}</h1>
          <p className='text-(--text-secondary) text-xs md:text-sm line-clamp-3'>{description}</p>
        </div>
        <div className='mt-2'>
          <HomepageButton
            onClick={(event) => {
              event.stopPropagation();
              onClick?.();
            }}
            text="View Blog"
            icon={Webassets.arrowMark}
          />
        </div>
      </section>
  )
}

export default HomepageBlog

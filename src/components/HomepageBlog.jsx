import React from 'react'
import HomepageButton from '../reusableComponents/HomepageButton'
import Webassets from '../assets/Assets'

const HomepageBlog = ({image,name,tag,date,title,description,likes,comments,shares}) => {
  return (
    <section className='w-full px-2 md:px-4 lg:px-30 max-sm:flex-col max-sm:items-start border flex flex-col md:flex-row md:items-center border-(--bg-primary)'>
        <div className='flex-1/8 py-8 md:py-20 flex gap-3 md:gap-5 items-center flex-shrink-0'>
          <img src={image} alt={name} className='w-10 md:w-12 h-10 md:h-12 rounded-full object-cover' />
          <div className=''>
            <p className='text-xs md:text-sm font-semibold'>{name}</p>
            <p className='text-(--text-secondary) text-xs md:text-sm'>{tag}</p>
          </div>
        </div>
        <div className='flex-1/2 flex flex-col gap-1 md:gap-2 px-2 md:px-4'>
          <p className='text-xs md:text-sm text-(--text-secondary)'>{date}</p>
          <h1 className='text-lg md:text-xl lg:text-2xl font-semibold line-clamp-2'>{title}</h1>
          <p className='text-(--text-secondary) text-xs md:text-sm line-clamp-2'>{description}</p>
            <div>

            </div>
        </div>
        <div className='flex-shrink-0 mt-3 md:mt-0'>
          <HomepageButton text="View Blog" icon={Webassets.arrowMark}/>
        </div>
      </section>
  )
}

export default HomepageBlog

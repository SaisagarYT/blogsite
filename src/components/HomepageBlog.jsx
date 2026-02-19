import React from 'react'
import HomepageButton from '../reusableComponents/HomepageButton'
import Webassets from '../assets/Assets'

const HomepageBlog = ({image,name,tag,date,title,description,likes,comments,shares}) => {
  return (
    <section className='w-full px-30 max-sm:p-0 max-sm:flex-col max-sm:items-start border flex items-center border-(--bg-primary)'>
        <div className='flex-1/8 py-20 flex gap-5 items-center'>
          <img src={image} alt="" />
          <div className=''>
            <p>{name}</p>
            <p className='text-(--text-secondary)'>{tag}</p>
          </div>
        </div>
        <div className='flex-1/2 flex flex-col gap-2'>
          <p>{date}</p>
          <h1 className='text-3xl'>{title}</h1>
          <p className='text-(--text-secondary)'>{description}</p>
            <div>

            </div>
        </div>
        <HomepageButton text="View Blog" icon={Webassets.arrowMark}/>
      </section>
  )
}

export default HomepageBlog

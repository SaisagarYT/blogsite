import React from 'react'

const HomepageCard = ({icon,title,subTitle,text,icon2}) => {
  return (
    <section className='w-full flex justify-center h-full border-r border-(--bg-primary) py-6 md:py-10'>
        <div className='flex flex-col items-start'>
            <img className='scale-50 md:scale-75' src={icon} alt="" />
            <p className='font-medium text-sm md:text-base'>{title}</p>
            <p className='text-(--text-secondary) text-xs md:text-sm'>{subTitle}</p>
            <br />
            <p className='text-sm md:text-base'>{text}</p>
        </div>
        <div className='flex items-center'>
            <img src={icon2} className='scale-50 md:scale-75' alt="" />
        </div>
    </section>
  )
}

export default HomepageCard

import React from 'react'

const HomepageCard = ({icon,title,subTitle,text,icon2}) => {
  return (
    <section className='w-full flex justify-center h-full border-r border-(--bg-primary)  py-10'>
        <div className='flex flex-col items-start'>
            <img className='scale-50' src={icon} alt="" />
            <p className='font-medium'>{title}</p>
            <p className='text-(--text-secondary)'>{subTitle}</p>
            <br />
            <p className=''>{text}</p>
        </div>
        <div className='flex items-center'>
            <img src={icon2} className='scale-50' alt="" />
        </div>
    </section>
  )
}

export default HomepageCard

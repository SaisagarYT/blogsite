import React from 'react'
import HomepageButton from './HomepageButton'
import HomepagePersons from './HomepagePersons'
import Webassets from '../assets/Assets'

const HomepageBooks = ({title,desc,image,image2,type,text,icon,title2,desc2}) => {
  return (
    <div className='flex flex-col lg:flex-row'>
        <div className='border-r max-sm:border-r-0 max-sm:flex-col max-sm:flex border-b border-(--bg-secondary) flex-1/10 flex justify-center items-center'>
          <div className='flex flex-col py-8 md:py-16 lg:py-20 px-4 md:px-8 lg:px-20 items-start gap-3 md:gap-4'>
            <img src={image} alt="" className='w-12 md:w-16' />
          <h1 className='font-bold text-lg md:text-2xl'>{title}</h1>
          <p className='text-sm md:text-base text-(--text-secondary)'>{desc}</p>
          <HomepageButton text={text} icon={icon}/>
          <HomepagePersons type={type}/>
          </div>
        </div>
        <div className='flex flex-col border-b border-(--bg-secondary) py-8 md:py-10 gap-3 md:gap-4 px-4 md:px-8 lg:px-40 justify-center items-start flex-1/2'>
            <div className='flex flex-col lg:flex-row gap-2 md:gap-4'>
                <h1 className='font-bold text-lg md:text-xl lg:w-1/4'>{title2}</h1>
                <p className='text-(--text-secondary) text-sm md:text-base'>{desc2}</p>
            </div>
            <img src={image2} alt="" className='w-full h-auto' />
            <div className='flex flex-col lg:flex-row gap-3 md:gap-4 w-full'>
                <div className='bg-(--bg-secondary) w-full lg:w-2/9 py-4 md:py-6 px-4 md:px-5 rounded-xl'>
                    <h1 className='text-(--text-secondary) text-xs md:text-sm'>Total Ebooks</h1>
                    <p className='font-semibold text-sm md:text-base'>Over 100 ebooks</p>
                </div>
                <div className='bg-(--bg-secondary) justify-between items-start md:items-center flex flex-col md:flex-row py-4 md:py-6 px-4 md:px-5 w-full rounded-xl gap-2 md:gap-0'> 
                    <div> 
                        <h1 className='text-(--text-secondary) text-xs md:text-sm'>Download Formats</h1>
                        <p className='font-semibold text-sm md:text-base'>PDF format to access</p>
                    </div>
                    <HomepageButton text="Preview" icon={Webassets.arrowMark}/>
                </div>
            </div>
            <div className='bg-(--bg-secondary) py-4 md:py-6 px-4 md:px-5 w-full gap-2 flex flex-col'>
                <h1 className='text-(--text-secondary) text-xs md:text-sm font-semibold'>Average Author Expertise</h1>
                <p className='text-sm md:text-base'>Whitepapers are authored by subject matter experts with an average of 20 years of experience.</p>
            </div>
        </div>
      </div>
  )
}

export default HomepageBooks

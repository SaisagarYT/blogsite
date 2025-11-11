import React from 'react'
import HomepageButton from './HomepageButton'
import HomepagePersons from './HomepagePersons'
import Webassets from '../assets/Assets'

const HomepageBooks = ({title,desc,image,image2,type,text,icon,title2,desc2}) => {
  return (
    <div className='flex'>
        <div className='border-r border-b border-(--bg-secondary) flex-1/10 flex justify-center items-center'>
          <div className='flex flex-col py-20 px-20 items-start gap-4'>
            <img src={image} alt="" />
          <h1>{title}</h1>
          <p>{desc}</p>
          <HomepageButton text={text} icon={icon}/>
          <HomepagePersons type={type}/>
          </div>
        </div>
        <div className='flex flex-col border-b border-(--bg-secondary) py-10 gap-4 px-40 justify-center items-start flex-1/2'>
            <div className='flex gap-4'>
                <h1 className='text-xl w-1/4'>{title2}</h1>
                <p className='text-(--text-secondary)'>{desc2}</p>
            </div>
            <img src={image2} alt="" />
            <div className='flex gap-4 w-full'>
                <div className='bg-(--bg-secondary)  w-2/9 py-6 px-5 rounded-xl'>
                    <h1 className='text-(--text-secondary)'>Total Ebooks</h1>
                    <p>Over 100 ebooks</p>
                </div>
                <div className='bg-(--bg-secondary) justify-between items-center flex py-6 px-5 w-full rounded-xl'> 
                    <div> 
                        <h1 className='text-(--text-secondary)'>Download Formats</h1>
                        <p>PDF format to access</p>
                    </div>
                    <HomepageButton text="Preview" icon={Webassets.arrowMark}/>
                </div>
            </div>
            <div className='bg-(--bg-secondary) py-6 px-5 w-full gap-2 flex flex-col'>
                <h1 className='text-(--text-secondary)'>Average Author Expertise</h1>
                <p>Whitepapers are authored by subject matter experts with an average of 20 years of experience.</p>
            </div>
        </div>
      </div>
  )
}

export default HomepageBooks

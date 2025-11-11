import React from 'react';
import Webassets from '../assets/Assets';

const HomepageTestimonials = ({userName,image,address,review,stars}) => {
  const star = [1,2,3,4,5];
  return (
    <section className='flex flex-col items-center flex-1/2 border border-(--bg-secondary) px-10 py-20'>
      <div className='flex justify-center items-center'>
        <img className='scale-75' src={image} alt="" />
        <ul>
          <p className=''>{userName}</p>
          <p className='text-(--text-secondary) '>{address}</p>
        </ul>
      </div>
      <div className='py-4 px-6 items-center flex flex-col justify-center'>
        <div className='flex w-fit border border-(--text-secondary) rounded-md translate-y-4 items-center justify-center gap-2 px-3 py-2 bg-(--bg-background)'>
          {
            star.map((i,x) =>{
              return <li className='list-none'>{i}</li>
            })
          }
        </div>
        <p className='w-80 text-center border border-(--text-secondary) py-3 bg-(--bg-secondary) px-5 rounded-xl'>
          {review}
        </p>
      </div>
    </section>
  )
}

export default HomepageTestimonials

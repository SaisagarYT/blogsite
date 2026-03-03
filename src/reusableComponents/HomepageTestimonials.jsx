const HomepageTestimonials = ({ userName, image, address, review, stars }) => {
  const star = [1, 2, 3, 4, 5];
  return (
    <section className="flex flex-col items-center flex-1/2 border border-(--bg-secondary) px-6 md:px-10 py-8 md:py-20">
      <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4">
        <img className="scale-75 w-16 h-16 rounded-full object-cover" src={image} alt="" />
        <ul>
          <p className="font-semibold text-sm md:text-base">{userName}</p>
          <p className="text-(--text-secondary) text-xs md:text-sm">{address}</p>
        </ul>
      </div>
      <div className="py-3 md:py-4 px-3 md:px-6 items-center flex flex-col justify-center">
        <div className="flex w-fit border border-(--text-secondary) rounded-md translate-y-3 md:translate-y-4 items-center justify-center gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-(--bg-background) text-xs md:text-sm">
          {star.map((i, x) => (
            <li className="list-none" key={x}>
              ⭐
            </li>
          ))}
        </div>
        <p className="w-auto md:w-80 text-center border border-(--text-secondary) py-3 md:py-4 bg-(--bg-secondary) px-4 md:px-5 rounded-xl text-xs md:text-sm mt-2 md:mt-0">
          {review}
        </p>
      </div>
    </section>
  );
};

export default HomepageTestimonials;

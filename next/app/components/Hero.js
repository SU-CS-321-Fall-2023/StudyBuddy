import HeroImage from '../../public/undraw_scrum_board.svg'
import Image from 'next/image'
export default function Hero() {
    return(
        <section className="bg-white">
  <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
    <div className="mr-auto place-self-center lg:col-span-7">
      <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight non-italic leading-none md:text-5xl xl:text-6xl text-green-400 ">
        Find your group
      </h1>
      <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
        We help you connect with like minded students who share classes with you.
      </p>
     
    </div>
    <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
      <Image
        src={HeroImage}
        alt="mockup"
      />
    </div>
  </div>
</section>
    )
}
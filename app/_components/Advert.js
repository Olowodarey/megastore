export default function Advert() {
  return (
    <div className="mx-auto  max-w-7xl py-3  sm:py-3 ">
      <div className="relative isolate overflow-hidden bg-cyan-600 px-6  py-10 sm:py-20 
      text-center shadow-2xl rounded-3xl  sm:rounded-3xl sm:px-16">
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Shop with us today and get amazing discount
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray-300">
          shop from verious items to be delivered to your location
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm 
             hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
              focus-visible:outline-white"
          >
            shop now
          </a>
          <a href="#" className="text-sm/6 font-semibold text-white">
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
        <svg
          viewBox="0 0 1024 1024"
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -z-10 size-[64rem] -translate-x-1/2 
          [mask-image:radial-gradient(closest-side,white,transparent)]"
        >
      
     
        </svg>
      </div>
    </div>
  );
}

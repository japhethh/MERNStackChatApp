
const NotFound = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="text-8xl font-bold">
          404
        </div>
        <div className='text-2xl'>
          NotFound
        </div>
        <h1>
          The resource request could not be found on this server!
        </h1>
      </div>
    </div>
  )
}

export default NotFound
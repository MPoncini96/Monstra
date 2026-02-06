const VideoSection = () => {
  return (
    <section className='relative z-10 overflow-hidden w-full'>
      <div className='relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden'>
        <video
          className='w-full h-full object-cover'
          autoPlay
          muted
          loop
        >
          <source src='/images/banner/Monstra.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default VideoSection;

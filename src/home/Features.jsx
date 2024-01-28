import { useState, useEffect } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
const Features = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { Data } = await import('./Data');
      setData(Data);
    };

    fetchData();
  }, []);

  if (!data) {
    return <div className="h-screen flex items-center justify-center">
    <CircularProgress /> &nbsp; Loading...
  </div>;
  }

  return (
    <>
      <div id="feature" className="my-16 sm:w-[90%] md:w-[98%] lg:w-[90%] sm:mx-auto">
        <h1 className="text-2xl text-center lg:text-left sm:text-3xl font-bold my-4">
          Why selling on <span className="text-[#1687a7]"> Nearo!</span>
        </h1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 my-10 gap-y-10 gap-x-7 md:gap-x-2 lg:gap-x-7">
          {data.map((val) => (
            <div key={val.id} className="w-[95%] custom400:w-[70%] shadow-box home-borders rounded-[0.9rem] mx-auto pb-8 sm:[&:nth-child(3)]:mx-[50%] md:[&:nth-child(3)]:mx-auto text-center sm:w-[100%]">
              <img src={val.img} alt="seller" className="rounded-xl max-h-[200px] w-full aspect-video object-cover bg-[#1687a7]" />
              <img src={val.img2} alt="sell" className="w-[4.5rem] -left-5 relative -top-[40px] mx-10 rounded-full border-4 border-white shadow-lg" />
              <div className="-mt-10 mx-6">
                <h2 className="text-xl font-semibold mb-4">{val.title}</h2>
                <p className="text-[#757575] text-base font-extralight">{val.para}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Features;

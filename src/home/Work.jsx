
import { useState, useEffect } from 'react';
import CircularProgress from "@mui/material/CircularProgress";

const Work = () => {

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { Data2 } = await import('./Data2');
      setData(Data2);
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
      <div className="works sm:w-[90%] mx-auto" id='works'>
        <h1 className="text-2xl text-center lg:text-left sm:text-3xl
        font-bold my-4 ">
          How Nearo <span  className="text-[#1687a7]"> Works!</span>
        </h1>
        <div  className="grid my-12  grid-cols-1  sm:grid-cols-2 md:grid-cols-3  home-borders  shadow-box rounded-xl w-[96%] custom400:w-[70%] mx-auto  sm:w-full lg:grid-cols-4 gap-x-8 p-4
        
        ">
          {data.map((val, ind) => {
            return (
              <div key={ind} className="   text-center py-10  ">
                <img src={val.img} alt="img" className="w-20 rounded-full   mx-auto " />
                <h4 className="text-[#90A4AE] my-3  uppercase">{val.h3}</h4>
                <h2 className="text-2xl font-semibold text-[#1687a7] ">{val.h2}</h2>
                <p className="my-3 text-[#757575]  font-extralight ">{val.para}</p>
              </div>
            );
          })}
        </div>
        
      </div>
    </>
  );
};

export default Work;

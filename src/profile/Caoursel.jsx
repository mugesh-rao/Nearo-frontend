import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import LazyLoadImage from "../Orders/LazyLoadImage";
import banner_img from "../profile/images/Group 1000003812 (1).jpg";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Caoursels = ({ newBanner }) => {
  const arrowStyles = {
    position: "absolute",
    zIndex: 2,
    top: "calc(50% - 15px)",
    width: 30,
    height: 50,
    cursor: "pointer",
  };

  const indicatorStyles = {
    background: "cyan",
    width: 8,
    height: 8,
    display: "inline-block",
    margin: "0 8px",
    borderRadious: "100%",
  };
  const [see, setSee] = useState(false);

  return (
    <>
      <Carousel
        autoPlay={false}
        swipeable={true}
        stopOnHover={true}
        showArrows={true}
        interval={2000}
        infiniteLoop={true}
        dynamicHeight={false}
        showStatus={false}
        showThumbs={false}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              style={{ ...arrowStyles, left: 15 }}
              className="rounded-md text-white bg-black bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-500 flex justify-center items-center invisible c500:visible"
            >
              <IoIosArrowBack className="text-2xl" />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              style={{ ...arrowStyles, right: 15 }}
              className="rounded-md text-white bg-black bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-500 flex justify-center items-center invisible c500:visible"
            >
              <IoIosArrowForward className="text-[20px]" />
            </button>
          )
        }
        renderIndicator={(onClickHandler, isSelected, index, label) => {
          if (isSelected) {
            return (
              <li
                style={{ ...indicatorStyles, background: "#000" }}
                aria-label={`Selected: ${label} ${index + 1}`}
                title={`Selected: ${label} ${index + 1}`}
                className="rounded-full"
              />
            );
          }
          return (
            <li
              style={indicatorStyles}
              onClick={onClickHandler}
              onKeyDown={onClickHandler}
              value={index}
              key={index}
              role="button"
              tabIndex={0}
              title={`${label} ${index + 1}`}
              aria-label={`${label} ${index + 1}`}
              className="rounded-full"
            />
          );
        }}
      >
        {newBanner?.length > 0 ? (
          newBanner?.map((item, index) => (
            <div
              key={index}
              className=" h-[150px] custom400:h-[180px]  c500:h-[200px] md:h-[220px] lg:h-[250px] bg-slate-500 "
              onMouseEnter={() => setSee(true)}
              onMouseLeave={() => setSee(false)}
            >
              <LazyLoadImage
                src={
                  item && item.type && item.type.startsWith("image/")
                    ? URL.createObjectURL(item)
                    : item
                }
                alt="shop banner"
                className="h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div
            className=" h-[150px] custom400:h-[180px] c500:h-[200px] md:h-[220px] lg:h-[250px] bg-slate-500 "
            onMouseEnter={() => setSee(true)}
            onMouseLeave={() => setSee(false)}
          >
            <LazyLoadImage
              src={banner_img}
              alt="shop banner"
              className="h-full"
            />
          </div>
        )}
      </Carousel>

      {/* <div
        className={`absolute left-8 top-14 c500:left-1/3 bg-white shadow-xl ${
          see ? "visible " : "invisible"
        } rounded-lg p-1 text-[14px] border border-gray-200 text-center `}
      >
        Banner image should be 1080*720
      </div> */}
    </>
  );
};

export default Caoursels;

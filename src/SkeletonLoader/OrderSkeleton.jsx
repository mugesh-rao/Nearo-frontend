import React from "react";
import PropTypes from "prop-types";
import { Skeleton, Card, CardContent, Typography } from "@mui/material";

const OrderSkeleton = ({ data, data2 }) => {
  const generateSkeleton = () => {
    return (
      <div>
        {data.map((item, index) => (
          <Card className="h-full" key={index}>
            <CardContent>
              <div className="flex justify-between items-center w-full my-4 ">
                <div className="w-full ">
                  <Typography variant="body2" width="40%">
                    <Skeleton animation="wave" height={30} width="100%" />
                  </Typography>
                  <Typography variant="body2" width="40%">
                    <Skeleton animation="wave" height={30} width="100%" />
                  </Typography>
                </div>
                <div className="w-[40%] ">
                  <Typography variant="body2" width="100%">
                    <Skeleton animation="wave" height={30} width="100%" />
                  </Typography>
                  <Typography variant="body2" width="100%">
                    <Skeleton animation="wave" height={30} width="100%" />
                  </Typography>
                </div>
              </div>

              {data2.map((val) => (
                <div
                  key={val}
                  className="flex sm:items-center sm:justify-between flex-col sm:flex-row my-4"
                >
                  <div className="flex sm:w-[60%]">
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="mb-4"
                      height={70}
                      width={70}
                    />
                    <div className="ml-2 w-full">
                      <Skeleton
                        animation="wave"
                        variant="text"
                        height={20}
                        width="90%"
                      />
                      <Typography variant="h3" width="100%">
                        <Skeleton animation="wave" height={30} width="40%" />
                      </Typography>
                    </div>
                  </div>
                  <div className="hidden sm:block font-semibold text-lg capitalize w-[100px] mx-4">
                    <Typography variant="h3" width="100%">
                      <Skeleton animation="wave" height={30} width="100%" />
                    </Typography>
                  </div>
                  <div className="hidden sm:block font-semibold text-lg capitalize w-[120px] ">
                    <Typography variant="h3" width="100%">
                      <Skeleton animation="wave" height={60} width="100%" />
                    </Typography>
                  </div>

                  <div className="flex justify-between items-center sm:hidden">
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={30}
                      width={80}
                    />
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={30}
                      width={80}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      height={50}
                      width={130}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return <>{generateSkeleton()}</>;
};

OrderSkeleton.propTypes = {
  data: PropTypes.array.isRequired,
  data2: PropTypes.array.isRequired,
};

export default OrderSkeleton;

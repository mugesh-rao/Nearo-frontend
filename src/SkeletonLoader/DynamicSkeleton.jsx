// DynamicSkeleton.js
import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton, Card, CardContent, Typography } from '@mui/material';

const DynamicSkeleton = ({ data }) => {
  // You can customize this function based on your data structure
  const generateSkeleton = () => {
    // Assuming data is an array of objects, each representing a piece of content
    return (
      <div className="grid grid-cols-1 custom400:grid-cols-2 custom450:grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-[7px] custom400:gap-2 md:gap-x-3 md:gap-y-5 my-10 w-[95%] mx-auto sm:w-full">
        {data.map((item, index) => (
         
            <Card className="h-full" key={index}>
              <CardContent>
                <Skeleton variant="rectangular" animation="wave" className="mb-4" height={200} />
                {/* Assuming each item has a title and description */}
                
                <Typography variant="body2">
                  <Skeleton animation="wave" height={20} width="90%" />
                </Typography>
                <Typography variant="body2">
                  <Skeleton animation="wave" height={20} width="90%" />
                </Typography>
                <Typography variant="body2">
                  <Skeleton animation="wave" height={20} width="90%" />
                </Typography>
                <Typography variant="body2">
                  <Skeleton animation="wave" height={25} width="90%" />
                </Typography>
               <div className='flex items-center justify-between w-full'>
               <Typography variant="button" gutterBottom width="70%">
                  <Skeleton animation="wave" height={45} width="100%" />
                </Typography>
                <Typography variant="button" gutterBottom width="20%">
                  <Skeleton animation="wave" height={45} width="100%" />
                </Typography>
               </div>
              </CardContent>
            </Card>
         
        ))}
      </div>
    );
  };

  return <>{generateSkeleton()}</>;
};

DynamicSkeleton.propTypes = {
  data: PropTypes.array.isRequired,
};

export default DynamicSkeleton;

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { BsCaretDownFill } from "react-icons/bs";
import PropTypes from "prop-types";

import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "../../utils/BaseApi";
import { RxCross2 } from "react-icons/rx";

const Category = ({ datas, get_category_id,setCategory_last_id,handleChange,handleBlur,values,errors,touched}) => {
  Category.propTypes = {
    datas: PropTypes.arrayOf(
      PropTypes.shape({
        product_category_id: PropTypes.number.isRequired,
        product_category_title: PropTypes.string.isRequired,
        // Add any other required props here
      })
    ).isRequired,
    get_category_id: PropTypes.func.isRequired,
    isloading: PropTypes.func.isRequired,
    setCategory_last_id:PropTypes.array.isRequired
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);

  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle =useCallback( () => {
    setIsOpen(true);

    get_category_id();
  },[isOpen])

  const [idParameter, setIdParameter] = useState(1);

  const category_api = (data) =>
    apiRequest({
      url: `datas/get_sub_product_categories/${idParameter}`,
      method: "post",
      data,
    });

  const queryClient = useQueryClient();
  const { mutate: gate_category2, isLoading: loads } = useMutation(
    category_api,
    {
      onSuccess: (data) => {
        // console.log(data?.data?.data);
        setCategory2Data(data?.data?.data);
        queryClient.invalidateQueries("chilldren_category");
      },
      onError: (err) => {
        console.log(err);
      },
      retry: {
        maxAttempts: 3,
        delay: (attempt) => {
          return attempt * 1000;
        },
      },
    }
  );

  const [category2Data, setCategory2Data] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("chilldren_category");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );
  //we are psoting our session id for api requesting

  const handleSelectOption = useCallback(
    (option, category_id) => {
      // Check if the category_id already exists in selectedOption
      const categoryExists = selectedOption.some((item) => item.category_id === category_id);
  
      // If the category doesn't exist, add it
      if (!categoryExists) {
        const selectedObject = { option, category_id };

        setSelectedOption([...selectedOption, selectedObject]);
        setCategory_last_id([...selectedOption, selectedObject]);
      
        
      }
  
      const formData = new FormData();
      formData.append("parent_category_id", category_id);
      gate_category2(formData);
      setIdParameter((prev) => prev + 1);
      
    },
    [selectedOption, idParameter]
  );
  

  const changeCategory = useCallback((event, option, categoryId) => {
    event.preventDefault(); // Prevent form submission
    console.log(option, categoryId,"changecategory");
    handleSelectOption(option, categoryId);
  },[])

  
  

  return (
    <div className=" w-full sm:w-[85%] relative">
      <div
        className="w-full my-2 P-4 h-10 py-[12px] text-sm border border-gray-300 hover:border-black rounded-sm placeholder:text-gray-400 flex justify-between items-center  "
        onClick={handleToggle}
      >
        <div onChange={handleChange}>
          {selectedOption
            ? selectedOption.map((val, ind) => {
                return (
                  <button
                    type="button"
                    key={val.category_id}
                    className="mx-2 z-10 cursor-pointer hover:underline"
                    onClick={(event) => {
                      changeCategory(event,val.option, val.category_id);
                      if (ind === 0) {
                        // Clicked the first button, remove all numbers after the first element
                        setSelectedOption([selectedOption[0]]);
                      } else if (ind < selectedOption.length - 1) {
                        // Clicked a button in the middle, remove numbers from ind + 1 onwards
                        setSelectedOption(selectedOption.slice(0, ind + 1));
                      }
                     
                    }}
                  >
                    {ind + 1}:{val.option}
                  </button>
                );
              })
            : "Select an option"}
        </div>
       
       
      
      

        {selectedOption?.length > 0 ? (
          <RxCross2
            className="text-2xl !cursor-pointer mx-2 z-10"
            onClick={() => {
              handleSelectOption(), setSelectedOption([]);
            }}
          />
        ) : (
          ""
        )}
      </div>
      { touched?.category_id && selectedOption&&(
                  <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                    {errors?.category_id}
                  </p>
                )}
      {isOpen && (
        <div
          className="fixed bottom-0 top-0 right-0 left-0  "
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      {(isOpen || selectedOption?.length > 0) &&
        selectedOption?.length !== 4 && (
          <div className="absolute mt-1 w-full z-10 bg-white border border-gray-300 rounded-md shadow-sm  h-[300px] overflow-y-auto whitespace-nowrap">
            <ul>
              {category2Data && category2Data.length > 0
                ? category2Data.map((val) => (
                    <li
                      key={+val.product_category_id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      
                      onClick={() => {
                        handleSelectOption(
                          val.product_category_title,
                          val.product_category_id
                        );
                        setIsOpen(false);
                      }}
                    >
                      {val.product_category_title}
                    </li>
                  ))
                : datas && datas.length > 0 && selectedOption.length == 0
                ? datas.map((val) => (
                    <li
                      key={val.product_category_id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleSelectOption(
                          val.product_category_title,
                          val.product_category_id
                        );
                        setIsOpen(false);
                      }}
                    >
                      {val.product_category_title}
                    </li>
                  ))
                : "loading..."}
            </ul>
          </div>
        )}
    </div>
  );
};

export default Category;



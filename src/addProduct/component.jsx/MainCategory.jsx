import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "../../utils/BaseApi";
import { RxCross2 } from "react-icons/rx";
import Loader from "../../utils/Loader";

const Category = ({
  datas,
  get_category_id,
  setCategory_last_id,
  handleChange,
  errors,
  touched,
}) => {
  Category.propTypes = {
    datas: PropTypes.arrayOf(
      PropTypes.shape({
        product_category_id: PropTypes.string.isRequired,
        product_category_title: PropTypes.string.isRequired,
      })
    ).isRequired,
    get_category_id: PropTypes.func.isRequired,
    setCategory_last_id: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [idParameter, setIdParameter] = useState(1);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [nestedCategories, setNestedCategories] = useState([]);
  const selectRef = useRef(null);
  const queryClient = useQueryClient();

  const categoryApi = (data) =>
    apiRequest({
      url: `datas/get_sub_product_categories/${idParameter}`,
      method: "post",
      data,
    });

  const { mutate: gateCategory2, isLoading: loads } = useMutation(
    categoryApi,
    {
      onSuccess: (data) => {
        setCategory2Data(data?.data?.data);
        queryClient.invalidateQueries("children_category");
      },
      onError: (err) => {
        console.log(err);
      },
      retry: {
        maxAttempts: 3,
        delay: (attempt) => attempt * 1000,
      },
    }
  );

  const [category2Data, setCategory2Data] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("children_category");
      return data?.data || null;
    }, [queryClient])
  );

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

  const handleToggle = useCallback(() => {
    setIsOpen(true);
    get_category_id();
  }, [get_category_id, isOpen]);

  const handleSelectOption = useCallback(
    async (option, category_id) => {
      const categoryExists = selectedOption.some(
        (item) => item.category_id === category_id
      );

      if (!categoryExists) {
        const selectedObject = { option, category_id };
        setSelectedOption([...selectedOption, selectedObject]);
        setCategory_last_id([...selectedOption, selectedObject]);
      }

      setCurrentCategoryId(category_id);

      const formData = new FormData();
      formData.append("parent_category_id", category_id);

      try {
        await gateCategory2(formData);
        setNestedCategories([...nestedCategories, category_id]);
      } catch (error) {
        console.error(error);
      }
    },
    [gateCategory2, selectedOption, nestedCategories, setCategory_last_id]
  );

  const changeCategory = useCallback((event, option, categoryId) => {
    event.preventDefault();
    handleSelectOption(option, categoryId);
  }, [handleSelectOption]);

  const renderNestedCategories = (categories, level = 0) => {
    const cardWidth = 30; // Adjust this value based on your design
    const cardPosition = level * cardWidth;
console.log(categories);
console.log(level);
    return (
      <div
        key={categories[0].product_category_id}
        className=" mt-0 w-1/2 z-10 border border-gray-300 rounded-md shadow-sm h-[300px] overflow-y-auto whitespace-nowrap"
        style={{ left: `${cardPosition}vw` }}
      >
        <ul>
          {categories.map((val) => (
            <li
              key={+val.product_category_id}
              className={`p-2 hover:bg-gray-100 cursor-pointer ${
                currentCategoryId === val.product_category_id
                  ? "font-bold text-blue-500"
                  : ""
              }`}
              onClick={() => {
                handleSelectOption(
                  val.product_category_title,
                  val.product_category_id
                );
              }}
            >
              {val.product_category_title}
              {val.children && val.children.length > 0 && (
                // Render nested categories in a new card to the right
                <div className="mt-1 w-full z-10 bg-red-700 border border-gray-300 rounded-md shadow-sm h-[300px] overflow-y-auto whitespace-nowrap left-[100%]">
                  {renderNestedCategories(val.children, level + 1)}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="w-full sm:w-[85%] relative">
      <div
        className="w-full my-2 P-4 h-10 py-[12px] text-sm border border-gray-300 hover:border-black rounded-sm placeholder:text-gray-400 flex justify-between items-center"
        onClick={handleToggle}
      >
        <div onChange={handleChange}>
          {selectedOption
            ? selectedOption.map((val, ind) => (
                <button
                  type="button"
                  key={val.category_id}
                  className={`mx-2 z-10 ${
                    ind !== 3 ? "hover:underline" : " cursor-not-allowed"
                  } ${
                    currentCategoryId === val.category_id
                      ? "font-bold text-blue-500"
                      : ""
                  }`}
                  onClick={(event) => {
                    changeCategory(event, val.option, val.category_id);
                    if (ind === 0) {
                      setSelectedOption([selectedOption[0]]);
                    } else if (ind < selectedOption.length - 1) {
                      setSelectedOption(selectedOption.slice(0, ind + 1));
                    }
                  }}
                >
                  {ind + 1}:{val.option}
                </button>
              ))
            : "Select an option"}
        </div>

        {selectedOption?.length > 0 && (
          <RxCross2
            className="text-2xl !cursor-pointer mx-2 z-10"
            onClick={() => {
              handleSelectOption();
              setSelectedOption([]);
            }}
          />
        )}
      </div>
      {touched?.category_id && selectedOption && (
        <p className="text-red-500 text-sm text-left sm:text-center capitalize">
          {errors?.category_id}
        </p>
      )}
      {isOpen && <div onClick={() => setIsOpen(false)}></div>}
      {(isOpen || selectedOption?.length > 0) &&
        selectedOption?.length !== 4 && (
          <div className="flex mt-1 space-x-4 ">
            {!loads ? (
              <ul>
                {category2Data && category2Data.length > 0 ? (
                  category2Data.map((val) => (
                    <li
                      key={+val.product_category_id}
                      className={`p-2 hover:bg-gray-100 cursor-pointer ${
                        currentCategoryId === val.product_category_id
                          ? "font-bold text-blue-500"
                          : ""
                      }`}
                      onClick={() => {
                        handleSelectOption(
                          val.product_category_title,
                          val.product_category_id
                        );
                      }}
                    >
                      {val.product_category_title}
                      {val.children && val.children.length > 0 && (
                        <div className="mt-1 w-1/2 z-10 bg-yellow-700 border border-gray-300 rounded-md shadow-sm h-[300px] overflow-y-auto whitespace-nowrap left-[100%]">
                          {renderNestedCategories(val.children)}
                        </div>
                      )}
                    </li>
                  ))
                ) : datas && datas.length > 0 && selectedOption.length === 0 ? (
                  datas.map((val) => (
                    <li
                      key={val.product_category_id}
                      className={`p-2 hover:bg-gray-100 cursor-pointer ${
                        currentCategoryId === val.product_category_id
                          ? "font-bold text-blue-500"
                          : ""
                      }`}
                      onClick={() => {
                        handleSelectOption(
                          val.product_category_title,
                          val.product_category_id
                        );
                      }}
                    >
                      {val.product_category_title}
                      {val.children && val.children.length > 0 && (
                        <div className="mt-1 w-1/2 z-10 bg-green-700 border border-gray-300 rounded-md shadow-sm h-[300px] overflow-y-auto whitespace-nowrap left-[100%]">
                          {renderNestedCategories(val.children)}
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <div className="h-[300px] w-full grid place-items-center bg-white">
                    <Loader />
                  </div>
                )}
              </ul>
            ) : (
              <div className="h-full w-full grid place-items-center bg-white">
                <Loader />
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default Category;

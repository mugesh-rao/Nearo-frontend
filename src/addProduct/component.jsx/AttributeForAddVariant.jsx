import {
  useState,
  useEffect,
  useRef,
  useMemo,
  Fragment,
  useCallback,
} from "react";
import { CiSearch } from "react-icons/ci";
import { BsCaretDownFill } from "react-icons/bs";
import { Menu, MenuHandler, MenuList, Input } from "@material-tailwind/react";
import { apiRequest } from "../../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";

const AttributeForAddVariant = ({ category_last_id, attributesID, setAttributeID, data }) => {
  const [isOpen, setIsOpen] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [extra, setExtra] = useState([]);
  const [isExit, setIsExit] = useState([]);
  const selectRefs = useRef([]);

  const addExternal = useCallback((e, index) => {
    setIsExit((prevIsExit) => {
      const updatedIsExit = [...prevIsExit];
      updatedIsExit[index] = false; // Set isExit for the specific field to false
      return updatedIsExit;
    });
    setExtra((prevExtra) => {
      const updatedExtra = [...prevExtra];
      updatedExtra[index] = e.target.value; // Update the extra value for the specific field
      return updatedExtra;
    });
  }, []);

  const clearAll = useCallback((index) => {
    setExtra((prevExtra) => {
      const updatedExtra = [...prevExtra];
      updatedExtra[index] = ""; // Clear the extra value for the specific field
      return updatedExtra;
    });
    setIsOpen((prevIsOpen) => {
      const updatedIsOpen = [...prevIsOpen];
      updatedIsOpen[index] = false; // Close the dropdown for the specific field
      return updatedIsOpen;
    });
  }, []);

  const applyData = useCallback(
    (index) => {
      setIsOpen((prevIsOpen) => {
        const updatedIsOpen = [...prevIsOpen];
        updatedIsOpen[index] = false; // Close the dropdown for the specific field
        return updatedIsOpen;
      });
      setSelectedOption((prevSelectedOption) => {
        const updatedSelectedOption = [...prevSelectedOption];
        updatedSelectedOption[index] = extra[index]; // Update the selected option for the specific field
        return updatedSelectedOption;
      });
      setExtra((prevExtra) => {
        const updatedExtra = [...prevExtra];
        updatedExtra[index] = ""; // Clear the extra value for the specific field
        return updatedExtra;
      });
    },
    [extra]
  );

  // ... (other code)

  useEffect(() => {
    const handleClickOutside = (event, index) => {
      if (
        selectRefs.current[index] &&
        !selectRefs.current[index].contains(event.target)
      ) {
        setIsOpen((prevIsOpen) => {
          const updatedIsOpen = [...prevIsOpen];
          updatedIsOpen[index] = false;
          return updatedIsOpen;
        });
      }
    };

    const handleOutsideClick = (event) => {
      for (let i = 0; i < isOpen.length; i++) {
        handleClickOutside(event, i);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelectOption = useCallback(
    (option, index, parent_id, child_id) => {
      // console.log(parent_id,child_id)
      setSelectedOption((prevSelectedOption) => {
        const updatedSelectedOption = [...prevSelectedOption];
        updatedSelectedOption[index] = option;
        return updatedSelectedOption;
      });

      setAttributeID([...attributesID, [parent_id, child_id]]);

      setSearchTerm("");
      setIsOpen((prevIsOpen) => {
        const updatedIsOpen = [...prevIsOpen];
        updatedIsOpen[index] = false;
        return updatedIsOpen;
      });
    },
    [attributesID, setAttributeID]
  );
  // console.log(attributesID)

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const send_category = (data) =>
    apiRequest({
      url: "/datas/get_product_category_attributes",
      method: "post",
      data: data,
    });

  const queryClient = useQueryClient();

  const get_stats = useMutation(send_category, {
    onSuccess: (data) => {
      setCategoryAttributes(data.data.product_attributes_data);
      queryClient.invalidateQueries("category_4_id");
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
  });

  const [CategoryAttributes, setCategoryAttributes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const formData = new FormData();
    formData.append(
      "category_4_id", category_last_id
    );
    get_stats.mutate(formData);
    setIsLoading(false);
  }, [category_last_id]);

  const send_attribute_value = (data) =>
    apiRequest({
      url: "/datas/get_product_attribute_values",
      method: "post",
      data: data,
    });

  const { mutate, isLoading: loads } = useMutation(send_attribute_value, {
    onSuccess: (data) => {
      console.log(data);
      setAttributeValue(data?.data?.data);
      queryClient.invalidateQueries("product_attribute_id");
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
  });

  const handleToggle = useCallback(
    (index, id) => {
      const formData = new FormData();
      formData.append("product_attribute_id", id);

      const sendAttribute = async () => {
        try {
          await mutate(formData);
        } catch (err) {
          console.log(err);
        }
      };

      sendAttribute();

      setIsOpen((prevIsOpen) => {
        const updatedIsOpen = [...prevIsOpen];
        updatedIsOpen[index] = !updatedIsOpen[index];
        return updatedIsOpen;
      });
      setSelectedOption((prevSelectedOption) => {
        const updatedSelectedOption = [...prevSelectedOption];
        updatedSelectedOption[index] = "";
        return updatedSelectedOption;
      });
    },
    [mutate]
  );

  const [attributeValue, setAttributeValue] = useState([]);

  const filteredOptions = useMemo(() => {
    return (
      attributeValue &&
      attributeValue.filter((option) =>
        option.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [attributeValue, searchTerm]);

  if (isLoading || loads) {
    return (
      <h2 className="text-5xl text-red-500 h-screen flex justify-center  items-center">
        Loading...
      </h2>
    );
  }

  console.log(data);

  return (
    <div className="grid grid-cols-1 w-full gap-x-10 gap-y-4 items-center c500:grid-cols-2">
      {data &&
        data.map((val, index) => (
          <Fragment key={val.id}>
            <label htmlFor="Fabric" className="w-full ">
              <p>
                {val.name} <span className="text-red-500 text-xl"></span>
              </p>

              <div className="relative">
                <div
                  className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm placeholder:text-gray-400 flex justify-between items-center"
                  onClick={() => handleToggle(index, +val.product_attribute_id)}
                >
                  <div className="capitalize">
                    {selectedOption[index]
                      ? selectedOption[index]
                      : val.value}
                  </div>
                  <BsCaretDownFill
                    className={`${isOpen[index] ? "rotate-180" : ""}`}
                  />
                </div>
                {isOpen[index] && (
                  <div
                    className="fixed bottom-0 top-0 right-0 left-0 "
                    onClick={() => handleToggle(index)}
                  ></div>
                )}
                {isOpen[index] && (
                  <div className="absolute mt-1 w-full z-10 bg-white border border-gray-300 rounded-md shadow-sm  h-[300px] overflow-y-auto whitespace-nowrap">
                    <div className="w-full sticky top-0 z-10 flex items-center px-2 border-b border-gray-300 bg-white">
                      <CiSearch className="text-xl text-cyan-600" />
                      <input
                        type="text"
                        className="w-full p-2 focus:outline-none "
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>

                    <ul>
                      {filteredOptions.map((option) => (
                        <li
                          key={option.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            handleSelectOption(
                              option.title,
                              index,
                              val.id,
                              option.id
                            )
                          }
                        >
                          {option.title}
                        </li>
                      ))}
                    </ul>
                    <Menu
                      dismiss={{
                        itemPress: isExit[index],
                      }}
                    >
                      <MenuHandler>
                        <p className="p-2 sticky bottom-0 bg-white cursor-pointer">
                          Other
                        </p>
                      </MenuHandler>
                      <MenuList className="z-20 w-[270px]">
                        <h1 className="mx-2 text-lg my-2 hover:outline-none">
                          Add Your {val.title} Name
                        </h1>
                        <Input
                          placeholder="Fabric Name"
                          onChange={(e) => addExternal(e, index)}
                          value={extra[index]}
                          containerProps={{
                            className: "mb-4 focus:outline-none",
                          }}
                          className="focus:outline-none input-border capitalize"
                        />

                        <div className="flex justify-between mt-10 hover:outline-none">
                          {" "}
                          <button
                            className="btn2 pt-1 pb-[5px] text-sm"
                            onClick={() => clearAll(index)}
                          >
                            Clear
                          </button>{" "}
                          <button
                            className="btn1 pt-1 pb-[7px] text-sm"
                            onClick={() => applyData(index)}
                          >
                            Apply
                          </button>{" "}
                        </div>
                      </MenuList>
                    </Menu>
                  </div>
                )}
              </div>
            </label>
          </Fragment>
        ))}
    </div>
  );
};

export default AttributeForAddVariant;

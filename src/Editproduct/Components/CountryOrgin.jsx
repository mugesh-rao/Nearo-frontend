import { useState, useEffect, useRef } from "react";
import { BsCaretDownFill } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import {
  Menu,
  MenuHandler,
  
  MenuList,
  Input,
} from "@material-tailwind/react";

const CountryOrigin = ({ options, onSelect ,handleChange,handleBlur,errors,touched,values}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [extra, setExtra] = useState("");

  const [isExit, setIsExit] = useState(false);

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
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setSelectedOption("");
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const addExternal = (e) => {
    isExit ? setIsExit(false) : "";
    setExtra(e.target.value);
  };

  const clearAll = () => {
    setExtra("");
    extra ? " " : setIsOpen(false);
  };
  const applyData = () => {
    setIsOpen(false);

    setSelectedOption(extra);
    setExtra("");
  };

  return (
    <div className="relative">
      <div
         className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 flex justify-between items-center "
        onClick={handleToggle}
      >
        <div>{selectedOption ? selectedOption : "Select an option"}</div>
        <BsCaretDownFill className={` ${isOpen ? "rotate-180" : ""}`}/>
      </div>
      {isOpen && (
        <div
          className="fixed bottom-0 top-0 right-0 left-0 "
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      {isOpen && (
        <div className="absolute mt-1 w-full z-10 bg-white border border-gray-300 rounded-md shadow-sm  h-[300px] overflow-y-auto whitespace-nowrap">
          <div className="w-full sticky top-0 z-10 flex items-center px-2 border-b border-gray-300 bg-white">
            <CiSearch className="text-xl text-cyan-600" />
            <input
              type="text"
              name="country_origin"
              className="w-full p-2 focus:outline-none "
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <ul>
            {filteredOptions.map((option) => (
              <li
                key={option}
                name="country_origin"
                onBlur={handleBlur}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectOption(option)}
              >
                {option}
              </li>
            ))}
          </ul>
          <Menu
            dismiss={{
              itemPress: isExit,
            }}
          >
            <MenuHandler>
              <p className="p-2 sticky bottom-0 bg-white cursor-pointer">
                Other
              </p>
            </MenuHandler>
            <MenuList className="z-20 w-[270px]">
              <h1 className="mx-2 text-lg my-2 hover:outline-none">
                Add Your Color Name
              </h1>
              <Input
                placeholder="Color Name"
                onChange={addExternal}
                value={extra}
                containerProps={{
                  className: "mb-4 focus:outline-none",
                }}
                className="focus:outline-none input-border"
              />

              <div className="flex justify-between mt-10 hover:outline-none outline-none">
                {" "}
                <button
                  className="btn2 pt-1 pb-[5px] text-sm"
                  onClick={() => clearAll()}
                >
                  Clear
                </button>{" "}
                <button
                  className="btn1 pt-1 pb-[7px] text-sm"
                  onClick={() => applyData()}
                >
                  Apply
                </button>{" "}
              </div>
            </MenuList>
          </Menu>
        </div>
      )}
      

    </div>
  );
};

export default CountryOrigin;

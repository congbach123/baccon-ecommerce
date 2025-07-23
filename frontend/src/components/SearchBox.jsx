import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword("");
    } else {
      navigate("/");
    }
  };

  return (
    <form onSubmit={submitHandler} className="relative">
      <div className="flex items-center">
        <input
          type="text"
          name="q"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products..."
          className="bg-charcoal text-gray-300 text-sm rounded-lg focus:ring-1 focus:ring-white focus:outline-none block w-full pl-4 pr-10 py-2 placeholder-gray-500"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <SearchOutlined />
        </button>
      </div>
    </form>
  );
};

export default SearchBox;

import RestaurantCard from "./RestaurantCard.js";
import { useEffect, useState, useContext } from "react";
import Shimmer from "./Shimmer.js";
import { SWIGGY_URL } from "../utils/constants.js";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus.js";
import Usercontext from "../utils/Usercontext.js";
import Whatsonyourmind from "./whatsonyourmind.js";
import Footer from "./Footer.js";
// import FilterRestaurant from "./filteredRestaurant.js";

const Body = () => {
  const [listofrestaurants, setListofrestaurants] = useState([]);
  const [filteredRestaurant, setfilteredRestaurant] = useState([]);
  const [carouselData, setCarouselData] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetch(SWIGGY_URL);
    const json = await data.json();

    setListofrestaurants(
      json.data.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
    setfilteredRestaurant(
      json.data.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );

    setCarouselData(
      json?.data?.cards[0]?.card?.card?.gridElements?.infoWithStyle?.info
    );
  };

  const onlinestatus = useOnlineStatus();
  if (!onlinestatus) {
    return (
      <h1>
        Looks like you are Offline! Please check your internet connection.
      </h1>
    );
  }

  const { loggedInUser, setUserName } = useContext(Usercontext);

  return listofrestaurants.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="body flex flex-col items-center mt-10  ">
      {/* <div className="search m-4 p-6 flex items-center">
        <label>UserName:</label>
        <input
          className="border border-black p-2 ml-2"
          value={loggedInUser}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
      </div> */}
      <div className="flex gap-4  w-[80%]">
        <button className="px-6 py-3 rounded-md border text-lg font-semibold">Your location </button>
        <button className="px-6 py-3 rounded-md border text-lg font-semibold">Bangalore</button>
        <button className="px-6 py-3 rounded-md border text-lg font-semibold">Hyderabad</button>
        <button className="px-6 py-3 rounded-md border text-lg font-semibold">Delhi</button>
      </div>

      <Whatsonyourmind data={carouselData} />

      <div className="mb-2  w-[80%] ">
        <h1 className="text-2xl sm:text-2xl font-bold text-black my-8 tracking-wide">
          Restaurants with Online Food Delivery in Bangalore
        </h1>

        <div className="filter">
          <div className="search my-4 py-4 flex gap-4">
            <input
              type="text"
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-gray-500 transition duration-300 ease-in-out"
              placeholder="Search for restaurants..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className="px-4 py-2 border border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-500 hover:text-white transition duration-300 ease-in-out"
              onClick={() => {
                const filteredList = listofrestaurants.filter((res) =>
                  res.info.name.toLowerCase().includes(searchText.toLowerCase())
                );
                setfilteredRestaurant(filteredList);
              }}
            >
              Search
            </button>
            {/* <FilterRestaurant /> */}
          </div>
        </div>
      </div>

      <div className="restro-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  w-[80%]">
        {filteredRestaurant.length > 0 ? (
          filteredRestaurant.map((res) => (
            <Link to={"/restaurants/" + res.info.id} key={res.info.id}>
              <RestaurantCard resData={res} />
            </Link>
          ))
        ) : (
          <p>No restaurants available</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Body;

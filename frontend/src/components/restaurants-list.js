import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import { useState, useEffectg } from "react";
import RestaurantDataService from "../services/restaurant";
import Restaurant from "./restaurant";

const RestaurantsList = (props) => {
    const [restaurants, setRestaurants] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState("");
    const [searchCuisine, setSearchCuisine] = useState("");
    const [cuisines, setCuisines] = useState(["All Cuisines"]);

    useEffect(() => {
        retrieveRestaurants();
        retrieveCuisines();
    }, []);

    // monitor search bar for three queries
    const onChangeSearchName = e => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };
    const onChangeSearchZip = e => {
        const searchZip = e.target.value;
        setSearchZip(searchZip);
    };
    const onChangeSearchCuisine = e => {
        const searchCuisine = e.target.value;
        setSearchCuisine(searchCuisine);
    };

    // retrieve restaurant listings
    const retrieveRestaurants = () => {
        RestaurantDataService.getAll()
        .then(response => {
            console.log(response.data);
            setRestaurants(response.data.restaurants);
        })
        .catch(e => {
            console.log(e);
        });
    };

    const retrieveCuisines = () => {
        RestaurantDataService.getCuisines()
        .then(response => {
            console.log(response.data);
            setCuisines(["All Cuisines"].concat(response.data));
        })
        .catch(e => {
            console.log(e);
        });
    };

    const refreshList = () => {
        retrieveRestaurants();
    };

    // finding specific restaurant
    const find = (query, by) => {
        RestaurantDataService.find(query, by)
        .then(response => {
            console.log(response.data);
            setRestaurants(response.data.restaurants);
        })
        .catch(e => {
            console.log(e);
        });
    };
    // find by functions to feed into "find" function
    const findByName = () => {
        find(searchName, "name");
    }
    const findByZip = () => {
        find(searchZip, "zipcode");
    }
    const findByCuisine = () => {
        if (searchCuisine == "All Cuisines") {
            refreshList();
        }
        else {
            find(searchCuisine, "cuisine");
        }
    };


    return (
        <div>
            <div className="row">
                <div className="input-group col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={onChangeSearchName}
                    />
                    <div className="input-group-append">
                        <button 
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByName}
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="input-group col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by zip"
                        value={searchZip}
                        onChange={onChangeSearchZip}
                    />
                    <div className="input-group-append">
                        <button 
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByZip}
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="input-group col">
                    <select onChange={onChangeSearchCuisine}>
                        { cuisines.map(cuisine => {
                            return(
                                <option value={cuisine}>
                                    { cuisine.substr(0,20) }
                                </option>
                            )
                        })}
                    </select>
                    <div className="input-group-append">
                        <button 
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByCuisine}
                        >
                            Search
                        </button>
                    </div>
                </div>
                
            </div>

            <div className="row">
                { restaurants.map((restaurant => {
                    const address = `${restaurant.address.building} ${restaurant.address.street} ${restaurant.address.zipcode}`;
                    return (
                        <div className="col-lg-4 pb-1">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{restaurant.name}</h5>
                                    <p className="card-text">
                                        <strong>Cuisine: </strong>{restaurant.cuisine}
                                        <br />
                                        <strong>Address: </strong>{address}
                                    </p>
                                    <div className="row">
                                        <Link to={"/restaurants/"+restaurant._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                                            View Reviews
                                        </Link>
                                        <a target="_blank" href={"https://www.gooogle.com/maps/place/"+address}
                                            className="btn btn-primary col-lg-5 mx-1 mb-1">View Map</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })) }
            </div>
        </div>
    );
}


export default RestaurantsList;
import React from "react";
import { useState, } from "react";
import { Switch, Route, Link, useParams, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import RestaurantDataService from "../services/restaurant"

const AddReview = (props) => {
    // useParams from Router path="/restaurants/:id/review"
    const params = useParams();
    const location = useLocation();
    let initialReviewState = "";

    let editing = false;
    //console.log(location.state.currentReview)
    if (location.state && location.state.currentReview) {
        editing = true;
        initialReviewState = location.state.currentReview.text;
    }

    const [review, setReview] = useState(initialReviewState);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = event => {
        setReview(event.target.value);
    }

    const saveReview = () => {
        var data = {
            text: review,
            name: props.user.name,
            user_id: props.user.id,
            restaurant_id: params.id
        };

        if (editing) {
            data.review_id = location.state.currentReview._id;
            RestaurantDataService.updateReview(data)
            .then(response => {
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e)
            })
        } else {
            RestaurantDataService.createReview(data)
            .then(response => {
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
        }
    };

    return (
        <div>
            { props.user ? (
                <div className="submit-form">
                    { submitted ? (
                        <div>
                            <h4>Submitted Successfully</h4>
                            <Link to={"/restaurants/" + params.id} className="btn btn-success">
                                Back to restaurant
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <div className="form-group">
                                <label htmlFor="description">
                                    { editing ? "Edit" : "Create" } Review
                                </label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    id="text"
                                    required
                                    value={review}
                                    onChange={handleInputChange}
                                    name="text">
                                </input>
                            </div>
                            <button onClick={saveReview} className="btn btn-success">
                                Submit
                            </button>
                        </div>
                    )}
                
                </div>
            ) : (
                <div>
                    Please log in
                </div>
            )}
        </div>
    );
}


export default AddReview;
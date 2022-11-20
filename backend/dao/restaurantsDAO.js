//import { ObjectId } from "mongodb";
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId;

let restaurants; // acts as our reference to restaurants collection in MongoDB Atlas

export default class RestaurantsDAO {
    static async injectDB(conn) {
        if (restaurants) {
            return;
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants");
        } catch(error) {
            console.error(`Unable to establish a collection handle in restaurantsDAO: ${error}`,
            )
        }
    }

    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"] }};
            } else if ("cuisine" in filters) {
                query = { "cuisine": { $eq: filters["cuisine"] }};
            } else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"] }}
            }
        }

        let cursor;

        try {
            cursor = await restaurants.find(query);
        } catch (error) {
            console.error(`Unable to issue find command, ${error}`);
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);

        try {
            const restaurantsList = await displayCursor.toArray();
            const totalNumRestaurants = await restaurants.countDocuments(query);

            return { restaurantsList, totalNumRestaurants}
        } catch (e) {
            console.error(`Unable to convert cursor to array, ${e}`);
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }
    }

    static async getRestaurantByID(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        // match id to restaurant
                        _id: new ObjectId(id),
                    },
                },
                {
                    // lookup the reviews to add (mongodb pipeline)
                    $lookup: {
                        from: "reviews",
                        let: {
                            id: "$_id",
                        },
                        pipeline: [
                            {
                                // find the reviews that match with rest id
                                $match: {
                                    $expr: {
                                        $eq: ["$restaurant_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: "reviews",
                    },
                },
                {
                    $addFields: {
                        reviews: "$reviews",
                    },
                },
            ]
            return await restaurants.aggregate(pipeline).next();
            // return restaurant with reviews connected
        } catch(e) {
            console.error(`Issue with getRestaurantByID: ${e}`);
            throw e;
        }
    }

    static async getCuisines() {
        let cuisines = [];
        try {
            cuisines = await restaurants.distinct("cuisine");
            return cuisines;
        } catch(e) {
            console.error(`Unable to get cuisines: ${e}`);
            return cuisines;
        }
    }
}
import http from "../http-common";
// http common uses axios to set the base url
// then use axios to use http requests using the urls
// defined in the REST Api

class RestaurantDataService {
    getAll(page = 0) {
        return http.get(`?page=${page}`);
    }

    get(id) {
        return http.get(`/id/${id}`);
    }

    find(query, by="name", page=0) {
        return http.get(`?${by}=${query}&page=${page}`)
    }

    createReview(data) {
        return http.post("/review", data);
    }

    updateReview(data) {
        return http.put("/review", data);
    }

    deleteReview(id, userId) {
        return http.delete(`/review?id=${id}`, {data:{user_id: userId}});
    }

    getCuisines(id) {
        return http.get(`/cuisines`);
    }
}

export default new RestaurantDataService();
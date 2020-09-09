// helper function to fix incorrect restaurant names from NYC open data api
export const massageApiResponse = (response) => {
    for (let index in response) {
        if (response[index].restaurantname === 'TEST' || response[index].restaurantname === 'Test') {
            delete response[index];
        }
    }
    return response;
}

export const massageSearchResponse = (response) => {
    if (response.restaurantname === "Redoak") {
        response.restaurantname = "Red oak";
    } else if (response.restaurantname.includes("GÇÖ")) {
        response.restaurantname = response.restaurantname.replace("GÇÖ", "'");
    } else if (response.restaurantname.includes("+¬")) {
        response.restaurantname = response.restaurantname.replace("+¬", "e");
    } else if (response.restaurantname.includes("+¦")) {
        response.restaurantname = response.restaurantname.replace("+¦", "ll");
    }

    return response;
}

export const mapBorough = (name) => {
    if (name === "manhattan") return "Manhattan";
    else if (name === "bronx") return "Bronx";
    else if (name === "staten island") return "Staten Island";
    else if (name === "queens") return "Queens";
    else if (name === "brooklyn") return "Brooklyn";
    else if (name === "Manhattan") return "manhattan";
    else if (name === "Bronx") return "bronx";
    else if (name === "Staten Island") return "staten island";
    else if (name === "Queens") return "queens";
    else if (name === "Brooklyn") return "brooklyn";
}

export const encodeRestaurantName = (name) => {
    if (name.includes('&')) {
        name = name.replace('&', '%26');
    }
    return name;
}

import React from 'react';
import './New-Restaurant.css';

export const NewRestaurant = () => {
    return (
        <div className="NewRestaurant">
            <form method="post" action="/api/restaurants">
                <label>Add a Restaurant</label><br />
                <input type="text" name="name" placeholder="Name" required /> <br />
                <input type="text" name="city" placeholder="City" required /> <br />
                <input type="text" name="state" placeholder="State (2 letter abbriev.)" required /> <br />
                <input type="text" name="playlistUrl" placeholder="Music Playlist URL" required /> <br />
                <input type="text" name="lighting" placeholder="Light (dim, normal, or bright)" required /> <br />
                <input type="text" name="scent" placeholder="Scent" required /> <br />
                <input type="text" name="items" placeholder="Items (comma-separated list)" required /> <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

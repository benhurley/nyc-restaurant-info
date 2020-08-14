import React from 'react';
import './NewRestaurant.css';

export const NewRestaurant = () => {
    return (
        <div className="NewRestaurant">
            <form method="post" action="/api/restaurants">
                <label>Add a Restaurant</label><br />
                <input type="text" name="name" placeholder="Name" required /> <br />
                <input type="text" name="playlist" placeholder="Music Playlist" required /> <br />
                <input type="text" name="lighting" placeholder="Lighting" required /> <br />
                <input type="text" name="scent" placeholder="Aromas" required /> <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

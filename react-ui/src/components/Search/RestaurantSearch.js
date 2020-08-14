/* eslint-disable no-use-before-define */
import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

const filter = createFilterOptions();

export const RestaurantSearch = ({location}) => {
  const [value, setValue] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    let request;
    if (location) {
      request = `/api/restaurants/location/${location}`;
    } else {
      request = '/api/restaurants';
    }

    fetch(request).then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        if(!(json instanceof Array)){
          json = [json];
       }
        setRestaurants(json);
      }).catch(e => {
        throw new Error(`Search Options API call failed: ${e}`);
      })
      
  }, []);

  useEffect(() => {
    if (value && value._id){
      const newURL = window.location.origin + `/restaurants/${value._id}`
      window.location.assign(newURL)
    }
  }, [value]);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            name: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            name: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        return filter(options, params);
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="global-search"
      options={restaurants}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name;
      }}
      renderOption={(option) => option.name}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label={"Search"}
          variant="outlined"
          onKeyDown={e => {
            if (e.keyCode === 13 && e.target.value) {
              value && setValue(value);
            }
          }
        }/>
      )}
    />
  );
}

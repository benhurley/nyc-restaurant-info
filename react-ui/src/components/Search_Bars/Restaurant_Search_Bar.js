/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { detectMobile } from '../../helpers/Window_Helper'

const filter = createFilterOptions();

export const RestaurantSearchBar = ({ borough }) => {
  debugger
  const [value, setValue] = useState(null);
  const [restaurant_names, setrestaurant_names] = useState([]);

  const isMobile = detectMobile();

  const nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/pitm-atqc.json?$limit=20000&borough=Manhattan&$order=time_of_submission%20DESC`;
  
  useEffect(() => {
    fetch(nycCompliantRestaurantApi).then(response => {
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      return response.json();
    })
      .then(json => {
        setrestaurant_names(json);
      }).catch(e => {
        throw new Error(`API call failed: ${e}`);
      })
  }, []);

  useEffect(() => {
    if (value && value.restaurant_name) {
      const newURL = window.location.origin + `/restaurant/${value.restaurant_name}`
      window.location.assign(newURL)
    }
  }, [value]);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            restaurant_name: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            restaurant_name: newValue.inputValue,
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
      id="restaurant-search-bar"
      options={restaurant_names}
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
        return option.restaurant_name;
      }}
      renderOption={(option) => (
        <React.Fragment>
          <div style={{ textTransform: "lowercase" }}>{option.restaurant_name} <br />
          </div>
        </React.Fragment>
      )}
      style={{ width: isMobile ? 250 : 325 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={<div style={{ textTransform: "lowercase" }}>{`search ${borough}`}</div>}
          variant="outlined"
          onKeyDown={e => {
            if (e.keyCode === 13 && e.target.value) {
              value && setValue(value);
            }
          }
          } />
      )}
    />
  );
}

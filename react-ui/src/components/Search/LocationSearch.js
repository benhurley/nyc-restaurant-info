/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

const filter = createFilterOptions();

export const LocationSearch = () => {
  const [value, setValue] = useState(null);
  const locations = [{location: "New York City"}, {location: "Dallas"}, {location: "Tampa"}]

  useEffect(() => {
    if (value && value.location){
      const newURL = window.location.origin + `/restaurants/location/${value.location}`
      window.location.assign(newURL)
    }
  }, [value]);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            location: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            location: newValue.inputValue,
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
      id="location-search"
      options={locations}
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
        return option.location;
      }}
      renderOption={(option) => option.location}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="Select your Location"
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

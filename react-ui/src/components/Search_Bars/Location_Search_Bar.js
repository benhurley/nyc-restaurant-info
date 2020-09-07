/* eslint-disable no-use-before-define */
import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

const filter = createFilterOptions();

export const LocationSearchBar = () => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (value && value.borough){
      const newURL = window.location + `location/${value.borough}`
      window.location.assign(newURL)
    }
  }, [value]);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            borough: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            borough: newValue.inputValue,
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
      id="location-search-bar"
      options={boroughs}
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
        return option.borough;
      }}
      renderOption={(option) => ( 
        <React.Fragment>
          <div style={{"textTransform": "lowercase"}}>{option.borough} <br /></div>
        </React.Fragment>
      )}
      style={{ width: 200 }}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="select a nyc borough" 
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

const boroughs = [
  {
      "borough": "bronx"
  },
  {
      "borough": "brooklyn"
  },
  {
      "borough": "manhattan"
  },
  {
      "borough": "queens"
  },
  {
      "borough": "staten island"
  },
]

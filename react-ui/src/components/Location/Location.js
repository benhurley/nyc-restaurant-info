/* eslint-disable no-use-before-define */
import React, { Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { Search } from '../Search/Search';

const filter = createFilterOptions();

export const Location = () => {
  const [value, setValue] = React.useState(null);

  return (
    <Fragment>
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
        const filtered = filter(options, params);

        // Suggest the creation of a new value
        if (params.inputValue !== '') {
          filtered.push({
            inputValue: params.inputValue,
            location: `Add "${params.inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
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
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="Select your location" variant="outlined" />
      )}
    />
    <div className="searchBar">
      <Search value={value}/>
    </div>
    </Fragment>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const locations = [{location: "New York City"}, {location: "Dallas"}]
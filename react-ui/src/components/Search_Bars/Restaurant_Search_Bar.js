/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { DetectMobile } from '../../helpers/Window_Helper';
import { toTitleCase } from '../../helpers/to_title_case';

const filter = createFilterOptions();

export const RestaurantSearchBar = ({ borough }) => {
  const [value, setValue] = useState(null);
  const [dbas, setDbas] = useState([]);

  const isMobile = DetectMobile();

  const nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/gra9-xbjk.json?$limit=20000&boro=${borough}&$order=grade_date%20DESC`;
  
  useEffect(() => {
    fetch(nycCompliantRestaurantApi).then(response => {
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      return response.json();
    })
      .then(json => {
        const unique = new Map(json.map(item => [item['dba'], item]));
        const deduppedResults = Array.from(unique.values());
        setDbas(deduppedResults);
      }).catch(e => {
        throw new Error(`API call failed: ${e}`);
      })
  }, [nycCompliantRestaurantApi]);

  useEffect(() => {
    if (value && value.dba) {
      const newURL = window.location.origin + `/restaurant/${value.dba}`
      window.location.assign(newURL)
    }
  }, [value]);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            dba: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            dba: newValue.inputValue,
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
      options={dbas}
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
        return option.dba;
      }}
      renderOption={(option) => (
        <React.Fragment>
          <div>{toTitleCase(option.dba)}</div>
        </React.Fragment>
      )}
      style={{ width: isMobile ? 250 : 325 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={<div>{`Search by Restaurant Name`}</div>}
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

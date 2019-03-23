import React, { Component } from 'react';
import './search.css';

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';


class Search extends Component {
  // Define Constructor
  constructor(props) {
    super(props);

    // Declare State
    this.state = {
      city: '',
      query: '',
      address: ''
    };
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    console.log('Address:', address);
    this.props.onSelect(address);
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
  };


  render() {
    return (
      <div>
        <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        searchOptions={{types: ['(cities)'], componentRestrictions: {country: 'au'}}}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input size="150"
              {...getInputProps({
                placeholder: 'Search for suburbs by name',
                className: 'location-search-input',
              })}
            />
            <button className="button">Search</button>
            <div className="autocomplete-dropdown-container">
              {loading && <div className="loading"> Loading </div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      &nbsp;
      
      </div>
    );
  }
}

export default Search;
import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

import Home from "./Home";
import Account from "./Account/Account";

import Autosuggest from 'react-autosuggest';
import MdAccountCircle from 'react-icons/lib/md/account-circle';
import './main.css';

// Imagine you have a list of languages that you'd like to autosuggest.
const languages = [{
        name: 'C',
        year: 1972
    },
    {
        name: 'Elm',
        year: 2012
    },
    {
        name: 'Java',
        year: 2012
    },
    {
        name: 'Python',
        year: 2012
    },
    {
        name: 'React',
        year: 2012
    },
];

const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? [] : languages.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
);

class Main extends Component {
    constructor() {
        super();

        this.state = {
          value: '',
          suggestions: []
        };
    }

    onChange = (event, { newValue }) => {
        this.setState({
          value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          suggestions: getSuggestions(value)
        });
    };
    
    onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
    };

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Search for creations',
            id: 'searchbar',
            value,
            onChange: this.onChange
        };

        return (
            <HashRouter>
                <div>
                    <h1 id="company-name">Creators Inc</h1>
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                    />

                    <div id="menu-icon-div">
                        <ul id="menu-icon-list">
                            <li className="menu-icon"><NavLink to="/account"><MdAccountCircle /></NavLink></li>
                        </ul>
                    </div>

                    <div className="content">
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/account" component={Account}/>
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default Main;
import React, {Component} from "react";
import {Route, NavLink, HashRouter} from "react-router-dom";

import Home from "./Home/Home";
import Account from "./Account/Account";
import Detail from "./Detail/Detail";
import './main.css';
import {getUsername} from './Backend/database';

import Autosuggest from 'react-autosuggest';
import ReactTooltip from 'react-tooltip'

import MdAccountCircle from 'react-icons/lib/md/account-circle';
import MdMenu from 'react-icons/lib/md/menu';

// Imagine you have a list of languages that you'd like to autosuggest.
const languages = [
    {
        name: 'C',
        year: 1972
    }, {
        name: 'Elm',
        year: 2012
    }, {
        name: 'Java',
        year: 2012
    }, {
        name: 'Python',
        year: 2012
    }, {
        name: 'React',
        year: 2012
    }
];

const getSuggestions = value => {
    const inputValue = value
        .trim()
        .toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
        ? []
        : languages.filter(lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue);
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
    <p className="suggestion">
        {suggestion.name}
    </p>
);

class Main extends Component {

    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: [],
            renderMenu: false
        };
        this.handleToggleClick = this
            .handleToggleClick
            .bind(this);
    }

    handleToggleClick() {
        this.setState(prevState => ({
            renderMenu: !prevState.renderMenu
        }));
    }

    handleClick(menuItemClicked) {
        switch (menuItemClicked) {
            case "home":
                console.log("Home");
                break;
            default:
                console.log("Default");
        }

    }

    onChange = (event, {newValue}) => {
        this.setState({value: newValue});
    };

    onSuggestionsFetchRequested = ({value}) => {
        this.setState({suggestions: getSuggestions(value)});
    };

    onSuggestionsClearRequested = () => {
        this.setState({suggestions: []});
    };

    componentWillMount() {
        getUsername().then((username) => {
            this.setState({name: username});
        });
    }

    render() {
        const {value, suggestions} = this.state;
        const inputProps = {
            placeholder: 'Search for creations',
            id: 'searchbar',
            value,
            onChange: this.onChange
        };
        let menu = null;
        if (this.state.renderMenu) {
            menu = <div id="hidden-menu">
                <p id="hidden-menu-name">{this.state.name}</p>
                <ul id="hidden-menu-item-list">
                    <NavLink to="/">
                        <li className="hidden-menu-item">Home</li>
                    </NavLink>
                    <NavLink to="/account">
                        <li className="hidden-menu-item">Account</li>
                    </NavLink>
                </ul>
            </div>;
        }

        return (
            <HashRouter>
                <div>
                    <NavLink to="/" id="company-name-link">
                        <h1 id="company-name">Create</h1>
                    </NavLink>
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}/>

                    <div id="menu-icon-div">
                        <ul id="menu-icon-list">
                            <NavLink to="/">
                                <li data-tip="Creations" className='menu-icon'>
                                    <p className="menu-text">Home</p>
                                </li>
                            </NavLink>
                            <NavLink to="/account">
                                <li data-tip="Account" className='menu-icon'>
                                    <MdAccountCircle/>
                                </li>
                            </NavLink>
                            <li
                                data-tip={(menu == null)
                                ? "Menu"
                                : "Close"}
                                className={`menu-icon${ (menu == null)
                                ? ''
                                : ' menu-sandwich'}`}
                                onClick={() => {
                                this.handleToggleClick()
                            }}>
                                <MdMenu/>
                            </li>
                            <ReactTooltip place="bottom" type="info" delayShow={200} effect="solid"/>
                        </ul>
                    </div>

                    {menu}

                    <div className="content">
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/account" component={Account}/>
                        <Route path='/view/:String' component={Detail}/>
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default Main;
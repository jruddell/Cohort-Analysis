'use strict';
import React from './lib/react';
import $ from 'jquery/jquery:dist/jquery';
import {Layout} from './views/_layout';
import {Home} from './views/index';


export class App extends React.Component {
    constructor (props){
        super(props);
        this.state = {};
    }
    render () {
        return (
            <Layout>
                <Home />
            </Layout>
        );
    }
}

var { render } = React;

$(function() { // render to body
    render(React.createElement(App), document.body);
});
'use strict';
import React from '../lib/react';

export class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
};

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class Nav extends PureComponent {
    render() {
        return (
            <nav>
                <Link to="/">Home</Link> |
                <Link to="/practice">Practice</Link> |
                <Link to="/insert">Insert</Link>
            </nav>
        )
    }
}

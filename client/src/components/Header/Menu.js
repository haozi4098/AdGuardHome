import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import classnames from 'classnames';
import { Trans, withNamespaces } from 'react-i18next';

import { SETTINGS_URLS, FILTERS_URLS, MENU_URLS } from '../../helpers/constants';
import Dropdown from '../ui/Dropdown';

const MENU_ITEMS = [
    {
        route: MENU_URLS.root, exact: true, xlinkHref: 'dashboard', text: 'dashboard', order: 0,
    },

    // Settings dropdown should have visual order 1

    // Filters dropdown should have visual order 2

    {
        route: MENU_URLS.logs, xlinkHref: 'log', text: 'query_log', order: 3,
    },
    {
        route: MENU_URLS.guide, xlinkHref: 'setup', text: 'setup_guide', order: 4,
    },
];

const SETTINGS_ITEMS = [
    { route: SETTINGS_URLS.settings, text: 'general_settings' },
    { route: SETTINGS_URLS.dns, text: 'dns_settings' },
    { route: SETTINGS_URLS.encryption, text: 'encryption_settings' },
    { route: SETTINGS_URLS.clients, text: 'client_settings' },
    { route: SETTINGS_URLS.dhcp, text: 'dhcp_settings' },
];

const FILTERS_ITEMS = [
    { route: FILTERS_URLS.dns_blocklist, text: 'dns_blocklist' },
    { route: FILTERS_URLS.dns_whitelist, text: 'dns_whitelist' },
    { route: FILTERS_URLS.custom_rules, text: 'custom_rules' },
];

class Menu extends Component {
    handleClickOutside = () => {
        this.props.closeMenu();
    };

    toggleMenu = () => {
        this.props.toggleMenuOpen();
    };

    getActiveClassForSettings = (URLS) => {
        const { pathname } = this.props.location;
        const isSettingsPage = pathname in URLS;

        return isSettingsPage ? 'active' : '';
    };

    getNavLink = ({
        route, exact, text, order, className, xlinkHref,
    }) => (
        <NavLink to={route}
                 key={route}
                 exact={exact || false}
                 className={`order-${order} ${className}`}
                 onClick={this.toggleMenu}>
            {xlinkHref && <svg className="nav-icon">
                <use xlinkHref={`#${xlinkHref}`} />
            </svg>}
            <Trans>{text}</Trans>
        </NavLink>
    );

    getDropdown = ({
        label, order, URLS, icon, ITEMS,
    }) =>
        (
            <Dropdown
                label={this.props.t(label)}
                baseClassName={`dropdown nav-item order-${order}`}
                controlClassName={`nav-link ${this.getActiveClassForSettings(URLS)}`}
                icon={icon}>
                {ITEMS.map(item => (
                    this.getNavLink({
                        ...item,
                        order,
                        className: 'dropdown-item',
                    })))}
            </Dropdown>
        );

    render() {
        const menuClass = classnames({
            'header__column mobile-menu': true,
            'mobile-menu--active': this.props.isMenuOpen,
        });
        return (
            <Fragment>
                <div className={menuClass}>
                    <ul className="nav nav-tabs border-0 flex-column flex-lg-row flex-nowrap">
                        {MENU_ITEMS.map(item => (
                            <li className={`nav-item order-${item.order}`} key={item.text} onClick={this.toggleMenu}>
                                {this.getNavLink({ ...item, className: 'nav-link' })}
                            </li>
                        ))}
                        {this.getDropdown({
                            order: 1,
                            label: 'settings',
                            icon: 'settings',
                            URLS: SETTINGS_URLS,
                            ITEMS: SETTINGS_ITEMS,
                        })}
                        {this.getDropdown({
                            order: 2,
                            label: 'filters',
                            icon: 'filters',
                            URLS: FILTERS_URLS,
                            ITEMS: FILTERS_ITEMS,
                        })}
                    </ul>
                </div>
            </Fragment>
        );
    }
}

Menu.propTypes = {
    isMenuOpen: PropTypes.bool,
    closeMenu: PropTypes.func,
    toggleMenuOpen: PropTypes.func,
    location: PropTypes.object,
    t: PropTypes.func,
};

export default withNamespaces()(enhanceWithClickOutside(Menu));

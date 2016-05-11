import React, { PropTypes } from 'react'
import cx from 'classnames'

import Icon from '../Icon'
import NavBarItem from './NavBarItem.js'
import NavBarLink from './NavBarLink.js'
import NavBarTitle from './NavBarTitle.js'

import fabricComponent from '../fabricComponent.js'

import style from './NavBar.scss'

const isFabricComponent = (component = {}, ...componentTypes) => {
  const type = component.type || {}

  return componentTypes.indexOf(type) !== -1
}

const splitChildren = children => {
  const split = {
    title: null,
    items: []
  }

  React.Children.forEach(children, child => {
    if (isFabricComponent(child, NavBarItem, NavBarLink)) {
      split.items.push(child)
    }
    if (isFabricComponent(child, NavBarTitle)) {
      split.title = child
    }
  })

  return split
}

@fabricComponent(style)
class NavBar extends React.Component {
  static propTypes = {
    title: PropTypes.node,
    children: React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.arrayOf((propValue, key, componentName, location, propFullName) => {
        if (!isFabricComponent(propValue[key], NavBarItem, NavBarLink, NavBarTitle)) {
          return new Error(
            `Invalid prop '${propFullName}' supplied to '${componentName}'. Must be one of
            NavBar.Item, NavBar.Link or NavBar.Title`
          )
        }
        if (propValue.filter(value => isFabricComponent(value, NavBarTitle)).length > 1) {
          return new Error(
            `Multiple NavBar.Title props supplied to '${componentName}'. Maximal one is allowed.`
          )
        }
        return null
      })
    ]),
    openMenu: PropTypes.func,
    closeMenu: PropTypes.func,
    isMenuOpen: PropTypes.bool,
    styles: PropTypes.object
  };
  static defaultProps = {
    isMenuOpen: false,
  }

  _closeMenu() {
    const { closeMenu, isMenuOpen } = this.props

    if (isMenuOpen) {
      if (closeMenu) { closeMenu() }
    }
  }

  _openMenu() {
    const { openMenu } = this.props

    if (openMenu) { openMenu() }
  }

  render() {
    const { children, isMenuOpen, ...props } = this.props
    const { title, items } = splitChildren(children)

    return (
      <div data-fabric="NavBar" {...props}
        onClick={::this._closeMenu}
        styleName={cx('ms-NavBar', { 'is-open': isMenuOpen })}>
        { items.length > 0 && <div onClick={::this._openMenu}
          styleName={cx('ms-NavBar-openMenu', {
            'is-open': isMenuOpen
          })}>
          <Icon glyph="menu" />
        </div> }

        { title }

        <ul styleName="ms-NavBar-items">
          { items }
        </ul>
      </div>
    )
  }
}
NavBar.Item = NavBarItem
NavBar.Link = NavBarLink
NavBar.Title = NavBarTitle

export default NavBar

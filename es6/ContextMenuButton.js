var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import assign from 'object-assign';

import { showMenu, hideMenu } from './actions';
import { callIfExists, cssClasses } from './helpers';

var ContextMenuButton = function (_Component) {
    _inherits(ContextMenuButton, _Component);

    function ContextMenuButton() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ContextMenuButton);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ContextMenuButton.__proto__ || Object.getPrototypeOf(ContextMenuButton)).call.apply(_ref, [this].concat(args))), _this), _this.touchHandled = false, _this.handleMouseDown = function (event) {
            if (_this.props.holdToDisplay >= 0 && event.button === 0) {
                event.persist();
                event.stopPropagation();

                _this.mouseDownTimeoutId = setTimeout(function () {
                    return _this.handleContextClick(event);
                }, _this.props.holdToDisplay);
            }
            callIfExists(_this.props.attributes.onMouseDown, event);
        }, _this.handleMouseUp = function (event) {
            if (event.button === 0) {
                clearTimeout(_this.mouseDownTimeoutId);
            }
            callIfExists(_this.props.attributes.onMouseUp, event);
        }, _this.handleMouseOut = function (event) {
            if (event.button === 0) {
                clearTimeout(_this.mouseDownTimeoutId);
            }
            callIfExists(_this.props.attributes.onMouseOut, event);
        }, _this.handleTouchstart = function (event) {
            _this.touchHandled = false;

            if (_this.props.holdToDisplay >= 0) {
                event.persist();
                event.stopPropagation();

                _this.touchstartTimeoutId = setTimeout(function () {
                    _this.handleContextClick(event);
                    _this.touchHandled = true;
                }, _this.props.holdToDisplay);
            }
            callIfExists(_this.props.attributes.onTouchStart, event);
        }, _this.handleTouchEnd = function (event) {
            if (_this.touchHandled) {
                event.preventDefault();
            }
            clearTimeout(_this.touchstartTimeoutId);
            callIfExists(_this.props.attributes.onTouchEnd, event);
        }, _this.handleClick = function (event) {
            _this.handleContextClick(event);
            callIfExists(_this.props.attributes.onClick, event);
        }, _this.handleContextClick = function (event) {
            if (_this.props.disable) return;

            event.preventDefault();
            event.stopPropagation();

            var x = event.clientX || event.touches && event.touches[0].pageX;
            var y = event.clientY || event.touches && event.touches[0].pageY;

            hideMenu();

            var data = callIfExists(_this.props.collect, _this.props);
            var showMenuConfig = {
                position: { x: x, y: y },
                target: _this.elem,
                id: _this.props.id,
                data: data
            };
            if (data && typeof data.then === 'function') {
                // it's promise
                data.then(function (resp) {
                    showMenuConfig.data = resp;
                    showMenu(showMenuConfig);
                });
            } else {
                showMenu(showMenuConfig);
            }
        }, _this.elemRef = function (c) {
            _this.elem = c;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ContextMenuButton, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                renderTag = _props.renderTag,
                attributes = _props.attributes,
                children = _props.children;

            var newAttrs = assign({}, attributes, {
                className: cx(cssClasses.menuWrapper, attributes.className),
                onClick: this.handleClick,
                onMouseDown: this.handleMouseDown,
                onMouseUp: this.handleMouseUp,
                onTouchStart: this.handleTouchstart,
                onTouchEnd: this.handleTouchEnd,
                onMouseOut: this.handleMouseOut,
                ref: this.elemRef
            });

            return React.createElement(renderTag, newAttrs, children);
        }
    }]);

    return ContextMenuButton;
}(Component);

ContextMenuButton.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    attributes: PropTypes.object,
    collect: PropTypes.func,
    disable: PropTypes.bool,
    holdToDisplay: PropTypes.number,
    renderTag: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
};
ContextMenuButton.defaultProps = {
    attributes: {},
    collect: function collect() {
        return null;
    },

    disable: false,
    holdToDisplay: 1000,
    renderTag: 'div'
};
export default ContextMenuButton;

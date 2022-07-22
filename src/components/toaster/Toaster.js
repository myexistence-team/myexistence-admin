import React from "react";
import ReactDOM from "react-dom";
import ToastManager from "./ToastManager";

/**
 * The Toaster manages the interactions between
 * the ToasterManger and the toast API.
 */
export default class Toaster {
  constructor() {
    const container = document.createElement("div");
    container.setAttribute("coreUi-toaster-container", "");
    document.body.appendChild(container);

    ReactDOM.render(
      <ToastManager
        bindNotify={this._bindNotify}
        bindRemove={this._bindRemove}
        bindGetToasts={this._bindGetToasts}
        bindCloseAll={this._bindCloseAll}
      />,
      container
    );
  }

  _bindNotify = handler => {
    this.notifyHandler = handler;
  };

  _bindRemove = handler => {
    this.removeHandler = handler;
  };

  _bindGetToasts = handler => {
    this.getToastsHandler = handler;
  };

  _bindCloseAll = handler => {
    this.closeAllHandler = handler;
  };

  getToasts = () => {
    return this.getToastsHandler();
  };

  closeAll = () => {
    return this.closeAllHandler();
  };

  notify = (title, settings = {}) => {
    return this.notifyHandler(title, { ...settings, color: "primary" });
  };

  success = (title, settings = {}) => {
    return this.notifyHandler(title, { ...settings, color: "success" });
  };

  warning = (title, settings = {}) => {
    return this.notifyHandler(title, { ...settings, color: "warning" });
  };

  danger = (title, settings = {}) => {
    return this.notifyHandler(title, { ...settings, color: "danger" });
  };

  remove = id => {
    return this.removeHandler(id);
  };
}

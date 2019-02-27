import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@neogrup/nc-items-grid/nc-items-grid.js';
import '@neogrup/nc-password-dialog/nc-password-dialog.js';

class NcUsersGrid extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          --users-grid-item-content-border-radius: 5px;
          --users-grid-item-content-box-shadow: none;
        }

        nc-items-grid{
          --items-grid-item-content-border-radius: var(--users-grid-item-content-border-radius);
          --items-grid-item-content-box-shadow: var(--users-grid-item-content-box-shadow);
        }
      </style>

      <nc-items-grid 
          items-grid-data="[[usersGridData]]" 
          language="[[language]]" 
          is-paginated
          auto-flow
          item-height="[[heightUsersGridItems]]"
          item-width="[[widthUsersGridItems]]"
          item-margin="[[marginUsersGridItems]]"
          on-item-selected="_userSelected">
      </nc-items-grid>

      <nc-password-dialog 
          id="passwordDialog" 
          language="{{language}}" 
          on-password-accepted="_passwordAccepted">
      </nc-password-dialog>
    `;
  }

  static get properties() {
    return {
      usersGridData: {
        type: Array,
        value: []
      },
      language: String,
      heightUsersGridItems: {
        type: Number,
        reflectToAttribute: true
      },
      widthUsersGridItems: {
        type: Number,
        reflectToAttribute: true
      },
      marginUsersGridItems: {
        type: Number,
        reflectToAttribute: true
      }
    };
  }

  _userSelected(user){
    if(user.detail.needPassword === 'S'){
      this._openPasswordDialog(user.detail);
    } else{
      this.dispatchEvent(new CustomEvent('user-selected', {detail: {user: user.detail, password: ''}, bubbles: true, composed: true }));
    }
  }

  _passwordAccepted(e){
    this.dispatchEvent(new CustomEvent('user-selected', {detail:{user: e.detail.user, password: e.detail.password}, bubbles: true, composed: true }));
  }

  _openPasswordDialog(user){
    this.$.passwordDialog.set('userData.name', user.name);
    this.$.passwordDialog.set('userData.code', user.code);
    this.$.passwordDialog.open();
  }
}

window.customElements.define('nc-users-grid', NcUsersGrid);

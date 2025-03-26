import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@neogrup/nc-items-grid/nc-items-grid.js';
import '@neogrup/nc-password-dialog/nc-password-dialog.js';
import '@neogrup/nc-keyboard/nc-keyboard.js';

class NcUsersGrid extends mixinBehaviors([AppLocalizeBehavior], PolymerElement) {
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

        paper-button.delete:not([disabled]){
          background-color: var(--error-color);
        }

        paper-button.accept:not([disabled]){
          background-color: var(--success-color);
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
          animations="[[animations]]"
          on-item-selected="_userSelected">
      </nc-items-grid>

      <nc-password-dialog 
          id="passwordDialog" 
          language="{{language}}" 
          on-password-accepted="_passwordAccepted"
          show-keyboard="{{showKeyboard}}">
      </nc-password-dialog>

      <paper-dialog id="userDialog" class="modalNoApp fullWidth" modal dialog>
        <iron-a11y-keys id="a11ySignIn" keys="enter" on-keys-pressed="_acceptUser"></iron-a11y-keys>
        <div class="header">
          <iron-icon icon="communication:vpn-key"></iron-icon><h3>{{localize('USER_DIALOG_TITLE')}}</h3>
        </div>
        <div class="content">
          <div>
            <paper-input id="user"  error-message="{{localize('INPUT_ERROR_REQUIRED')}}" value="{{currentUser.code}}" on-focus="_setFocus" required></paper-input>
          </div>
        </div>
        <div class="content-keyboard">
          <nc-keyboard
            keyboard-enabled="{{showKeyboard}}"
            keyboard-embedded='S'
            keyboard-type="keyboard"
            value="{{formData.password}}"
            keyboard-current-input="{{keyboardCurrentInput}}">
          </nc-keyboard>-
        </div>
        <div class="buttons">
          <paper-button raised class="delete" dialog-dismiss>{{localize('BUTTON_CLOSE')}}</paper-button>
          <paper-button raised class="accept" on-tap="_acceptUser">{{localize('BUTTON_ACCEPT')}}</paper-button>
        </div>
      </paper-dialog>
      
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
      animations: {
        type: Boolean,
        value: true
      },
      widthUsersGridItems: {
        type: Number,
        reflectToAttribute: true
      },
      marginUsersGridItems: {
        type: Number,
        reflectToAttribute: true
      },
      showKeyboard: {
        type: String,
      },
      currentUser: Object,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.useKeyIfMissing = true;
    this.loadResources(this.resolveUrl('./static/translations.json'));
  }

  _userSelected(user){
    if((typeof user.detail.code == 'undefined') || (user.detail.code === '')){
      this.currentUser = user.detail;
      this.currentUser.code = '';
      this.$.userDialog.open();
      return
    }

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

  _acceptUser(){
    if (this.currentUser.code == ''){
      //this.$.user.validate();
      return;
    }
    //this.$.userDialog.close();
    let user = {detail: this.currentUser};
    this._userSelected(user);
  }

  _setFocus() {
    this.keyboardCurrentInput = this.$.user;
    this.dispatchEvent(new CustomEvent('inputFocus', {bubbles: true, composed: true }));
  }
}

window.customElements.define('nc-users-grid', NcUsersGrid);

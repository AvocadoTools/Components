import AvocadoTag from './tag.js';

export default class AvocadoTagInput extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          min-width: 100px;
          position: relative;
        }

        button {
          -webkit-appearance: none;
          appearance: none;
          background: none;
          background-image: url( /img/controls/chevron.svg );
          background-position: center 12px;
          background-repeat: no-repeat;
          background-size: 16px;
          border: none;
          border-left: solid 1px #e5e5e5;
          border-radius: 0;
          cursor: pointer;
          height: 39px;
          outline: none;
          width: 40px;
        }

        button:disabled {
          background-image: url( '/img/controls/chevron-disabled.svg' );
          border-bottom: solid 1px transparent;
          cursor: not-allowed;
          outline: none;
        }

        button:hover {
          background-color: #e5e5e5;
        }

        button:disabled:hover {
          background-color: transparent;
        }

        p {
          box-sizing: border-box;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          margin: 0;
          padding: 0 0 6px 0;
        }

        p.none {
          color: #161616;
          font-size: 14px;
          height: 40px;
          line-height: 40px;
          margin: 0;
          overflow: hidden;
          padding: 0 16px 0 16px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }        

        #error {
          color: #da1e28;
          padding: 4px 0 2px 0;
        }

        #field {
          align-items: center;
          background-color: #f4f4f4;
          border-bottom: solid 1px #8d8d8d;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          position: relative;
        }

        #field.invalid {
          outline: solid 2px #da1e28;
          outline-offset: -2px;
        }

        #field.light {
          background-color: #ffffff;
        }

        #field.readonly {
          border-bottom: solid 1px transparent;
          cursor: not-allowed;
        }

        #helper {
          color: #6f6f6f;
        }

        #label {
          color: #393939;
        }

        #list {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-basis: 0;
          flex-direction: row;
          flex-grow: 1;
          height: 39px;
          justify-content: flex-start;
          overflow: scroll;
        }

        #menu {
          background-color: white;
          border: solid 1px #0f62fe;
          bottom: -40px;
          box-shadow: 0 2px 6px rgba( 0, 0, 0, 0.20 );
          box-sizing: border-box;
          display: none;
          flex-direction: column;
          left: 0;
          max-height: 200px;
          min-width: 100px;
          overflow: scroll;
          position: absolute;
          z-index: 100;
        }

        #menu button {
          background-image: url( /img/controls/checkbox.svg );
          background-position: left 16px center;
          background-size: 20px;
          border: none;
          box-sizing: border-box;
          color: #161616;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 40px;
          min-height: 40px;
          overflow: hidden;
          padding: 0 16px 0 44px;
          position: relative;
          text-align: left;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }

        #menu button.selected {
          background-image: url( /img/controls/checkbox-checked.svg );
        }

        #menu button::after {
          background-color: #e5e5e5;
          bottom: 0;
          content: '';
          height: 1px;
          left: 16px;
          position: absolute;
          right: 16px;
        }

        #menu button:last-of-type::after {
          background-color: transparent;
        }

        #placeholder {
          color: #a8a8a8;
          cursor: default;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          padding: 0 0 0 16px;
        }

        #placeholder.readonly {
          cursor: not-allowed;
        }
      </style>
      <p id="label"></p>
      <p id="helper"></p>
      <div id="field">
        <p id="placeholder"></p>
        <div id="list">
          <slot></slot>
        </div>
        <button></button>
      </div>
      <p id="error"></p>
      <div id="menu"></div>
    `;

    // Properties
    this._data = [];
    this._value = [];

    // Events
    this.doHide = this.doHide.bind( this );
    this.doMenuAdd = this.doMenuAdd.bind( this );
    this.doMenuRemove = this.doMenuRemove.bind( this );
    this.doTagRemove = this.doTagRemove.bind( this );

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$chevron = shadowRoot.querySelector( '#field button' );
    this.$chevron.addEventListener( 'mousedown', ( evt ) => this.doChevron( evt ) );
    this.$error = shadowRoot.querySelector( '#error' );
    this.$field = shadowRoot.querySelector( '#field' );
    this.$helper = shadowRoot.querySelector( '#helper' );
    this.$label = shadowRoot.querySelector( '#label' );
    this.$list = shadowRoot.querySelector( '#list' );
    this.$menu = shadowRoot.querySelector( '#menu' );
    this.$placeholder = shadowRoot.querySelector( '#placeholder' );
    this.$select = shadowRoot.querySelector( 'select' );
  }

  doChevron( evt ) {
    this.$menu.scrollTop = 0;
    this.$menu.style.display = this.$menu.style.display === 'flex' ? 'none' : 'flex';
    this.$menu.style.bottom = ( 21 - this.$menu.clientHeight ) + 'px';
    this.$menu.style.width = this.clientWidth + 'px';

    if( this.$menu.style.display === 'flex' ) {
      evt.stopPropagation();
      document.addEventListener( 'mousedown', this.doHide );
    } else {
      document.removeEventListener( 'mousedown', this.doHide );
    }
  }

  doHide( evt ) {
    let found = false;

    for( let p = 0; p < evt.path.length; p++ ) {
      if( evt.path[p].id === 'menu' ) {
        found = true;
        break;
      }
    }

    if( !found ) {
      this.$menu.style.display = 'none';    
      document.removeEventListener( 'mousedown', this.doHide );      
    }
  }

  doMenuAdd( evt ) {
    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    this._value.push( this._data[index] );
    this._render();
  }

  doMenuRemove( evt ) {
    let index = null;

    for( let v = 0; v < this._value.length; v++ ) {
      const label = this.dataField === null ? this._value[v] : this._value[v][this.dataField];

      if( label === evt.currentTarget.innerText ) {
        index = v;
        break;
      }
    }

    this._value.splice( index, 1 );
    this._render();
  }

  doTagRemove( evt ) {
    let index = null;

    for( let v = 0; v < this._value.length; v++ ) {
      const label = this.dataField === null ? this._value[v] : this._value[v][this.dataField];

      if( label === evt.detail.label ) {
        index = v;
        break;
      }
    }

    this._value.splice( index, 1 );
    this._render();
  }

  // When things change
  _render() {
    // Host styles
    this.style.display = this.hidden === true ? 'none' : '';
    this.style.flexBasis = this.grow === null ? '' : 0;
    this.style.flexGrow = this.grow === null ? '' : 1;
    this.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;
    this.style.visibility = this.concealed === true ? 'hidden' : '';

    // Label
    if( this.label === null ) {
      this.$label.style.display = 'none';
    } else {
      this.$label.innerText = this.label;
      this.$label.style.display = '';
      this.$label.style.color = this.disabled === true ? '#c6c6c6' : '#393939';
    }

    // Helper
    if( this.helper === null ) {
      this.$helper.style.display = 'none';
      this.$helper.style.marginTop = 0;
    } else {
      this.$helper.innerText = this.helper;
      this.$helper.style.display = '';
      this.$helper.style.color = this.disabled === true ? '#c6c6c6' : '#6f6f6f';
      this.$helper.style.marginTop = '-4px';
    }

    // Theme
    if( this.light ) {
      this.$field.classList.add( 'light' );
    }

    // Placeholder
    if( this._value.length > 0 ) {
      this.$placeholder.style.display = 'none';
      this.$list.style.display = 'flex';
    } else {
      this.$placeholder.style.display = '';
      this.$placeholder.innerText = this.placeholder === null ? '' : this.placeholder;
      this.$list.style.display = 'none';
    }

    // Readonly
    if( this.readonly ) {
      this.$field.classList.add( 'readonly' );
      this.$placeholder.classList.add( 'readonly' );
    } else {
      this.$field.classList.remove( 'readonly' );
      this.$placeholder.classList.remove( 'readonly' );
    }

    this.$chevron.disabled = this.readonly;

    // Tooltip
    this.$field.title = this.title === null ? '' : this.title;

    // Error
    if( this.error === null ) {
      this.$error.style.visibility = 'hidden';
      this.$error.innerText = '&nbsp;';
    } else {
      this.$field.classList.add( 'invalid' );
      this.$error.innerText = this.error;
      this.$error.style.visibility = '';
    }

    // Add tags if needed (values)
    for( let v = 0; v < this._value.length; v++ ) {
      const label = this.dataField === null ? this._value[v] : this._value[v][this.dataField];
      let found = false;

      for( let c = 0; c < this.$list.children.length; c++ ) {
        if( label === this.$list.children[c].label ) {
          found = true;
          break;
        }
      }

      if( !found ) {
        const tag = document.createElement( 'avocado-tag' );
        tag.label = label;
        tag.marginLeft = 8;
        tag.readonly = this.readonly;
        tag.addEventListener( 'clear', this.doTagRemove );
        this.$list.appendChild( tag );
      }
    }

    // Remove tags (values) if not selected
    for( let c = 0; c < this.$list.children.length; c++ ) {
      this.$list.children[c].readonly = this.readonly;

      let found = false;

      for( let v = 0; v < this._value.length; v++ ) {
        const label = this.dataField === null ? this._value[v] : this._value[v][this.dataField];      

        if( this.$list.children[c].label === label ) {
          found = true;
          break;
        }
      }

      if( !found ) {
        this.$list.children[c].removeEventListener( 'clear', this.doTagRemove );
        this.$list.children[c].remove();
      }
    }

    // No menu items
    // Use menu placeholder
    if( this._data.length === 0 ) {
      if( this.$menu.children.length === 0 ) {
        const none = document.createElement( 'p' );
        none.classList.add( 'none' );
        none.innerText = this.noOptions === null ? 'No options available' : this.noOptions;
        this.$menu.appendChild( none );
      }

      return;
    } else {
      const none = this.$menu.querySelector( 'p.none' );

      if( none !== null ) {
        none.remove();
      }
    }

    // Menu items    
    while( this.$menu.children.length > this._data.length ) {
      this.$menu.children[0].removeEventListener( 'mousedown', this.doMenuAdd );
      this.$menu.children[0].removeEventListener( 'mousedown', this.doMenuRemove );
      this.$menu.children[0].remove();
    }

    while( this.$menu.children.length < this._data.length ) {
      const button = document.createElement( 'button' );
      this.$menu.appendChild( button );
    }

    // Menu state
    for( let d = 0; d < this._data.length; d++ ) {
      const label = this.dataField === null ? this._data[d] : this._data[d][this.dataField];

      this.$menu.children[d].setAttribute( 'data-index', d );
      this.$menu.children[d].innerText = label;

      let found = false;

      for( let t = 0; t < this.$list.children.length; t++ ) {
        if( this.$list.children[t].label === label ) {
          found = true;
          break;
        }
      }

      if( found ) {
        this.$menu.children[d].classList.add( 'selected' );
        this.$menu.children[d].removeEventListener( 'mousedown', this.doMenuAdd );
        this.$menu.children[d].addEventListener( 'mousedown', this.doMenuRemove );
      } else {
        this.$menu.children[d].classList.remove( 'selected' );
        this.$menu.children[d].removeEventListener( 'mousedown', this.doMenuRemove );
        this.$menu.children[d].addEventListener( 'mousedown', this.doMenuAdd );
      }
    }
  }

   // Properties set before module loaded
   _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Default render
  // No attributes set
  connectedCallback() {
    // Check data property before render
    // May be assigned before module is loaded
    this._upgrade( 'concealed' );
    this._upgrade( 'data' );
    this._upgrade( 'dataField' );
    this._upgrade( 'dataTipField' );
    this._upgrade( 'disabled' );
    this._upgrade( 'error' );
    this._upgrade( 'grow' );
    this._upgrade( 'helper' );
    this._upgrade( 'hidden' );
    this._upgrade( 'label' );
    this._upgrade( 'light' );
    this._upgrade( 'marginBottom' );
    this._upgrade( 'marginLeft' );
    this._upgrade( 'marginRight' );
    this._upgrade( 'marginTop' );
    this._upgrade( 'noOptions' );
    this._upgrade( 'placeholder' );
    this._upgrade( 'readonly' );
    this._upgrade( 'title' );
    this._upgrade( 'value' );

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'data-field',
      'data-tip-field',
      'disabled',
      'error',
      'grow',
      'helper',
      'hidden',
      'label',
      'light',
      'margin-bottom',
      'margin-left',
      'margin-right',
      'margin-top',
      'no-options',
      'placeholder',
      'readonly',
      'title'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
    this._render();
  }

  get value() {
    return this._value;
  }

  set value( items ) {
    if( items === null ) {
      this._value = [];
    } else {
      this._value = [... items];
    }

    this._render();
  }

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)
  get concealed() {
    return this.hasAttribute( 'concealed' );
  }

  set concealed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'concealed' );
      } else {
        this.setAttribute( 'concealed', '' );
      }
    } else {
      this.removeAttribute( 'concealed' );
    }
  }

  get dataField() {
    if( this.hasAttribute( 'data-field' ) ) {
      return this.getAttribute( 'data-field' );
    }

    return null;
  }

  set dataField( value ) {
    if( value !== null ) {
      this.setAttribute( 'data-field', value );
    } else {
      this.removeAttribute( 'data-field' );
    }
  }

  get dataTipField() {
    if( this.hasAttribute( 'data-tip-field' ) ) {
      return this.getAttribute( 'data-tip-field' );
    }

    return null;
  }

  set dataTipField( value ) {
    if( value !== null ) {
      this.setAttribute( 'data-tip-field', value );
    } else {
      this.removeAttribute( 'data-tip-field' );
    }
  }

  get disabled() {
    return this.hasAttribute( 'disabled' );
  }

  set disabled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'disabled' );
      } else {
        this.setAttribute( 'disabled', '' );
      }
    } else {
      this.removeAttribute( 'disabled' );
    }
  }

  get error() {
    if( this.hasAttribute( 'error' ) ) {
      return this.getAttribute( 'error' );
    }

    return null;
  }

  set error( value ) {
    if( value !== null ) {
      this.setAttribute( 'error', value );
    } else {
      this.removeAttribute( 'error' );
    }
  }

  get grow() {
    if( this.hasAttribute( 'grow' ) ) {
      return parseInt( this.getAttribute( 'grow' ) );
    }

    return null;
  }

  set grow( value ) {
    if( value !== null ) {
      this.setAttribute( 'grow', value );
    } else {
      this.removeAttribute( 'grow' );
    }
  }

  get helper() {
    if( this.hasAttribute( 'helper' ) ) {
      return this.getAttribute( 'helper' );
    }

    return null;
  }

  set helper( value ) {
    if( value !== null ) {
      this.setAttribute( 'helper', value );
    } else {
      this.removeAttribute( 'helper' );
    }
  }

  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }

  get light() {
    return this.hasAttribute( 'light' );
  }

  set light( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'light' );
      } else {
        this.setAttribute( 'light', '' );
      }
    } else {
      this.removeAttribute( 'light' );
    }
  }

  get marginBottom() {
    if( this.hasAttribute( 'margin-bottom' ) ) {
      return parseInt( this.getAttribute( 'margin-bottom' ) );
    }

    return null;
  }

  set marginBottom( value ) {
    if( value !== null ) {
      this.setAttribute( 'margin-bottom', value );
    } else {
      this.removeAttribute( 'margin-bottom' );
    }
  }

  get marginLeft() {
    if( this.hasAttribute( 'margin-left' ) ) {
      return parseInt( this.getAttribute( 'margin-left' ) );
    }

    return null;
  }

  set marginLeft( value ) {
    if( value !== null ) {
      this.setAttribute( 'margin-left', value );
    } else {
      this.removeAttribute( 'margin-left' );
    }
  }

  get marginRight() {
    if( this.hasAttribute( 'margin-right' ) ) {
      return parseInt( this.getAttribute( 'margin-right' ) );
    }

    return null;
  }

  set marginRight( value ) {
    if( value !== null ) {
      this.setAttribute( 'margin-right', value );
    } else {
      this.removeAttribute( 'margin-right' );
    }
  }

  get marginTop() {
    if( this.hasAttribute( 'margin-top' ) ) {
      return parseInt( this.getAttribute( 'margin-top' ) );
    }

    return null;
  }

  set marginTop( value ) {
    if( value !== null ) {
      this.setAttribute( 'margin-top', value );
    } else {
      this.removeAttribute( 'margin-top' );
    }
  }

  get noOptions() {
    if( this.hasAttribute( 'no-options' ) ) {
      return this.getAttribute( 'no-options' );
    }

    return null;
  }

  set noOptions( value ) {
    if( value !== null ) {
      this.setAttribute( 'no-options', value );
    } else {
      this.removeAttribute( 'no-options' );
    }
  }

  get placeholder() {
    if( this.hasAttribute( 'placeholder' ) ) {
      return this.getAttribute( 'placeholder' );
    }

    return null;
  }

  set placeholder( value ) {
    if( value !== null ) {
      this.setAttribute( 'placeholder', value );
    } else {
      this.removeAttribute( 'placeholder' );
    }
  }

  get readonly() {
    return this.hasAttribute( 'readonly' );
  }

  set readonly( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'readonly' );
      } else {
        this.setAttribute( 'readonly', '' );
      }
    } else {
      this.removeAttribute( 'readonly' );
    }
  }

  get title() {
    if( this.hasAttribute( 'title' ) ) {
      return this.getAttribute( 'title' );
    }

    return null;
  }

  set title( value ) {
    if( value !== null ) {
      this.setAttribute( 'title', value );
    } else {
      this.removeAttribute( 'title' );
    }
  }
}

window.customElements.define( 'avocado-tag-input', AvocadoTagInput );

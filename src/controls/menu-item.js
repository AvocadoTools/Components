export default class AvocadoMenuItem extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          background: none;
          background-image: var( --menu-item-background-image );
          background-position: left 12px center;
          background-repeat: no-repeat;
          background-size: 18px;
          border: none;
          color: var( --menu-item-color, #f4f4f4 );
          cursor: var( --menu-item-cursor, default );
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: var( --menu-item-font-size, 14px );
          font-weight: var( --menu-item-font-weight, 600 );
          height: var( --menu-item-height, 32px );
          margin: var( --menu-item-margin, 0 );
          outline: none;
          padding: var( --menu-item-padding, 0 0 0 44px );
          text-align: var( --menu-item-text-align, left );
        }

        :host( [href] ) button {
          cursor: pointer;
        }

        :host( [href] ) button:hover {
          background-color: var( --menu-item-background-hover, #4d4d4d );
        }

        :host( [leaf] ) button {
          font-weight: 400;
          padding: 0 0 0 60px;          
        }

        :host( [selected] ) button {
          border-left: solid 4px #0f62fe;          
        }
      </style>
      <button part="button">
        <slot></slot>
      </button>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  // When things change
  _render() {;}

  // Properties set before module loaded
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Setup
  connectedCallback() {
    this._upgrade( 'concealed' );
    this._upgrade( 'data' );
    this._upgrade( 'hidden' );
    this._upgrade( 'href' );
    this._upgrade( 'leaf' );
    this._upgrade( 'selected' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'href',
      'leaf',
      'selected'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
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

  get href() {
    if( this.hasAttribute( 'href' ) ) {
      return this.getAttribute( 'href' );
    }

    return null;
  }

  set href( value ) {
    if( value !== null ) {
      this.setAttribute( 'href', value );
    } else {
      this.removeAttribute( 'href' );
    }
  }

  get leaf() {
    return this.hasAttribute( 'leaf' );
  }

  set leaf( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'leaf' );
      } else {
        this.setAttribute( 'leaf', '' );
      }
    } else {
      this.removeAttribute( 'leaf' );
    }
  }

  get selected() {
    return this.hasAttribute( 'selected' );
  }

  set selected( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selected' );
      } else {
        this.setAttribute( 'selected', '' );
      }
    } else {
      this.removeAttribute( 'selected' );
    }
  }  
}

window.customElements.define( 'adc-menu-item', AvocadoMenuItem );

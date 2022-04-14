export default class AvocadoLink extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        :host {
          box-sizing: border-box;
          position: relative;
        }

        button {
          background: none;
          border: none;
          box-sizing: border-box;
          color: #0f62fe;
          cursor: pointer;
          display: block;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          outline: none;
          padding: 0;
          position: relative;
        }

        button:hover {
          text-decoration: underline;
        }

        button:disabled:hover,
        button:disabled {
          color: #c6c6c6;
          cursor: not-allowed;
          text-decoration: none;
        }
      </style>
      <button type="button">
        <slot></slot>
      </button>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$link = shadowRoot.querySelector( 'button' );
  }

  // When things change
  _render() {
    // Host styles
    this.style.display = this.hidden === true ? 'none' : '';    
    this.style.visibility = this.concealed === true ? 'hidden' : '';

    // Attributes
    this.$link.disabled = this.disabled;
    this.$link.title = this.title === null ? '' : this.title;

    // Button styles
    this.$link.style.fontSize = this.fontSize === null ? '' : `${this.fontSize}px`;
    this.$link.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.$link.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.$link.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.$link.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;
    this.$link.style.textDecoration = this.inline == true ? 'underline' : '';

    // Content
    this.$link.innerText = this.label === null ? '' : this.label;
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
    this._upgrade( 'disabled' );    
    this._upgrade( 'font-size' );    
    this._upgrade( 'hidden' );    
    this._upgrade( 'inline' );    
    this._upgrade( 'label' );    
    this._upgrade( 'marginBottom' );    
    this._upgrade( 'marginLeft' );    
    this._upgrade( 'marginRight' );    
    this._upgrade( 'marginTop' );    
    this._upgrade( 'title' );

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'font-size',
      'hidden',
      'inline',
      'label',
      'margin-bottom',
      'margin-left',
      'margin-right',
      'margin-top',
      'title'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Arbitrary storage
  // For your convenience
  // Not used in component  
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
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

  get fontSize() {
    if( this.hasAttribute( 'font-size' ) ) {
      return parseInt( this.getAttribute( 'font-size' ) );
    }

    return null;
  }

  set fontSize( value ) {
    if( value !== null ) {
      this.setAttribute( 'font-size', value );
    } else {
      this.removeAttribute( 'font-size' );
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

  get inline() {
    return this.hasAttribute( 'inline' );
  }

  set inline( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'inline' );
      } else {
        this.setAttribute( 'inline', '' );
      }
    } else {
      this.removeAttribute( 'inline' );
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

window.customElements.define( 'avocado-link', AvocadoLink );

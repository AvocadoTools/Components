export default class AvocadoCheckbox extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          position: relative;
        }

        button {
          background: none;
          background-image: url( /img/controls/checkbox.svg );
          background-position: left center;
          background-repeat: no-repeat;  
          background-size: 20px;
          border: none;
          box-sizing: border-box;         
          color: #161616;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          outline: none;
          padding: 3px 0 3px 26px;
        }

        button:disabled {
          background-image: url( /img/controls/checkbox-disabled.svg );
          color: #c6c6c6;
          cursor: not-allowed;
        }

        button.checked {
          background-image: url( /img/controls/checkbox-checked.svg );
        }

        button.checked:disabled {
          background-image: url( /img/controls/checkbox-checked-disabled.svg );          
        }

        button::before {
          border: solid 1px transparent;
          border-radius: 1px;
          content: '';  
          height: 14px;
          left: 0;
          margin: 2px;
          position: absolute;
          top: 2px;
          width: 14px;
        }

        button:focus::before {
          box-shadow: 
            0 0 0 2px #ffffff,
            0 0 0 4px #0f62fe;  
        }
      </style>
      <button>Checkbox label</button>
    `;

    // Properties
    this._data = null;

    // Events
    this.doSpace = this.doSpace.bind( this );

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Touch
    const touch = ( 'ontouchstart' in document.documentElement ) ? true : false;    

    // Elements
    this.$checkbox = shadowRoot.querySelector( 'button' );
    this.$checkbox.addEventListener( touch ? 'touchstart' : 'mousedown', ( evt ) => this.doDown( evt ) );
    this.$checkbox.addEventListener( 'focus', ( evt ) => this.doFocus( evt ) );
    this.$checkbox.addEventListener( 'blur', ( evt ) => this.doBlur( evt ) );
  }

  // Focus out
  // No longer listen for space bar
  doBlur( evt ) {
    document.removeEventListener( 'keypress', this.doSpace );
  }

  // Down
  // Toggle state
  doDown( evt ) {
    if( this.checked ) {
      this.checked = false;
    } else {
      this.checked = true;
    } 
  }

  // Focus arrived
  // Listen for space bar
  doFocus( evt ) {
    document.addEventListener( 'keypress', this.doSpace );
  }

  // Actually do any key press
  // Listening specifically for space
  doSpace( evt ) {
    if( evt.code === 'Space' ) {
      this.checked = !this.checked;
    }
  }

  // When things change
  _render() {
    // Host
    this.style.display = this.hidden === true ? 'none' : '';
    this.style.visibility = this.concealed === true ? 'hidden' : '';    

    // Attributes
    if( this.title !== null ) {
      this.$checkbox.removeAttribute( 'title' );      
    } else {
      this.$checkbox.title = this.title;
    }

    this.$checkbox.disabled = this.disabled;

    // Styles
    if( this.checked ) {
      this.$checkbox.classList.add( 'checked' );
    } else {
      this.$checkbox.classList.remove( 'checked' );
    }

    this.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;    

    // Content
    this.$checkbox.innerText = this.label === null ? '' : this.label;
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
    this._upgrade( 'checked' );
    this._upgrade( 'concealed' );
    this._upgrade( 'disabled' );
    this._upgrade( 'hidden' ); 
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
      'checked',
      'concealed',
      'disabled',
      'hidden',
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
  get checked() {
    return this.hasAttribute( 'checked' );
  }

  set checked( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'checked' );
      } else {
        this.setAttribute( 'checked', '' );
      }
    } else {
      this.removeAttribute( 'checked' );
    }
  }

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

window.customElements.define( 'avocado-checkbox', AvocadoCheckbox );

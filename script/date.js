export default class AvocadoDatePicker extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        input[type="date"] {
          appearance: none;
          background: none;
          background-image: url( /img/controls/calendar.svg );
          background-position: right 16px center;
          background-repeat: no-repeat;
          background-size: 16px;
          background-color: #f4f4f4;
          border: none;
          border-bottom: solid 1px #8d8d8d;
          border-radius: 0;
          box-sizing: border-box;
          color: #161616;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 40px;
          outline-offset: -2px;          
          padding: 0 48px 0 16px;
          -webkit-appearance: none;
          width: 100%;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;  
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: auto;
          height: auto;
          color: transparent;
          background: transparent;
        }
        
        input[type="date"]::-webkit-inner-spin-button {
          display: none;
        }

        input[type="date"]::-webkit-clear-button {
          display: none;
        }        

        input:focus {
          outline: solid 2px #0f62fe;
        }
        
        input:read-only {
          background-image: url( /img/controls/calendar-disabled.svg );
          border-bottom: solid 1px transparent;
          cursor: not-allowed;
          outline: none;  
        }

        input:disabled {
          background-image: url( /img/controls/calendar-disabled.svg );
          border-bottom: solid 1px transparent;
          color: #c6c6c6;          
          cursor: not-allowed;
          outline: none;  
        }        

        input.invalid {
          background-image: url( /img/controls/warning.svg );
          outline: solid 2px #da1e28;          
        }

        input.invalid:focus {
          outline: solid 2px #da1e28;
        }

        input.light {
          background-color: #ffffff;
        }

        p {
          box-sizing: border-box;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          margin: 0;
          padding: 0;
        }

        #error {
          color: #da1e28;
          padding: 4px 0 2px 0;
        }

        #helper {
          color: #6f6f6f;
          padding-bottom: 6px;
        }
        
        #label {
          color: #393939;
          padding-bottom: 6px;         
        }
      </style>
      <p id="label"></p>
      <p id="helper"></p>
      <input required type="date">
      <p id="error"></p>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = shadowRoot.querySelector( '#label' );
    this.$helper = shadowRoot.querySelector( '#helper' );
    this.$picker = shadowRoot.querySelector( 'input' );
    this.$error = shadowRoot.querySelector( '#error' );

    // Default
    this.value = new Date();
  }

  // Shortcut for setting value to today
  today() {
    this.value = null;
  }

  // When tnings change  
  _render() {
    // Host styles
    this.style.display = this.hidden === true ? 'none' : '';
    this.style.flexBasis = this.grow === null ? '' : 0;
    this.style.flexGrow = this.grow === null ? '' : this.grow;
    this.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;
    this.style.visibility = this.concealed === true ? 'hidden' : '';    
    this.style.width = this.width === null ? '' : `${this.width}px`;    

    // Is there a label attribute
    // Should it be displayed
    // What color should it be
    if( this.label === null ) {
      this.$label.style.display = 'none';
    } else {
      this.$label.innerText = this.label;
      this.$label.style.display = '';
      this.$label.style.color = this.disabled === true ? '#c6c6c6' : '#393939';
    }

    // Same for helper
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
    this.$picker.className = '';

    if( this.light ) {
      this.$picker.classList.add( 'light' );
    }

    // Attributes
    this.$picker.disabled = this.disabled;    
    this.$picker.readOnly = this.readonly;
    this.$picker.title = this.title === null ? '' : this.title;
    
    // Error message
    if( this.error === null ) {
      this.$error.style.visibility = 'hidden';
      this.$error.innerText = '&nbsp;';
    } else {
      this.$picker.classList.add( 'invalid' );
      this.$error.innerText = this.error;
      this.$error.style.visibility = '';
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
    this._upgrade( 'readonly' );
    this._upgrade( 'title' );    
    this._upgrade( 'width' );    

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
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
      'readonly',
      'title',
      'width'
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

  // Properties
  // Not reflected
  get value() {
    // Put time in place to parse for local
    return new Date( this.$picker.value + 'T12:00:00Z' );
  }

  // String (YYYY-MM-DD, 8601)
  // Number (ms)
  // Date
  // Null (set to today, local)
  set value( content ) {
    if( content !== null ) {
      const type = typeof content;

      if( type === 'string' ) {
        if( content.length > 10 ) {
          content = new Date();
        } else {
          content = new Date( content + 'T12:00:00Z' );          
        }
      } else if( type === 'number' ) {
        content = new Date( content );
      }
    } else {
      content = new Date();
    }

    const month = ( content.getMonth() + 1 ).toString().padStart( 2, '0' );
    const date = content.getDate().toString().padStart( 2, '0' );
    const year = content.getFullYear();

    this.$picker.value = `${year}-${month}-${date}`;    
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

  get width() {
    if( this.hasAttribute( 'width' ) ) {
      return parseInt( this.getAttribute( 'width' ) );
    }

    return null;
  }

  set width( value ) {
    if( value !== null ) {
      this.setAttribute( 'width', value );
    } else {
      this.removeAttribute( 'width' );
    }
  }    
}

window.customElements.define( 'avocado-date-picker', AvocadoDatePicker );

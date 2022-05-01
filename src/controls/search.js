export default class AvocadoSearch extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    
    /*template*/
    template.innerHTML = `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
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
          background-image: url( /img/controls/clear.svg );
          background-position: center;
          background-repeat: no-repeat;
          background-size: 20px;
          border: none;
          border-radius: 0;
          box-sizing: border-box;
          cursor: pointer;
          display: none;
          height: 48px;          
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0;
          position: absolute;
          right: 0;
          width: 48px;          
          top: 0;
        }

        button:hover {
          background-color: #e5e5e5;
        }

        button:active {
          background-color: #e0e0e0;
        }

        input {
          background: none; 
          background-color: #f4f4f4;
          background-image: url( /img/controls/search.svg );
          background-position: left 12px center;          
          background-repeat: no-repeat;
          background-size: 16px;                    
          border: none;
          border-bottom: solid 1px #8d8d8d;          
          border-radius: 0;
          box-sizing: border-box;          
          color: #161616;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 40px;       
          min-height: 40px;             
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0 40px 0 40px;
          position: relative;
          text-rendering: optimizeLegibility;
          width: 100%;
        }

        input::placeholder {
          color: #a8a8a8;          
          font-family: 'IBM Plex Sans', sans-serif;
          font-weight: 400;
        }

        input:hover {
          background-color: #e8e8e8;
        }

        input:focus {
          cursor: text;
          outline: solid 2px #0f62fe;
        }
        
        input:focus ~ button:hover {
          top: 2px;
          right: 2px;
          width: 44px;
          height: 44px;
        }

        :host( [light] ) input {
          background-color: #ffffff;
        }        

        :host( [size=lg] ) button {
          height: 48px;
          width: 48px;                    
        }        

        :host( [size=lg] ) input {
          background-position: left 16px center;
          background-size: 16px;                    
          font-size: 16px;
          height: 48px;
          min-height: 48px;      
          padding: 0 48px 0 48px;              
        }

        :host( [size=sm] ) button {
          height: 32px;
          width: 40px;          
        }        

        :host( [size=sm] ) input {
          background-position: left 16px center;
          background-size: 16px;                              
          font-size: 14px;
          height: 32px;
          min-height: 32px;
          padding: 0 40px 0 40px;
        }

        :host( [size=sm] ) input::placeholder {  
          font-size: 14px;                          
        }
      </style>
      <input part="input" type="text"/>
      <button part="clear" title="Clear" type="button"></button>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$search = shadowRoot.querySelector( 'input' );
    this.$search.addEventListener( 'input', () => {
      // Reflect value to attribute
      this.value = this.$search.value;

      // Should there be a clear button
      if( this.value.trim().length === 0 ) {
        this.$clear.style.display = 'none';
      } else {
        this.$clear.style.display = 'block';
      }
    } );
    this.$search.addEventListener( 'keypress', ( evt ) => {
      if( evt.key === 'Enter' ) {
        this.dispatchEvent( new CustomEvent( 'enter', {
          detail: {
            value: this.value
          }
        } ) );
      }      
    } );    
    this.$clear = shadowRoot.querySelector( 'button' );
    this.$clear.addEventListener( 'click', ( evt ) => {
      // Control focus
      // Not on button
      evt.preventDefault();

      // Clear field
      // Hide clear button
      this.clear();

      // Move focus back to field
      this.$search.focus();

      // In case anybody is interested
      this.dispatchEvent( new CustomEvent( 'clear' ) );
    } );
  }

  // Clear the field
  // Hide the clear button    
  clear() {
    this.$search.value = '';
    this.$clear.style.display = 'none';    
  }

  // When things change
  _render() {
    this.$search.placeholder = this.placeholder === null ? 'Search' : this.placeholder;
    this.$search.title = this.title === null ? '' : this.title;
    this.$search.value = this.value;
  }

  // Promote properties
  // Values may be set before module load
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
    this._upgrade( 'light' );    
    this._upgrade( 'placeholder' );    
    this._upgrade( 'size' );    
    this._upgrade( 'title' );    
    this._upgrade( 'value' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'light',
      'placeholder',
      'size',
      'title',
      'value'
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

  /*
  get value() {
    return this.$search.value;
  }

  set value( content ) {
    this.$search.value = content;
  }
  */

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

  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return this.getAttribute( 'size' );
    }

    return null;
  }

  set size( value ) {
    if( value !== null ) {
      this.setAttribute( 'size', value );
    } else {
      this.removeAttribute( 'size' );
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

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( content ) {
    if( content !== null ) {
      this.setAttribute( 'value', content );
    } else {
      this.removeAttribute( 'value' );
    }
  }    
}

window.customElements.define( 'adc-search', AvocadoSearch );

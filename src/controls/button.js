export default class AvocadoButton extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
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
          appearance: none;
          background: none;
          background-color: #0f62fe;          
          background-position: right 16px center;
          background-repeat: no-repeat;
          background-size: 16px;
          border: none;
          border: solid 1px transparent;
          box-sizing: border-box;          
          color: #ffffff;          
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 48px;
          margin: 0;
          outline: solid 1px transparent;
          outline-offset: -3px;
          padding: 0 60px 0 12px;
          text-align: left;
          text-rendering: optimizeLegibility;
          white-space: nowrap;
          width: 100%;
        }

        button:focus {
          border-color: #0f62fe;
          box-shadow: 
            inset 0 0 0 1px #0f62fe,
            inset 0 0 0 2px #ffffff;          
        }      
        
        button:hover {
          background-color: #0353e9;
        }              

        :host( [disabled] ) button {
          background-color: #c6c6c6;
          color: #8d8d8d;
          cursor: not-allowed;
        }

        :host( [size=field] ) button {
          height: 40px;
        }

        :host( [size=sm] ) button {
          height: 32px;
        }        

        :host( [size=lg] ) button {
          height: 64px;
        }              
        
        :host( [size=xl] ) button {
          height: 80px;
        }

        :host( [kind=secondary] ) button {
          background-color: #393939;
          color: #ffffff;
          padding: 0 60px 0 12px;
        }

        :host( [kind=secondary] ) button:focus {
          border-color: #0f62fe;
          box-shadow: 
            inset 0 0 0 1px #0f62fe,
            inset 0 0 0 2px #ffffff;          
        }

        :host( [kind=secondary] ) button:hover {
          background-color: #4a4a4a;          
        }

        :host( [kind=secondary] ) button:disabled {
          background-color: #c6c6c6;
          color: #8d8d8d;
          cursor: not-allowed;
        }        

        :host( [kind=tertiary] ) button {
          background-color: transparent;
          border: solid 1px #0f62fe;
          color: #0f62fe;
          padding: 0 60px 0 12px;
        }

        :host( [kind=tertiary] ) button:focus {
          background-color: #0f62fe;
          border-color: #0f62fe;
          box-shadow: 
            inset 0 0 0 1px #0f62fe,
            inset 0 0 0 2px #ffffff;
          color: #ffffff;                    
        }        

        :host( [kind=tertiary] ) button:hover {
          background-color: #0353e9;
          border: solid 1px #0353e9;          
          color: #ffffff;          
        }        

        :host( [kind=tertiary] ) button:disabled {
          border: solid 1px #c6c6c6;
          color: #c6c6c6;
          cursor: not-allowed;          
        }

        :host( [kind=danger] ) button {
          background-color: #da1e28;
          color: #ffffff;
          padding: 0 60px 0 12px;          
        }

        :host( [kind=danger] ) button:focus {
          border-color: #0f62fe;
          box-shadow: 
            inset 0 0 0 1px #0f62fe,
            inset 0 0 0 2px #ffffff;
        }

        :host( [kind=danger] ) button:hover {
          background-color: #bc1a22;          
        }

        :host( [kind=danger] ) button:disabled {
          background-color: #c6c6c6;
          color: #8d8d8d;
          cursor: not-allowed;          
        }

        :host( [kind=ghost] ) button {        
          background-color: transparent;
          color: #0f62fe;
          padding: 0 12px 0 12px;
        }

        :host( [kind=ghost] ) button:focus {                
          border-color: #0f62fe;
          box-shadow: 
            inset 0 0 0 1px #0f62fe,
            inset 0 0 0 2px #ffffff;
        }

        :host( [kind=ghost] ) button:hover {                
          background-color: #e5e5e5e4;
        }

        :host( [kind=ghost] ) button:disabled {                
          color: #c6c6c6;
          cursor: not-allowed;
        }        

        :host( [kind=ghost] ) button[disabled]:hover {                
          background-color: transparent;
        }                
      </style>
      <button part="button" type="button">
        <slot></slot>
      </button>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = shadowRoot.querySelector( 'button' );
  }

  // When things change
  _render() {
    this.$button.disabled = this.disabled;
    
    if( this.title === null ) {
      this.$button.removeAttribute( 'title' );      
    } else {
      this.$button.title = this.title;      
    }

    if( this.label !== null )
      this.innerText = this.label;
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
    this._upgrade( 'disabled' );
    this._upgrade( 'hidden' );    
    this._upgrade( 'kind' );    
    this._upgrade( 'label' );    
    this._upgrade( 'size' );    
    this._upgrade( 'title' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'kind',
      'label',
      'size',
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

  get kind() {
    if( this.hasAttribute( 'kind' ) ) {
      return this.getAttribute( 'kind' );
    }

    return null;
  }

  set kind( value ) {
    if( value !== null ) {
      this.setAttribute( 'kind', value );
    } else {
      this.removeAttribute( 'kind' );
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
}

window.customElements.define( 'adc-button', AvocadoButton );

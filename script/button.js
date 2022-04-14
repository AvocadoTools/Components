export default class AvocadoButton extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        @import url( 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap' );

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

        :host( [size="field"] ) button {
          height: 40px;
        }

        :host( [size="sm"] ) button {
          height: 32px;
        }        

        :host( [size="lg"] ) button {
          height: 64px;
        }              
        
        :host( [size="xl"] ) button {
          height: 80px;
        }

        :host( [kind="secondary"] ) button {
          background-color: #393939;
          color: #ffffff;
          padding: 0 60px 0 12px;
        }

        :host( [kind="secondary"] ) button:focus {
          border-color: #0f62fe;
          box-shadow: 
            inset 0 0 0 1px #0f62fe,
            inset 0 0 0 2px #ffffff;          
        }

        :host( [kind="secondary"] ) button:hover {
          background-color: #4a4a4a;          
        }

        button.secondary:disabled {
          background-color: #c6c6c6;
          color: #8d8d8d;
          cursor: not-allowed;
        }        
        
        button.tertiary {
          border: solid 1px #0f62fe;
          color: #0f62fe;
          padding: 0 60px 0 12px;
        }        

        button.tertiary:focus {
          background-color: #0f62fe;
          border-color: #0f62fe;
          box-shadow: 
            inset 0 0 0 1px #0f62fe,
            inset 0 0 0 2px #ffffff;
          color: #ffffff;          
        }

        button.tertiary:hover {
          background-color: #0353e9;
          border: solid 1px #0353e9;          
          color: #ffffff;
        }        

        button.tertiary:disabled {
          border: solid 1px #c6c6c6;
          color: #c6c6c6;
          cursor: not-allowed
        }

        button[disabled].tertiary:hover {
          background-color: transparent;
        }

        button.danger {
          background-color: #da1e28;
          color: #ffffff;
          padding: 0 60px 0 12px;
        }        

        button.danger:focus {
          border-color: #0f62fe;
          box-shadow: 
            inset 0 0 0 1px #0f62fe,
            inset 0 0 0 2px #ffffff;
        }

        button.danger:hover {
          background-color: #bc1a22;
        }

        button.danger:disabled {
          background-color: #c6c6c6;
          color: #8d8d8d;
          cursor: not-allowed;
        }

        button.ghost {
          color: #0f62fe;
          padding: 0 12px 0 12px;
        }

        button.ghost:focus {
          border-color: #0f62fe;
          box-shadow: 
            inset 0 0 0 1px #0f62fe,
            inset 0 0 0 2px #ffffff;
        }

        button.ghost:hover {
          background-color: #e5e5e5e4;
        }

        button.ghost:disabled {
          color: #c6c6c6;
          cursor: not-allowed;
        }        
      </style>
      <button></button>
    `;

    // Properties
    this._data = null;
    this._focus = false;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Touch
    const touch = ( 'ontouchstart' in document.documentElement ) ? true : false;    

    // Elements
    // Event listeners for icon management
    this.$button = shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'blur', ( evt ) => this.doBlur( evt ) );                
    this.$button.addEventListener( 'focus', ( evt ) => this.doFocus( evt ) );            
    this.$button.addEventListener( touch ? 'touchstart' : 'mousedown', ( evt ) => this.doDown( evt ) );        
    this.$button.addEventListener( 'mouseout', ( evt ) => this.doOut( evt ) );    
    this.$button.addEventListener( 'mouseover', ( evt ) => this.doOver( evt ) );
    this.$button.addEventListener( touch ? 'touchend' : 'mouseup', ( evt ) => this.doOver( evt ) );            
  }

  // Down
  doDown( evt ) {
    if( this.icon !== null ) {
      if( this.iconDown !== null ) {
        this.$button.style.backgroundImage = `url( ${this.iconDown} )`;
      } else {
        this.$button.style.backgroundImage = `url( ${this.icon} )`;
      }
    }
  }

  // Not focused
  doBlur( evt ) {
    this._focus = false;
    this.doOut( evt );
  }

  // Focused
  doFocus( evt ) {
    this._focus = true;
  }

  // Focus leaving
  // Hover leaving
  doOut( evt ) {
    if( this.icon !== null ) {
      if( this._focus ) {
        if( this.iconOver !== null ) {
          this.$button.style.backgroundImage = `url( ${this.iconOver} )`;
        } else {
          this.$button.style.backgroundImage = `url( ${this.icon} )`;
        }
      } else {
        this.$button.style.backgroundImage = `url( ${this.icon} )`;
      }
    } else {
      this.$button.style.backgroundImage = '';
    }
  }

  // Hover
  doOver( evt ) {
    if( this.icon !== null ) {
      if( this.iconOver !== null ) {
        this.$button.style.backgroundImage = `url( ${this.iconOver} )`;
      } else {
        this.$button.style.backgroundImage = `url( ${this.icon} )`;
      }
    }
  }

  // When things change
  _render() {
    if( this.title === null ) {
      this.$button.removeAttribute( 'title' );      
    } else {
      this.$button.title = this.title;      
    }

    if( this.icon === null ) {
      this.$button.backgroundImage = '';
    } else {
      this.$button.style.backgroundImage = this.disabled === true ? `url( ${this.iconDisabled} )` : `url( ${this.icon} )`;    
    }

    this.$button.innerText = this.label === null ? '' : this.label;
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
    this._upgrade( 'hidden' );    
    this._upgrade( 'icon' );    
    this._upgrade( 'iconDisabled' );    
    this._upgrade( 'iconDown' );    
    this._upgrade( 'iconOver' );    
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
      'icon',
      'icon-disabled',
      'icon-down',
      'icon-over',
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

  get icon() {
    if( this.hasAttribute( 'icon' ) ) {
      return this.getAttribute( 'icon' );
    }

    return null;
  }

  set icon( value ) {
    if( value !== null ) {
      this.setAttribute( 'icon', value );
    } else {
      this.removeAttribute( 'icon' );
    }
  }  

  get iconDisabled() {
    if( this.hasAttribute( 'icon-disabled' ) ) {
      return this.getAttribute( 'icon-disabled' );
    }

    return null;
  }

  set iconDisabled( value ) {
    if( value !== null ) {
      this.setAttribute( 'icon-disabled', value );
    } else {
      this.removeAttribute( 'icon-disabled' );
    }
  }    

  get iconDown() {
    if( this.hasAttribute( 'icon-down' ) ) {
      return this.getAttribute( 'icon-down' );
    }

    return null;
  }

  set iconDown( value ) {
    if( value !== null ) {
      this.setAttribute( 'icon-down', value );
    } else {
      this.removeAttribute( 'icon-down' );
    }
  }  

  get iconOver() {
    if( this.hasAttribute( 'icon-over' ) ) {
      return this.getAttribute( 'icon-over' );
    }

    return null;
  }

  set iconOver( value ) {
    if( value !== null ) {
      this.setAttribute( 'icon-over', value );
    } else {
      this.removeAttribute( 'icon-over' );
    }
  }  

  get kind() {
    if( this.hasAttribute( 'kind' ) ) {
      return this.getAttribute( 'kind' );
    }

    return 'primary';
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

    return 'default';
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

window.customElements.define( 'avocado-button', AvocadoButton );

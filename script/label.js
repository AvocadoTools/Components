export default class AvocadoLabel extends HTMLElement {
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

        :host( [disabled] ) p {
          color: var( --disabled-color, #c6c6c6 );
        }

        :host( [hidden] ) {
          display: none;
        }        

        :host( [internal] ) p {
          user-select: none;
        }                

        :host( [truncate] ) p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        p {
          background-color: var( --background-color, transparent );
          box-sizing: border-box;
          color: var( --color, #161616 );
          cursor: var( --cursor, default );
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: var( --font-size, 14px );
          font-weight: var( --font-weight, 400 );
          line-height: var( --height );
          margin: 0;
          padding: 0;
          text-align: var( --text-align, left );
          width: 100%;
        }
      </style>
      <p></p>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = shadowRoot.querySelector( 'p' );
  }

  // When things change
  _render() {
    if( this.title === null ) {
      this.$label.removeAttribute( 'title' );      
    } else {
      this.$label.title = this.title;
    }

    this.$label.innerText = this.text === null ? '' : this.text;    
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
    this._upgrade( 'internal' );        
    this._upgrade( 'text' ); 
    this._upgrade( 'title' );    
    this._upgrade( 'truncate' );    

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'internal',
      'text',
      'title',
      'truncate'
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

  get internal() {
    return this.hasAttribute( 'internal' );
  }

  set internal( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'internal' );
      } else {
        this.setAttribute( 'internal', '' );
      }
    } else {
      this.removeAttribute( 'internal' );
    }
  }  

  get text() {
    if( this.hasAttribute( 'text' ) ) {
      return this.getAttribute( 'text' );
    }

    return null;
  }

  set text( value ) {
    if( value !== null ) {
      this.setAttribute( 'text', value );
    } else {
      this.removeAttribute( 'text' );
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

  get truncate() {
    return this.hasAttribute( 'truncate' );
  }

  set truncate( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'truncate' );
      } else {
        this.setAttribute( 'truncate', '' );
      }
    } else {
      this.removeAttribute( 'truncate' );
    }
  }    
}

window.customElements.define( 'avocado-label', AvocadoLabel );

export default class AvocadoTag extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        :host {
          background-color: #e0e0e0;
          border-radius: 28px;
          cursor: default;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          position: relative;
        }

        button {
          background: none;
          border: none;
          border-radius: 20px;
          box-sizing: border-box;
          cursor: pointer;
          height: 20px;
          margin: 4px 2px 0 4px;
          outline: none;
          padding: 2px 0 0 0;
          width: 20px;            
        }

        p {
          box-sizing: border-box;
          color: #525252;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 28px;
          margin: 0;
          padding: 0 0 0 8px;
        }

        p.disabled {
          color: #c6c6c6;
          cursor: not-allowed;
        }

        p.readonly {
          cursor: not-allowed;
          padding: 0 8px 0 8px;
        }
      </style>
      <p></p>
      <button title="Clear">
        <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
          <polygon points="24 9.4 22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4"></polygon>
        </svg>
      </button>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = shadowRoot.querySelector( 'p' );
    this.$button = shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'mousedown', ( evt ) => this.doButtonDown( evt ) );
    this.$button.addEventListener( 'mouseout', ( evt ) => this.doButtonOut( evt ) );    
    this.$button.addEventListener( 'mouseover', ( evt ) => this.doButtonOver( evt ) );
    this.$filter = shadowRoot.querySelector( 'polygon' );
  }

  doButtonDown( evt ) {
    this.dispatchEvent( new CustomEvent( 'clear', {
      detail: {
        label: this.label
      }
    } ) );
  }

  doButtonOut( evt ) {
    this.$button.style.backgroundColor = 'transparent';
  }

  doButtonOver( evt ) {
    this.$button.style.backgroundColor = this.filterColor === null ? '#c6c6c6' : this.filterColor;
  }  

  // When things change
  _render() {
    // Host
    this.style.backgroundColor = this.backgroundColor === null ? '' : this.backgroundColor;        
    this.style.display = this.hidden === true ? 'none' : '';            
    this.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;        
    this.style.visibility = this.concealed === true ? 'hidden' : '';

    // Content
    this.$label.innerText = this.label ===  null ? '' : this.label;
    this.$label.title = this.label === null ? '' : this.label;

    // Disabled
    if( this.disabled ) {
      this.$label.classList.add( 'disabled' );
    } else {
      this.$label.classList.remove( 'disabled' );
      this.$label.style.color = this.color === null ? '' : this.color;    
      this.$filter.style.fill = this.color === null ? '' : this.color;      
    }

    // Readony
    if( this.readonly ) {
      this.$label.classList.add( 'readonly' );
      this.$button.style.display = 'none';  
    } else {
      this.$label.classList.remove( 'readonly' );      
      this.$button.style.display = 'block';        
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
    this._upgrade( 'backgroundColor' );    
    this._upgrade( 'color' );               
    this._upgrade( 'concealed' ); 
    this._upgrade( 'disabled' ); 
    this._upgrade( 'filterColor' );     
    this._upgrade( 'hidden' );    
    this._upgrade( 'label' );    
    this._upgrade( 'marginBottom' );    
    this._upgrade( 'marginLeft' );    
    this._upgrade( 'marginRight' );    
    this._upgrade( 'marginTop' );        
    this._upgrade( 'readonly' );        

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'background-color',
      'color',      
      'concealed',
      'disabled',
      'filter-color',
      'hidden',
      'label',
      'margin-bottom',
      'margin-left',
      'margin-right',
      'margin-top',
      'readonly'
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
  get backgroundColor() {
    if( this.hasAttribute( 'background-color' ) ) {
      return this.getAttribute( 'background-color' );
    }

    return null;
  }

  set backgroundColor( value ) {
    if( value !== null ) {
      this.setAttribute( 'background-color', value );
    } else {
      this.removeAttribute( 'background-color' );
    }
  }

  get color() {
    if( this.hasAttribute( 'color' ) ) {
      return this.getAttribute( 'color' );
    }

    return null;
  }

  set color( value ) {
    if( value !== null ) {
      this.setAttribute( 'color', value );
    } else {
      this.removeAttribute( 'color' );
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

  get filterColor() {
    if( this.hasAttribute( 'filter-color' ) ) {
      return this.getAttribute( 'filter-color' );
    }

    return null;
  }

  set filterColor( value ) {
    if( value !== null ) {
      this.setAttribute( 'filter-color', value );
    } else {
      this.removeAttribute( 'filter-color' );
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
}

window.customElements.define( 'avocado-tag', AvocadoTag );

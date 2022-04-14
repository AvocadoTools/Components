export default class AvocadoBox extends HTMLElement {
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
      </style>
      <slot></slot>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  // When things change
  _render() {
    // Host
    this.style.alignItems = this.alignItems === null ? '' : this.alignItems;
    this.style.backgroundColor = this.backgroundColor === null ? '' : this.backgroundColor;
    this.style.display = this.hidden === true ? 'none' : '';            
    this.style.flexBasis = this.grow === null ? '' : 0;
    this.style.flexDirection = this.direction === null ? '' : this.direction;
    this.style.flexGrow = this.grow === null ? '' : this.grow;
    this.style.height = this.height === null ? '' : `${this.height}px`;
    this.style.justifyContent = this.justifyContent === null ? '' : this.justifyContent;
    this.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;
    this.style.visibility = this.concealed === true ? 'hidden' : '';
    this.style.width = this.width === null ? '' : `${this.width}px`;
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
    this._upgrade( 'align-items' );
    this._upgrade( 'background-color' );    
    this._upgrade( 'concealed' );    
    this._upgrade( 'direction' );
    this._upgrade( 'grow' );    
    this._upgrade( 'height' );    
    this._upgrade( 'hidden' );    
    this._upgrade( 'justify-content' );    
    this._upgrade( 'margin-bottom' );
    this._upgrade( 'margin-left' );    
    this._upgrade( 'margin-right' );    
    this._upgrade( 'margin-top' );    
    this._upgrade( 'width' );

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'align-items',
      'background-color',
      'concealed',
      'direction',
      'grow',
      'height',
      'hidden',
      'justify-content',
      'margin-bottom',
      'margin-left',
      'margin-right',
      'margin-top',
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

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)
  get alignItems() {
    if( this.hasAttribute( 'align-items' ) ) {
      return this.getAttribute( 'align-items' );
    }

    return null;
  }

  set alignItems( value ) {
    if( value !== null ) {
      this.setAttribute( 'align-items', value );
    } else {
      this.removeAttribute( 'align-items' );
    }
  }

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

  get direction() {
    if( this.hasAttribute( 'direction' ) ) {
      return this.getAttribute( 'direction' );
    }

    return null;
  }

  set direction( value ) {
    if( value !== null ) {
      this.setAttribute( 'direction', value );
    } else {
      this.removeAttribute( 'direction' );
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

  get height() {
    if( this.hasAttribute( 'height' ) ) {
      return parseInt( this.getAttribute( 'height' ) );
    }

    return null;
  }

  set height( value ) {
    if( value !== null ) {
      this.setAttribute( 'height', value );
    } else {
      this.removeAttribute( 'height' );
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

  get justifyContent() {
    if( this.hasAttribute( 'justify-content' ) ) {
      return this.getAttribute( 'justify-content' );
    }

    return null;
  }

  set justifyContent( value ) {
    if( value !== null ) {
      this.setAttribute( 'justify-content', value );
    } else {
      this.removeAttribute( 'justify-content' );
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

window.customElements.define( 'avocado-box', AvocadoBox );

export default class AvocadoAvatar extends HTMLElement {
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
          background-color: #f4f4f4;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          border: none;
          border-radius: 61px;          
          box-sizing: border-box;
          color: #a8a8a8;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 20px;
          font-weight: 400;
          height: 61px;
          outline: none;
          text-transform: uppercase;
          width: 61px;
        }

        button:hover {
          background-color: #e5e5e5;
        }

        button:focus {
          border: solid 2px #0f62fe;
        }

        button:disabled {
          cursor: not-allowed;
        }

        button:disabled:hover {
          background-color: #f4f4f4;
        }
      </style>
      <button></button>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$avatar = shadowRoot.querySelector( 'button' );
  }

  // Utility method
  // Extract initials for name
  initials( name ) {
    const cleaned = name.replace( /\([^()]*\)/g, '' );
    const parts = cleaned.split( ' ' );
    let result = '';

    for( let p = 0; p < parts.length; p++ ) {
      const name = parts[p].trim();

      if( name.length === 0 ) {
        continue;
      }

      let letter = name.charAt( 0 );

      if( name.indexOf( '-' ) > -1 ) {
        const hyphens = name.split( '-' );

        for( let h = 1; h < hyphens.length; h++ ) {
          letter = letter + hyphens[h].charAt( 0 );
        }
      }

      result = result + letter;
    }

    return result.toUpperCase();    
  }  

  // When things change
  _render() {
    this.$avatar.disabled = this.disabled;

    // Image or label
    if( this.image === null ) {
      this.$avatar.style.backgroundImage = '';
    } else {
      this.$avatar.style.backgroundImage = `url( ${this.image} )`;
      this.$avatar.innerText = '';
    }

    // Content
    let content = this.label;

    // Handle shortening
    // If necessary
    if( content === null ) {
      content = '';
    } else {
      // Might provide initials
      if( this.shorten ) {
        content = this.initials( this.label );
      } 
      
      // Default font size
      let size = 20;

      // Determine on character count
      switch( this.label.trim().length ) {
        case 4:
          size = 18;
          break
        case 5:
          size = 14;
          break;
      }

      // Set font size
      this.$avatar.style.fontSize = `${size}px`;
    }

    // Place content
    this.$avatar.innerText = content;    

    // Styles
    this.$avatar.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.$avatar.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.$avatar.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.$avatar.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;

    // Tooltip
    if( this.title !== null ) {
      this.$avatar.title = this.title;
    } else {
      this.$avatar.removeAttribute( 'title' );
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
    this._upgrade( 'hidden' );
    this._upgrade( 'image' );
    this._upgrade( 'label' );
    this._upgrade( 'margin-bottom' );
    this._upgrade( 'margin-left' );
    this._upgrade( 'margin-right' );
    this._upgrade( 'margin-top' );            
    this._upgrade( 'shorten' );
    this._upgrade( 'title' );                

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'image',
      'label',
      'margin-bottom',
      'margin-left',
      'margin-right',
      'margin-top',
      'shorten',
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

  get image() {
    if( this.hasAttribute( 'image' ) ) {
      return this.getAttribute( 'image' );
    }

    return null;
  }

  set image( value ) {
    if( value !== null ) {
      this.setAttribute( 'image', value );
    } else {
      this.removeAttribute( 'image' );
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

  get shorten() {
    return this.hasAttribute( 'shorten' );
  }

  set shorten( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'shorten' );
      } else {
        this.setAttribute( 'shorten', '' );
      }
    } else {
      this.removeAttribute( 'shorten' );
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

window.customElements.define( 'avocado-avatar', AvocadoAvatar );

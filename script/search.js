export default class AvocadoSearch extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    
    /*template*/
    template.innerHTML = `
      <style>
        :host {
          box-sizing: border-box;
          position: relative;
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
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0;
          position: absolute;
          right: 0;
          top: 0;
        }

        button:hover {
          background-color: #e5e5e5;
        }

        button:active {
          background-color: #e0e0e0;
        }

        button.xl {
          height: 48px;
          width: 48px;          
        }

        button.lg {
          height: 40px;
          width: 40px;          
        }        

        button.sm {
          height: 32px;
          width: 40px;          
        }

        input {
          background: none; 
          background-color: #f4f4f4;
          background-image: url( /img/controls/search.svg );
          background-repeat: no-repeat;
          border: none;
          border-radius: 0;
          box-sizing: border-box;          
          color: #161616;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0;
          position: relative;
          width: 100%;
        }

        input::placeholder {
          color: #a8a8a8;          
          font-family: 'IBM Plex Sans', sans-serif;
          font-weight: 400;
        }

        input:focus {
          outline: solid 2px #0f62fe;
        }

        input:focus ~ button:hover {
          top: 2px;
          right: 2px;
          width: 44px;
          height: 44px;
        }

        input.light {
          background-color: #ffffff;
        }

        input.sm {
          background-position: left 16px center;
          background-size: 16px;                              
          font-size: 14px;
          height: 32px;
          min-height: 32px;
          padding: 0 40px 0 40px;
        }

        input.sm::placeholder {
          font-size: 14px;          
        }

        input.lg {
          background-position: left 16px center;
          background-size: 16px;                    
          font-size: 16px;
          height: 40px;
          min-height: 40px;      
          padding: 0 40px 0 40px;    
        }

        input.xl {
          background-position: left 14px center;
          background-size: 20px;          
          font-size: 16px;
          height: 48px;
          min-height: 48px;
          padding: 0 48px 0 48px;
        }
      </style>
      <input type="text"/>
      <button type="button" title="Clear"></button>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$search = shadowRoot.querySelector( 'input' );
    this.$search.addEventListener( 'input', ( evt ) => this.doChange( evt ) );
    this.$clear = shadowRoot.querySelector( 'button' );
    this.$clear.addEventListener( 'mousedown', ( evt ) => this.doClear( evt ) );
  }

  // Clear the field
  // Hide the clear button    
  clear() {
    this.value = '';
    this.$clear.style.display = 'none';    
  }

  // Field has changed
  doChange( evt ) {
    // Should there be a clear button
    if( this.value.trim().length === 0 ) {
      this.$clear.style.display = 'none';
    } else {
      this.$clear.style.display = 'block';
    }

    // Notify that content has changed
    this.dispatchEvent( new CustomEvent( 'search', {
      detail: {
        value: this.value
      }
    } ) );
  }

  doClear( evt ) {
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
  }

  // When things change
  _render() {
    // Host
    this.style.display = this.hidden === true ? 'none' : '';    
    this.style.flexBasis = this.grow === null ? '' : 0;
    this.style.flexGrow = this.grow === null ? '' : 1;
    this.style.visibility = this.concealed === true ? 'hidden' : '';
    this.style.width = this.width === null ? '' : `${this.width}px`;

    // Attributes
    this.$search.placeholder = this.placeholder === null ? 'Search' : this.placeholder;
    this.$search.title = this.title === null ? '' : this.title;

    // Styles
    this.$search.style.fontSize = this.fontSize === null ? '' : `${this.fontSize}px`;    
    this.$search.className = '';
    this.$search.classList.add(
      this.size === null ? 'xl' : this.size
    );

    // Theme
    // Works as class
    if( this.light ) {
      this.$search.classList.add( 'light' );
    }    

    // Nudge in place
    this.$search.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.$search.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.$search.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.$search.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;    

    // Default
    this.$clear.classList.add(
      this.size === null ? 'xl' : this.size
    );
  }

  // Default render
  // No attributes set
  connectedCallback() {
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'font-size',
      'grow',
      'hidden',
      'light',
      'margin-bottom',
      'margin-left',
      'margin-right',
      'margin-top',      
      'placeholder',
      'size',
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
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }
  
  // Properties
  // Not reflected
  get value() {
    return this.$search.value;
  }

  set value( content ) {
    this.$search.value = content;
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

window.customElements.define( 'avocado-search', AvocadoSearch );

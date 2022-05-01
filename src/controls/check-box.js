export default class AvocadoCheckBox extends HTMLElement {
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
          align-items: center;
          background: none;
          background-image: url( /img/controls/checkbox.svg );
          background-position: left 1px center;
          background-repeat: no-repeat;
          background-size: 18px;
          border: none;
          box-sizing: border-box;
          cursor: var( --check-box-cursor, pointer );
          display: flex;
          flex-direction: row;
          margin: 0;
          min-height: 40px;
          min-width: 24px;
          outline: none;
          padding: 0;
          position: relative;
        }

        button:focus::after {
          border: solid 2px #0f62fe;
          content: '';
          height: 13px;
          left: 1px;
          position: absolute;
          top: 15px;
          width: 14px;
        }

        p {
          color: var( --check-box-color, #161616 );
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: var( --check-box-font-size, 14px );
          font-weight: 400;
          padding: 0 0 0 24px;
          text-rendering: optimizeLegibility;
        }

        :host( [checked] ) button {
          background-image: url( /img/controls/checkbox-checked.svg );          
        }

        :host( [hide-label] ) p {
          display: none;
        }
      </style>
      <button part="button">
        <p part="label">
          <slot></slot>
        </p>
      </button>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'click', () => {
      this.checked = !this.checked;
    } );
    this.$label = shadowRoot.querySelector( 'p' );
  }

  // When things change
  _render() {
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
    this._upgrade( 'checked' );        
    this._upgrade( 'concealed' );    
    this._upgrade( 'data' );            
    this._upgrade( 'hidden' );    
    this._upgrade( 'hideLabel' );    
    this._upgrade( 'label' );        
    this._upgrade( 'title' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'checked',
      'concealed',
      'hidden',
      'hide-label',
      'label',
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

  get hideLabel() {
    return this.hasAttribute( 'hide-label' );
  }

  set hideLabel( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hide-label' );
      } else {
        this.setAttribute( 'hide-label', '' );
      }
    } else {
      this.removeAttribute( 'hide-label' );
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

window.customElements.define( 'adc-check-box', AvocadoCheckBox );

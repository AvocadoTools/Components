export default class AvocadoTab extends HTMLElement {
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
          background: none;
          background-color: #e0e0e0;
          border: none;
          border-left: solid 1px #8d8d8d;
          border-top: solid 2px transparent;
          box-sizing: border-box;
          color: #393939;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 48px;
          justify-content: center;
          margin: 0;
          min-width: 145px;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0 0 0 16px;
          text-align: left;
        }

        button p {
          font-family: 'IBM Plex Sans', sans-serif;
          font-weight: 400;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
        }

        button:hover {
          background-color: #cacaca;
        }

        button:focus {
          outline: solid 2px #005fcc;
        }

        button p:first-of-type {
          color: #161616;
          font-size: 14px;
          font-weight: 600;
        }

        button p:last-of-type {
          color: #6f6f6f;
          display: none;
          font-size: 12px;
        }        

        :host( [hint] ) button p:last-of-type {
          display: block;
        }

       :host( [selected] ) button {
          background-color: #f4f4f4;
          border-left: solid 1px transparent;
          border-top: solid 2px #0f62fe;
          color: #161616;
          font-weight: 600;
        }

        :host( [disabled] ) button {
          background-color: #c6c6c6;
          cursor: not-allowed;
        }        

        :host( [disabled] ) button p:first-of-type,
        :host( [disabled] ) button p:last-of-type {
          color: #8d8d8d;
        }        
      </style>
      <button part="button">
        <p part="label"></p>
        <p part="hint"></p>
      </button>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = shadowRoot.querySelector( 'button' );
    this.$label = shadowRoot.querySelector( 'p[part=label]' );    
    this.$hint = shadowRoot.querySelector( 'p[part=hint]' );        
  }

  // When things change
  _render() {
    this.$button.disabled = this.disabled;
    this.$label.innerText = this.label === null ? '' : this.label;
    this.$hint.innerText = this.hint === null ? '' : this.hint;    
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
    // Check data property before render
    // May be assigned before module is loaded
    this._upgrade( 'concealed' );
    this._upgrade( 'disabled' );
    this._upgrade( 'hidden' );
    this._upgrade( 'hint' );    
    this._upgrade( 'label' );
    this._upgrade( 'selected' );    
    this._upgrade( 'title' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'hint',
      'index',
      'label',
      'selected',
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

  get hint() {
    if( this.hasAttribute( 'hint' ) ) {
      return this.getAttribute( 'hint' );
    }

    return null;
  }

  set hint( value ) {
    if( value !== null ) {
      this.setAttribute( 'hint', value );
    } else {
      this.removeAttribute( 'hint' );
    }
  }      

  get index() {
    if( this.hasAttribute( 'index' ) ) {
      return parseInt( this.getAttribute( 'index' ) );
    }

    return null;
  }

  set index( value ) {
    if( value !== null ) {
      this.setAttribute( 'index', value );
    } else {
      this.removeAttribute( 'index' );
    }
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }        

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  get selected() {
    return this.hasAttribute( 'selected' );
  }

  set selected( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selected' );
      } else {
        this.setAttribute( 'selected', '' );
      }
    } else {
      this.removeAttribute( 'selected' );
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

window.customElements.define( 'adc-tab', AvocadoTab );

export default class AvocadoTag extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          background-color: #e0e0e0;
          border-radius: 24px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          height: 24px;
          padding: 4px 8px 4px 8px;
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
          border: none;
          border-radius: 24px;
          display: none;
          height: 24px;
          justify-content: center;
          margin: 0;
          padding: 0;
          width: 24px;
        }

        button:hover {
          background-color: #c6c6c6;
        }

        p {
          color: #393939;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
        }

        :host( [color=red] ) { background-color: #ffd7d9; }
        :host( [color=red] ) button:hover { background-color: #ffb3b8; }
        :host( [color=red] ) p { color: #750e13; }
        :host( [color=red] ) polygon { fill: #750e13; }

        :host( [color=magenta] ) { background-color: #ffd6e8; }
        :host( [color=magenta] ) button:hover { background-color: #ffafd2; }
        :host( [color=magenta] ) p { color: #740937; }
        :host( [color=magenta] ) polygon { fill: #740937; }

        :host( [color=purple] ) { background-color: #e8daff; }
        :host( [color=purple] ) button:hover { background-color: #d4bbff; }
        :host( [color=purple] ) p { color: #491d8b; }
        :host( [color=purple] ) polygon { fill: #491d8b; }

        :host( [color=blue] ) { background-color: #d0e2ff; }
        :host( [color=blue] ) button:hover { background-color: #a6c8ff; }
        :host( [color=blue] ) p { color: #002d9c; }
        :host( [color=blue] ) polygon { fill: #002d9c; }

        :host( [color=cyan] ) { background-color: #bae6ff; }
        :host( [color=cyan] ) button:hover { background-color: #82cfff; }
        :host( [color=cyan] ) p { color: #003a6d; }
        :host( [color=cyan] ) polygon { fill: #003a6d; }

        :host( [color=teal] ) { background-color: #9ef0f0; }
        :host( [color=teal] ) button:hover { background-color: #3ddbd9; }
        :host( [color=teal] ) p { color: #004144; }
        :host( [color=teal] ) polygon { fill: #004144; }

        :host( [color=green] ) { background-color: #a7f0ba; }
        :host( [color=green] ) button:hover { background-color: #6fdc8c; }
        :host( [color=green] ) p { color: #044317; }
        :host( [color=green] ) polygon { fill: #044317; }

        :host( [color=cool] ) { background-color: #dde1e6; }
        :host( [color=cool] ) button:hover { background-color: #c1c7cd; }
        :host( [color=cool] ) p { color: #343a3f; }
        :host( [color=cool] ) polygon { fill: #343a3f; }

        :host( [color=warm] ) { background-color: #e5e0df; }
        :host( [color=warm] ) button:hover { background-color: #cac5c4; }
        :host( [color=warm] ) p { color: #3c3838; }
        :host( [color=warm] ) polygon { fill: #3c3838; }

        :host( [filter] ) {
          padding: 4px 0 4px 8px;
        }

        :host( [filter] ) button {
          cursor: pointer;
          display: flex;
          margin: 0 0 0 4px;
        }

        :host( [disabled] ) { background-color: #f4f4f4; cursor: not-allowed; }
        :host( [disabled] ) button { cursor: not-allowed; }
        :host( [disabled] ) button:hover { background: none; }        
        :host( [disabled] ) p { color: #c6c6c6; cursor: not-allowed; }
        :host( [disabled] ) polygon { fill: #c6c6c6; }
      </style>
      <p part="label">
        <slot></slot>
      </p>
      <button part="button" title="Clear">
        <svg height="16" viewBox="0 0 32 32" width="16" xmlns="http://www.w3.org/2000/svg">
          <polygon points="24 9.4 22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4" />
        </svg>
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
      this.dispatchEvent( new CustomEvent( 'clear' ) );
    } );
    this.$label = shadowRoot.querySelector( 'p' );
  }

  // When things change
  _render() {
    if( this.innerText.trim().length === 0 ) {
      this.innerText = this.label === null ? '' : this.label;
    }
    
    this.$button.disabled = this.disabled;

    if( this.title === null ) {
      this.$button.removeAttribute( 'title' );
    } else {
      this.$button.title = this.title;
    }
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
    this._upgrade( 'color' );
    this._upgrade( 'concealed' );
    this._upgrade( 'data' );
    this._upgrade( 'disabled' );
    this._upgrade( 'filter' );
    this._upgrade( 'hidden' );
    this._upgrade( 'label' );    
    this._upgrade( 'title' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'color',
      'concealed',
      'disabled',
      'filter',
      'hidden',
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

  get filter() {
    return this.hasAttribute( 'filter' );
  }

  set filter( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'filter' );
      } else {
        this.setAttribute( 'filter', '' );
      }
    } else {
      this.removeAttribute( 'filter' );
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

window.customElements.define( 'adc-tag', AvocadoTag );

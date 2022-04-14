export default class AvocadoSpacer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        :host {
          box-sizing: border-box;
          position: relative;
        }
      </style>
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
    this.style.flexBasis = this.grow === null ? '' : 0;
    this.style.flexGrow = this.grow === null ? '' : 1;
    this.style.height = this.height === null ? '' : `${this.height}px`;    
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
    this._upgrade( 'grow' );
    this._upgrade( 'height' );    
    this._upgrade( 'width' );    

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'grow',
      'height',
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

window.customElements.define( 'avocado-spacer', AvocadoSpacer );

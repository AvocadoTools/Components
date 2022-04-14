export default class AvocadoDrawer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        @import url( 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap' );

        :host {
          background-color: #f5f5f5;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          padding: 16px;
          position: relative;
          width: 250px;
        }

        ::slotted( button ) {
          background: none;
          background-position: left 7px center;
          background-repeat: no-repeat;
          background-size: 16px;
          border: solid 1px transparent;
          box-sizing: border-box;
          color: #4b4b4b;
          cursor: pointer;
          font-family: 'Source Sans Pro', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 32px;
          margin: none;
          outline: none;
          padding: 0 16px 0 30px;
          text-align: left;
        }

        ::slotted( button:hover ) {        
          background-color: #2c2c2c0a;
        }

        ::slotted( button[selected] ) {        
          background-color: #1473e61a;
          border: solid 1px #2680eb;
        }        
      </style>
      <slot></slot>
    `;

    // Properties
    this._data = null;
    this._source = null;

    // Events
    this.doSelect = this.doSelect.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  // Button selected
  // Get index
  doSelect( evt ) {
    this.selectedIndex = parseInt( evt.target.getAttribute( 'data-index' ) );
  }

  // When things change
  _render() {
    // Nothing to render
    if( this._data === null ) return;

    // Remove previous render
    // Include clean-up of event listeners
    while( this.children.length > 0 ) {
      this.children[0].removeEventListener( 'mousedown', this.doSelect );
      this.children[0].remove();
    }

    // Set labels
    for( let d = 0; d < this._data.length; d++ ) {
      const control = document.createElement( 'button' );
      control.setAttribute( 'data-index', d );
      control.innerText = this._data[d].name;
      control.addEventListener( 'mousedown', this.doSelect );

      if( this._data[d].hasOwnProperty( 'icon' ) ) {
        control.style.backgroundImage = `url( /img/inspector/${this._data[d].icon} )`;
      }

      this.appendChild( control );

      if( this.selectedIndex === d ) {
        control.setAttribute( 'selected', '' );
      }
    }
  }

  // Default render
  // No attributes set
  connectedCallback() {
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'selected-index'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = [... value];
    this._render();
  }

  get source() {
    return this._source;
  }

  set source( value ) {
    this._source = value;
    fetch( this._source )
    .then( ( response ) => response.json() )
    .then( ( data ) => {
      this.data = data;
    } );
  }      

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)  
  get selectedIndex() {
    if( this.hasAttribute( 'selected-index' ) ) {
      return parseInt( this.getAttribute( 'selected-index' ) );
    }

    return null;
  }

  set selectedIndex( value ) {
    if( value !== null ) {
      this.setAttribute( 'selected-index', value );
    } else {
      this.removeAttribute( 'selected-index' );
    }
  }    
}

window.customElements.define( 'avocado-drawer', AvocadoDrawer );

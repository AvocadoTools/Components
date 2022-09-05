export default class AvocadoNavigationBar extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: var( --navigation-bar-background-color, #262626 );                     
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          padding: 16px 0 16px 0;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }       

        :host( [hidden] ) {
          display: none;
        }        
      </style>
      <slot></slot>
    `;

    // Properties
    this._data = null;

    // Events
    this.doItemClick = this.doItemClick.bind( this );    

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$slot = shadowRoot.querySelector( 'slot' );
    this.$slot.addEventListener( 'slotchange', () => {
      const selected = this.selectedIndex === null ? 0 : this.selectedIndex;

      // Iterate to populate content and set state
      for( let c = 0; c < this.children.length; c++ ) {        
        this.children[c].index = c;
        this.children[c].selected = c === selected ? true : false;       
      }
    } );    
  }

  doItemClick( evt ) {
    // Has no link
    if( this.href === null ) 
      return;

    // Only change if different
    if( this.selectedIndex !== evt.currentTarget.index )
      this.selectedIndex = evt.currentTarget.index;
  }  

  // When things change
  _render() {;}

  // Properties set before module loaded
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }    
  }    

  // Setup
  connectedCallback() {
    this._upgrade( 'concealed' );        
    this._upgrade( 'data' );                
    this._upgrade( 'hidden' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden'
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
}

window.customElements.define( 'adc-navigation-bar', AvocadoNavigationBar );

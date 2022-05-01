export default class AvocadoColumn extends HTMLElement {
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

        button {
          background: none;
          background-color: #e0e0e0;
          background-position: right 16px center;
          background-repeat: no-repeat;
          background-size: 18px;
          border: none;
          border-bottom: solid 1px #d1d1d1;
          box-sizing: border-box;
          color: #161616;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          height: 48px;
          margin: 0;
          padding: 0 16px 0 16px;
          text-align: left;
          text-rendering: optimizeLegibility;
          width: 100%;
        }

        :host( [sortable] ) button {
          cursor: pointer;
        }

        :host( [sortable] ) button:hover {
          background-color: #d1d1d1;
          background-image: url( /img/controls/arrows-vertical.svg );
        }     
        
        :host( [sort-direction=asc] ) button,
        :host( [sort-direction=ascending] ) button {
          background-image: url( /img/controls/arrow-down.svg );
        }

        :host( [sort-direction=asc] ) button:hover,
        :host( [sort-direction=ascending] ) button:hover {
          background-image: url( /img/controls/arrow-down.svg );
        }        

        :host( [sort-direction=desc] ) button,
        :host( [sort-direction=descending] ) button {
          background-image: url( /img/controls/arrow-up.svg );
        }        

        :host( [sort-direction=desc] ) button:hover,
        :host( [sort-direction=descending] ) button:hover {
          background-image: url( /img/controls/arrow-up.svg );
        }                
      </style>
      <button part="button">
        <slot></slot>
      </button>
    `;

    // Properties
    this._data = null;
    this._label = null;
    this._sort = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'click', () => {
      if( !this.sortable ) return;
      
      switch( this.sortDirection ) {
        case null:
          this.sortDirection = 'asc';
          break;
        case 'asc':
        case 'ascending':
          this.sortDirection = 'desc';
          break;
        case 'desc':
        case 'descending':
          this.sortDirection = null;
          break;
      }

      this.dispatchEvent( new CustomEvent( 'sort' ) );
    } );
  }

  // When things change
  _render() {
    if( this.width !== null ) {
      // this.style.flexGrow = 'unset';
      this.style.minWidth = `${this.width}px`;
      this.style.width = `${this.width}px`;
    } else {
      // this.style.flexGrow = 1;
      this.style.minWidth = 'unset';
      this.style.width = 'unset';      
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
    this._upgrade( 'data' );         
    this._upgrade( 'itemRenderer' );               
    this._upgrade( 'labelField' );            
    this._upgrade( 'labelFunction' );            
    this._upgrade( 'sortable' );     
    this._upgrade( 'sortDirection' );                                 
    this._upgrade( 'sortFunction' );                     
    this._upgrade( 'width' );                         
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'item-renderer',
      'label-field',
      'sortable',
      'sort-direction',
      'width'
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

  get labelFunction() {
    return this._label;
  }

  set labelFunction( value ) {
    this._label = value;
  }

  get sortFunction() {
    return this._sort;
  }

  set sortFunction( value ) {
    this._sort = value;
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null      
  get itemRenderer() {
    if( this.hasAttribute( 'item-renderer' ) ) {
      return this.getAttribute( 'item-renderer' );
    }

    return null;
  }

  set itemRenderer( value ) {
    if( value !== null ) {
      this.setAttribute( 'item-renderer', value );
    } else {
      this.removeAttribute( 'item-renderer' );
    }
  }      

  get labelField() {
    if( this.hasAttribute( 'label-field' ) ) {
      return this.getAttribute( 'label-field' );
    }

    return null;
  }

  set labelField( value ) {
    if( value !== null ) {
      this.setAttribute( 'label-field', value );
    } else {
      this.removeAttribute( 'label-field' );
    }
  }      

  get sortable() {
    return this.hasAttribute( 'sortable' );
  }

  set sortable( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'sortable' );
      } else {
        this.setAttribute( 'sortable', '' );
      }
    } else {
      this.removeAttribute( 'sortable' );
    }
  }  

  get sortDirection() {
    if( this.hasAttribute( 'sort-direction' ) ) {
      return this.getAttribute( 'sort-direction' );
    }

    return null;
  }

  set sortDirection( value ) {
    if( value !== null ) {
      this.setAttribute( 'sort-direction', value );
    } else {
      this.removeAttribute( 'sort-direction' );
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

window.customElements.define( 'adc-column', AvocadoColumn );

export default class AvocadoColumn extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
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
          background-size: 20px;          
          border: none;
          box-sizing: border-box;
          color: #161616;
          display: block;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          line-height: 48px;
          margin: 0;
          outline: none;
          padding: 0 16px 0 16px;
          text-align: left;
          width: 100%;
        }

        button.sortable {
          cursor: pointer;
        }

        button.sortable:hover {
          background-color: #cacaca;          
        }
      </style>
      <button 
        type="button">
      </button>
      `;

    // Properties
    this._data = [];

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );      

    // Elements
    this.$column = shadowRoot.querySelector( 'button' );
    this.$column.addEventListener( 'mousedown', ( evt ) => this.doDown( evt ) );
    this.$column.addEventListener( 'mouseout', ( evt ) => this.doOut( evt ) );     
    this.$column.addEventListener( 'mouseover', ( evt ) => this.doOver( evt ) );
  }

  doDown( evt ) {
    if( !this.sortable ) return;

    if( this.sortDirection === null ) {
      this.sortDirection = 'asc';
      this.$column.style.backgroundImage = 'url( /img/controls/ascending.svg )';                
    } else {
      if( this.sortDirection === 'asc' ) {
        this.sortDirection = 'desc';
        this.$column.style.backgroundImage = 'url( /img/controls/descending.svg )';                        
      } else {
        this.sortDirection = null;
        this.$column.style.backgroundImage = 'url( /img/controls/sort.svg )';                        
      }
    }

    this.dispatchEvent( new CustomEvent( 'sort', {
      bubbles: true,
      composed: true,
      detail: {
        dataField: this.dataField,
        sortDirection: this.sortDirection
      } 
    } ) );
  }

  doOut( evt )  {
    if( !this.sortable ) return;

    if( this.sortDirection === null ) {
      this.$column.style.backgroundImage = '';
    } else {
      if( this.sortDirection === 'desc' ) {
        this.$column.style.backgroundImage = 'url( /img/controls/descending.svg )';          
      } else {
        this.$column.style.backgroundImage = 'url( /img/controls/ascending.svg )';          
      }
    }
  }

  doOver( evt )  {
    if( !this.sortable ) return;

    if( this.sortDirection === null ) {
      this.$column.style.backgroundImage = 'url( /img/controls/sort.svg )';
    } else {
      if( this.sortDirection === 'desc' ) {
        this.$column.style.backgroundImage = 'url( /img/controls/descending.svg )';          
      } else {
        this.$column.style.backgroundImage = 'url( /img/controls/ascending.svg )';          
      }
    }
  }

  // When things change
  _render() {
    this.style.flexBasis = this.grow === null ? '' : 0;
    this.style.flexGrow = this.grow === null ? '' : 1;
    this.style.width = this.width === null ? '' : `${this.width}px`;

    this.$column.className = '';

    if( this.sortable ) {
      this.$column.classList.add( 'sortable' );
    }

    this.$column.innerText = this.headerText === null ? '' : this.headerText;
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
    this._upgrade( 'sortable' );
    this._render();
  }

  // Attributes
  static get observedAttributes() {
    return [
      'data-field',
      'data-tip-field',
      'grow',
      'header-text',
      'item-renderer',
      'label-function',
      'sortable',
      'sort-direction',
      'width'
    ];
  }  

  // Render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }  

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)  
  get dataField() {
    if( this.hasAttribute( 'data-field' ) ) {
      return this.getAttribute( 'data-field' );
    }

    return null;
  }

  set dataField( value ) {
    if( value !== null ) {
      this.setAttribute( 'data-field', value );
    } else {
      this.removeAttribute( 'data-field' );
    }
  }

  get dataTipField() {
    if( this.hasAttribute( 'data-tip-field' ) ) {
      return this.getAttribute( 'data-tip-field' );
    }

    return null;
  }

  set dataTipField( value ) {
    if( value !== null ) {
      this.setAttribute( 'data-tip-field', value );
    } else {
      this.removeAttribute( 'data-tip-field' );
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

  get headerText() {
    if( this.hasAttribute( 'header-text' ) ) {
      return this.getAttribute( 'header-text' );
    }

    return null;
  }

  set headerText( value ) {
    if( value !== null ) {
      this.setAttribute( 'header-text', value );
    } else {
      this.removeAttribute( 'header-text' );
    }
  }  

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

  get labelFunction() {
    if( this.hasAttribute( 'label-function' ) ) {
      return this.getAttribute( 'label-function' );
    }

    return null;
  }

  set labelFunction( value ) {
    if( value !== null ) {
      this.setAttribute( 'label-function', value );
    } else {
      this.removeAttribute( 'label-function' );
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

  set sortDirection( value ) {
    if( value !== null ) {
      this.setAttribute( 'sort-direction', value );
    } else {
      this.removeAttribute( 'sort-direction' );
    }
  }  

  get sortDirection() {
    if( this.hasAttribute( 'sort-direction' ) ) {
      return this.getAttribute( 'sort-direction' );
    }

    return null;
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

window.customElements.define( 'avocado-column', AvocadoColumn );

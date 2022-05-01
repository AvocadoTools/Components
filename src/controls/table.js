import AvocadoColumn from './column.js';
import AvocadoLabelItemRenderer from './label-item-renderer.js';

export default class AvocadoTable extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        div[part=header] {
          display: flex;
          flex-direction: row;
        }

        div[part=list] {
          background-color: #f4f4f4;
          overflow: auto;
        }

        :host( [light] ) div[part=list] {
          background-color: #ffffff;
        }

        div[part=list] > div {
          display: flex;
          flex-direction: row;
        }

        div[part=list] > div:hover {
          background-color: var( --table-row-hover-color, #e8e8e8 );
        }

        :host( [inert] ) div[part=list] > div {
          cursor: default;
        }

        :host( [inert] ) div[part=list] > div:hover {
          background-color: transparent;
        }       

        ::slotted( adc-column ) {
          flex-basis: 0;
          flex-grow: 1;
        }
      </style>
      <div part="header">
        <slot></slot>        
      </div>
      <div part="list"></div>
    `;

    // Properties
    this._data = null;
    this._filtered = [];
    this._provider = [];
    this._selection = [];

    // Events
    this.doSort = this.doSort.bind( this );

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = shadowRoot.querySelector( 'button' );
    this.$header = shadowRoot.querySelector( 'div[part=header]' );
    this.$list = shadowRoot.querySelector( 'div[part=list]' );
    this.$slot = shadowRoot.querySelector( 'slot' );
    this.$slot.addEventListener( 'slotchange', () => {
      for( let c = 0; c < this.children.length; c++ ) {
        this.children[c].removeEventListener( 'click', this.doSort );
        this.children[c].addEventListener( 'click', this.doSort );
      }
    } );
  }

  doSort( evt ) {
    for( let c = 0; c < this.children.length; c++ ) {
      if( this.children[c] !== evt.currentTarget ) {
        this.children[c].sortDirection = null;
      }
    }

    // TODO: Selected item
    // const item = this.selectedIndex === null ? null : Object.assign( {}, this.selectedItem );    
    const item = null;

    const direction = evt.target.sortDirection;
    const field = evt.target.labelField;

    if( evt.currentTarget.sortFunction === null ) {
      if( direction === null ) {
        this._filtered = [... this._provider];        
      } else {
        this._filtered.sort( ( a, b ) => {
          if( direction === 'desc' || direction === 'descending' ) {
            if( !a.hasOwnProperty( field ) ) return -1;  
            if( !b.hasOwnProperty( field ) ) return 1;  
            if( a[field] === null ) return -1;
            if( b[field] === null ) return 1;
            if( a[field] > b[field] ) return 1;
            if( a[field] < b[field] ) return -1;
            return 0;
          } else {
            if( !a.hasOwnProperty( field ) ) return 1;   
            if( !b.hasOwnProperty( field ) ) return -1;  
            if( a[field] === null ) return 1;
            if( b[field] === null ) return -1;                               
            if( a[field] > b[field] ) return -1;
            if( a[field] < b[field] ) return 1;
            return 0;
          }
        } );
      }      
    } else {
      this._filtered.sort( evt.currentTarget.sortFunction );
    }

    if( item !== null ) {
      this.selectedItem = item;
    } else {
      this._render();
    }    
  }

  // When things change
  _render() {
    this.$header.style.display = this.hideHeader ? 'none' : 'flex';

    if( this.children.length === 0 ) {
      if( this._provider.length > 0 ) {
        const keys = Object.keys( this._provider[0] );

        for( let k = 0; k < keys.length; k++ ) {
          const column = document.createElement( 'adc-column' );
          column.labelField = keys[k];          
          column.innerText = keys[k];
          column.sortable = true;
          this.appendChild( column );
        }
      }
    }

    while( this.$list.children.length > this._filtered.length ) {
      for( let c = 0; c < this.children.length; c++ ) {
        this.$list.children[0].children[0].remove();
      }

      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._filtered.length ) {
      const row = document.createElement( 'div' );

      for( let c = 0; c < this.children.length; c++ ) {
        const renderer = this.children[c].itemRenderer === null ? 'adc-label-item-renderer' : this.children[c].itemRenderer;
        const cell = document.createElement( renderer );

        /*
        if( this.children[c].width !== null ) {
          // cell.style.flexGrow = 'unset';
          cell.style.minWidth = `${this.children[c].width}px`;
          cell.style.width = `${this.children[c].width}px`;
        } else {
          // cell.style.flexGrow = 1;
          cell.style.minWidth = 'unset';
          cell.style.width = 'unset';      
        }
        */

        row.appendChild( cell );
      }

      this.$list.appendChild( row );      
    }

    for( let p = 0; p < this._provider.length; p++ ) {
      this.$list.children[p].setAttribute( 'data-index', p );

      if( this._selection.indexOf( p ) === -1 ) {
        this.$list.children[p].classList.remove( 'selected' );
      } else {
        this.$list.children[p].classList.add( 'selected' );
      }

      for( let c = 0; c < this.children.length; c++ ) {
        if( this.children[c].labelField !== null ) {
          this.$list.children[p].children[c].data = this._filtered[p][this.children[c].labelField];
        } else if( this.children[c].labelFunction !== null ) {
          this.$list.children[p].children[c].data = this.children[c].labelFunction( this._filtered[p] );
        } else {
          this.$list.children[p].children[c].data = this._filtered[p];        
        }
      }
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
    this._upgrade( 'hideHeader' );              
    this._upgrade( 'inert' );             
    this._upgrade( 'light' );             
    this._upgrade( 'provider' );                
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hide-header',
      'inert',
      'light'
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

  get provider() {
    return this._provider;
  }

  set provider( value ) {
    this._provider = value === null ? [] : [... value];
    this._filtered = value === null ? [] : [... value];
    this._render();
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get hideHeader() {
    return this.hasAttribute( 'hide-header' );
  }

  set hideHeader( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hide-header' );
      } else {
        this.setAttribute( 'hide-header', '' );
      }
    } else {
      this.removeAttribute( 'hide-header' );
    }
  }

  get inert() {
    return this.hasAttribute( 'inert' );
  }

  set inert( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'inert' );
      } else {
        this.setAttribute( 'inert', '' );
      }
    } else {
      this.removeAttribute( 'inert' );
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
}

window.customElements.define( 'adc-table', AvocadoTable );

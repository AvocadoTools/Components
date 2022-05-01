import AvocadoLabelItemRenderer from './label-item-renderer.js';

export default class AvocadoList extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #f4f4f4;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }        

        div[part=empty] {
          align-items: center;
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
          justify-content: center;
        }

        div[part=list] *:hover {
          background-color: var( --table-row-hover-color, #e8e8e8 );          
        }

        div[part=list] * .selected {
          background-color: var( --item-selected-color, #d1d1d1 );
        }

        /*
        adc-label-item-renderer {
          border-bottom: solid 1px #e0e0e0;
          cursor: pointer;          
        }

        adc-label-item-renderer:hover {
          background-color: var( --label-row-hover-color, #e8e8e8 );          
        }

        adc-label-item-renderer.selected { 
          background-color: var( --item-selected-color, #d1d1d1 );
        }
        */

        :host( [light] ) {
          background-color: #ffffff;
        }

        :host( [inert] ) * :hover {
          background-color: transparent;
        }

        /*
        :host( [inert] ) adc-label-item-renderer {
          cursor: default;
        }

        :host( [inert] ) adc-label-item-renderer:hover {
          background-color: transparent;
        }

        :host( [inert] ) adc-label-item-renderer.selected {
          background-color: transparent;
        } 
        */       
      </style>
      <div part="list"></div>
      <div part="empty">
        <slot name="empty"></slot>
      </div>
    `;

    // Private
    this._compare = null;
    this._data = null;
    this._provider = [];
    this._label = null;
    this._pointer = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    
    this._selection = [];

    // Events
    // Removeable
    this.doItemClick = this.doItemClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$empty = this.shadowRoot.querySelector( 'div[part=empty]' );
    this.$list = this.shadowRoot.querySelector( 'div[part=list]' );
  }

  doItemClick( evt ) {
    if( this.ignored ) return;

    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    if( evt.metaKey && this.multiple ) {
      const found = this._selection.indexOf( index );

      if( found === -1 ) {
        this._selection.push( index );
      } else {
        this._selection.splice( found, 1 );
      }

      this._selection.sort( ( a, b ) => {
        if( a > b ) return 1;
        if( a < b ) return -1;
        return 0;
      } );      
    } else {
      this._selection = [index];
    }
  
    const items = [... this._selection];

    for( let i = 0; i < items.length; i++ ) {
      items[i] = this._provider[items[i]];
    }

    this.dispatchEvent( new CustomEvent( 'change', {
      detail: {
        selectedIndex: index,
        selectedIndices: this.selectedIndices,
        selectedItem: this.selectedItem,
        selectedItems: this.selectedItems
      }
    } ) );

    this._render();
  }

  // When attributes change
  _render() {
    this.$empty.style.display = this._provider.length > 0 ? 'none' : '';

    const renderer = this.itemRenderer === null ? 'adc-label-item-renderer' : this.itemRenderer;

    while( this.$list.children.length > this._provider.length ) {
      this.$list.children[0].removeEventListener( this._pointer, this.doItemClick );
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._provider.length ) {
      const element = document.createElement( renderer );
      element.addEventListener( this._pointer, this.doItemClick );
      this.$list.appendChild( element );
    }

    for( let p = 0; p < this._provider.length; p++ ) {
      this.$list.children[p].setAttribute( 'data-index', p );

      if( this._selection.indexOf( p ) === -1 ) {
        this.$list.children[p].classList.remove( 'selected' );
      } else {
        this.$list.children[p].classList.add( 'selected' );
      }

      if( this.labelField !== null ) {
        this.$list.children[p].data = this._provider[p][this.labelField];
      } else if( this._label !== null ) {
        this.$list.children[p].data = this._label( this._provider[p] );
      } else {
        this.$list.children[p].data = this._provider[p];        
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
    this._upgrade( 'compareFunction' );        
    this._upgrade( 'concealed' );        
    this._upgrade( 'data' );                
    this._upgrade( 'hidden' );    
    this._upgrade( 'inert' );                  
    this._upgrade( 'itemRenderer' );
    this._upgrade( 'labelField' );                
    this._upgrade( 'labelFunction' );      
    this._upgrade( 'multiple' );                  
    this._upgrade( 'provider' );  
    this._upgrade( 'selectedIndex' );
    this._upgrade( 'selectedIndices' );            
    this._upgrade( 'selectedItem' );
    this._upgrade( 'selectedItems' );                
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'inert', 
      'item-renderer',
      'label-field',
      'multiple',      
      'selected-index'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    if( name === 'selected-index' )
      this._selection = value === null ? [] : [value];

    this._render();
  } 

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get compareFunction() {
    return this._compare;
  }

  set compareFunction( value ) {
    this._compare = value;
  }

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

  get provider() {
    return this._provider.length === 0 ? null : this._provider;
  }

  set provider( value ) {
    this._selection = [];

    if( value === null ) {
      this._provider = [];
    } else {
      this._provider = [... value];
    }

    this._render();
  }

  get selectedIndices() {
    return this._selection;
  }

  set selectedIndices( value ) {
    if( value === null ) {
      this._selection = [];
    } else {
      this._selection = [... value];
    }

    this._render();
  }     

  get selectedItem() {
    return this._provider[this._selection[0]];
  }

  set selectedItem( value ) {
    for( let p = 0; p < this._provider.length; p++ ) {
      if( this._compare === null ) {
        if( this._provider[p] === value ) {
          this.selection = [p];
          break;
        }
      } else {
        if( this._compare( this._provider[p], value ) ) {
          this.selection = [p];
          break;
        }
      }
    }
  }

  set selectedItem( value ) {
    if( value === null ) {
      this._selection = [];
    } else {
      this._selection = [];

      for( let p = 0; p < this._provider.length; p++ ) {
        if( this._compare === null ) {
          if( this._provider[p] === value ) {
            this._selection.push( p );
            break;
          }
        } else {
          if( this._compare( this._provider[p], value ) ) {
            this._selection.push( p );
            break;
          }
        }
      }

      this._render();
    }
  }

  get selectedItems() {
    const items = [... this._selection];

    for( let i = 0; i < items.length; i++ ) {
      items[i] = this._provider[items[i]];
    }

    return items;
  }

  set selectedItems( value ) {
    if( value === null ) {
      this._selection = [];
    } else {
      const items = [];

      for( let v = 0; v < value.length; v++ ) {
        for( let p = 0; p < this._provider.length; p++ ) {
          if( this._provider[p] === value[v] ) {
            items.push( v );
            break;
          }
        }
      }

      this.selection = items;      
    }
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

  get multiple() {
    return this.hasAttribute( 'multiple' );
  }

  set multiple( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'multiple' );
      } else {
        this.setAttribute( 'multiple', '' );
      }
    } else {
      this.removeAttribute( 'multiple' );
    }
  }

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

window.customElements.define( 'adc-list', AvocadoList );

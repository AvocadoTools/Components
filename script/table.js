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

        #columns {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          width: 100%;
        }

        #list {
          background-color: #f4f4f4;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          flex-basis: 0;
          flex-grow: 1;
          overflow: scroll; 
        }

        #list.light {
          background-color: #ffffff;
        }

        #list div {
          border-bottom: solid 1px #e0e0e0;
          border-top: solid 1px transparent;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
        }

        #list div:hover {
          background-color: #e5e5e5;
        }

        #list div.selected {
          background-color: #e0e0e0;
        }

        #list div:first-of-type.selected {
          border-top: solid 1px #cacaca;
          line-height: 46px;
        }

        #list div.selected:hover {
          background-color: #cacaca;
        }        

        #list div:last-of-type {
          border-bottom: solid 1px transparent;
        }

        #list div p {
          box-sizing: border-box;
          color: #525252;
          cursor: default;
          display: block;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 48px;
          margin: 0;
          width: 200px;
          overflow: hidden;          
          padding: 0 16px 0 16px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        #list div:hover p {
          color: #161616;
        }
      </style>
      <div id="columns">
        <slot></slot>
      </div>
      <div id="list"></div>
      `;

    // Properties
    this._data = [];
    this._provider = [];
    this._filter = null;
    this._sortDirection = null;
    this._sortField = null;

    // Removable events
    this.doSelect = this.doSelect.bind( this );

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );      

    // Elements
    this.$columns = shadowRoot.querySelector( '#columns' );
    this.$columns.addEventListener( 'sort', ( evt ) => this.doSort( evt ) );
    this.$list = shadowRoot.querySelector( '#list' );
  }

  addItem( item ) {
    this._data.push( item );
    this._render();
  }

  removeItem( item, key ) {
    let index = null;

    // Look at items
    for( let d = 0; d < this._data.length; d++ ) {
      if( this._data[d][key] === item[key] ) {
        index = d;
        break;
      }
    }

    // Remove and render
    this._data.splice( index, 1 );
    this._render();
  }

  setItem( item, key ) {
    let index = null;

    // Look at items
    for( let d = 0; d < this._data.length; d++ ) {
      if( this._data[d][key] === item[key] ) {
        index = d;
        break;
      }
    }

    // Update and render
    this._data[index] = item;
    this._render();
  }

  // Item selected
  doSelect( evt ) {
    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    // Not on same row twice
    if( index !== this.selectedIndex ) {
      // Set selected index
      this.selectedIndex = index;

      // Notify of change
      this.dispatchEvent( new CustomEvent( 'change', {
        bubbles: true,
        composed: true,
        detail: {
          selectedIndex: this.selectedIndex,
          selectedItem: this.selectedItem
        }
      } ) );
    }
  }

  // Sorting requested
  doSort( evt ) {
    // Clear sort indicator on other columns
    for( let c = 0; c < this.children.length; c++ ) {
      if( this.children[c] !== evt.target ) {
        this.children[c].sortDirection = null;
      }
    }

    // Stash column details
    this._sortDirection = evt.target.sortDirection;
    this._sortField = evt.target.dataField;

    // Currently selected item
    const item = Object.assign( {}, this.selectedItem );

    // Update display
    this._render();

    // Set to selected item
    this.selectedItem = item;
  }

  // When things change
  _render() {
    // Host
    this.style.flexBasis = this.grow === null ? '' : 0;    
    this.style.flexGrow = this.grow === null ? '' : this.grow;
    this.style.float = this.grow === null ? 'left' : '';
    this.style.height = this.height === null ? '' : `${this.height}px`;
    this.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;
    this.style.width = this.width === null ? '' : `${this.width}px`;

    // Default columns
    // If none supplied
    // Use keys as column names
    if( this.children.length === 0 ) {
      if( this._data.length === 0 ) return;

      const keys = Object.keys( this._data[0] );

      for( let k = 0; k < keys.length; k++ ) {
        const column = document.createElement( 'avocado-column' );
        column.headerText = keys[k];
        column.dataField = keys[k];
        this.appendChild( column );
      }
    }

    // List theme
    if( this.light ) {
      this.$list.classList.add( 'light' );
    } else {
      this.$list.classList.remove( 'light' );
    }    

    // Filtering
    if( this.filter === null ) {
      this._provider = [... this._data];      
    } else {
      // TODO: Test function reference
      this._provider = this._data.filter( this.filter );      
    }

    // Sorting
    if( this._sortDirection !== null ) {
      // Based on data field if present
      this._provider.sort( ( a, b ) => {
        if( this._sortField === null ) {
          if( this._sortDirection === 'asc' ) {
            if( a > b ) return 1;
            if( a < b ) return -1;
            return 0;
          } else {
            if( a > b ) return -1;
            if( a < b ) return 1;
            return 0;            
          }
        } else {
          if( this._sortDirection === 'asc' ) {
            if( a[this._sortField] > b[this._sortField] ) return 1;
            if( a[this._sortField] < b[this._sortField] ) return -1;
            return 0;
          } else {
            if( a[this._sortField] > b[this._sortField] ) return -1;
            if( a[this._sortField] < b[this._sortField] ) return 1;
            return 0;
          }
        }
      } );
    }

    // Make list elements if needed
    while( this.$list.children.length < this._provider.length ) {
      const row = document.createElement( 'div' );

      // If selectable
      if( this.selectable ) {
        row.addEventListener( 'mousedown', this.doSelect );      
      }

      // Cell for each column
      for( let c = 0; c < this.children.length; c++ ) {
        let column = null;

        // No custom renderer
        // Use generic paragraph
        if( this.children[c].itemRenderer === null ) {
          column = document.createElement( 'p' );
        } else {
          column = document.createElement( this.children[c].itemRenderer );
        }
        
        // Column sizing
        if( this.grow !== null || this.width !== null ) {
          if( this.children[c].width === null ) {
            this.children[c].grow = 1;
            
            column.style.flexBasis = 0;
            column.style.flexGrow = 1;
            column.style.width = 0;
          } else {
            column.style.width = `${this.children[c].width}px`;
          }
        }

        // Column on row
        row.appendChild( column );
      }

      // Row on table
      this.$list.appendChild( row );
    }

    // Remove list elements if needed
    // Be sure to remove event listeners
    while( this.$list.children.length > this._provider.length ) {
      // If selectable
      if( this.selectable ) {
        this.$list.children[0].removeEventListener( 'mousedown', this.doSelect );
      }

      this.$list.children[0].remove();
    }    

    // Should the column headers be displayed
    // Add one row to default height if not displayed
    this.$columns.style.display = this.hideHeaders === true ? 'none' : '';
    this.$list.style.minHeight = this.hideHeaders === true ? '196px' : '';    

    // Populate cells
    // Based on sorted and filtered data
    for( let p = 0; p < this._provider.length; p++ ) {
      // Row index
      this.$list.children[p].setAttribute( 'data-index', p );

      // Highlight currently selected row
      if( this.selectedIndex === p ) {
        this.$list.children[p].classList.add( 'selected' );
      } else {
        this.$list.children[p].classList.remove( 'selected' );
      }

      // Using column-provided information
      for( let c = 0; c < this.children.length; c++ ) {
        // Tooltip
        // Using title attribute
        // Useful for content that overflows column
        if( this.children[c].dataTipField === null ) {
          this.$list.children[p].children[c].removeAttribute( 'title' );
        } else {
          this.$list.children[p].children[c].setAttribute( 'title', this._provider[p][this.children[c].dataTipField] );
        }

        // Column has specified field
        if( this.children[c].dataField !== null ) {
          this.$list.children[p].children[c].innerText = this._provider[p][this.children[c].dataField];        
          continue;
        }

        // Column has specified formatting
        if( this.children[c].labelFunction !== null ) {
          // TODO: Test parent reference
          this.$list.children[p].children[c].innerText = this.parentElement[this.children[c].labelFunction]( this._provider[p] );
          continue;
        }

        // Column has alternate renderer
        if( this.children[c].itemRenderer !== null ) {
          this.$list.children[p].children[c].data = this._provider[p];
        }
      }
    }    
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
    this._upgrade( 'data' );

    this._upgrade( 'height' );
    this._upgrade( 'hideHeaders' );
    this._upgrade( 'grow' );
    this._upgrade( 'light' );
    this._upgrade( 'marginBottom' );
    this._upgrade( 'marginLeft' );
    this._upgrade( 'marginRight' );
    this._upgrade( 'marginTop' );
    this._upgrade( 'selectable' );
    this._upgrade( 'selectedIndex' );    
    this._upgrade( 'width' );    

    this._render();
  }  

  // Watched attributes
  static get observedAttributes() {
    return [
      'height',
      'hide-headers',
      'grow',
      'light',
      'margin-bottom',
      'margin-left',
      'margin-right',
      'margin-top',
      'selectable',
      'selected-index',
      'width'
    ];
  }  

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }  

  // List items
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = [... value];    
    this._render();
  }

  get filter() {
    return this._filter;
  }

  set filter( value ) {
    this._filter = value;
  }

  get length() {
    return this._provider.length;
  }

  get selectedItem() {
    if( this.selectedIndex === null ) return null;
    return this._provider[this.selectedIndex];
  }

  set selectedItem( value ) {
    let index = null;

    // Look through sorted and filtered list
    for( let p = 0; p < this._provider.length; p++ ) {
      // Examine keys
      const keys = Object.keys( this._provider[p] );
      let match = true;

      for( let k = 0; k < keys.length; k++ ) {
        if( value[keys[k]] !== this._provider[p][keys[k]] ) {
          match = false;
          break;
        }
      }

      // All keys match
      if( match ) {
        index = p;
        break;
      }
    }

    // Set the selected row
    this.selectedIndex = index;
  }  

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)  
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

  get hideHeaders() {
    return this.hasAttribute( 'hide-headers' );
  }

  set hideHeaders( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hide-headers' );
      } else {
        this.setAttribute( 'hide-headers', '' );
      }
    } else {
      this.removeAttribute( 'hide-headers' );
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

  get marginBottom() {
    if( this.hasAttribute( 'margin-bottom' ) ) {
      return parseInt( this.getAttribute( 'margin-bottom' ) );
    }

    return null;
  }

  set marginBottom( value ) {
    if( value !== null ) {
      this.setAttribute( 'margin-bottom', value );
    } else {
      this.removeAttribute( 'margin-bottom' );
    }
  }

  get marginLeft() {
    if( this.hasAttribute( 'margin-left' ) ) {
      return parseInt( this.getAttribute( 'margin-left' ) );
    }

    return null;
  }

  set marginLeft( value ) {
    if( value !== null ) {
      this.setAttribute( 'margin-left', value );
    } else {
      this.removeAttribute( 'margin-left' );
    }
  }

  get marginRight() {
    if( this.hasAttribute( 'margin-right' ) ) {
      return parseInt( this.getAttribute( 'margin-right' ) );
    }

    return null;
  }

  set marginRight( value ) {
    if( value !== null ) {
      this.setAttribute( 'margin-right', value );
    } else {
      this.removeAttribute( 'margin-right' );
    }
  }

  get marginTop() {
    if( this.hasAttribute( 'margin-top' ) ) {
      return parseInt( this.getAttribute( 'margin-top' ) );
    }

    return null;
  }

  set marginTop( value ) {
    if( value !== null ) {
      this.setAttribute( 'margin-top', value );
    } else {
      this.removeAttribute( 'margin-top' );
    }
  }

  get selectable() {
    return this.hasAttribute( 'selectable' );
  }

  set selectable( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selectable' );
      } else {
        this.setAttribute( 'selectable', '' );
      }
    } else {
      this.removeAttribute( 'selectable' );
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

window.customElements.define( 'avocado-table', AvocadoTable );

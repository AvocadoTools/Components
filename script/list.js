export default class AvocadoList extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /*template*/ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        button {
          -webkit-appearance: none;
          appearance: none;
          background: none;
          background: #e0e0e0;
          border: none;
          box-sizing: border-box;
          color: #161616;
          display: block;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          height: 48px;          
          margin: 0;
          outline: none;
          padding: 0 16px 0 16px;
          text-align: left;
          width: 100%;
        }

        button.sortable {
          background-position: right 16px center;
          background-repeat: no-repeat;
          background-size: 20px;
          cursor: pointer;
        }

        button.sortable:hover {
          background-color: #cacaca;          
          background-image: url( /img/controls/sort.svg );
        }        

        button.sortable.asc {
          background-image: url( /img/controls/ascending.svg );
        }

        button.sortable.desc {
          background-image: url( /img/controls/descending.svg );
        }

        div {
          background-color: #f4f4f4;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          flex-basis: 0;
          flex-grow: 1;
          height: 100%;
          min-height: 144px;
          overflow: scroll;          
          width: 100%; 
        }

        div.light {
          background-color: #ffffff;
        }

        div p {
          border-bottom: solid 1px #e5e5e5;
          border-top: solid 1px transparent;
          box-sizing: border-box;
          color: #525252;
          cursor: default;
          display: block;          
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 47px;          
          margin: 0;
          padding: 0 16px 0 16px;
        }

        div p:last-of-type {
          border-bottom: solid 1px transparent;
        }

        div p:hover {
          background-color: #e5e5e5;
          color: #161616;
        }

        div p.selected {
          background-color: #e0e0e0;
        }

        div p:first-of-type.selected {
          border-top: solid 1px #cacaca;
          line-height: 46px;
        }

        div p.selected:hover {
          background-color: #cacaca;
        }

        div p.truncate {
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 0;
        }
      </style>
      <button></button>
      <div></div>
    `;

    // Properties
    this._data = [];
    this._provider = [];

    // Events
    this.doSelect = this.doSelect.bind( this );
    this.doSort = this.doSort.bind( this );

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$header = shadowRoot.querySelector( 'button' );
    this.$list = shadowRoot.querySelector( 'div' );
  }

  addItem( item ) {
    this._data.push( item );
    this._render();
  }

  removeItem( item, key = null ) {
    let index = null;

    // Look at items
    for( let d = 0; d < this._data.length; d++ ) {
      // Key not provided
      if( key === null ) {
        // No data field
        if( this.dataField === null ) {
          // Evaluate as string
          if( this._data[d] === item ) {
            index = d;
            break;
          }
        } else {
          // Evaluate as string on data field
          if( this._data[d][this.dataField] === item ) {
            index = d;
            break;
          }
        }        
      } else {
        // Key provided
        // Must be object
        // Evaluate on specified field
        if( this._data[d][key] === item[key] ) {
          index = d;
          break;
        }
      }
    }

    // Remove and render
    this._data.splice( index, 1 );
    this._render();
  }

  setItem( item, key = null ) {
    let index = null;

    // Look at items
    for( let d = 0; d < this._data.length; d++ ) {
      // Key not provided
      if( key === null ) {
        // No data field
        if( this.dataField === null ) {
          // Evaluate as string
          if( this._data[d] === item ) {
            index = d;
            break;
          }
        } else {
          // Evaluate as string on data field
          if( this._data[d][this.dataField] === item ) {
            index = d;
            break;
          }
        }        
      } else {
        // Key provided
        // Must be object
        // Evaluate on specified field
        if( this._data[d][key] === item[key] ) {
          index = d;
          break;
        }
      }
    }

    // Remove and render
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
        detail: {
          selectedIndex: this.selectedIndex,
          selectedItem: this.selectedItem
        }
      } ) );
    }
  }

  // Sorting requested
  // Determine direction
  doSort( evt ) {
    if( this.sortDirection === null ) {
      this.sortDirection = 'asc';
      this.$header.classList.add( 'asc' );      
    } else {
      if( this.sortDirection === 'asc' ) {
        this.sortDirection = 'desc';
        this.$header.classList.remove( 'asc' );
        this.$header.classList.add( 'desc' );        
      } else {
        this.sortDirection = null;
        this.$header.classList.remove( 'desc' );        
      }
    }

    this.dispatchEvent( new CustomEvent( 'sort', {
      detail: {
        direction: this.sortDirection
      }
    } ) );
  }

  // When things change
  _render() {
    // Host
    this.style.display = this.hidden === true ? 'none' : '';
    this.style.flexBasis = this.grow === null ? '' : 0;
    this.style.flexGrow = this.grow === null ? '' : this.grow;
    this.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;        
    this.style.visibility = this.concealed === true ? 'hidden' : '';

    // List theme
    if( this.light ) {
      this.$list.classList.add( 'light' );
    } else {
      this.$list.classList.remove( 'light' );
    }

    // Can be sorted
    // Add styles for interaction
    // Add event for interaction
    if( this.sortable ) {
      this.$header.classList.add( 'sortable' );
      this.$header.addEventListener( 'mousedown', this.doSort );
    } else {
      this.$header.classList.remove( 'sortable' );
      this.$header.removeEventListener( 'mousedown', this.doSort );
    }

    // Show/hide header if desired
    this.$header.style.display = this.hideHeader === true ? 'none' : 'block';

    // Filtering
    if( this.filter === null ) {
      this._provider = [... this._data];      
    } else {
      // Based on data field if present
      this._provider = this._data.filter( ( value, index ) => {
        if( this.dataField === null ) {
          if( value.toLowerCase().indexOf( this.filter.toLowerCase() ) >= 0 ) return true;
        } else {
          if( value[this.dataField].toLowerCase().indexOf( this.filter.toLowerCase() ) >= 0 ) return true;
        }

        return false;
      } );      
    }

    // Sorting
    if( this.sortDirection !== null ) {
      // Based on data field if present
      this._provider.sort( ( a, b ) => {
        if( this.dataField === null ) {
          if( this.sortDirection === 'asc' ) {
            if( a > b ) return 1;
            if( a < b ) return -1;
            return 0;
          } else {
            if( a > b ) return -1;
            if( a < b ) return 1;
            return 0;            
          }
        } else {
          if( this.sortDirection === 'asc' ) {
            if( a[this.dataField] > b[this.dataField] ) return 1;
            if( a[this.dataField] < b[this.dataField] ) return -1;
            return 0;
          } else {
            if( a[this.dataField] > b[this.dataField] ) return -1;
            if( a[this.dataField] < b[this.dataField] ) return 1;
            return 0;
          }
        }
      } );
    }

    // Populate header
    // Show record count if desired
    if( this.count ) {
      this.$header.innerText = this.headerText === null ? '' : `${this.headerText} (${this._provider.length})`;
    } else {
      this.$header.innerText = this.headerText === null ? '' : this.headerText;      
    }

    // Make list elements if needed
    while( this.$list.children.length < this._provider.length ) {
      const element = document.createElement( 'p' );

      // Allow for selection if desired
      if( this.selectable ) {
        element.addEventListener( 'mousedown', this.doSelect );
      }

      this.$list.appendChild( element );
    }

    // Remove list elements if needed
    // Be sure to remove event listeners
    while( this.$list.children.length > this._provider.length ) {
      this.$list.children[0].removeEventListener( 'mousedown', this.doSelect );
      this.$list.children[0].remove();
    }

    // Iterate (sorted and filtered) data
    // Populate rows along the way
    for( let p = 0; p < this._provider.length; p++ ) {
      // Keep in index for easy reference
      this.$list.children[p].setAttribute( 'data-index', p );

      // Allow selection of row if desired
      if( this.selectable ) {
        // Add style to show selection
        this.$list.children[p].classList.add( 'selectable' );

        // Highlight currently selected row
        if( this.selectedIndex === p ) {
          this.$list.children[p].classList.add( 'selected' );
        } else {
          this.$list.children[p].classList.remove( 'selected' );
        }
      } else {
        // Selection is not desired
        // Remove associated styles showing interaction
        this.$list.children[p].classList.remove( 'selectable' );
        this.$list.children[p].classList.remove( 'selected' );
      }

      // Truncate text with ellipsis if desired
      if( this.truncate ) {
        this.$list.children[p].classList.add( 'truncate' );
      } else {
        this.$list.children[p].classList.remove( 'truncate' );
      }

      // Populate the row content
      // Based on data field if present
      if( this.dataField === null ) {
        this.$list.children[p].innerText = this._provider[p];
      } else {
        this.$list.children[p].innerText = this._provider[p][this.dataField];
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

    this._upgrade( 'concealed' );
    this._upgrade( 'count' );
    this._upgrade( 'dataField' );
    this._upgrade( 'filter' );    
    this._upgrade( 'grow' );    
    this._upgrade( 'headerText' );    
    this._upgrade( 'hidden' );    
    this._upgrade( 'hideHeader' );    
    this._upgrade( 'light' );        
    this._upgrade( 'marginBottom' );    
    this._upgrade( 'marginLeft' );    
    this._upgrade( 'marginRight' );    
    this._upgrade( 'marginTop' );                
    this._upgrade( 'selectable' );        
    this._upgrade( 'selectedIndex' );        
    this._upgrade( 'sortDirection' );        
    this._upgrade( 'sortable' );        
    this._upgrade( 'truncate' );        

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'count',
      'data-field',
      'filter',
      'grow',
      'header-text',
      'hidden',
      'hide-header',
      'light',
      'margin-bottom',
      'margin-left',
      'margin-right',
      'margin-top',
      'selectable',
      'selected-index',
      'sort-direction',
      'sortable',
      'truncate'
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
    this._provider = [... value];
    this._render();
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

    // Look through list
    // Support string and object array
    // Use data field when object array
    for( let p = 0; p < this._provider.length; p++ ) {
      if( this.dataField === null ) {
        if( this._provider[p] === value ) {
          index = p;
          break;
        }
      } else {
        if( this._provider[p][this.dataField] === value ) {
          index = p;
          break;
        }
      }
    }

    // Set the selected row
    this.selectedIndex = index;
  }
  
  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)
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

  get count() {
    return this.hasAttribute( 'count' );
  }

  set count( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'count' );
      } else {
        this.setAttribute( 'count', '' );
      }
    } else {
      this.removeAttribute( 'count' );
    }
  }  

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

  get filter() {
    if( this.hasAttribute( 'filter' ) ) {
      return this.getAttribute( 'filter' );
    }

    return null;
  }

  set filter( value ) {
    if( value !== null ) {
      this.setAttribute( 'filter', value );
    } else {
      this.removeAttribute( 'filter' );
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

  get truncate() {
    return this.hasAttribute( 'truncate' );
  }

  set truncate( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'truncate' );
      } else {
        this.setAttribute( 'truncate', '' );
      }
    } else {
      this.removeAttribute( 'truncate' );
    }
  }  
}

window.customElements.define( 'avocado-list', AvocadoList );

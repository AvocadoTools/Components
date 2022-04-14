export default class AvocadoSelect extends HTMLElement {
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
          width: 200px;
        }

        select {
          appearance: none;
          background: none;
          background-color: #f4f4f4;
          background-image: url( '/img/controls/chevron.svg' );
          background-position: right 16px center;
          background-repeat: no-repeat;
          background-size: 16px;
          border: none;
          border-bottom: solid 1px #8d8d8d;
          border-radius: 0;
          box-sizing: border-box;
          color: #161616;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 40px;
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          overflow: hidden;
          padding: 0 48px 0 16px;
          text-overflow: ellipsis;
          -webkit-appearance: none;
          white-space: nowrap;   
          width: 100%;       
        }

        select.light {
          background-color: #ffffff;
        }

        select.light:hover {
          background-color: #e5e5e5;
        }

        select:focus {
          outline: solid 2px #0f62fe;
        }

        select:disabled {
          background-image: url( '/img/controls/chevron-disabled.svg' );      
          border-bottom: solid 1px transparent;
          color: #c6c6c6;
          cursor: not-allowed;
          outline: none;
        }

        select:disabled.light:hover {        
          background-color: #ffffff;
        }

        select.invalid {
          background-image: url( /img/controls/warning.svg );
          background-position: right 14px center;
          background-repeat: no-repeat;
          background-size: 20px;
          margin: 0;
          outline: solid 2px #da1e28;
          padding: 0 48px 0 16px;
        }

        select.readonly {
          display: none;
        }

        p {
          box-sizing: border-box;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          margin: 0;
          padding: 0;
        }

        #error {
          color: #da1e28;
          padding: 4px 0 2px 0;
        }

        #helper {
          color: #6f6f6f;
          padding-bottom: 6px;
        }

        #label {
          color: #393939;
          padding-bottom: 6px;
        }

        #readonly {
          background-color: #f4f4f4;          
          background-image: url( '/img/controls/chevron-disabled.svg' );        
          background-position: right 16px center;
          background-repeat: no-repeat;
          background-size: 16px;  
          color: #161616;
          cursor: not-allowed;
          font-size: 14px;
          height: 40px;
          line-height: 40px;
          overflow: hidden;
          padding: 0 48px 0 16px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        #readonly.light {
          background-color: #ffffff;
        }
      </style>
      <p id="label"></p>
      <p id="helper"></p>
      <select></select>
      <p id="readonly"></p>
      <p id="error"></p>
    `;

    // Properties
    this._data = [];

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    // And any changes
    this.$label = shadowRoot.querySelector( '#label' );
    this.$helper = shadowRoot.querySelector( '#helper' );
    this.$select = shadowRoot.querySelector( 'select' );
    this.$select.addEventListener( 'input', ( evt ) => this.doChange( evt ) );
    this.$error = shadowRoot.querySelector( '#error' );
    this.$readonly = shadowRoot.querySelector( '#readonly' );
  }

  // Changed
  doChange( evt ) {
    evt.stopPropagation();

    this.selectedIndex = evt.currentTarget.selectedIndex;
    this.$readonly.innerText = this.dataField === null ? this.data[this.selectedIndex] : this.data[this.selectedIndex][this.dataField];

    this.dispatchEvent( new CustomEvent( 'input', {
      detail: {
        index: this.selectedIndex,
        item: this.data[this.selectedIndex]
      }
    } ) );        
  }

  // When things change
  _render() {
    // Host
    this.style.flexBasis = this.grow === null ? '' : 0;
    this.style.flexGrow = this.grow === null ? '' : this.grow;
    this.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;    
    this.style.width = this.width === null ? '' : `${this.width}px`;    

    // Label
    if( this.label === null ) {
      this.$label.style.display = 'none';
    } else {
      this.$label.innerText = this.label;
      this.$label.style.display = '';
      this.$label.style.color = this.disabled === true ? '#c6c6c6' : '#393939';
    }

    // Helper
    if( this.helper === null ) {
      this.$helper.style.display = 'none';
      this.$helper.style.marginTop = 0;
    } else {
      this.$helper.innerText = this.helper;
      this.$helper.style.display = '';
      this.$helper.style.color = this.disabled === true ? '#c6c6c6' : '#6f6f6f';      
      this.$helper.style.marginTop = '-4px';
    }    

    // Theme
    this.$select.className = '';
    this.$readonly.className = '';

    if( this.light ) {
      this.$select.classList.add( 'light' );
      this.$readonly.classList.add( 'light' );
    }

    // Read only
    if( this.readonly ) {
      this.$select.classList.add( 'readonly' );
      this.$readonly.style.display = '';
    } else {
      this.$readonly.style.display = 'none';
    }

    // Disabled
    this.$select.disabled = this.disabled;    

    // Title
    if( this.title === null ) {
      this.$select.removeAttribute( 'title' );
    } else {
      this.$select.setAttribute( 'title', this.title );
    }

    // Selection
    this.$select.selectedIndex = this.selectedIndex;

    // Error
    if( this.error === null ) {
      this.$error.style.visibility = 'hidden';
      this.$error.innerText = '&nbsp;';
    } else {
      this.$select.classList.add( 'invalid' );
      this.$error.innerText = this.error;
      this.$error.style.visibility = '';
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
    this._upgrade( 'concealed' );
    this._upgrade( 'dataField' );
    this._upgrade( 'disabled' );    
    this._upgrade( 'error' );    
    this._upgrade( 'grow' );    
    this._upgrade( 'helper' );    
    this._upgrade( 'hidden' );    
    this._upgrade( 'label' );    
    this._upgrade( 'light' );    
    this._upgrade( 'marginBottom' );    
    this._upgrade( 'marginLeft' );    
    this._upgrade( 'marginRight' );    
    this._upgrade( 'marginTop' );    
    this._upgrade( 'readonly' );    
    this._upgrade( 'selectedIndex' );    
    this._upgrade( 'title' );    
    this._upgrade( 'width' );    

    // Render
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'data-field',            
      'disabled',
      'error',
      'grow',
      'helper',
      'hidden',
      'label',
      'light',
      'margin-bottom',
      'margin-left',
      'margin-right',
      'margin-top',
      'readonly',
      'selected-index',
      'title',
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
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = [... value];

    // Match list size to data length
    // Reuse elements that exist
    // Just reconfigure them
    while( this.$select.children.length > this._data.length ) {
      this.$select.children[0].remove();
    }

    while( this.$select.children.length < this._data.length ) {
      const option = document.createElement( 'option' );
      this.$select.appendChild( option );
    }

    // Populate list
    for( let d = 0; d < this._data.length; d++ ) {
      this.$select.options[d].setAttribute( 'data-index', d );
      this.$select.options[d].value = this.dataField === null ? this._data[d] : this._data[d][this.dataField];      
      this.$select.options[d].innerText = this.dataField === null ? this._data[d] : this._data[d][this.dataField];

      if( this.index !== null ) {
        if( this.index === d ) {
          option.selected = true;
        }
      }
    }  

    // Read-only placeholder
    if( this.selectedIndex !== null ) {
      this.$readonly.innerText = this.dataField === null ? this._data[this.selectedIndex] : this._data[this.selectedIndex][this.dataField];
    } else {
      this.$readonly.innerText = this.dataField === null ? this._data[0] : this._data[0][this.dataField];
    }

    // Default
    this._selectedItem = this._data[0];
  }

  get selectedItem() {
    const index = this.selectedIndex === null ? 0 : this.selectedIndex;
    return this._data[index];
  }

  set selectedItem( value ) {
    let index = null;

    // Look through list
    // Support string and object array
    // Use data field when object array
    for( let d = 0; d < this._data.length; d++ ) {
      if( this.dataField === null ) {
        if( this._data[d] === value ) {
          index = d;
          break;
        }
      } else {
        if( this._data[d][this.dataField] === value[this.dataField] ) {
          index = d;
          break;
        }
      }
    }

    // Set the select element
    this.$select.selectedIndex = index;
  }

  // Shortcut to the select element
  // Useful when array of strings
  get value() {
    return this.$select.value;
  }

  set value( content ) {
    let index = null;

    for( let s = 0; s < this.$select.options.length; s++ ) {
      if( this.$select.options[s].value === content ) {
        index = s;
        break;
      }
    }

    this.$readonly.innerText = content;
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

  get error() {
    if( this.hasAttribute( 'error' ) ) {
      return this.getAttribute( 'error' );
    }

    return null;
  }

  set error( value ) {
    if( value !== null ) {
      this.setAttribute( 'error', value );
    } else {
      this.removeAttribute( 'error' );
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

  get helper() {
    if( this.hasAttribute( 'helper' ) ) {
      return this.getAttribute( 'helper' );
    }

    return null;
  }

  set helper( value ) {
    if( value !== null ) {
      this.setAttribute( 'helper', value );
    } else {
      this.removeAttribute( 'helper' );
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

  get readonly() {
    return this.hasAttribute( 'readonly' );
  }

  set readonly( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'readonly' );
      } else {
        this.setAttribute( 'readonly', '' );
      }
    } else {
      this.removeAttribute( 'readonly' );
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

window.customElements.define( 'avocado-select', AvocadoSelect );

export class AvocadoProperty extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        :host {
          border-bottom: solid 1px #cacaca;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          position: relative;
        }

        input {
          -webkit-appearance: none;
          appearance: none;
          background: none;
          border: none;
          border-left: solid 1px #cacaca;
          box-sizing: border-box;
          color: #4b4b4b;
          flex-basis: 0;
          flex-grow: 1;
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 400;          
          height: 25px;
          margin: 0;
          padding: 0 8px 0 8px;    
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="color"] {
          padding: 0 4px 0 4px;
        }

        label {
          box-sizing: border-box;
          color: #4b4b4b;
          flex-basis: 0;
          flex-grow: 1;
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 25px;
          line-height: 25px;
          margin: 0;
          padding: 0 0 0 16px;
        }

        select {
          -webkit-appearance: none;
          appearance: none;
          background: none;
          background-image: url( /img/inspector/chevron-down.svg );
          background-position: right 4px center;
          background-repeat: no-repeat;
          background-size: 16px;
          border: none;
          border-left: solid 1px #cacaca;
          box-sizing: border-box;
          color: #4b4b4b;
          cursor: pointer;
          flex-basis: 0;
          flex-grow: 1;
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 25px;
          margin: 0;
          padding: 0 0 0 8px;
        }
      </style>
      <label></label>
    `;

    // Properties
    this._data = null;
    this._editor = null;
    this._type = null;

    // Events
    this.doChange = this.doChange.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'label' );
  }

  // Value changed in property
  doChange( evt ) {
    // Get the value
    let value = this._editor.value;

    // Special case for types number and string
    // No content means null
    if( this.type === 'number' || this.type === 'string' ) {
      if( value.trim().length === 0 ) {
        value = null;
      }
    }

    // Dispatch event new value for given property
    this.dispatchEvent( new CustomEvent( 'property', {
      bubbles: true,
      composed: true,
      detail: {
        property: this.property,
        type: this.type,
        value: value
      }
    } ) );
  }

  // When tnings change
  _render() {
    // Label of property
    this.$label.innerText = this.label === null ? '' : this.label;

    // Type argument can be an array or string
    // Special considerations in rendering for array
    const type = Array.isArray( this.type ) ? 'array' : this.type;

    // Remove event listeners
    // Remove editor
    if( this._editor !== null ) {
      this._editor.removeEventListener( 'change', this.doChange );
      this._editor.removeEventListener( 'input', this.doChange );
      this._editor.remove();
    }

    // Depending on type of property
    switch( type ) {
      case 'array':
        // Editor will be select element
        this._editor = document.createElement( 'select' );
        this._editor.addEventListener( 'change', this.doChange );

        // Filled with supplied options
        for( let t = 0; t < this.type.length; t++ ) {
          const option = document.createElement( 'option' );
          option.innerText = this.type[t];
          
          // Match selection to default value
          if( this.type[t] === this.value ) {
            option.selected = true;
          }

          // Add to select
          this._editor.appendChild( option ); 
        }

        break;

      case 'boolean':
        // Editor will be a select element
        this._editor = document.createElement( 'select' );
        this._editor.addEventListener( 'change', this.doChange );        

        // Filled with options for true and false
        let option = document.createElement( 'option' );
        option.innerText = 'true';
        this._editor.appendChild( option ); 

        option = document.createElement( 'option' );
        option.innerText = 'false';
        this._editor.appendChild( option ); 

        // Default value selected
        this._editor.selectedIndex = this.value === 'true' ? 0 : 1;
        break;        

      case 'color':
        // Editor ill be an input of type coloe
        this._editor = document.createElement( 'input' );
        this._editor.addEventListener( 'input', this.doChange );
        this._editor.type = 'color';
        this._editor.value = this.value;
        break;

      case 'number':
      case 'size':        
        // Editor will be an input of type number
        this._editor = document.createElement( 'input' );
        this._editor.addEventListener( 'input', this.doChange );
        this._editor.type = 'number';
        this._editor.value = this.value;
        break;        

      case 'string':
        // Editor will be an input of type text
        this._editor = document.createElement( 'input' );
        this._editor.addEventListener( 'input', this.doChange );        
        this._editor.type = 'text';
        this._editor.value = this.value;
        break;        
    }

    // Place editor as host child
    if( this._editor !== null ) {
      this.shadowRoot.appendChild( this._editor );          
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
      'description',
      'label',
      'property',
      'value'
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

  // Type can be Array or String
  // Avoid attribute, use property
  get type() {
    return this._type;
  }

  set type( value ) {
    this._type = value;
  }

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)
  get description() {
    if( this.hasAttribute( 'description' ) ) {
      return this.getAttribute( 'description' );
    }

    return null;
  }

  set description( value ) {
    if( value !== null ) {
      this.setAttribute( 'description', value );
    } else {
      this.removeAttribute( 'description' );
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

  get property() {
    if( this.hasAttribute( 'property' ) ) {
      return this.getAttribute( 'property' );
    }

    return null;
  }

  set property( value ) {
    if( value !== null ) {
      this.setAttribute( 'property', value );
    } else {
      this.removeAttribute( 'property' );
    }
  }          
  
  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( data ) {
    if( data !== null ) {
      this.setAttribute( 'value', data );
    } else {
      this.removeAttribute( 'value' );
    }
  }         
}

window.customElements.define( 'avocado-property', AvocadoProperty );

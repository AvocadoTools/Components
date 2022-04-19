import AvocadoTag from './tag.js';

export default class AvocadoTagInput extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #ffffff;
          box-sizing: border-box;
          display: block;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }        

        :host( [hidden] ) {
          display: none;
        }        

        adc-tag {
          margin: 0 4px 0 0;
        }

        adc-tag:last-of-type {
          margin: 0 16px 0 0;
        }

        div[part=list] {
          display: flex;
          flex-direction: row;
        }

        img {
          height: 16px;
          padding: 16px;          
          width: 16px;
        }

        input {
          background: none;
          border: none;
          color: #161616;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;          
          height: 36px;
          margin: 0;
          outline: none;
          padding: 0 16px 0 0;
          width: 100%;
        }

        input::placeholder {
          color: #a8a8a8;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          text-rendering: optimizeLegibility;
        }

        label {
          align-items: center;
          border: solid 2px transparent;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          padding: 0 0 0 16px;
        }

        label:focus-within {
          border: solid 2px #0f62fe;
        }

        :host( [light] ) {
          background-color: transparent;
        }

        :host( [size=xl] ) input {
          height: 44px;
        }
      </style>
      <label part="field">
        <div part="list"></div>
        <input part="input" type="text">
      </label>
    `;

    // Properties
    this._color = null;
    this._data = null;
    this._label = null;    
    this._sort = null;
    this._value = [];

    // Events
    this.doTagClear = this.doTagClear.bind( this );

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$input = shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'keydown', ( evt ) => {
      if( evt.key === 'Enter' ) {
        const tag = this.$input.value.trim();

        if( this._value.indexOf( tag ) === -1 ) {
          let label = this.$input.value;

          if( this.labelField !== null ) {
            label = {[this.labelField]: label};
          }

          // TODO: colorField?

          this._value.push( label );

          if( this._sort !== null )
            this._value.sort( this._sort );

          this.$input.value = '';          
          this._render();

          this.dispatchEvent( new CustomEvent( 'change', {
            detail: {
              value: this.value
            }
          } ) );          
        }
      }

      if( evt.key === 'Backspace' ) {
        if( this.$input.value.trim().length === 0 ) {
          this._value.pop();

          if( this._sort !== null )
            this._value.sort( this._sort );

          this._render();

          this.dispatchEvent( new CustomEvent( 'change', {
            detail: {
              value: this.value
            }
          } ) );          
        }
      }
    } );
    this.$list = shadowRoot.querySelector( 'div[part=list]' );
  }

  doTagClear( evt ) {
    const index = this._value.indexOf( evt.currentTarget.label );
    this._value.splice( index, 1 );
    this._render();

    this.dispatchEvent( new CustomEvent( 'change', {
      detail: {
        value: this.value
      }
    } ) );
  }

  // When things change
  _render() {
    this.$input.title = this.title === null ? '' : this.title;
    this.$input.placeholder = this.placeholder === null ? '' : this.placeholder;

    while( this.$list.children.length > this._value.length ) {
      this.$list.children[0].removeEventListener( 'clear', this.doTagClear );
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._value.length ) {
      const tag = document.createElement( 'adc-tag' );
      tag.addEventListener( 'clear', this.doTagClear );
      tag.filter = true;
      this.$list.appendChild( tag );
    }

    for( let v = 0; v < this._value.length; v++ ) {
      let label = this._value[v];

      if( this.labelField !== null ) {
        label = this._value[v][this.labelField];   
      } else if( this._label !== null ) {
        label = this._label( this._value[v] );
      } else if( this._value[v].hasOwnProperty( 'label' ) ) {
        label = this._value[v].label;    
      }

      this.$list.children[v].label = label;
      this.$list.children[v].title = label;      

      if( this.colorField !== null ) {
        this.$list.children[v].color = this._value[v][this.colorField];   
      } else if( this._color !== null ) {
        this.$list.children[v].color = this._color( this._value[v] );
      } else if( this._value[v].hasOwnProperty( 'color' ) ) {
        this.$list.children[v].color = this._value[v].color;    
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
    this._upgrade( 'colorField' );        
    this._upgrade( 'colorFunction' );            
    this._upgrade( 'concealed' );    
    this._upgrade( 'data' );            
    this._upgrade( 'hidden' );    
    this._upgrade( 'labelField' );        
    this._upgrade( 'labelFunction' );                
    this._upgrade( 'placeholder' );        
    this._upgrade( 'sortFunction' );
    this._upgrade( 'size' );
    this._upgrade( 'title' );    
    this._upgrade( 'value' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'color-field',
      'concealed',
      'hidden',
      'label-field',
      'placeholder',
      'size',
      'title'
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
  get colorFunction() {
    return this._color;
  }

  set colorFunction( value ) {
    this._color = value;
    this._render();
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
    this._render();
  } 

  get sortFunction() {
    return this._sort;
  }

  set sortFunction( value ) {
    this._sort = value;
    this._value.sort( this._sort );
    this._render();
  }

  get value() {
    return this._value.length === 0 ? null : this._value;
  }

  set value( items ) {
    this._value = items === null ? [] : items;

    if( this._sort !== null ) {
      this._value.sort( this._sort );
    }

    this._render();
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get colorField() {
    if( this.hasAttribute( 'color-field' ) ) {
      return this.getAttribute( 'color-field' );
    }

    return null;
  }

  set colorField( value ) {
    if( value !== null ) {
      this.setAttribute( 'color-field', value );
    } else {
      this.removeAttribute( 'color-field' );
    }
  }  

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

  get placeholder() {
    if( this.hasAttribute( 'placeholder' ) ) {
      return this.getAttribute( 'placeholder' );
    }

    return null;
  }

  set placeholder( value ) {
    if( value !== null ) {
      this.setAttribute( 'placeholder', value );
    } else {
      this.removeAttribute( 'placeholder' );
    }
  } 

  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return this.getAttribute( 'size' );
    }

    return null;
  }

  set size( value ) {
    if( value !== null ) {
      this.setAttribute( 'size', value );
    } else {
      this.removeAttribute( 'size' );
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
}

window.customElements.define( 'adc-tag-input', AvocadoTagInput );

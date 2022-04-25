export default class AvocadoInput extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <div part="heading">
        <p part="label"></p>
        <slot name="count"></slot>
      </div>
      <p part="hint"></p>
      <input part="input" size="1" type="text">
      <p part="error"></p>
      <button part="reveal" type="button"></button>
    `;

    // Properties
    this._data = null;
    this._reveal = false;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$error = shadowRoot.querySelector( 'p[part=error]' );    
    this.$hint = shadowRoot.querySelector( 'p[part=hint]' );
    this.$input = shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'input', () => {
      this.value = this.$input.value;
    } );
    this.$input.addEventListener( 'keypress', ( evt ) => {
      if( evt.key === 'Enter' ) {
        this.dispatchEvent( new CustomEvent( 'enter', {
          detail: {
            value: this.value
          }
        } ) );
      }      
    } );
    this.$label = shadowRoot.querySelector( 'p[part=label]' );    
    this.$reveal = shadowRoot.querySelector( 'button' );
    this.$reveal.addEventListener( 'click', () => {
      this._reveal = !this._reveal;    
      this.$reveal.className = this._reveal == true ? 'reveal' : '';
      this.$input.type = this._reveal === true ? 'text' : 'password';
    } );
  }

  focus( wait = true ) {
    if( wait ) {
      window.requestAnimationFrame( () => {
        this.$input.focus();
      } );
    } else {
      this.$input.focus();
    }
  }

  // When things change
  _render() {
    this.$label.innerText = this.label === null ? '' : this.label;
    this.$hint.innerText = this.hint === null ? '' : this.hint;
    this.$input.disabled = this.disabled;    
    this.$input.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$input.readOnly = this.readOnly;
    this.$input.title = this.title === null ? '' : this.title;
    this.$input.type = this.password === true ? 'password' : 'text';
    this.$input.value = this.value === null ? '' : this.value;
    this.$error.innerText = this.error === null ? '&nbsp;' : this.error;
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
    this._upgrade( 'concealed' );
    this._upgrade( 'count' );    
    this._upgrade( 'data' );
    this._upgrade( 'disabled' );
    this._upgrade( 'error' );
    this._upgrade( 'hidden' );    
    this._upgrade( 'hint' );    
    this._upgrade( 'invalid' );    
    this._upgrade( 'label' );    
    this._upgrade( 'light' );  
    this._upgrade( 'password' );          
    this._upgrade( 'placeholder' );    
    this._upgrade( 'readOnly' );    
    this._upgrade( 'size' );    
    this._upgrade( 'title' );    
    this._upgrade( 'value' );     
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'count',
      'disabled',
      'error',
      'hidden',
      'hint', 
      'invalid',     
      'label',
      'light',
      'password',
      'placeholder',
      'read-only',
      'size',
      'title',
      'value'
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

  get count() {
    if( this.hasAttribute( 'count' ) ) {
      return this.getAttribute( 'count' );
    }

    return null;
  }

  set count( value ) {
    if( value !== null ) {
      this.setAttribute( 'count', value );
    } else {
      this.removeAttribute( 'count' );
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

  get hint() {
    if( this.hasAttribute( 'hint' ) ) {
      return this.getAttribute( 'hint' );
    }

    return null;
  }

  set hint( value ) {
    if( value !== null ) {
      this.setAttribute( 'hint', value );
    } else {
      this.removeAttribute( 'hint' );
    }
  }

  get invalid() {
    return this.hasAttribute( 'invalid' );
  }

  set invalid( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'invalid' );
      } else {
        this.setAttribute( 'invalid', '' );
      }
    } else {
      this.removeAttribute( 'invalid' );
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

  get password() {
    return this.hasAttribute( 'password' );
  }

  set password( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'password' );
      } else {
        this.setAttribute( 'password', '' );
      }
    } else {
      this.removeAttribute( 'password' );
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

  get readOnly() {
    return this.hasAttribute( 'read-only' );
  }

  set readOnly( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'read-only' );
      } else {
        this.setAttribute( 'read-only', '' );
      }
    } else {
      this.removeAttribute( 'read-only' );
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

  get value() {
    let result = null;

    if( this.hasAttribute( 'value' ) ) {
      if( this.getAttribute( 'value').trim().length > 0 ) {
        result = this.getAttribute( 'value' );
      }
    }

    return result;
  }

  set value( content ) {
    if( content !== null ) {
      this.setAttribute( 'value', content );
    } else {
      this.removeAttribute( 'value' );
    }
  }  
}

window.customElements.define( 'adc-input', AvocadoInput );

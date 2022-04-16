export default class AvocadoTextArea extends HTMLElement {
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

        div {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          padding: 0 0 6px 0;
        }

        div p {
          color: #393939;
          display: none;
          flex-basis: 0;
          flex-grow: 1;
        }

        p {
          box-sizing: border-box;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
        }

        p[part=error] {
          color: #6f6f6f;          
          padding: 5px 0 2px 0;
          visibility: hidden;
        }

        p[part=hint] {
          color: #6f6f6f;
          display: none;
          margin: -4px 0 0 0;
          padding: 0 0 6px 0;
        }        

        textarea {
          background: none;
          background-position: right 16px center;
          background-repeat: no-repeat;
          background-size: 16px;
          background-color: #ffffff;
          border: none;
          border-bottom: solid 1px #8d8d8d;
          border-radius: 0;
          box-sizing: border-box;
          color: #161616;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 100%;
          min-height: 40px;
          outline-offset: -2px;          
          padding: 10px 40px 12px 16px;
          resize: var( --textarea-resize, none );
          text-rendering: optimizeLegibility;
          width: 100%;
        }

        textarea::placeholder {
          color: #a8a8a8;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
        }        

        textarea:disabled::placeholder {
          color: #c6c6c6;
        }

        textarea:focus {
          outline: solid 2px #0f62fe;
        }

        textarea:disabled {
          border-bottom: solid 1px transparent;
        }

        textarea:read-only {
          border-bottom: solid 1px transparent;
          cursor: not-allowed;
        }

        textarea:read-only:focus {
          outline: solid 2px transparent;
        }

        :host( [disabled] ) p[part=hint] {
          color: #c6c6c6;
        }

        :host( [disabled] ) p[part=label] {
          color: #c6c6c6;
        }

        :host( [error] ) p[part=error] {
          visibility: visible;
        }

        :host( [hint] ) p[part=hint] {
          display: block;
        }

        :host( [invalid] ) textarea {
          background-image: url( /img/controls/warning.svg );
          outline: solid 2px #da1e28;          
        }

        :host( [invalid] ) textarea:focus {          
          outline: solid 2px #da1e28;
        }        

        :host( [invalid] ) p[part=error] {
          color: #da1e28;          
        }

        :host( [label] ) p[part=label] {
          display: block;
        }

        :host( [light] ) textarea {
          background-color: transparent;
        }
      </style>
      <div part="heading">
        <p part="label"></p>      
        <p part="count"></p>      
      </div>
      <p part="hint"></p>
      <textarea part="textarea"></textarea>
      <p part="error"></p>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = shadowRoot.querySelector( 'p[part=label]' );
    this.$count = shadowRoot.querySelector( 'p[part=count]' ); 
    this.$hint = shadowRoot.querySelector( 'p[part=hint]' );
    this.$textarea = shadowRoot.querySelector( 'textarea' );
    this.$textarea.addEventListener( 'input', () => {
      this.value = this.$textarea.value.trim().length === 0 ? null : this.$textarea.value;
    } );
    this.$error = shadowRoot.querySelector( 'p[part=error]' );
  }

  focus( wait = true ) {
    if( wait ) {
      window.requestAnimationFrame( () => {
        this.$textarea.focus();
      } );
    } else {
      this.$textarea.focus();
    }
  }

  // When things change
  _render() {
    this.$label.innerText = this.label === null ? '' : this.label;
    this.$hint.innerText = this.hint === null ? '' : this.hint;
    this.$textarea.disabled = this.disabled;    
    this.$textarea.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$textarea.readOnly = this.readonly;
    this.$textarea.title = this.title === null ? '' : this.title;
    this.$textarea.value = this.value === null ? '' : this.value;
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
    this._upgrade( 'placeholder' );    
    this._upgrade( 'readonly' );    
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
      'placeholder',
      'readonly',
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
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( content ) {
    if( content !== null ) {
      this.setAttribute( 'value', content );
    } else {
      this.removeAttribute( 'value' );
    }
  }  
}

window.customElements.define( 'adc-text-area', AvocadoTextArea );

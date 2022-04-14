export default class AvocadoTextArea extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          min-height: 100px;
          position: relative;
          min-width: 200px;
        }

        div {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          padding-bottom: 6px;
        }

        div p {
          color: #393939;
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
        }

        textarea {
          background: none;
          background-position: right 16px center;
          background-repeat: no-repeat;
          background-size: 16px;
          background-color: #f4f4f4;
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
          padding: 11px 40px 11px 16px;
          resize: none;
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

        textarea.invalid {
          background-image: url( /img/controls/warning.svg );
          outline: solid 2px #da1e28;          
        }

        textarea.invalid:focus {
          outline: solid 2px #da1e28;
        }

        textarea.light {
          background-color: #ffffff;
        }

        #error {
          color: #da1e28;
          padding: 4px 0 2px 0;
        }

        #helper {
          color: #6f6f6f;
          padding-bottom: 6px;
        }        
      </style>
      <div>
        <p></p>      
        <slot></slot>
      </div>
      <p id="helper"></p>
      <textarea></textarea>
      <p id="error"></p>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = shadowRoot.querySelector( 'div p' );
    this.$helper = shadowRoot.querySelector( '#helper' );
    this.$textarea = shadowRoot.querySelector( 'textarea' );
    this.$textarea.addEventListener( 'input', ( evt ) => this.doInput( evt ) );    
    this.$error = shadowRoot.querySelector( '#error' );
  }

  doInput( evt ) {
    this.value = evt.currentTarget.value;
  }

  // When things change
  _render() {
    this.style.display = this.hidden === true ? 'none' : '';
    this.style.flexBasis = this.grow === null ? '' : 0;
    this.style.flexGrow = this.grow === null ? '' : this.grow;
    this.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;
    this.style.visibility = this.concealed === true ? 'hidden' : '';
    this.style.width = this.width === null ? '' : `${this.width}px`;

    if( this.label === null ) {
      this.$label.style.display = 'none';
    } else {
      this.$label.innerText = this.label;
      this.$label.style.display = '';
      this.$label.style.color = this.disabled === true ? '#c6c6c6' : '#393939';
    }

    if( this.helper === null ) {
      this.$helper.style.display = 'none';
      this.$helper.style.marginTop = 0;
    } else {
      this.$helper.innerText = this.helper;
      this.$helper.style.display = '';
      this.$helper.style.color = this.disabled === true ? '#c6c6c6' : '#6f6f6f';      
      this.$helper.style.marginTop = '-4px';
    }    

    this.$textarea.className = '';

    if( this.light ) {
      this.$textarea.classList.add( 'light' );
    }

    this.$textarea.disabled = this.disabled;    
    this.$textarea.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$textarea.readOnly = this.readonly;
    this.$textarea.title = this.title === null ? '' : this.title;
    this.$textarea.value = this.value === null ? '' : this.value;

    if( this.error === null ) {
      this.$error.style.visibility = 'hidden';
      this.$error.innerText = '&nbsp;';
    } else {
      this.$input.classList.add( 'invalid' );
      this.$error.innerText = this.error;
      this.$error.style.visibility = '';
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
      'concealed',
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
      'placeholder',
      'readonly',
      'title',
      'value',
      'width'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Arbitrary storage
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
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

window.customElements.define( 'avocado-textarea', AvocadoTextArea );

export default class AvocadoAvatar extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
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

        button {
          align-items: center;
          background: none;
          background-color: #f4f4f4;
          border: none;
          border-radius: 100%;
          cursor: pointer;
          display: flex;
          height: var( --avatar-height, 62px );          
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          justify-content: center;
          margin: 0;
          padding: 0;
          outline: none;
          overflow: hidden;
          position: relative;
          text-rendering: optimizeLegibility;          
          width: var( --avatar-width, 62px );
        }

        img {
          display: none;
          height: var( --avatar-height, 62px );          
          max-height: var( --avatar-height, 62px );
          object-fit: cover;
          width: 100%;
        }

        canvas,
        input {
          display: none;
        }

        p {
          color: #525252;
          display: none;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          text-rendering: optimizeLegibility;
        }
      </style>
      <button part="button">
        <img part="image">
        <p></p>
      </button>
      <canvas></canvas>
      <input accept="image/*" type="file">
    `;

    // Properties
    this._context = null;
    this._data = null;
    this._value = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'click', () => {
      this.$input.click();
    } );
    this.$canvas = shadowRoot.querySelector( 'canvas' );
    this.$input = shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'change', () => {
      this.value = this.$input.files[0];
      this.dispatchEvent( new CustomEvent( 'change', {
        detail: this.$input.files.length === 0 ? null : this.$input.files[0]
      } ) );
    } );
    this.$label = shadowRoot.querySelector( 'p' );
    this.$img = shadowRoot.querySelector( 'img' );
  }

  // When things change
  _render() {
    this.$label.innerText = this.label === null ? '' : this.label;

    if( this._value === null ) {
      this.$label.style.display = 'block';
      this.$img.style.display = 'none';            
      return;
    }

    if( 'name' in this._value ) {
      this.$label.style.display = 'none';
      this.$img.style.display = 'block';      
    } else {
      this.$label.style.display = 'block';
      this.$img.style.display = 'none';   
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
    this._upgrade( 'concealed' );
    this._upgrade( 'data' );
    this._upgrade( 'hidden' );
    this._upgrade( 'label' );    
    this._upgrade( 'title' );        
    this._upgrade( 'value' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'label',
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
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  get value() {
    return this._value;
  }

  set value( file ) {
    this._value = file;

    if( 'name' in this._value ) {
      this.$img.src = URL.createObjectURL( this._value );        
    } else if( 'length' in this._value ) {
      this.$img.src = this._value;
    } else {
      this.$img.src = null;
    }

    this._render();
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

window.customElements.define( 'adc-avatar', AvocadoAvatar );

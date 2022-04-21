import AvocadoCalendar from './calendar.js';

import { format as formatDate } from 'date-fns';

export default class AvocadoDatePicker extends HTMLElement {
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

        :host( [concealed] ) {
          visibility: hidden;
        }        

        :host( [hidden] ) {
          display: none;
        }        

        adc-calendar {
          background-color: #f4f4f4;
          box-shadow: 0 2px 6px rgba( 0, 0, 0, 0.30 );
          outline-offset: -1px;
          position: absolute;
        }

        adc-calendar:focus {
          outline: solid 1px #0f62fe;                    
        }

        button {
          align-items: center;
          background: none;
          background-color: #ffffff;
          border: none;          
          border-bottom: solid 1px #8d8d8d;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          height: 40px;
          outline-offset: -2px;                    
          padding: 0 4px 0 16px;
          position: relative;
          width: 100%;
        }

        button:focus {
          outline: solid 2px #0f62fe;          
        }

        button:active {
          outline: solid 2px #0f62fe;          
        }        

        img {
          height: 16px;
          padding: 12px;
          width: 16px;
        }

        p {
          color: #161616;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
        }

        p[part=error] {
          color: #6f6f6f;
          font-size: 12px;
          padding: 5px 0 2px 0;
          visibility: hidden;
        }        

        p[part=label] {
          color: #393939;
          display: none;
          font-size: 12px;
          padding: 0 0 6px 0;
        }

        p[part=hint] {
          color: #6f6f6f;
          display: none;
          font-size: 12px;
          margin: -4px 0 0 0;
          padding: 0 0 6px 0;
        }        

        p[part=value] {
          flex-basis: 0;
          flex-grow: 1;
          text-align: left;
        }

        :host( [error] ) p[part=error] {
          visibility: visible;
        }

        :host( [hint] ) p[part=hint] {
          display: block;
        }

        :host( [invalid] ) button {
          outline: solid 2px #da1e28;
        }

        :host( [invalid] ) p[part=error] {
          color: #da1e28;
        }

        :host( [label] ) p[part=label] {
          display: block;
        }        

        :host( [light] ) button {
          background-color: transparent;
        }

        :host( [size=xl] ) button {
          height: 48px;
        }
      </style>
      <p part="label">Label</p>
      <p part="hint">Hint</p>
      <button part="field" type="button">
        <p part="value"></p>
        <img part="icon" src="/img/controls/calendar.svg">
      </button>
      <p part="error">Error</p>
      <adc-calendar hidden tabindex="-1"></adc-calendar>
    `;

    // Properties
    this._data = null;
    this._value = new Date();

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'blur', ( evt ) => {
      console.log( evt );
      if( evt.relatedTarget !== this.$calendar )
        this.$calendar.hidden = true;
    } );
    this.$button.addEventListener( 'click', () => {
      this.$button.focus();

      if( this.$calendar.hidden ) {
        const box = this.getBoundingClientRect();
        const button = this.$button.getBoundingClientRect();        

        let top = ( button.top - box.top ) + button.height;

        this.$calendar.value = this.value;
        this.$calendar.hidden = false;

        window.requestAnimationFrame( () => {
          const total = button.top + button.height + this.$calendar.clientHeight;

          if( total > window.innerHeight ) {
            top = top - button.height - this.$calendar.clientHeight;
          }  

          this.$calendar.style.top = top + 'px';                  
        } );
      } else {
        this.$calendar.hidden = true;
      }
    } );
    this.$calendar = shadowRoot.querySelector( 'adc-calendar' );
    this.$calendar.addEventListener( 'change', ( evt ) => {
      this.value = evt.detail.value;
      this.$calendar.hidden = true;
    } );
    this.$label = shadowRoot.querySelector( 'p[part=label]' );
    this.$hint = shadowRoot.querySelector( 'p[part=hint]' );
    this.$error = shadowRoot.querySelector( 'p[part=error]' );    
    this.$value = shadowRoot.querySelector( 'p[part=value]' );
  }

  // When things change
  _render() {
    this.$label.innerText = this.label === null ? '' : this.label;
    this.$hint.innerText = this.hint === null ? '' : this.hint;
    this.$error.innerText = this.error === null ? '&nbsp;' : this.error;    
    
    const format = this.format === null ? 'PP' : this.format;
    this.$value.innerText = formatDate( this._value, format );
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
    this._upgrade( 'error' );            
    this._upgrade( 'format' );                
    this._upgrade( 'hidden' );    
    this._upgrade( 'hint' );      
    this._upgrade( 'invalid' );          
    this._upgrade( 'label' );        
    this._upgrade( 'value' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'error',
      'format',
      'hidden',
      'hint',
      'invalid',
      'label'
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

  set value( date ) {
    this._value = date === null ? new Date() : new Date( date.getTime() );
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

  get format() {
    if( this.hasAttribute( 'format' ) ) {
      return this.getAttribute( 'format' );
    }

    return null;
  }

  set format( value ) {
    if( value !== null ) {
      this.setAttribute( 'format', value );
    } else {
      this.removeAttribute( 'format' );
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
}

window.customElements.define( 'adc-date-picker', AvocadoDatePicker );

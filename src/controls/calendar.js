import { format } from 'date-fns';

export default class AvocadoCalendar extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          padding: 4px;
          position: relative;
        }                

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        div[part=days] {
          align-items: center;
          display: flex;
          flex-direction: row;
          height: 40px;          
        }

        div[part=days] p {
          color: #161616;
          cursor: default;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility
        }

        div[part=heading] {
          align-items: center;
          display: flex;
          flex-direction: row;
        }

        div[part=heading] button {
          background: none;
          background-position: center;
          background-repeat: no-repeat;
          background-size: 16px;
          border: none;
          cursor: pointer;
          height: 40px;
          margin: 0;
          outline-offset: -2px;                    
          padding: 0;
          width: 40px;
        }

        div[part=heading] button:focus {
          outline: solid 2px #0f62fe;
        }

        div[part=heading] button:hover {
          background-color: #e5e5e5;
        }        

        div[part=heading] button[part=left] {
          background-image: url( /img/controls/chevron-left.svg );
        }

        div[part=heading] button[part=right] {
          background-image: url( /img/controls/chevron-right.svg );
        }        

        :host( [tabindex] ) div[part=heading] button {
          outline: none;
        }

        div[part=heading] p {
          color: #161616;
          cursor: default;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
        }        

        div[part=month] {
          display: grid; 
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
          gap: 0px 0px; 
        }

        div[part=month] button {
          background: none;
          border: none;
          box-sizing: border-box;
          color: #161616;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 40px;
          margin: 0;
          min-width: 40px;
          padding: 0;
          text-rendering: optimizeLegibility;
        }        

        div[part=month] button.today {        
          color: #0f62fe;
          font-weight: 600;
        }                        

        div[part=month] button:hover {
          background-color: #e5e5e5;
        }

        div[part=month] button.outer {        
          color: #6f6f6f;
        }

        div[part=month] button.selected {        
          background-color: #0f62fe;
          color: #ffffff;
        }        
      </style>
      <div part="heading">
        <button part="left" type="button"></button>
        <p part="label"></p>
        <button part="right" type="button"></button>
      </div>
      <div part="days">
        <p>Sun</p>
        <p>Mon</p>        
        <p>Tue</p>        
        <p>Wed</p>        
        <p>Thu</p>        
        <p>Fri</p>        
        <p>Sat</p>        
      </div>
      <div part="month"></div>
    `;

    // Properties
    this._data = null;
    this._display = new Date();
    this._value = new Date();

    // Events
    this.doDayClick = this.doDayClick.bind( this );

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = shadowRoot.querySelector( 'p[part=label]' );
    this.$left = shadowRoot.querySelector( 'button[part=left]' );
    this.$left.addEventListener( 'click', () => {
      this._display.setMonth( this._display.getMonth() - 1 );
      this._render();
    } );
    this.$month = shadowRoot.querySelector( 'div[part=month]' );
    this.$right = shadowRoot.querySelector( 'button[part=right]' );
    this.$right.addEventListener( 'click', () => {
      this._display.setMonth( this._display.getMonth() + 1 );
      this._render();
    } );    
  }

  doDayClick( evt ) {
    const date = parseInt( evt.currentTarget.getAttribute( 'data-date' ) );
    const month = parseInt( evt.currentTarget.getAttribute( 'data-month' ) );        
    const year = parseInt( evt.currentTarget.getAttribute( 'data-year' ) );

    this.value = new Date( year, month, date, this._value.getHours(), this._value.getMinutes() );
    
    this.dispatchEvent( new CustomEvent( 'change', {
      detail: {
        value: this.value
      }
    } ) );
  }

  // When things change
  _render() {
    while( this.$month.children.length < 42 ) {
      const day = document.createElement( 'button' );
      day.type = 'button';
      day.addEventListener( 'click', this.doDayClick );
      this.$month.appendChild( day );
    }

    this.$label.innerText = format( this._display, 'MMMM yyyy' );

    const today = new Date();
    const calendar = new Date(
      this._display.getFullYear(),
      this._display.getMonth(),
      1
    );    

    calendar.setDate( calendar.getDate() - calendar.getDay() );    

    for( let d = 0; d < 42; d++ ) {
      this.$month.children[d].setAttribute( 'data-month', calendar.getMonth() );
      this.$month.children[d].setAttribute( 'data-year', calendar.getFullYear() );
      this.$month.children[d].setAttribute( 'data-date', calendar.getDate() );              

      this.$month.children[d].innerText = calendar.getDate();

      if(
        calendar.getFullYear() !== this._display.getFullYear() ||
        calendar.getMonth() !== this._display.getMonth()
      ) {
        this.$month.children[d].classList.add( 'outer' );      
      } else {
        this.$month.children[d].classList.remove( 'outer' );      
      }

      if(
        calendar.getFullYear() === today.getFullYear() &&
        calendar.getMonth() === today.getMonth() &&
        calendar.getDate() === today.getDate()
      ) {
        this.$month.children[d].classList.add( 'today' );      
      } else {
        this.$month.children[d].classList.remove( 'today' );      
      }

      if(
        calendar.getFullYear() === this._value.getFullYear() &&
        calendar.getMonth() === this._value.getMonth() &&
        calendar.getDate() === this._value.getDate() &&
        calendar.getMonth() === this._value.getMonth()
      ) {
        this.$month.children[d].classList.add( 'selected' );        
      } else {
        this.$month.children[d].classList.remove( 'selected' );        
      }

      calendar.setDate( calendar.getDate() + 1 );      
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
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden'
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
}

window.customElements.define( 'adc-calendar', AvocadoCalendar );
